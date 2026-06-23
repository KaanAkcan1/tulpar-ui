import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { isMeaningfulNode } from "../_internal/slot-content";
import { warnDev } from "../_internal/warn-dev";
import { optionStyles } from "./tulpar-option.styles";

/**
 * `<tulpar-option>` — presentational list option for `<tulpar-select>`.
 *
 * This element is DISPLAY-ONLY. It reflects state attributes set by the
 * parent Select — it holds NO selection logic. The Select is responsible
 * for setting `aria-selected`, `data-active`, `data-selected`, and for
 * assigning stable `id` values (if missing). This element must not clobber
 * an existing `id`.
 *
 * ## Content
 * - Default slot OR `label` prop → display text. Slot wins when both set.
 *   `resolvedLabel` returns the effective label for typeahead + trigger display.
 * - `description` slot OR `description` prop → optional second line.
 * - `icon` slot → optional leading icon.
 *
 * ## State (reflected, parent-driven)
 * - `disabled` — not selectable; skipped by keyboard nav (the Select enforces
 *   skipping; this element only reflects the attribute + dims itself).
 * - `role="option"` is set on connectedCallback if not already present.
 * - `aria-selected`, `data-active`, `data-selected` are set by the parent.
 *
 * ## CRITICAL Lit trap
 * Do NOT add a `slotchange` handler that calls `requestUpdate()` while render
 * conditionally swaps that same slot — it causes an infinite update loop.
 * `resolvedLabel` reads the DOM on demand (getter); it does NOT react to
 * slotchange + requestUpdate. See CLAUDE.md for the full gotcha reference.
 */
export class TulparOption extends LitElement {
  static override styles = optionStyles;

  /** The option value — passed to the parent Select on selection. REQUIRED. */
  @property({ type: String }) value = "";

  /** Convenience label (alias of the default slot). Slot wins when both set. */
  @property({ type: String }) label?: string;

  /** Optional description line (alias of the `description` slot). Slot wins. */
  @property({ type: String }) description?: string;

  /** Dims + marks as non-selectable. Keyboard nav skips disabled options. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    // Assign role if not already set (the parent may set it before connection).
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "option");
    }
    // Dev guard: warn when value is empty so consumers discover the bug early.
    if (this.value === "") {
      warnDev("[tulpar-option] The `value` attribute is required and must not be empty.", this);
    }
  }

  /**
   * The effective display label for this option.
   *
   * Returns the trimmed text of light-DOM children if they contain at least
   * one meaningful node (element or non-whitespace text; comment nodes are
   * intentionally skipped — Vue's compiler leaves a `<!---->` placeholder for
   * empty slots). Falls back to the `label` prop, then empty string.
   *
   * Read on demand — NOT reactive. The Select reads this when building its
   * typeahead index and when updating the trigger display text.
   */
  get resolvedLabel(): string {
    // Walk direct child nodes; accumulate text from elements and text nodes;
    // skip comment nodes (nodeType 8) which Vue injects for empty slots.
    let text = "";
    let hasMeaningful = false;

    for (const node of this.childNodes) {
      if (!isMeaningfulNode(node)) continue;
      hasMeaningful = true;
      text += node.textContent ?? "";
    }

    if (hasMeaningful) return text.trim();
    return (this.label ?? "").trim();
  }

  // ── Check SVG ─────────────────────────────────────────────────────────────
  // Inline SVG string (no unsafeSVG directive — avoids dual-instance crash,
  // see CLAUDE.md Lit directive gotcha). A 16×16 checkmark.
  private _checkSvg() {
    return html`<svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true">
      <path
        d="M3 8.5 L6.5 12 L13 5"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>`;
  }

  override render() {
    return html`
      <span class="opt-icon" part="icon"><slot name="icon"></slot></span>
      <span class="opt-text">
        <span class="opt-label"><slot>${this.label}</slot></span>
        ${this.description
          ? html`<span class="opt-desc"><slot name="description">${this.description}</slot></span>`
          : nothing}
      </span>
      <span class="opt-check" part="check" aria-hidden="true">${this._checkSvg()}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-option": TulparOption;
  }
}

if (!customElements.get("tulpar-option")) {
  customElements.define("tulpar-option", TulparOption);
}
