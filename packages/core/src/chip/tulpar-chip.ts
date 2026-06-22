import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, query, state } from "lit/decorators.js";
import { resolveTone, type ToneValue } from "../_internal/tone/tone-resolver";
import { chipStyles } from "./tulpar-chip.styles";

export type ChipVariant = "soft-tonal" | "outline" | "solid" | "ghost";
export type ChipShape = "square" | "pill" | "sharp";
export type ChipSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * `<tulpar-chip>` — the interactive display atom.
 *
 * A chip is an activatable tonal label. Unlike `<tulpar-tag>` (static, read
 * only), the chip body is operable (click / Enter / Space → `tulpar-click`)
 * and can carry an independent remove control (`tulpar-remove`). It shares the
 * tag's size table + tone / variant / shape model.
 *
 * ## Tone
 * - Built-in tones (`neutral|info|success|warning|danger`) are attribute-only:
 *   the styles map `[tone][variant]` to `--tulpar-atom-tone-*` tokens that
 *   auto-flip for `.dark` via the generated token sheet (no inline styles).
 * - `tone="custom"` calls `resolveTone(this, { prefix: "chip" })` and applies
 *   the returned `-l` / `-d` var pairs as inline styles; the styles pick the
 *   right pair via `:host-context(.dark)` (custom path only).
 *
 * ## Variants
 * - `soft-tonal` (default) · `outline` · `solid` — same as the tag.
 * - `ghost` — transparent at rest, hovers into the soft-tonal surface (toolbar
 *   filter chips). The soft surface is always tracked so ghost can hover into
 *   the tone's soft tint.
 *
 * ## Content
 * - Default slot OR `label` prop → the chip text (prop is an alias of the slot).
 * - `icon` (name / raw SVG / emoji) OR `icon` slot → a leading icon.
 * - `avatar` (image URL OR initials) OR `avatar` slot → a leading circular
 *   avatar that bleeds to the chip's leading edge. An avatar wins over an icon.
 *
 * ## Interaction
 * - The chip host is `role="button"` and focusable (`tabindex="0"`) when not
 *   disabled. Clicking the body, or pressing Enter / Space while focused, fires
 *   a `tulpar-click` CustomEvent.
 * - `removable` renders a trailing real `<button>` (its own tab stop). Clicking
 *   it fires `tulpar-remove` and `stopPropagation()`s so it does NOT also fire
 *   `tulpar-click`. Delete / Backspace on the focused CHIP also fires
 *   `tulpar-remove`. After a remove, focus moves to the next sibling chip (else
 *   previous, else the parent) so focus is never orphaned.
 * - `disabled`: no events fire, the host is not focusable, dimmed.
 *
 * ## Reserved (Wave 2)
 * `selected` / `selectable` (toggle selection state, `aria-pressed`) and the
 * `ChipGroup` container (roving tabindex, single / multi semantics) are RESERVED
 * for Wave 2 — intentionally NOT implemented here. Do not add selection state,
 * `aria-pressed`, or roving tabindex to this element.
 */
export class TulparChip extends LitElement {
  static override styles = [chipStyles];

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

  /** Visual variant. `ghost` = transparent rest → soft-tonal hover. */
  @property({ type: String, reflect: true }) variant: ChipVariant = "soft-tonal";

  /** Corner shape: square (per-size radius), pill, or sharp (2px). */
  @property({ type: String, reflect: true }) shape: ChipShape = "square";

  /** Size tier. */
  @property({ type: String, reflect: true }) size: ChipSize = "md";

  /** Leading icon: built-in name, raw SVG string, or emoji. */
  @property({ type: String }) icon?: string;

  /** Leading avatar: an image URL or initials (circular, bleeds to the edge). */
  @property({ type: String }) avatar?: string;

  /** Show the trailing remove control (an independent tab stop). */
  @property({ type: Boolean, reflect: true }) removable = false;

  /** Dim + non-interactive + not focusable. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Convenience label (alias of the default slot). Slot wins when both set. */
  @property({ type: String }) label?: string;

  // RESERVED (Wave 2): `selected` / `selectable`. See the class doc — selection
  // state + ChipGroup land in Wave 2 (roving tabindex, single/multi semantics).
  // Do NOT add aria-pressed / selection here.

  /** True while the default slot has assigned content (slot wins over `label`). */
  @state() private _hasSlotLabel = false;

  /** Text content of the default slot, for the remove button's aria-label. */
  @state() private _slotText = "";

  /** True while the `icon` slot has assigned content (slot wins over the prop). */
  @state() private _hasSlotIcon = false;

  /** True while the `avatar` slot has assigned content (slot wins over the prop). */
  @state() private _hasSlotAvatar = false;

  @query(".icon-prop-target")
  private _iconTarget?: HTMLElement;

  @query(".avatar-prop-target")
  private _avatarTarget?: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
    // The chip body is operable → role="button" so AT announces it correctly.
    if (!this.hasAttribute("role")) this.setAttribute("role", "button");
    this._syncFocusability();
    this.addEventListener("click", this._onHostClick);
    this.addEventListener("keydown", this._onHostKeydown);
  }

  override disconnectedCallback(): void {
    this.removeEventListener("click", this._onHostClick);
    this.removeEventListener("keydown", this._onHostKeydown);
    super.disconnectedCallback();
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    const toneRelated = ["tone", "color", "bg", "accent", "text"];
    if (toneRelated.some((k) => changed.has(k))) {
      this._applyToneVars();
    }

    // Inject icon content imperatively (avoids unsafeSVG/unsafeHTML directive
    // dual-instance crash — see CLAUDE.md Lit directive gotcha).
    if (changed.has("icon")) this._applyIconContent();
    if (changed.has("avatar")) this._applyAvatarContent();

    // Drive leading-element visibility via host attributes (avatar wins icon).
    if (
      changed.has("icon") ||
      changed.has("avatar") ||
      changed.has("_hasSlotIcon") ||
      changed.has("_hasSlotAvatar")
    ) {
      this._syncLeadingAttrs();
    }

    if (changed.has("disabled")) this._syncFocusability();
  }

  // ─── Focusability ────────────────────────────────────────────────────────
  private _syncFocusability(): void {
    if (this.disabled) {
      this.removeAttribute("tabindex");
    } else if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
    // aria-disabled mirrors the boolean for AT (the host role is "button").
    this.toggleAttribute("aria-disabled", this.disabled);
  }

  // ─── Leading element visibility (avatar wins over icon) ────────────────────
  private get _showAvatar(): boolean {
    const hasProp = this.avatar !== undefined && this.avatar !== null && this.avatar !== "";
    return hasProp || this._hasSlotAvatar;
  }

  private get _showIcon(): boolean {
    if (this._showAvatar) return false;
    const hasProp = this.icon !== undefined && this.icon !== null && this.icon !== "";
    return hasProp || this._hasSlotIcon;
  }

  private _syncLeadingAttrs(): void {
    const showAvatar = this._showAvatar;
    this.toggleAttribute("data-show-avatar", showAvatar);
    this.toggleAttribute("data-show-icon", !showAvatar && this._showIcon);
  }

  // ─── Tone ────────────────────────────────────────────────────────────────
  private static _customVarNames = [
    "--tulpar-chip-surface-l",
    "--tulpar-chip-surface-d",
    "--tulpar-chip-on-surface-l",
    "--tulpar-chip-on-surface-d",
    "--tulpar-chip-border-l",
    "--tulpar-chip-border-d",
    "--tulpar-chip-accent-l",
    "--tulpar-chip-accent-d",
  ];

  private _applyToneVars(): void {
    const result = resolveTone(
      { tone: this.tone, color: this.color, bg: this.bg, accent: this.accent, text: this.text },
      { prefix: "chip" },
    );

    for (const v of TulparChip._customVarNames) this.style.removeProperty(v);

    if (!result.builtin) {
      for (const [prop, value] of Object.entries(result.vars)) {
        this.style.setProperty(prop, value);
      }
    }
  }

  // ─── Icon / avatar content ─────────────────────────────────────────────────
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
      target.textContent = value; // emoji / name / text glyph
    }
  }

  private _applyAvatarContent(): void {
    const target = this._avatarTarget;
    if (!target) return;
    const value = this.avatar?.trim();
    if (!value) {
      target.replaceChildren();
      return;
    }
    // Treat anything that looks like a URL / path / data URI as an image src,
    // otherwise render the string as initials text.
    if (
      /^(https?:|data:|\/|\.{0,2}\/)/i.test(value) ||
      /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value)
    ) {
      const img = document.createElement("img");
      img.src = value;
      img.alt = "";
      target.replaceChildren(img);
    } else {
      target.textContent = value;
    }
  }

  // ─── Slot change handlers ──────────────────────────────────────────────────
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
  };

  private _onIconSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this._hasSlotIcon = slot.assignedNodes({ flatten: true }).length > 0;
    this.toggleAttribute("data-slot-icon", this._hasSlotIcon);
  };

  private _onAvatarSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this._hasSlotAvatar = slot.assignedNodes({ flatten: true }).length > 0;
    this.toggleAttribute("data-slot-avatar", this._hasSlotAvatar);
  };

  // ─── Interaction ───────────────────────────────────────────────────────────
  /** Accessible text for the chip (label prop → captured slot text). */
  private get _accessibleText(): string {
    return (this.label ?? this._slotText ?? "").trim();
  }

  private _onHostClick = (e: MouseEvent): void => {
    if (this.disabled) return;
    // A click that originated on the remove button is handled there (and stops
    // propagation); this guard is belt-and-suspenders for composed paths.
    const path = e.composedPath();
    if (path.some((n) => n instanceof HTMLElement && n.classList?.contains("x"))) return;
    this._fireClick();
  };

  private _onHostKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    // Ignore keys that originate on the remove button (it has its own handler).
    if (e.target !== this) return;

    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      this._fireClick();
    } else if ((e.key === "Delete" || e.key === "Backspace") && this.removable) {
      e.preventDefault();
      this._remove();
    }
  };

  private _fireClick(): void {
    this.dispatchEvent(new CustomEvent("tulpar-click", { bubbles: true, composed: true }));
  }

  private _onRemoveButtonClick = (e: MouseEvent): void => {
    // Independent control: never let the click also activate the chip body.
    e.stopPropagation();
    if (this.disabled) return;
    this._remove();
  };

  private _onRemoveButtonKeydown = (e: KeyboardEvent): void => {
    // The native <button> already fires click on Enter/Space; just keep the
    // event from bubbling up to the host keydown handler (which would also
    // try to act on Enter/Space / Delete).
    e.stopPropagation();
  };

  /**
   * Dispatch `tulpar-remove`, then move focus to a neighbour so focus is never
   * orphaned. Focus is moved BEFORE dispatch so that if a listener detaches the
   * chip synchronously, the neighbour reference is still valid; we guard for a
   * detached node and fall back to next-sibling → prev-sibling → parent.
   */
  private _remove(): void {
    if (this.disabled) return;
    this._moveFocusToNeighbour();
    this.dispatchEvent(new CustomEvent("tulpar-remove", { bubbles: true, composed: true }));
  }

  private _moveFocusToNeighbour(): void {
    const isChip = (n: Element | null): n is TulparChip =>
      !!n && n.tagName === "TULPAR-CHIP" && !(n as TulparChip).disabled;

    // Next sibling chip, else previous sibling chip.
    let next: Element | null = this.nextElementSibling;
    while (next && !isChip(next)) next = next.nextElementSibling;
    if (next) {
      (next as HTMLElement).focus();
      return;
    }
    let prev: Element | null = this.previousElementSibling;
    while (prev && !isChip(prev)) prev = prev.previousElementSibling;
    if (prev) {
      (prev as HTMLElement).focus();
      return;
    }
    // Else the parent element, if it can receive focus.
    const parent = this.parentElement;
    if (parent) {
      if (parent.tabIndex < 0 && !parent.hasAttribute("tabindex")) {
        parent.setAttribute("tabindex", "-1");
      }
      parent.focus();
    }
  }

  // ─── X glyph (stroke-based cross, 1.5px) ───────────────────────────────────
  private _removeGlyph() {
    // Plain inline SVG string injected via the template (no unsafeSVG); a stroke
    // X with round caps, matching the house icon language.
    return html`<svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 3 L9 9 M9 3 L3 9"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      ></path>
    </svg>`;
  }

  override render() {
    const removeLabel = this._accessibleText ? `Remove ${this._accessibleText}` : "Remove";

    // The icon/avatar containers + their slots are ALWAYS in the shadow DOM; CSS
    // shows/hides them via [data-show-icon] / [data-show-avatar] on the host
    // (attribute toggle, no requestUpdate loop — see CLAUDE.md slotchange gotcha).
    return html`
      <span class="chip" part="chip">
        <span class="avatar" part="avatar" aria-hidden="true">
          <span class="avatar-prop-target"></span>
          <slot name="avatar" @slotchange=${this._onAvatarSlotChange}></slot>
        </span>
        <span class="icon" part="icon" aria-hidden="true">
          <span class="icon-prop-target"></span>
          <slot name="icon" @slotchange=${this._onIconSlotChange}></slot>
        </span>
        <span class="label" part="label">
          <slot @slotchange=${this._onSlotChange}
            >${!this._hasSlotLabel && this.label ? this.label : nothing}</slot
          >
        </span>
        ${this.removable
          ? html`<button
              type="button"
              class="x"
              part="remove"
              aria-label=${removeLabel}
              ?disabled=${this.disabled}
              @click=${this._onRemoveButtonClick}
              @keydown=${this._onRemoveButtonKeydown}
            >
              <span class="x-glyph">${this._removeGlyph()}</span>
            </button>`
          : nothing}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-chip": TulparChip;
  }
}

if (!customElements.get("tulpar-chip")) {
  customElements.define("tulpar-chip", TulparChip);
}
