import { css } from "lit";

/**
 * Styles for <tulpar-chip> — the interactive display atom.
 *
 * Chip shares the tag's size table + tone/variant/shape model, but adds:
 *  - an activatable body (host is focusable, role="button"),
 *  - a `ghost` variant (transparent rest → soft-tonal surface on hover),
 *  - a trailing remove control that is an INDEPENDENT tab stop.
 *
 * House idioms (matching tulpar-tag.styles.ts / tulpar-switch.styles.ts):
 * - Only semantic / atom tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - @media (forced-colors: active) maps to system colors.
 * - Custom tone is the ONLY place :host-context(.dark) appears (custom path
 *   only); built-in tones are attribute-only via the atom token sheet.
 *
 * ## Size table (px) — height / pad-x / font / icon / gap / radius(square)
 *   xs 16 / 5  / 11 / 11 / 3 / 4
 *   sm 20 / 6  / 12 / 12 / 4 / 5
 *   md 24 / 8  / 13 / 14 / 6 / 6   (default)
 *   lg 28 / 10 / 14 / 14 / 6 / 6
 *   xl 32 / 12 / 15 / 16 / 8 / 7
 *
 * shape: square → per-size radius / pill → 9999px / sharp → 2px
 */
export const chipStyles = css`
  /* ── Size tier vars (default md) ──────────────────────────────────────── */
  :host {
    --_chip-h: 24px;
    --_chip-px: 8px;
    --_chip-font: 13px;
    --_chip-icon: 14px;
    --_chip-gap: 6px;
    --_chip-radius: 6px;
  }
  :host([size="xs"]) {
    --_chip-h: 16px;
    --_chip-px: 5px;
    --_chip-font: 11px;
    --_chip-icon: 11px;
    --_chip-gap: 3px;
    --_chip-radius: 4px;
  }
  :host([size="sm"]) {
    --_chip-h: 20px;
    --_chip-px: 6px;
    --_chip-font: 12px;
    --_chip-icon: 12px;
    --_chip-gap: 4px;
    --_chip-radius: 5px;
  }
  :host([size="lg"]) {
    --_chip-h: 28px;
    --_chip-px: 10px;
    --_chip-font: 14px;
    --_chip-icon: 14px;
    --_chip-gap: 6px;
    --_chip-radius: 6px;
  }
  :host([size="xl"]) {
    --_chip-h: 32px;
    --_chip-px: 12px;
    --_chip-font: 15px;
    --_chip-icon: 16px;
    --_chip-gap: 8px;
    --_chip-radius: 7px;
  }

  /* ── Internal tone pipeline (custom tone: -l → light, -d → dark) ──────── */
  /* Defaults read the custom-tone inline vars; built-in [tone] rules below
     override --_chip-bg / -text / -border with the atom token family.
     --_chip-soft tracks the soft surface so the ghost variant can hover into it. */
  :host {
    --_chip-bg: var(--tulpar-chip-surface-l, transparent);
    --_chip-text: var(--tulpar-chip-on-surface-l, inherit);
    --_chip-border: var(--tulpar-chip-border-l, transparent);
    --_chip-soft: var(--tulpar-chip-surface-l, transparent);
  }
  :host-context(.dark) {
    --_chip-bg: var(--tulpar-chip-surface-d, transparent);
    --_chip-text: var(--tulpar-chip-on-surface-d, inherit);
    --_chip-border: var(--tulpar-chip-border-d, transparent);
    --_chip-soft: var(--tulpar-chip-surface-d, transparent);
  }

  /* ── Built-in tone × variant → atom tokens (auto-flip via token sheet) ── */
  /* element variant=soft-tonal maps to the token slot "soft". --_chip-soft always
     tracks the soft surface so [variant=ghost] can hover into it regardless of variant. */

  /* soft-tonal (default variant) → soft tokens */
  :host([tone="neutral"][variant="soft-tonal"]),
  :host([tone="neutral"]:not([variant])) {
    --_chip-bg: var(--tulpar-atom-tone-neutral-soft-surface, #e3eaee);
    --_chip-text: var(--tulpar-atom-tone-neutral-soft-text, #404243);
    --_chip-border: transparent;
  }
  :host([tone="info"][variant="soft-tonal"]),
  :host([tone="info"]:not([variant])) {
    --_chip-bg: var(--tulpar-atom-tone-info-soft-surface, #cfeeff);
    --_chip-text: var(--tulpar-atom-tone-info-soft-text, #1b476f);
    --_chip-border: transparent;
  }
  :host([tone="success"][variant="soft-tonal"]),
  :host([tone="success"]:not([variant])) {
    --_chip-bg: var(--tulpar-atom-tone-success-soft-surface, #d2eee1);
    --_chip-text: var(--tulpar-atom-tone-success-soft-text, #204033);
    --_chip-border: transparent;
  }
  :host([tone="warning"][variant="soft-tonal"]),
  :host([tone="warning"]:not([variant])) {
    --_chip-bg: var(--tulpar-atom-tone-warning-soft-surface, #ffeac0);
    --_chip-text: var(--tulpar-atom-tone-warning-soft-text, #695114);
    --_chip-border: transparent;
  }
  :host([tone="danger"][variant="soft-tonal"]),
  :host([tone="danger"]:not([variant])) {
    --_chip-bg: var(--tulpar-atom-tone-danger-soft-surface, #ffdbd6);
    --_chip-text: var(--tulpar-atom-tone-danger-soft-text, #712020);
    --_chip-border: transparent;
  }

  /* --_chip-soft per built-in tone (drives the ghost hover surface). */
  :host([tone="neutral"]) {
    --_chip-soft: var(--tulpar-atom-tone-neutral-soft-surface, #e3eaee);
  }
  :host([tone="info"]) {
    --_chip-soft: var(--tulpar-atom-tone-info-soft-surface, #cfeeff);
  }
  :host([tone="success"]) {
    --_chip-soft: var(--tulpar-atom-tone-success-soft-surface, #d2eee1);
  }
  :host([tone="warning"]) {
    --_chip-soft: var(--tulpar-atom-tone-warning-soft-surface, #ffeac0);
  }
  :host([tone="danger"]) {
    --_chip-soft: var(--tulpar-atom-tone-danger-soft-surface, #ffdbd6);
  }

  /* outline → transparent fill + tone text + tone border */
  :host([tone="neutral"][variant="outline"]) {
    --_chip-bg: transparent;
    --_chip-text: var(--tulpar-atom-tone-neutral-outline-text, #4f5153);
    --_chip-border: var(--tulpar-atom-tone-neutral-outline-border, #909396);
  }
  :host([tone="info"][variant="outline"]) {
    --_chip-bg: transparent;
    --_chip-text: var(--tulpar-atom-tone-info-outline-text, #1d588b);
    --_chip-border: var(--tulpar-atom-tone-info-outline-border, #1b82d4);
  }
  :host([tone="success"][variant="outline"]) {
    --_chip-bg: transparent;
    --_chip-text: var(--tulpar-atom-tone-success-outline-text, #224c3c);
    --_chip-border: var(--tulpar-atom-tone-success-outline-border, #488e73);
  }
  :host([tone="warning"][variant="outline"]) {
    --_chip-bg: transparent;
    --_chip-text: var(--tulpar-atom-tone-warning-outline-text, #695114);
    --_chip-border: var(--tulpar-atom-tone-warning-outline-border, #b28811);
  }
  :host([tone="danger"][variant="outline"]) {
    --_chip-bg: transparent;
    --_chip-text: var(--tulpar-atom-tone-danger-outline-text, #8c2224);
    --_chip-border: var(--tulpar-atom-tone-danger-outline-border, #f84648);
  }

  /* solid → saturated fill + on-color text */
  :host([tone="neutral"][variant="solid"]) {
    --_chip-bg: var(--tulpar-atom-tone-neutral-solid-bg, #404243);
    --_chip-text: var(--tulpar-atom-tone-neutral-solid-text, #f0f7f5);
    --_chip-border: transparent;
  }
  :host([tone="info"][variant="solid"]) {
    --_chip-bg: var(--tulpar-atom-tone-info-solid-bg, #1c6eb3);
    --_chip-text: var(--tulpar-atom-tone-info-solid-text, #ffffff);
    --_chip-border: transparent;
  }
  :host([tone="success"][variant="solid"]) {
    --_chip-bg: var(--tulpar-atom-tone-success-solid-bg, #245d48);
    --_chip-text: var(--tulpar-atom-tone-success-solid-text, #ffffff);
    --_chip-border: transparent;
  }
  :host([tone="warning"][variant="solid"]) {
    --_chip-bg: var(--tulpar-atom-tone-warning-solid-bg, #d7a40f);
    --_chip-text: var(--tulpar-atom-tone-warning-solid-text, #15110b);
    --_chip-border: transparent;
  }
  :host([tone="danger"][variant="solid"]) {
    --_chip-bg: var(--tulpar-atom-tone-danger-solid-bg, #b22128);
    --_chip-text: var(--tulpar-atom-tone-danger-solid-text, #ffffff);
    --_chip-border: transparent;
  }

  /* Custom tone, outline / solid variants reuse the inline -l/-d surface vars
     but adjust which inline slot drives the visible fill/border. */
  :host([tone="custom"][variant="outline"]) {
    --_chip-bg: transparent;
    --_chip-text: var(--tulpar-chip-on-surface-l, inherit);
    --_chip-border: var(--tulpar-chip-border-l, transparent);
  }
  :host-context(.dark)[tone="custom"][variant="outline"] {
    --_chip-text: var(--tulpar-chip-on-surface-d, inherit);
    --_chip-border: var(--tulpar-chip-border-d, transparent);
  }

  /* Custom solid: fill with the resolved accent and use on-fill white text.
     NOTE: custom-tone solid contrast is the author responsibility — custom is
     the explicit escape hatch (per spec). */
  :host([tone="custom"][variant="solid"]) {
    --_chip-bg: var(--tulpar-chip-accent-l, transparent);
    --_chip-text: #fff;
    --_chip-border: transparent;
  }
  :host-context(.dark)[tone="custom"][variant="solid"] {
    --_chip-bg: var(--tulpar-chip-accent-d, transparent);
    --_chip-text: #fff;
    --_chip-border: transparent;
  }

  /* ── Host ─────────────────────────────────────────────────────────────── */
  :host {
    display: inline-flex;
    vertical-align: middle;
    box-sizing: border-box;
    max-width: var(--tulpar-chip-max-width, 220px);
    border-radius: var(--_chip-radius);
    outline: none;
    cursor: pointer;
  }
  :host([shape="pill"]) {
    border-radius: 9999px;
  }
  :host([shape="sharp"]) {
    border-radius: 2px;
  }

  /* The chip body is the activatable surface (clicking it fires tulpar-click). */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: var(--_chip-gap);
    box-sizing: border-box;
    width: 100%;
    height: var(--_chip-h);
    padding: 0 var(--_chip-px);
    min-width: 0;
    border: 1px solid var(--_chip-border);
    border-radius: inherit;
    background: var(--_chip-bg);
    color: var(--_chip-text);
    font-family: inherit;
    font-size: var(--_chip-font);
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    .chip {
      transition:
        background 0.14s ease,
        border-color 0.14s ease;
    }
  }

  /* ── Ghost variant: transparent rest → soft-tonal surface on hover ────── */
  :host([variant="ghost"]) .chip {
    background: transparent;
    border-color: transparent;
  }
  :host([variant="ghost"]:not([disabled]):hover) .chip {
    background: var(--_chip-soft);
  }

  /* ── Focus ────────────────────────────────────────────────────────────── */
  :host(:focus-visible) {
    outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
  }

  /* ── Leading icon (hidden unless [data-show-icon]) ────────────────────── */
  .icon {
    display: none;
    flex: none;
    align-items: center;
    justify-content: center;
    width: var(--_chip-icon);
    height: var(--_chip-icon);
    font-size: var(--_chip-icon);
    line-height: 1;
    opacity: 0.9;
  }
  :host([data-show-icon]) .icon {
    display: inline-flex;
  }
  /* The prop target renders raw-SVG / emoji set imperatively. A slotted icon
     wins: [data-slot-icon] on the host hides the prop target. */
  .icon-prop-target {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--_chip-icon);
    height: var(--_chip-icon);
    font-size: var(--_chip-icon);
    line-height: 1;
  }
  :host([data-slot-icon]) .icon-prop-target {
    display: none;
  }
  :host(:not([data-slot-icon])) .icon > slot[name="icon"] {
    display: none;
  }
  .icon svg,
  .icon ::slotted(*) {
    width: var(--_chip-icon);
    height: var(--_chip-icon);
    display: block;
  }

  /* ── Leading avatar (circular, bleeds to the chip's leading edge) ─────── */
  /* The avatar reads ~ chip height and is pulled left into the chip's padding
     so it visually bleeds to the leading edge (mockup: margin-left negative). */
  .avatar {
    display: none;
    flex: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-sizing: border-box;
    width: var(--_chip-h);
    height: var(--_chip-h);
    margin-left: calc(var(--_chip-px) * -1);
    border-radius: 50%;
    background: var(--tulpar-atom-tone-info-solid-bg, #1c6eb3);
    color: #fff;
    font-size: calc(var(--_chip-font) - 2px);
    font-weight: 600;
    line-height: 1;
  }
  :host([data-show-avatar]) .avatar {
    display: inline-flex;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* ── Label (truncates) ────────────────────────────────────────────────── */
  .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Remove control (independent tab stop) ────────────────────────────── */
  /* The visible X glyph is small (11–14px), but the button's hit area ≈ chip
     height via a negative-margin wrapper that stretches the click/tap target
     toward the chip's trailing edge (touch-target rule). */
  .x {
    display: none;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    /* hit area ≈ chip height; negative margins claw back the visual gap so the
       glyph still sits flush near the trailing edge. */
    width: var(--_chip-h);
    height: var(--_chip-h);
    margin-left: calc(var(--_chip-gap) - var(--_chip-px));
    margin-right: calc(var(--_chip-px) * -1);
    padding: 0;
    border: none;
    border-radius: var(--_chip-radius);
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    opacity: 0.62;
    outline: none;
  }
  :host([removable]) .x {
    display: inline-flex;
  }
  .x-glyph {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--_chip-icon) - 3px);
    height: calc(var(--_chip-icon) - 3px);
    border-radius: var(--tulpar-radius-sm, 4px);
  }
  .x-glyph svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  @media (prefers-reduced-motion: no-preference) {
    .x,
    .x-glyph {
      transition:
        opacity 0.12s ease,
        background 0.12s ease;
    }
  }
  :host(:not([disabled])) .x:hover {
    opacity: 1;
  }
  /* hover shows a small radius.sm tonal PLATE behind the X (not a circle). */
  :host(:not([disabled])) .x:hover .x-glyph {
    background: color-mix(in srgb, currentColor 16%, transparent);
  }
  .x:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
    opacity: 1;
  }

  /* ── Disabled ─────────────────────────────────────────────────────────── */
  :host([disabled]) {
    opacity: 0.45;
    pointer-events: none;
    cursor: default;
  }

  /* ── Forced colors (HCM) ──────────────────────────────────────────────── */
  @media (forced-colors: active) {
    .chip {
      border: 1px solid CanvasText;
      background: Canvas;
      color: CanvasText;
    }
    /* Solid chips invert so the saturated identity survives HCM. */
    :host([variant="solid"]) .chip {
      background: CanvasText;
      color: Canvas;
    }
    :host([variant="ghost"]:not([disabled]):hover) .chip {
      background: Canvas;
    }
    .icon {
      color: CanvasText;
    }
    .x {
      color: CanvasText;
    }
    :host(:focus-visible) {
      outline-color: CanvasText;
    }
    .x:focus-visible {
      outline-color: CanvasText;
    }
    :host([disabled]) {
      opacity: 1;
      color: GrayText;
    }
  }
`;
