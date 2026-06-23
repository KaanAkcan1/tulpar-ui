import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { resolveTone } from "../_internal/tone/tone-resolver";
import { hasMeaningfulContent } from "../_internal/slot-content";
import { progressStyles } from "./tulpar-progress.styles";

/** Monotonic counter → a stable, unique id for each instance's label wrapper. */
let progressLabelIdSeq = 0;

export type ProgressVariant = "linear" | "circular";
export type ProgressTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "custom"
  | "flow";
export type ProgressThickness = "thin" | "regular" | "thick";
export type ProgressSize = "xs" | "sm" | "md" | "lg" | "xl";

/** A value-label formatter: receives the raw value + bounds, returns a string. */
export type ProgressValueFormatter = (value: number, min: number, max: number) => string;

/**
 * `<tulpar-progress>` — linear + circular progress.
 *
 * Reports the progress of a task as a determinate bar/ring (a known fraction)
 * or an indeterminate animation (unknown duration). The fill defaults to brand
 * green; a `tone` (or `tone="custom"` + `color`) recolors it.
 *
 * ## Determinate vs indeterminate
 * - Determinate: `value` between `min`..`max`. The linear fill animates its
 *   width; the circular ring animates its `stroke-dashoffset` (both 320ms).
 * - `indeterminate`: a traveling bar (linear) or rotating arc (circular). When
 *   set, `aria-valuenow` is DROPPED (the value is unknown).
 *
 * ## Buffer (linear only)
 * `buffer` renders a fainter secondary segment behind the fill (e.g. a video's
 * buffered range ahead of the playhead). Ignored for the circular variant.
 *
 * ## State tone
 * `state-tone` auto-promotes to `success` once `value >= max` (a finished task
 * reads green). Failures are NOT auto-detected — a consumer signals an error by
 * setting `tone="danger"` (or a `data-error` attribute), which always wins.
 *
 * ## Flow tone (value-driven gradient)
 * `tone="flow"` (determinate only) recolors the fill as a CONTINUOUS oklab
 * interpolation across the value range: red (al) at 0% → amber (ulgen) at ~50%
 * → green (otuken) at 100%. It is opt-in and purely visual (a11y is unchanged).
 * Indeterminate + flow has no value to map, so it falls back to the brand
 * accent. Light/dark swap the primitive steps for legibility per surface.
 *
 * ## Value label vs descriptive label
 * Two DISTINCT label concepts:
 * - `valueLabel` (numeric %) — a PROPERTY (not an attribute): `true` shows
 *   `${pct}%`; a formatter shows its return (and seeds `aria-valuetext`, e.g.
 *   "Step 3 of 5").
 * - `slot="label"` (descriptive) — visible descriptive text beside/above the
 *   bar (e.g. "Uploading…"). When the label slot has content the progressbar's
 *   accessible name is wired via `aria-labelledby` → the label wrapper's id.
 *   The <slot name="label"> element is ALWAYS present in the shadow tree; its
 *   visibility is driven by a host data-attr + CSS, never by swapping the slot
 *   element in/out (see CLAUDE.md slotchange→requestUpdate gotcha).
 *
 * ## Accessibility
 * The host is `role="progressbar"` with `aria-valuemin`/`-valuemax` and, when
 * determinate, `aria-valuenow`. A `slot="label"` wires `aria-labelledby`;
 * otherwise a passed-through `aria-label` / `aria-labelledby` is left intact.
 */
export class TulparProgress extends LitElement {
  static override styles = [progressStyles];

  /** Linear (default) or circular. */
  @property({ type: String, reflect: true }) variant: ProgressVariant = "linear";

  /** Current value (clamped to min..max). Ignored when indeterminate. */
  @property({ type: Number }) value?: number;

  /** Lower bound. */
  @property({ type: Number }) min = 0;

  /** Upper bound. */
  @property({ type: Number }) max = 100;

  /** Unknown-duration mode (traveling bar / rotating arc). */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** Secondary "buffered" value (linear only). */
  @property({ type: Number }) buffer?: number;

  /** Tone. Default fill is brand green; built-in tones / custom recolor it. */
  @property({ type: String, reflect: true }) tone?: ProgressTone;

  /** Custom-tone base: a brand family name or any CSS color. */
  @property({ type: String }) color?: string;

  /** Auto-promote to success once value >= max (a consumer's danger wins). */
  @property({ type: Boolean, attribute: "state-tone" }) stateTone = false;

  /** Bar thickness (linear). */
  @property({ type: String, reflect: true }) thickness: ProgressThickness = "regular";

  /** Ring size (circular). */
  @property({ type: String, reflect: true }) size: ProgressSize = "md";

  /**
   * Value label: `true` → `${pct}%`; a formatter → its return (also seeds
   * aria-valuetext). PROPERTY only — set via JS, not an attribute.
   */
  @property({ attribute: false }) valueLabel: boolean | ProgressValueFormatter = false;

  /** True while the `label` slot has assigned non-whitespace content. */
  @state() private _hasSlotLabel = false;

  /** Stable id for the descriptive-label wrapper, for `aria-labelledby`. */
  private readonly _labelId = `tulpar-progress-label-${progressLabelIdSeq++}`;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("role")) this.setAttribute("role", "progressbar");
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    // The EFFECTIVE tone depends on value (state-tone success-at-max) + the
    // data-error attr, so recompute the color on any of these — not just tone.
    const toneRelated = ["tone", "color", "value", "max", "min", "indeterminate", "stateTone"];
    if (toneRelated.some((k) => changed.has(k))) {
      this._applyToneColor();
    }

    // Recompute a11y + visuals on any value-affecting change.
    this._syncAria();
    this._syncDataAttrs();
  }

  // ─── Value math ────────────────────────────────────────────────────────────
  /** Clamp helper. */
  private _clamp(v: number): number {
    const lo = Math.min(this.min, this.max);
    const hi = Math.max(this.min, this.max);
    return Math.min(hi, Math.max(lo, v));
  }

  /** The clamped current value, or null when there is no numeric value. */
  private get _value(): number | null {
    if (this.value === undefined || this.value === null || Number.isNaN(this.value)) return null;
    return this._clamp(this.value);
  }

  /** Fraction 0..1 of the current value within bounds. */
  private get _frac(): number {
    const v = this._value;
    if (v === null) return 0;
    const span = this.max - this.min;
    if (span === 0) return 0;
    return (v - this.min) / span;
  }

  /** Integer percentage 0..100. */
  private get _pct(): number {
    return Math.round(this._frac * 100);
  }

  /** Clamped buffer fraction 0..1, or null when no buffer is set. */
  private get _bufferFrac(): number | null {
    if (this.buffer === undefined || this.buffer === null || Number.isNaN(this.buffer)) return null;
    const span = this.max - this.min;
    if (span === 0) return 0;
    return (this._clamp(this.buffer) - this.min) / span;
  }

  /** The effective tone, honoring state-tone success-at-max (danger always wins). */
  private get _effectiveTone(): ProgressTone | undefined {
    if (this.tone === "danger" || this.hasAttribute("data-error")) return "danger";
    // `flow` is value-driven (already green at max), so it stays flow rather than
    // being overridden by the state-tone success-at-max promotion.
    if (this.tone === "flow") return "flow";
    if (
      this.stateTone &&
      !this.indeterminate &&
      this._value !== null &&
      this._value >= this.max &&
      this.max > this.min
    ) {
      return "success";
    }
    return this.tone;
  }

  // ─── Value label ───────────────────────────────────────────────────────────
  private get _hasValueLabel(): boolean {
    return this.valueLabel === true || typeof this.valueLabel === "function";
  }

  /** The rendered label text (or null when no label / indeterminate). */
  private get _labelText(): string | null {
    if (!this._hasValueLabel || this.indeterminate || this._value === null) return null;
    if (typeof this.valueLabel === "function") {
      return this.valueLabel(this._value, this.min, this.max);
    }
    return `${this._pct}%`;
  }

  // ─── A11y ──────────────────────────────────────────────────────────────────
  private _syncAria(): void {
    this.setAttribute("aria-valuemin", String(this.min));
    this.setAttribute("aria-valuemax", String(this.max));

    // A descriptive `slot="label"` becomes the accessible name via
    // aria-labelledby → the label wrapper's id. We only own aria-labelledby
    // while the slot has content: set it when present, and clear ONLY the value
    // we set (never stomp a consumer-supplied aria-labelledby).
    if (this._hasSlotLabel) {
      this.setAttribute("aria-labelledby", this._labelId);
    } else if (this.getAttribute("aria-labelledby") === this._labelId) {
      this.removeAttribute("aria-labelledby");
    }

    if (this.indeterminate || this._value === null) {
      // Unknown value → drop aria-valuenow entirely.
      this.removeAttribute("aria-valuenow");
    } else {
      this.setAttribute("aria-valuenow", String(this._value));
    }

    // A custom formatter result becomes aria-valuetext (e.g. "Step 3 of 5").
    if (typeof this.valueLabel === "function" && !this.indeterminate && this._value !== null) {
      this.setAttribute("aria-valuetext", this.valueLabel(this._value, this.min, this.max));
    } else {
      this.removeAttribute("aria-valuetext");
    }
  }

  /** Mirror render-affecting state to host data-* attributes for the CSS. */
  private _syncDataAttrs(): void {
    this.toggleAttribute("data-buffer", this._bufferFrac !== null && this.variant === "linear");
    this.toggleAttribute("data-value-label", this._hasValueLabel);
    this.toggleAttribute("data-label", this._hasSlotLabel);
  }

  // ─── Descriptive label slot ────────────────────────────────────────────────
  /**
   * Track `slot="label"` content. Sets `_hasSlotLabel` from the slot's assigned
   * nodes (whitespace-only text ignored). Only toggles a @state flag — the
   * <slot> element stays rendered unconditionally, so slotchange keeps firing
   * with no requestUpdate→re-render loop.
   */
  private _onLabelSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    // Count ONLY meaningful content (elements / non-whitespace text). A bare
    // comment node (Vue's empty-`<slot/>` `<!---->` placeholder) must NOT count,
    // else it spuriously flips `_hasSlotLabel` and points aria-labelledby at an
    // empty label wrapper. See slot-content.
    this._hasSlotLabel = hasMeaningfulContent(slot.assignedNodes({ flatten: true }));
  };

  // ─── Tone color ──────────────────────────────────────────────────────────
  private static _customVarNames = ["--tulpar-progress-accent-l", "--tulpar-progress-accent-d"];

  private _applyToneColor(): void {
    for (const v of TulparProgress._customVarNames) this.style.removeProperty(v);
    this.style.removeProperty("color");

    const tone = this._effectiveTone;
    if (!tone) return; // default brand green from the stylesheet

    if (tone === "custom") {
      const result = resolveTone({ tone: "custom", color: this.color }, { prefix: "progress" });
      for (const [prop, value] of Object.entries(result.vars)) {
        if (prop.endsWith("-accent-l") || prop.endsWith("-accent-d")) {
          this.style.setProperty(prop, value);
        }
      }
      return; // CSS rules map -accent-l/-d → color per mode
    }

    if (tone === "flow") {
      // Value-driven continuous tone. Determinate only: interpolate the fill
      // across the value range via two-segment oklab color-mix between our
      // palette anchors (al → ulgen → otuken). Indeterminate has no value, so
      // there is nothing to interpolate — fall back to the default brand accent
      // (return without setting anything, leaving the stylesheet's brand green).
      if (this.indeterminate || this._value === null) return;
      // flow computes a LITERAL color-mix (not an auto-flipping token), so the
      // light vs dark anchor set must be chosen here. We set BOTH:
      //  - inline `color` with the correct-for-mode mix (highest specificity,
      //    always wins — independent of :host-context reliability), and
      //  - the -accent-l/-d vars (so ::part / external CSS can read them too,
      //    mirroring the custom-tone plumbing).
      const dark = this._isDarkContext();
      this.style.setProperty("--tulpar-progress-accent-l", TulparProgress._flowMix(this._frac, false));
      this.style.setProperty("--tulpar-progress-accent-d", TulparProgress._flowMix(this._frac, true));
      this.style.setProperty("color", TulparProgress._flowMix(this._frac, dark));
      return;
    }

    this.style.setProperty("color", TulparProgress._toneAccent(tone));
  }

  /**
   * Whether the element sits inside a dark context. The project's dark trigger
   * is a `.dark` class on an ancestor (Tailwind-compatible), so we walk up via
   * `closest(".dark")`. (`:host-context(.dark)` is used elsewhere for tokens
   * that auto-flip; flow computes a literal color, so it resolves the mode here
   * and sets `color` inline — which always wins regardless of host-context.)
   */
  private _isDarkContext(): boolean {
    return this.closest(".dark") !== null;
  }

  /**
   * Continuous flow color for fraction `f` (0..1) as a two-segment perceptual
   * (oklab) interpolation across our palette: red (al) → amber (ulgen) → green
   * (otuken). Light vs dark swap the primitive steps so the sweep stays legible
   * on each surface. f<=0.5 mixes al→ulgen; f>0.5 mixes ulgen→otuken.
   */
  private static _flowMix(f: number, dark: boolean): string {
    const c = Math.min(1, Math.max(0, f));
    // Light: solid-bg anchors (match danger/warning/success tones).
    // Dark: brighter steps for contrast on dark surfaces.
    const red = dark ? "#f84648" : "#d2202c"; // al 400 / 500
    const amber = dark ? "#ecb32a" : "#d7a40f"; // ulgen 400 / 500
    const green = dark ? "#488e73" : "#245d48"; // otuken 400 / 600
    if (c <= 0.5) {
      const t = c * 2; // 0..1 within the red→amber half
      return `color-mix(in oklab, ${red} ${((1 - t) * 100).toFixed(2)}%, ${amber} ${(t * 100).toFixed(2)}%)`;
    }
    const t = (c - 0.5) * 2; // 0..1 within the amber→green half
    return `color-mix(in oklab, ${amber} ${((1 - t) * 100).toFixed(2)}%, ${green} ${(t * 100).toFixed(2)}%)`;
  }

  private static _toneAccent(tone: Exclude<ProgressTone, "custom" | "flow">): string {
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

  // ─── Render ──────────────────────────────────────────────────────────────
  private _renderLinear() {
    const indet = this.indeterminate;
    const fillStyle = indet ? "" : `width:${(this._frac * 100).toFixed(2)}%`;
    const bufFrac = this._bufferFrac;
    const bufStyle = bufFrac !== null ? `width:${(bufFrac * 100).toFixed(2)}%` : "";
    const label = this._labelText;

    return html`
      ${this._renderLabel()}
      <div class="row">
        <div class="track" part="track">
          <div class="buffer" part="buffer" style=${bufStyle || nothing}></div>
          <div class="fill" part="fill" style=${fillStyle || nothing}></div>
        </div>
        <span class="value" part="value">${label ?? nothing}</span>
      </div>
    `;
  }

  /**
   * The descriptive label wrapper. The <slot name="label"> is ALWAYS rendered
   * (so slotchange keeps firing); CSS hides the wrapper via [data-label] on the
   * host when the slot is empty. The id is the aria-labelledby target.
   */
  private _renderLabel() {
    return html`<span id=${this._labelId} class="label" part="label">
      <slot name="label" @slotchange=${this._onLabelSlotChange}></slot>
    </span>`;
  }

  /** Circular box (px) + ring stroke width (px) per size. */
  private static _circularGeom(
    size: ProgressSize,
  ): { box: number; stroke: number } {
    switch (size) {
      case "xs":
        return { box: 24, stroke: 3 };
      case "sm":
        return { box: 32, stroke: 4 };
      case "lg":
        return { box: 56, stroke: 4 };
      case "xl":
        return { box: 64, stroke: 5 };
      case "md":
      default:
        return { box: 44, stroke: 4 };
    }
  }

  private _renderCircular() {
    const { box, stroke } = TulparProgress._circularGeom(this.size);
    const r = box / 2 - stroke / 2; // keep the stroke fully inside the box
    const cx = box / 2;
    const indet = this.indeterminate;
    // pathLength=100 → offset = 100 - pct (no per-size circumference math).
    const dashoffset = indet ? null : 100 - this._frac * 100;
    const fillStyle = dashoffset !== null ? `stroke-dashoffset:${dashoffset.toFixed(2)}` : "";
    const label = this._labelText;

    return html`
      ${this._renderLabel()}
      <span class="circular" part="circular">
        <svg viewBox="0 0 ${box} ${box}" fill="none" stroke-width=${stroke}>
          <circle
            class="ring-track"
            part="ring-track"
            cx=${cx}
            cy=${cx}
            r=${r}
            pathLength="100"
          ></circle>
          <circle
            class="ring-fill"
            part="ring-fill"
            cx=${cx}
            cy=${cx}
            r=${r}
            pathLength="100"
            style=${fillStyle || nothing}
          ></circle>
        </svg>
        <span class="value" part="value">${label ?? nothing}</span>
      </span>
    `;
  }

  override render() {
    return this.variant === "circular" ? this._renderCircular() : this._renderLinear();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-progress": TulparProgress;
  }
}

if (!customElements.get("tulpar-progress")) {
  customElements.define("tulpar-progress", TulparProgress);
}
