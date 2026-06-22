import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { badgeStyles } from "./tulpar-badge.styles";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";
export type BadgeVariant = "solid" | "soft-tonal" | "outline";
export type BadgeShape = "pill" | "square";
export type BadgeSize = "sm" | "md" | "lg";

/**
 * Reserved for Wave 2: attached / anchored placement around a host element.
 * Type-only — there is NO attached rendering in this element yet.
 */
export type BadgePlacement =
  | "top-end"
  | "top-start"
  | "bottom-end"
  | "bottom-start"; // reserved — attached mode is Wave 2

/**
 * `<tulpar-badge>` — count / status indicator.
 *
 * Renders an inline pill (default) showing a count or short label, or a bare
 * dot for status. Used densely in grids and nav items.
 *
 * ## Numeric mode
 * - `count` is shown as text; if `count > max` (default 99) it renders
 *   `` `${max}+` `` (e.g. `100` → `99+`).
 * - When `count === 0 && !showZero` nothing renders (host gets `hidden`).
 * - `dot` mode ignores `count` entirely.
 *
 * ## Accessible name
 * For a numeric badge the element sets `aria-label` to the count plus a noun
 * derived (in priority order) from the `label` prop, the slotted text, or a
 * generic "items" fallback — e.g. `aria-label="3 notifications"`. This gives AT
 * users meaning for an otherwise bare number. Dot mode uses the `label` prop as
 * the name when provided.
 */
export class TulparBadge extends LitElement {
  static override styles = [badgeStyles];

  /** Tone (status / category). Attribute-only (auto-flips for .dark). */
  @property({ type: String, reflect: true }) tone: BadgeTone = "neutral";

  /** Visual variant. */
  @property({ type: String, reflect: true }) variant: BadgeVariant = "solid";

  /** Numeric count. Ignored in `dot` mode. */
  @property({ type: Number }) count?: number;

  /** Overflow cap: counts above this render as `${max}+`. */
  @property({ type: Number }) max = 99;

  /** Show the badge when `count === 0` (hidden by default). */
  @property({ type: Boolean, attribute: "show-zero" }) showZero = false;

  /** Bare status dot (ignores count). */
  @property({ type: Boolean, reflect: true }) dot = false;

  /** Corner shape. */
  @property({ type: String, reflect: true }) shape: BadgeShape = "pill";

  /** Size tier. */
  @property({ type: String, reflect: true }) size: BadgeSize = "md";

  /**
   * Convenience short label (alias of the default slot) AND the noun source for
   * the numeric accessible name (e.g. label="notifications" → "3 notifications").
   * Slot wins for rendered content; the prop still seeds the a11y noun.
   */
  @property({ type: String }) label?: string;

  /**
   * Reserved for Wave 2 attached/anchored mode. Declaring the type only — this
   * element performs NO attached rendering. Setting it has no visual effect.
   */
  // reserved — attached mode is Wave 2
  @property({ type: String }) placement?: BadgePlacement;

  /** True while the default slot has assigned content. */
  @state() private _hasSlotLabel = false;

  /** Text content of the default slot, for the a11y noun + display fallback. */
  @state() private _slotText = "";

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    const a11yRelated = ["count", "max", "dot", "label", "showZero"];
    if (
      a11yRelated.some((k) => changed.has(k)) ||
      changed.has("_slotText") ||
      changed.has("_hasSlotLabel")
    ) {
      this._syncMode();
      this._syncHidden();
      this._syncAriaLabel();
    }
  }

  /** Drive which child (count / label) is visible via a host attribute. */
  private _syncMode(): void {
    let mode: "dot" | "count" | "label" = "label";
    if (this.dot) mode = "dot";
    else if (this._displayCount !== null) mode = "count";
    this.setAttribute("data-mode", mode);
  }

  // ─── Numeric display ───────────────────────────────────────────────────────
  /** The text shown in numeric mode, or null when there's no numeric content. */
  private get _displayCount(): string | null {
    if (this.count === undefined || this.count === null || Number.isNaN(this.count)) return null;
    if (this.count === 0 && !this.showZero) return null;
    if (this.count > this.max) return `${this.max}+`;
    return String(this.count);
  }

  /** Whether the badge has any visible content. */
  private get _hasContent(): boolean {
    if (this.dot) return true;
    if (this._displayCount !== null) return true;
    // A label / slot with no count still renders as a text badge.
    return Boolean(this.label) || this._hasSlotLabel;
  }

  private _syncHidden(): void {
    this.toggleAttribute("hidden", !this._hasContent);
  }

  // ─── Accessible name ───────────────────────────────────────────────────────
  /** Noun for the count's accessible name: label → slot text → "items". */
  private get _noun(): string {
    const fromLabel = this.label?.trim();
    if (fromLabel) return fromLabel;
    const fromSlot = this._slotText.trim();
    if (fromSlot) return fromSlot;
    return "items";
  }

  private _syncAriaLabel(): void {
    if (this.dot) {
      // Dot is decorative unless a label gives it meaning.
      if (this.label?.trim()) this._setName(this.label.trim());
      else this._clearName();
      return;
    }
    const display = this._displayCount;
    if (display !== null) {
      this._setName(`${display} ${this._noun}`);
    } else {
      this._clearName();
    }
  }

  /**
   * Expose an accessible name on the host. `role="img"` makes the badge read as
   * a single labeled graphic (e.g. "3 notifications") rather than a bare number.
   */
  private _setName(name: string): void {
    this.setAttribute("aria-label", name);
    if (!this.hasAttribute("role")) this.setAttribute("role", "img");
  }

  private _clearName(): void {
    this.removeAttribute("aria-label");
    if (this.getAttribute("role") === "img") this.removeAttribute("role");
  }

  private _onSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    // NOTE: plain assignedNodes() (no flatten) — the default slot renders the
    // `label` prop as FALLBACK content, and flatten:true counts fallback nodes
    // as assigned, flipping `_hasSlotLabel` every render and locking the page
    // (slotchange→requestUpdate loop, see CLAUDE.md). Real slotted content still
    // wins because assignedNodes() only returns true light-DOM children.
    const nodes = slot.assignedNodes();
    this._hasSlotLabel = nodes.some((n) => {
      if (n.nodeType === Node.TEXT_NODE) return (n.textContent ?? "").trim().length > 0;
      return true;
    });
    this._slotText = nodes.map((n) => n.textContent ?? "").join("").trim();
  };

  override render() {
    const isDot = this.dot;
    const display = isDot ? null : this._displayCount;
    // The <slot> is ALWAYS in the shadow DOM so its text feeds the a11y noun
    // and the no-count label fallback; CSS hides it (and the dot) as needed.
    // [data-mode] on the host drives which child is visible (attribute toggle,
    // no requestUpdate loop — see CLAUDE.md slotchange gotcha).
    return html`
      <span class="badge ${isDot ? "is-dot" : ""}" part="badge">
        <span class="count" part="count" aria-hidden=${display !== null ? nothing : "true"}
          >${display !== null ? display : nothing}</span
        >
        <span class="label" part="label"
          ><slot @slotchange=${this._onSlotChange}
            >${!this._hasSlotLabel && this.label ? this.label : nothing}</slot
          ></span
        >
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-badge": TulparBadge;
  }
}

if (!customElements.get("tulpar-badge")) {
  customElements.define("tulpar-badge", TulparBadge);
}
