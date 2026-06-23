import { css } from "lit";

/**
 * Styles for <tulpar-badge> — count / status indicator.
 *
 * House idioms (matching tulpar-tag.styles.ts / tulpar-toast.styles.ts):
 * - Only semantic / atom tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - @media (forced-colors: active) maps to system colors; the default SOLID
 *   variant inverts (CanvasText bg / Canvas text) so the badge stays legible.
 *
 * ## Tone pipeline
 * Built-in tones are attribute-only: `:host([tone=...][variant=...])` maps to
 * the `--tulpar-atom-tone-<tone>-<variant>-<slot>` tokens, which auto-flip for
 * `.dark` via the generated token sheet (no :host-context, no inline styles).
 *
 * ## Size table
 *   dot Ø:        sm 6  / md 8  / lg 10
 *   count height: sm 16 / md 18 / lg 20   (min-width = height)
 *   count pad-x:  sm 5  / md 5  / lg 6
 *   count font:   sm 11 / md 11 / lg 12
 * font-variant-numeric: tabular-nums (counts don't jitter as digits change).
 */
export const badgeStyles = css`
  /* ── Size tier vars (default md) ──────────────────────────────────────── */
  :host {
    --_bdg-h: 18px;
    --_bdg-px: 5px;
    --_bdg-font: 11px;
    --_bdg-dot: 8px;
  }
  :host([size="sm"]) {
    --_bdg-h: 16px;
    --_bdg-px: 5px;
    --_bdg-font: 11px;
    --_bdg-dot: 6px;
  }
  :host([size="lg"]) {
    --_bdg-h: 20px;
    --_bdg-px: 6px;
    --_bdg-font: 12px;
    --_bdg-dot: 10px;
  }

  /* ── Internal tone pipeline (default: solid) ──────────────────────────── */
  :host {
    --_bdg-bg: var(--tulpar-atom-tone-neutral-solid-bg, #404243);
    --_bdg-text: var(--tulpar-atom-tone-neutral-solid-text, #f0f7f5);
    --_bdg-border: transparent;
  }

  /* solid (default variant) → solid tokens */
  :host([tone="info"]:not([variant="soft-tonal"]):not([variant="outline"])),
  :host([tone="info"][variant="solid"]) {
    --_bdg-bg: var(--tulpar-atom-tone-info-solid-bg, #1c6eb3);
    --_bdg-text: var(--tulpar-atom-tone-info-solid-text, #ffffff);
  }
  :host([tone="success"]:not([variant="soft-tonal"]):not([variant="outline"])),
  :host([tone="success"][variant="solid"]) {
    --_bdg-bg: var(--tulpar-atom-tone-success-solid-bg, #245d48);
    --_bdg-text: var(--tulpar-atom-tone-success-solid-text, #ffffff);
  }
  :host([tone="warning"]:not([variant="soft-tonal"]):not([variant="outline"])),
  :host([tone="warning"][variant="solid"]) {
    --_bdg-bg: var(--tulpar-atom-tone-warning-solid-bg, #d7a40f);
    --_bdg-text: var(--tulpar-atom-tone-warning-solid-text, #15110b);
  }
  :host([tone="danger"]:not([variant="soft-tonal"]):not([variant="outline"])),
  :host([tone="danger"][variant="solid"]) {
    --_bdg-bg: var(--tulpar-atom-tone-danger-solid-bg, #b22128);
    --_bdg-text: var(--tulpar-atom-tone-danger-solid-text, #ffffff);
  }

  /* soft-tonal */
  :host([tone="neutral"][variant="soft-tonal"]) {
    --_bdg-bg: var(--tulpar-atom-tone-neutral-soft-surface, #e3eaee);
    --_bdg-text: var(--tulpar-atom-tone-neutral-soft-text, #404243);
  }
  :host([tone="info"][variant="soft-tonal"]) {
    --_bdg-bg: var(--tulpar-atom-tone-info-soft-surface, #cfeeff);
    --_bdg-text: var(--tulpar-atom-tone-info-soft-text, #1b476f);
  }
  :host([tone="success"][variant="soft-tonal"]) {
    --_bdg-bg: var(--tulpar-atom-tone-success-soft-surface, #d2eee1);
    --_bdg-text: var(--tulpar-atom-tone-success-soft-text, #204033);
  }
  :host([tone="warning"][variant="soft-tonal"]) {
    --_bdg-bg: var(--tulpar-atom-tone-warning-soft-surface, #ffeac0);
    --_bdg-text: var(--tulpar-atom-tone-warning-soft-text, #695114);
  }
  :host([tone="danger"][variant="soft-tonal"]) {
    --_bdg-bg: var(--tulpar-atom-tone-danger-soft-surface, #ffdbd6);
    --_bdg-text: var(--tulpar-atom-tone-danger-soft-text, #712020);
  }

  /* outline → transparent fill + tone text + tone border */
  :host([tone="neutral"][variant="outline"]) {
    --_bdg-bg: transparent;
    --_bdg-text: var(--tulpar-atom-tone-neutral-outline-text, #4f5153);
    --_bdg-border: var(--tulpar-atom-tone-neutral-outline-border, #909396);
  }
  :host([tone="info"][variant="outline"]) {
    --_bdg-bg: transparent;
    --_bdg-text: var(--tulpar-atom-tone-info-outline-text, #1d588b);
    --_bdg-border: var(--tulpar-atom-tone-info-outline-border, #1b82d4);
  }
  :host([tone="success"][variant="outline"]) {
    --_bdg-bg: transparent;
    --_bdg-text: var(--tulpar-atom-tone-success-outline-text, #224c3c);
    --_bdg-border: var(--tulpar-atom-tone-success-outline-border, #488e73);
  }
  :host([tone="warning"][variant="outline"]) {
    --_bdg-bg: transparent;
    --_bdg-text: var(--tulpar-atom-tone-warning-outline-text, #695114);
    --_bdg-border: var(--tulpar-atom-tone-warning-outline-border, #b28811);
  }
  :host([tone="danger"][variant="outline"]) {
    --_bdg-bg: transparent;
    --_bdg-text: var(--tulpar-atom-tone-danger-outline-text, #8c2224);
    --_bdg-border: var(--tulpar-atom-tone-danger-outline-border, #f84648);
  }

  /* ── Host ─────────────────────────────────────────────────────────────── */
  :host {
    display: inline-flex;
    vertical-align: middle;
    box-sizing: border-box;
  }
  /* Hidden when there is nothing to show (count=0 & !show-zero, no dot/label). */
  :host([hidden]) {
    display: none;
  }

  /* ── Badge (count / label pill) ───────────────────────────────────────── */
  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: var(--_bdg-h);
    min-width: var(--_bdg-h);
    padding: 0 var(--_bdg-px);
    border: 1px solid var(--_bdg-border);
    border-radius: 9999px;
    background: var(--_bdg-bg);
    color: var(--_bdg-text);
    font-family: inherit;
    font-size: var(--_bdg-font);
    font-weight: 600;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    user-select: none;
  }

  /* Square shape (opt-in). */
  :host([shape="square"]) .badge {
    border-radius: 5px;
  }

  /* ── Count / label visibility (driven by host [data-mode]) ────────────── */
  .count,
  .label {
    display: none;
    align-items: center;
    line-height: 1;
  }
  :host([data-mode="count"]) .count {
    display: inline-flex;
  }
  :host([data-mode="label"]) .label {
    display: inline-flex;
  }

  /* ── Dot mode ─────────────────────────────────────────────────────────── */
  .badge.is-dot {
    width: var(--_bdg-dot);
    height: var(--_bdg-dot);
    min-width: 0;
    padding: 0;
    border-radius: 50%;
  }
  :host([shape="square"]) .badge.is-dot {
    border-radius: 2px;
  }

  /* ── Forced colors (HCM) ──────────────────────────────────────────────── */
  @media (forced-colors: active) {
    /* Default/solid badge inverts so the saturated fill survives HCM. */
    .badge {
      background: CanvasText;
      color: Canvas;
      border-color: CanvasText;
    }
    /* Soft / outline variants read as outlined chips on the page surface. */
    :host([variant="soft-tonal"]) .badge,
    :host([variant="outline"]) .badge {
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
    .badge.is-dot {
      background: CanvasText;
      border-color: CanvasText;
    }
  }
`;
