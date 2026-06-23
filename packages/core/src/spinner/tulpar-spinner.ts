import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { resolveTone } from "../_internal/tone/tone-resolver";
import { hasMeaningfulContent } from "../_internal/slot-content";
import { spinnerStyles } from "./tulpar-spinner.styles";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
/**
 * Spinner tone. Unlike the other tonal atoms, tone is OPTIONAL here: when
 * omitted the spinner inherits the page `currentColor`. Setting a built-in tone
 * (or `custom` + `color`) colorizes the arc + track.
 */
export type SpinnerTone = "neutral" | "info" | "success" | "warning" | "danger" | "custom";

/**
 * `<tulpar-spinner>` — indeterminate loader (quarter-arc).
 *
 * A round-cap quarter-arc spins at 0.7s linear (house consistency with the
 * switch busy spinner), over an optional faint full track ring. The arc/track
 * inherit `currentColor` by default so the spinner adopts its surrounding text
 * color; `tone` (or `tone="custom"` + `color`) colorizes it explicitly.
 *
 * ## Tone
 * - OMITTED (default) → arc/track = `currentColor` (no inline color is set; the
 *   spinner takes the page's color, e.g. a muted grid cell or button label).
 * - Built-in (`neutral|info|success|warning|danger`) → the host `color` is set
 *   to that tone's accent token (auto-flips for `.dark` via the token sheet).
 * - `custom` + `color` → a brand family name or any raw CSS color via the tone
 *   resolver's accent var (`--tulpar-spinner-accent-l/-d`, picked by `.dark`).
 *
 * ## Delay
 * When `delay > 0` the spinner renders NOTHING until the delay elapses — this
 * suppresses the flash of a loader for operations that resolve quickly. A timer
 * starts on connect and is cleared on disconnect.
 *
 * ## Accessibility
 * The host is `role="status"` with an accessible name: the `label` prop renders
 * as a visually-hidden span (default "Loading"); a `slot="label"` overrides it.
 * `role="status"` (an aria-live polite region) announces the loading state to AT.
 */
export class TulparSpinner extends LitElement {
  static override styles = [spinnerStyles];

  /** Size tier (outer diameter): xs14 / sm16 / md20 / lg24 / xl28. */
  @property({ type: String, reflect: true }) size: SpinnerSize = "md";

  /**
   * Tone. OPTIONAL — omitted means inherit `currentColor`. A built-in tone or
   * `custom` + `color` colorizes the arc + track.
   */
  @property({ type: String, reflect: true }) tone?: SpinnerTone;

  /** Custom-tone base: a brand family name (e.g. "tulpar") or any CSS color. */
  @property({ type: String }) color?: string;

  /** Faint full track ring behind the arc. */
  @property({ type: Boolean, reflect: true }) track = true;

  /** Delay (ms) before the spinner renders. 0 = render immediately. */
  @property({ type: Number }) delay = 0;

  /** Accessible name (visually-hidden). Overridden by a `slot="label"`. */
  @property({ type: String }) label = "Loading";

  /** False until the `delay` has elapsed (or immediately when delay is 0). */
  @state() private _ready = false;

  /** True while the `label` slot has assigned content (slot wins over `label`). */
  @state() private _hasSlotLabel = false;

  private _delayTimer?: ReturnType<typeof setTimeout>;

  override connectedCallback(): void {
    super.connectedCallback();
    // aria-live status region announces the loading state to AT.
    if (!this.hasAttribute("role")) this.setAttribute("role", "status");

    if (this.delay > 0) {
      this._ready = false;
      this._delayTimer = setTimeout(() => {
        this._ready = true;
        this._delayTimer = undefined;
      }, this.delay);
    } else {
      this._ready = true;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._delayTimer !== undefined) {
      clearTimeout(this._delayTimer);
      this._delayTimer = undefined;
    }
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has("tone") || changed.has("color")) {
      this._applyToneColor();
    }
  }

  // ─── Tone ────────────────────────────────────────────────────────────────
  private static _customVarNames = ["--tulpar-spinner-accent-l", "--tulpar-spinner-accent-d"];

  /**
   * Built-in tones set the host `color` to that tone's accent token (the arc +
   * track read `currentColor`). Custom tones emit -l/-d accent vars via the tone
   * resolver and pick the right one via `:host-context(.dark)` in CSS — here we
   * just set `color` to the active var. Omitted tone → leave `color` untouched
   * so the spinner inherits the page currentColor.
   */
  private _applyToneColor(): void {
    // Always clear prior custom vars + any color we previously set.
    for (const v of TulparSpinner._customVarNames) this.style.removeProperty(v);

    const tone = this.tone;

    if (!tone) {
      // Inherit currentColor — remove any color we set.
      this.style.removeProperty("color");
      return;
    }

    if (tone === "custom") {
      // We set color via inline `color` for built-in tones, but for custom we
      // must let the mode-aware CSS rules choose the -l/-d accent — so DON'T set
      // inline `color` (inline would beat the :host-context(.dark) rule). Emit
      // only the accent var pair; styles map them to `color` per mode.
      this.style.removeProperty("color");
      const result = resolveTone({ tone: "custom", color: this.color }, { prefix: "spinner" });
      for (const [prop, value] of Object.entries(result.vars)) {
        // We only need the accent pair for the spinner stroke.
        if (prop.endsWith("-accent-l") || prop.endsWith("-accent-d")) {
          this.style.setProperty(prop, value);
        }
      }
      return;
    }

    // Built-in tone → that tone's accent token (auto-flips for .dark).
    this.style.setProperty("color", TulparSpinner._toneAccent(tone));
  }

  /** Accent token + literal fallback for a built-in tone (atom solid bg). */
  private static _toneAccent(tone: Exclude<SpinnerTone, "custom">): string {
    switch (tone) {
      case "neutral":
        return "var(--tulpar-atom-tone-neutral-solid-bg, #404243)";
      case "info":
        return "var(--tulpar-atom-tone-info-solid-bg, #1c6eb3)";
      case "success":
        return "var(--tulpar-atom-tone-success-solid-bg, #245d48)";
      case "warning":
        return "var(--tulpar-atom-tone-warning-solid-bg, #d7a40f)";
      case "danger":
        return "var(--tulpar-atom-tone-danger-solid-bg, #b22128)";
    }
  }

  private _onLabelSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    // NOTE: plain assignedNodes() (no flatten) — the label slot renders the
    // `label` prop as FALLBACK content, and flatten:true counts fallback nodes
    // as assigned, flipping `_hasSlotLabel` every render and locking the page
    // (slotchange→requestUpdate loop, see CLAUDE.md). Real slotted content still
    // wins because assignedNodes() only returns true light-DOM children.
    const nodes = slot.assignedNodes();
    // Count ONLY meaningful content (elements / non-whitespace text). A bare
    // comment node (Vue's empty-`<slot/>` `<!---->` placeholder) must NOT count,
    // else it suppresses the `label` prop and nothing renders. See slot-content.
    this._hasSlotLabel = hasMeaningfulContent(nodes);
  };

  override render() {
    if (!this._ready) return nothing;

    // The visible glyph: a spinning quarter-arc by default; CSS swaps to a
    // 3-dot opacity cycle under prefers-reduced-motion. The accessible name is
    // a visually-hidden span (label prop) OR the `slot="label"` content.
    return html`
      <span class="spinner" part="spinner" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.6">
          <circle class="track" cx="12" cy="12" r="9"></circle>
          <circle class="arc" cx="12" cy="12" r="9"></circle>
        </svg>
      </span>
      <span class="dots" part="dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
      <span class="sr-only">
        ${!this._hasSlotLabel && this.label
          ? html`<span class="label-prop">${this.label}</span>`
          : nothing}
        <slot name="label" @slotchange=${this._onLabelSlotChange}></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-spinner": TulparSpinner;
  }
}

if (!customElements.get("tulpar-spinner")) {
  customElements.define("tulpar-spinner", TulparSpinner);
}
