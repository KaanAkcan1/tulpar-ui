import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { skeletonStyles } from "./tulpar-skeleton.styles";

export type SkeletonVariant = "text" | "rect" | "circle";
export type SkeletonAnimation = "shimmer" | "pulse" | "none";

/**
 * `<tulpar-skeleton>` — loading placeholder.
 *
 * Reserves layout while content loads, avoiding cumulative layout shift (CLS).
 * The default animation is a directional 100° shimmer sweep (calmer than an
 * opacity pulse across many rows); `pulse` and `none` are alternatives.
 *
 * ## Variants
 * - `text` (default) — one or more text-line bars (`lines`). When `lines > 1`
 *   the last bar is shortened (~60%) to mimic a ragged paragraph end.
 * - `rect` — a block (cards, thumbnails, media); 6px radius.
 * - `circle` — a round placeholder (avatars); 50% radius.
 *
 * `width` / `height` / `radius` props override the per-variant sizing.
 *
 * ## Accessibility
 * The skeleton is purely decorative: the host is `aria-hidden="true"` so AT
 * skips it. The LOADING CONTAINER (the region being populated) should expose
 * the busy state itself, e.g. `<div aria-busy="true" aria-live="polite">…`.
 * This element intentionally does NOT render or manage that container.
 */
export class TulparSkeleton extends LitElement {
  static override styles = [skeletonStyles];

  /** Shape variant. */
  @property({ type: String, reflect: true }) variant: SkeletonVariant = "text";

  /** Number of text-line bars (text variant only). */
  @property({ type: Number }) lines = 1;

  /** Explicit width override (any CSS length, e.g. "120px", "60%"). */
  @property({ type: String }) width?: string;

  /** Explicit height override (any CSS length). */
  @property({ type: String }) height?: string;

  /** Explicit corner-radius override (any CSS length). */
  @property({ type: String }) radius?: string;

  /** Animation style. */
  @property({ type: String, reflect: true }) animation: SkeletonAnimation = "shimmer";

  override connectedCallback(): void {
    super.connectedCallback();
    // Decorative — AT skips the placeholder; the container exposes aria-busy.
    if (!this.hasAttribute("aria-hidden")) this.setAttribute("aria-hidden", "true");
  }

  /** Inline overrides applied to each rendered bar. */
  private _barStyle(isLast: boolean): string {
    const decls: string[] = [];
    if (this.width) decls.push(`width:${this.width}`);
    if (this.height) decls.push(`height:${this.height}`);
    if (this.radius) decls.push(`border-radius:${this.radius}`);
    // Ragged last line in a multi-line text block (no explicit width override).
    if (isLast && this.variant === "text" && this.lines > 1 && !this.width) {
      decls.push("width:60%");
    }
    return decls.join(";");
  }

  override render() {
    if (this.variant === "text") {
      const count = Math.max(1, Math.floor(this.lines) || 1);
      const bars = [];
      for (let i = 0; i < count; i++) {
        const isLast = i === count - 1;
        bars.push(
          html`<span class="bar" part="bar" style=${this._barStyle(isLast) || nothing}></span>`,
        );
      }
      return html`${bars}`;
    }
    // rect / circle render a single shape.
    return html`<span class="bar" part="bar" style=${this._barStyle(true) || nothing}></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-skeleton": TulparSkeleton;
  }
}

if (!customElements.get("tulpar-skeleton")) {
  customElements.define("tulpar-skeleton", TulparSkeleton);
}
