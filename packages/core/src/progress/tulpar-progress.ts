import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { resolveTone } from "../_internal/tone/tone-resolver";
import { progressStyles } from "./tulpar-progress.styles";

export type ProgressVariant = "linear" | "circular";
export type ProgressTone = "neutral" | "info" | "success" | "warning" | "danger" | "custom";
export type ProgressThickness = "thin" | "regular" | "thick";
export type ProgressSize = "sm" | "md" | "lg";

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
 * ## Value label
 * `valueLabel` is a PROPERTY (not an attribute): `true` shows `${pct}%`; a
 * formatter function shows its return (and seeds `aria-valuetext`, e.g.
 * "Step 3 of 5").
 *
 * ## Accessibility
 * The host is `role="progressbar"` with `aria-valuemin`/`-valuemax` and, when
 * determinate, `aria-valuenow`. `aria-label` / `aria-labelledby` pass through.
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
  }

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

    this.style.setProperty("color", TulparProgress._toneAccent(tone));
  }

  private static _toneAccent(tone: Exclude<ProgressTone, "custom">): string {
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
      <div class="row">
        <div class="track" part="track">
          <div class="buffer" part="buffer" style=${bufStyle || nothing}></div>
          <div class="fill" part="fill" style=${fillStyle || nothing}></div>
        </div>
        <span class="value" part="value">${label ?? nothing}</span>
      </div>
    `;
  }

  private _renderCircular() {
    const box = this.size === "sm" ? 32 : this.size === "lg" ? 56 : 44;
    const r = box / 2 - 2; // stroke 4 kept inside the box
    const cx = box / 2;
    const indet = this.indeterminate;
    // pathLength=100 → offset = 100 - pct (no per-size circumference math).
    const dashoffset = indet ? null : 100 - this._frac * 100;
    const fillStyle = dashoffset !== null ? `stroke-dashoffset:${dashoffset.toFixed(2)}` : "";
    const label = this._labelText;

    return html`
      <span class="circular" part="circular">
        <svg viewBox="0 0 ${box} ${box}" fill="none" stroke-width="4">
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
