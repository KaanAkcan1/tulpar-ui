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
    --_sel-card-pad: 8px;
    --_sel-card-radius: 7px;
    --_sel-card-border-width: 1px;
  }
  :host([size="sm"]) {
    --_sel-control-size: 16px;
    --_sel-gap: 8px;
    --_sel-label-fs: 13px;
    --_sel-desc-fs: 12px;
    --_sel-touch: 6px;
    --_sel-card-pad: 10px;
    --_sel-card-radius: 8px;
    --_sel-card-border-width: 1px;
  }
  :host([size="md"]) {
    --_sel-control-size: 18px;
    --_sel-gap: 10px;
    --_sel-label-fs: 14px;
    --_sel-desc-fs: 12px;
    --_sel-touch: 5px;
    --_sel-card-pad: 12px;
    --_sel-card-radius: 9px;
    --_sel-card-border-width: 1.5px;
  }
  :host([size="lg"]) {
    --_sel-control-size: 20px;
    --_sel-gap: 12px;
    --_sel-label-fs: 16px;
    --_sel-desc-fs: 13px;
    --_sel-touch: 4px;
    --_sel-card-pad: 14px;
    --_sel-card-radius: 10px;
    --_sel-card-border-width: 1.5px;
  }
  :host([size="xl"]) {
    --_sel-control-size: 22px;
    --_sel-gap: 14px;
    --_sel-label-fs: 18px;
    --_sel-desc-fs: 14px;
    --_sel-touch: 3px;
    --_sel-card-pad: 16px;
    --_sel-card-radius: 11px;
    --_sel-card-border-width: 1.5px;
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

  /* ── Card variant ────────────────────────────────────────────────────── */
  /*
   * The card is the SAME .root <label> re-skinned via :host([variant="card"]).
   * No template branches — the control box/dot stays exactly where it is.
   * Per-tier --_sel-card-pad / --_sel-card-radius are set in the size blocks above.
   */
  :host([variant="card"]) .root {
    padding: var(--_sel-card-pad, 12px);
    border: var(--_sel-card-border-width, 1.5px) solid
      var(--tulpar-selection-card-border, #d9e0df);
    border-radius: var(--_sel-card-radius, 9px);
    background: var(--tulpar-selection-card-bg, #fff);
    align-items: flex-start;
    gap: var(--_sel-gap);
    cursor: pointer;
    transition:
      border-color 140ms cubic-bezier(0.2, 0, 0, 1),
      background-color 140ms cubic-bezier(0.2, 0, 0, 1),
      box-shadow 160ms cubic-bezier(0.2, 0, 0, 1),
      transform 120ms cubic-bezier(0.2, 0, 0, 1);
  }

  :host([variant="card"]:not([disabled]):not([checked]):not([indeterminate])) .root:hover {
    border-color: var(--tulpar-selection-control-border-hover, #909396);
    background: var(--tulpar-selection-card-bg-hover, #f0f7f5);
    box-shadow: 0 2px 8px -2px rgba(11, 8, 4, 0.1);
    transform: translateY(-1px);
  }

  :host([variant="card"][checked]) .root,
  :host([variant="card"][indeterminate]) .root {
    border-color: var(--_sel-fill);
    background: var(
      --tulpar-selection-card-bg-selected,
      color-mix(in oklch, var(--_sel-fill) 8%, var(--tulpar-selection-card-bg, #fff))
    );
    box-shadow: 0 0 0 1px var(--_sel-fill) inset;
  }

  :host([variant="card"]) .root:active {
    transform: translateY(0) scale(0.995);
  }

  /* Focus ring on the whole card when the inner control is keyboard-focused */
  :host([variant="card"]) .root:has(:focus-visible) {
    outline: 2px solid var(--tulpar-selection-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
  }

  @media (forced-colors: active) {
    :host([variant="card"]) .root:has(:focus-visible) {
      outline-color: CanvasText;
    }
  }

  /* Invalid: danger border; tint suppressed when also checked */
  :host([variant="card"][invalid]) .root {
    border-color: var(--tulpar-selection-control-border-invalid, #b22128);
  }

  :host([variant="card"][invalid][checked]) .root,
  :host([variant="card"][invalid][indeterminate]) .root {
    background: var(--tulpar-selection-card-bg, #fff);
    box-shadow: none;
  }

  :host([variant="card"][disabled]) .root {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    :host([variant="card"]) .root {
      transition: none;
    }
  }
`;
