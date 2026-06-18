import { css } from "lit";

/**
 * Shared styles for the selection control family (Switch / Checkbox / Radio).
 *
 * House idioms (matching tulpar-button.styles): per-tier `:host([size=…])`
 * blocks set private `--_sel-*` vars; only semantic tokens with literal
 * `var()` fallbacks; `:focus-visible` ring + forced-colors CanvasText;
 * reduced-motion kills transitions.
 *
 * Verified emitted token names (packages/tokens/dist/css/tulpar-light.css):
 *   --tulpar-selection-control-bg-checked / -bg-disabled
 *   --tulpar-selection-control-border-invalid
 *   --tulpar-selection-glyph-default / -on-custom / -disabled
 *   --tulpar-selection-label / -description / -focus-ring
 */
export const selectionControlBaseStyles = css`
  :host {
    display: inline-flex;
    flex-direction: column;
    font-family: var(--tulpar-font-family-ui, system-ui);

    /* Private color stops. Concrete subclasses (track / box) consume these. */
    --_sel-fill: var(--tulpar-selection-control-bg-checked, var(--tulpar-color-brand-default, #00c57a));
    --_sel-glyph: var(--tulpar-selection-glyph-default, #15110b);
  }

  /* Custom fill (color prop): the setter writes the value to an inline
     --_sel-custom-fill var (not --_sel-fill directly) so the disabled rule
     below can still override the resolved fill. Also flips the glyph to the
     on-custom contrast color. */
  :host([data-custom-fill]) {
    --_sel-fill: var(--_sel-custom-fill);
    --_sel-glyph: var(--tulpar-selection-glyph-on-custom, #f0f7f5);
  }

  /* Invalid recolors the control fill/border to danger. */
  :host([invalid]) {
    --_sel-fill: var(--tulpar-selection-control-border-invalid, var(--tulpar-color-danger-default, #b22128));
  }

  /* Disabled muting wins over invalid + custom fill via later source order
     (equal specificity (0,1,1)). */
  :host([disabled]) {
    --_sel-fill: var(--tulpar-selection-control-bg-disabled, #e9f1ef);
    --_sel-glyph: var(--tulpar-selection-glyph-disabled, #74777a);
  }

  /* ── Per-tier sizing ─────────────────────────────────────────────────── */
  :host([size="xs"]) {
    --_sel-control-size: 14px;
    --_sel-gap: 6px;
    --_sel-label-fs: 12px;
    --_sel-desc-fs: 11px;
    --_sel-touch: 8px;
  }
  :host([size="sm"]) {
    --_sel-control-size: 16px;
    --_sel-gap: 8px;
    --_sel-label-fs: 13px;
    --_sel-desc-fs: 12px;
    --_sel-touch: 6px;
  }
  :host([size="md"]) {
    --_sel-control-size: 18px;
    --_sel-gap: 10px;
    --_sel-label-fs: 14px;
    --_sel-desc-fs: 12px;
    --_sel-touch: 5px;
  }
  :host([size="lg"]) {
    --_sel-control-size: 20px;
    --_sel-gap: 12px;
    --_sel-label-fs: 16px;
    --_sel-desc-fs: 13px;
    --_sel-touch: 4px;
  }
  :host([size="xl"]) {
    --_sel-control-size: 22px;
    --_sel-gap: 14px;
    --_sel-label-fs: 18px;
    --_sel-desc-fs: 14px;
    --_sel-touch: 3px;
  }

  /* ── Root (the <label> is both wrapper and click target) ─────────────── */
  .root {
    display: inline-flex;
    align-items: center;
    gap: var(--_sel-gap);
    cursor: pointer;
    user-select: none;
  }

  :host([label-position="start"]) .root {
    flex-direction: row-reverse;
  }

  /* When a description is present, top-align the row and nudge the control
     down so it optically centers on the FIRST label line rather than the
     whole text block. data-has-description is toggled via the description
     slotchange listener (reliable in Shadow DOM; :has(::slotted) support is
     uneven across the WTR Chromium matrix). */
  :host([data-has-description]) .root {
    align-items: flex-start;
  }
  :host([data-has-description]) .control {
    margin-top: var(--_sel-touch);
  }

  .control {
    display: inline-flex;
    flex-shrink: 0;
  }

  .text {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: var(--_sel-label-fs);
    line-height: 1.3;
    color: var(--tulpar-selection-label, #15110b);
  }

  .description {
    font-size: var(--_sel-desc-fs);
    line-height: 1.3;
    color: var(--tulpar-selection-description, #4f5153);
  }

  /* ── Disabled / readonly interaction ─────────────────────────────────── */
  :host([disabled]) .root {
    cursor: not-allowed;
    pointer-events: none;
  }
  :host([disabled]) .label {
    color: var(--tulpar-selection-glyph-disabled, #74777a);
  }

  /* readonly stays focusable + visible; only the control mutation is gated by
     the subclass. No pointer-events change here. */

  /* ── Focus ring (drawn around the control by subclasses via :focus-visible
     on the actual control element; base provides the token + forced-colors). */
  .control:focus-visible,
  :host(:focus-visible) .control {
    outline: 2px solid var(--tulpar-selection-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
  }
  @media (forced-colors: active) {
    .control:focus-visible,
    :host(:focus-visible) .control {
      outline-color: CanvasText;
    }
  }

  /* Selection controls do not animate position/size by default; subclasses
     add their own transitions, which this block disables under reduced
     motion. */
  @media (prefers-reduced-motion: reduce) {
    .control,
    .control * {
      transition: none !important;
      animation-duration: 0.001ms !important;
    }
  }
`;
