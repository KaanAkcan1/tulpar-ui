import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, query, state } from "lit/decorators.js";
import { resolveTone, type ToneValue } from "../_internal/tone/tone-resolver";
import { tagStyles } from "./tulpar-tag.styles";

export type TagVariant = "soft-tonal" | "outline" | "solid";
export type TagShape = "square" | "pill" | "sharp";
export type TagSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * `<tulpar-tag>` — static, read-only tonal metadata.
 *
 * A tag labels an object with a tone (status / category). It is
 * non-interactive: no remove control, no click semantics. Tone always pairs
 * with a leading dot, a leading icon, or the label text — never hue alone
 * (accessibility: color is not the sole signal).
 *
 * ## Tone
 * - Built-in tones (`neutral|info|success|warning|danger`) are attribute-only:
 *   the styles map `[tone][variant]` to `--tulpar-atom-tone-*` tokens that
 *   auto-flip for `.dark` via the generated token sheet (no inline styles).
 * - `tone="custom"` calls `resolveTone(this, { prefix: "tag" })` and applies
 *   the returned `-l` / `-d` var pairs as inline styles; the styles pick the
 *   right pair via `:host-context(.dark)` (custom path only). For
 *   `variant="solid"` the resolved accent becomes the fill with white on-fill
 *   text — custom-tone solid contrast is the AUTHOR's responsibility (custom is
 *   the explicit escape hatch, per spec).
 *
 * ## Content
 * - Default slot OR `label` prop → the tag text (prop is an alias of the slot).
 * - `dot` → a tone-colored leading dot.
 * - `icon` (name / raw SVG / emoji) OR `icon` slot → a leading icon. When both
 *   `icon` and `dot` are set, the icon wins.
 *
 * ## Truncation
 * The label truncates with an ellipsis past `--tulpar-tag-max-width` (160px
 * default). When it overflows, the host's native `title` attribute is set to
 * the full text (no Tooltip dependency).
 */
export class TulparTag extends LitElement {
  static override styles = [tagStyles];

  /** Tone (status / category). Built-in tones are attribute-only. */
  @property({ type: String, reflect: true }) tone: ToneValue = "neutral";

  /** Custom-tone base: a brand family name or any raw CSS color. */
  @property({ type: String }) color?: string;

  /** Custom-tone surface override (literal). */
  @property({ type: String }) bg?: string;

  /** Custom-tone accent override (literal). */
  @property({ type: String }) accent?: string;

  /** Custom-tone text override (literal). */
  @property({ type: String }) text?: string;

  /** Visual variant. */
  @property({ type: String, reflect: true }) variant: TagVariant = "soft-tonal";

  /** Corner shape: square (per-size radius), pill, or sharp (2px). */
  @property({ type: String, reflect: true }) shape: TagShape = "square";

  /** Size tier. */
  @property({ type: String, reflect: true }) size: TagSize = "md";

  /** Show a leading tone-colored dot (ignored when `icon` is set). */
  @property({ type: Boolean, reflect: true }) dot = false;

  /** Leading icon: built-in name unsupported here — raw SVG string or emoji. */
  @property({ type: String }) icon?: string;

  /** Dim + non-interactive. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Convenience label (alias of the default slot). Slot wins when both set. */
  @property({ type: String }) label?: string;

  /** True while the default slot has assigned content (slot wins over `label`). */
  @state() private _hasSlotLabel = false;

  /** Text content of the default slot, for the overflow title fallback. */
  @state() private _slotText = "";

  /** True while the `icon` slot has assigned content (slot wins over the prop). */
  @state() private _hasSlotIcon = false;

  @query(".icon-prop-target")
  private _iconTarget?: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
    // role="status" reads as a non-interactive status item to AT.
    if (!this.hasAttribute("role")) this.setAttribute("role", "status");
  }

  protected override firstUpdated(changed: PropertyValues): void {
    super.firstUpdated(changed);
    // scrollWidth/clientWidth may be 0 during the first updated() callback (the
    // browser hasn't laid the label out yet). Re-check after a layout frame so
    // the overflow title is reliable.
    requestAnimationFrame(() => this._syncOverflowTitle());
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    const toneRelated = ["tone", "color", "bg", "accent", "text"];
    if (toneRelated.some((k) => changed.has(k))) {
      this._applyToneVars();
    }

    // Inject icon content imperatively (avoids unsafeSVG/unsafeHTML directive
    // dual-instance crash — see CLAUDE.md Lit directive gotcha).
    if (changed.has("icon")) {
      this._applyIconContent();
    }

    // Drive leading-element visibility via host attributes (icon wins over dot).
    if (changed.has("icon") || changed.has("dot") || changed.has("_hasSlotIcon")) {
      this._syncLeadingAttrs();
    }

    // Set/clear the native title when the label overflows its box.
    if (
      changed.has("label") ||
      changed.has("size") ||
      changed.has("icon") ||
      changed.has("dot") ||
      changed.has("_slotText")
    ) {
      this._syncOverflowTitle();
    }
  }

  private _syncLeadingAttrs(): void {
    const showIcon = this._showIcon;
    this.toggleAttribute("data-show-icon", showIcon);
    this.toggleAttribute("data-show-dot", !showIcon && this.dot);
  }

  // ─── Tone ────────────────────────────────────────────────────────────────
  private static _customVarNames = [
    "--tulpar-tag-surface-l",
    "--tulpar-tag-surface-d",
    "--tulpar-tag-on-surface-l",
    "--tulpar-tag-on-surface-d",
    "--tulpar-tag-border-l",
    "--tulpar-tag-border-d",
    "--tulpar-tag-accent-l",
    "--tulpar-tag-accent-d",
  ];

  private _applyToneVars(): void {
    const result = resolveTone(
      { tone: this.tone, color: this.color, bg: this.bg, accent: this.accent, text: this.text },
      { prefix: "tag" },
    );

    for (const v of TulparTag._customVarNames) this.style.removeProperty(v);

    if (!result.builtin) {
      for (const [prop, value] of Object.entries(result.vars)) {
        this.style.setProperty(prop, value);
      }
    }
  }

  // ─── Icon ────────────────────────────────────────────────────────────────
  /** Whether a leading icon should render (icon prop / slot wins over dot). */
  private get _showIcon(): boolean {
    const hasProp = this.icon !== undefined && this.icon !== null && this.icon !== "";
    return hasProp || this._hasSlotIcon;
  }

  private _applyIconContent(): void {
    const target = this._iconTarget;
    if (!target) return;
    const value = this.icon;
    if (value === undefined || value === null || value === "") {
      target.replaceChildren();
      return;
    }
    if (value.trimStart().startsWith("<")) {
      target.innerHTML = value; // raw SVG
    } else {
      target.textContent = value; // emoji / text glyph
    }
  }

  // ─── Overflow title ────────────────────────────────────────────────────────
  private _syncOverflowTitle(): void {
    const labelEl = this.renderRoot?.querySelector(".label") as HTMLElement | null;
    if (!labelEl) return;
    // `labelEl` wraps a <slot>; reading textContent on a slot returns only its
    // fallback, so slotted labels need the captured _slotText (mirrors badge).
    const full = (this.label ?? this._slotText ?? labelEl.textContent ?? "").trim();
    if (full && labelEl.scrollWidth > labelEl.clientWidth) {
      this.setAttribute("title", full);
    } else {
      this.removeAttribute("title");
    }
  }

  private _onSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this._hasSlotLabel = nodes.some((n) => {
      if (n.nodeType === Node.TEXT_NODE) return (n.textContent ?? "").trim().length > 0;
      return true;
    });
    this._slotText = nodes
      .map((n) => n.textContent ?? "")
      .join("")
      .trim();
    this._syncOverflowTitle();
  };

  private _onIconSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this._hasSlotIcon = slot.assignedNodes({ flatten: true }).length > 0;
    // Slot wins over the prop: hide the imperative prop target when slotted.
    this.toggleAttribute("data-slot-icon", this._hasSlotIcon);
  };

  override render() {
    // The icon container + its <slot name="icon"> are ALWAYS in the shadow DOM;
    // CSS shows/hides them via [data-show-icon] / [data-show-dot] on the host
    // (attribute toggle, no requestUpdate loop — see CLAUDE.md slotchange gotcha).
    // `icon-prop-target` receives raw-SVG / emoji injected imperatively; a
    // slotted icon wins because ::slotted content overlays the prop target.
    return html`
      <span class="tag" part="tag">
        <span class="dot" part="dot" aria-hidden="true"></span>
        <span class="icon" part="icon" aria-hidden="true">
          <span class="icon-prop-target"></span>
          <slot name="icon" @slotchange=${this._onIconSlotChange}></slot>
        </span>
        <span class="label" part="label">
          <slot @slotchange=${this._onSlotChange}
            >${!this._hasSlotLabel && this.label ? this.label : nothing}</slot
          >
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-tag": TulparTag;
  }
}

if (!customElements.get("tulpar-tag")) {
  customElements.define("tulpar-tag", TulparTag);
}
