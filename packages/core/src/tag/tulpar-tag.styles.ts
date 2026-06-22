import { css } from "lit";

/**
 * Styles for <tulpar-tag> — static, read-only tonal metadata.
 *
 * House idioms (matching tulpar-toast.styles.ts / tulpar-switch.styles.ts):
 * - Only semantic / atom tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - @media (forced-colors: active) maps to system colors.
 *
 * ## Tone pipeline
 *
 * Built-in tones (neutral/info/success/warning/danger) are ATTRIBUTE-ONLY:
 * `:host([tone=...][variant=...])` maps the active tone+variant to the
 * `--tulpar-atom-tone-<tone>-<variant>-<slot>` tokens, which already flip for
 * `.dark` via the generated CSS token sheet. NO :host-context(.dark) is used
 * for built-in tones.
 *
 * Custom tone (`tone="custom"`): the element sets the -l / -d pairs as inline
 * styles on the host (via resolveTone(this, { prefix: "tag" })). The :host /
 * :host-context(.dark) rules below pick the right pair into --_tag-* — this is
 * the ONLY place :host-context(.dark) appears (custom path only).
 *
 * ## Size table (px) — height / pad-x / font / icon / gap / radius(square)
 *   xs 16 / 5  / 11 / 11 / 3 / 4
 *   sm 20 / 6  / 12 / 12 / 4 / 5
 *   md 24 / 8  / 13 / 14 / 6 / 6   (default)
 *   lg 28 / 10 / 14 / 14 / 6 / 6
 *   xl 32 / 12 / 15 / 16 / 8 / 7
 */
export const tagStyles = css`
  /* ── Size tier vars (default md) ──────────────────────────────────────── */
  :host {
    --_tag-h: 24px;
    --_tag-px: 8px;
    --_tag-font: 13px;
    --_tag-icon: 14px;
    --_tag-gap: 6px;
    --_tag-radius: 6px;
  }
  :host([size="xs"]) {
    --_tag-h: 16px;
    --_tag-px: 5px;
    --_tag-font: 11px;
    --_tag-icon: 11px;
    --_tag-gap: 3px;
    --_tag-radius: 4px;
  }
  :host([size="sm"]) {
    --_tag-h: 20px;
    --_tag-px: 6px;
    --_tag-font: 12px;
    --_tag-icon: 12px;
    --_tag-gap: 4px;
    --_tag-radius: 5px;
  }
  :host([size="lg"]) {
    --_tag-h: 28px;
    --_tag-px: 10px;
    --_tag-font: 14px;
    --_tag-icon: 14px;
    --_tag-gap: 6px;
    --_tag-radius: 6px;
  }
  :host([size="xl"]) {
    --_tag-h: 32px;
    --_tag-px: 12px;
    --_tag-font: 15px;
    --_tag-icon: 16px;
    --_tag-gap: 8px;
    --_tag-radius: 7px;
  }

  /* ── Internal tone pipeline (custom tone: -l → light, -d → dark) ──────── */
  /* Defaults read the custom-tone inline vars; built-in [tone] rules below
     override --_tag-bg / -text / -border with the atom token family. */
  :host {
    --_tag-bg: var(--tulpar-tag-surface-l, transparent);
    --_tag-text: var(--tulpar-tag-on-surface-l, inherit);
    --_tag-border: var(--tulpar-tag-border-l, transparent);
  }
  :host-context(.dark) {
    --_tag-bg: var(--tulpar-tag-surface-d, transparent);
    --_tag-text: var(--tulpar-tag-on-surface-d, inherit);
    --_tag-border: var(--tulpar-tag-border-d, transparent);
  }

  /* ── Built-in tone × variant → atom tokens (auto-flip via token sheet) ── */

  /* soft-tonal (default variant) → soft tokens */
  :host([tone="neutral"][variant="soft-tonal"]),
  :host([tone="neutral"]:not([variant])) {
    --_tag-bg: var(--tulpar-atom-tone-neutral-soft-surface, #e3eaee);
    --_tag-text: var(--tulpar-atom-tone-neutral-soft-text, #404243);
    --_tag-border: transparent;
  }
  :host([tone="info"][variant="soft-tonal"]),
  :host([tone="info"]:not([variant])) {
    --_tag-bg: var(--tulpar-atom-tone-info-soft-surface, #cfeeff);
    --_tag-text: var(--tulpar-atom-tone-info-soft-text, #1b476f);
    --_tag-border: transparent;
  }
  :host([tone="success"][variant="soft-tonal"]),
  :host([tone="success"]:not([variant])) {
    --_tag-bg: var(--tulpar-atom-tone-success-soft-surface, #d2eee1);
    --_tag-text: var(--tulpar-atom-tone-success-soft-text, #204033);
    --_tag-border: transparent;
  }
  :host([tone="warning"][variant="soft-tonal"]),
  :host([tone="warning"]:not([variant])) {
    --_tag-bg: var(--tulpar-atom-tone-warning-soft-surface, #ffeac0);
    --_tag-text: var(--tulpar-atom-tone-warning-soft-text, #695114);
    --_tag-border: transparent;
  }
  :host([tone="danger"][variant="soft-tonal"]),
  :host([tone="danger"]:not([variant])) {
    --_tag-bg: var(--tulpar-atom-tone-danger-soft-surface, #ffdbd6);
    --_tag-text: var(--tulpar-atom-tone-danger-soft-text, #712020);
    --_tag-border: transparent;
  }

  /* outline → transparent fill + tone text + tone border */
  :host([tone="neutral"][variant="outline"]) {
    --_tag-bg: transparent;
    --_tag-text: var(--tulpar-atom-tone-neutral-outline-text, #4f5153);
    --_tag-border: var(--tulpar-atom-tone-neutral-outline-border, #909396);
  }
  :host([tone="info"][variant="outline"]) {
    --_tag-bg: transparent;
    --_tag-text: var(--tulpar-atom-tone-info-outline-text, #1d588b);
    --_tag-border: var(--tulpar-atom-tone-info-outline-border, #1b82d4);
  }
  :host([tone="success"][variant="outline"]) {
    --_tag-bg: transparent;
    --_tag-text: var(--tulpar-atom-tone-success-outline-text, #224c3c);
    --_tag-border: var(--tulpar-atom-tone-success-outline-border, #488e73);
  }
  :host([tone="warning"][variant="outline"]) {
    --_tag-bg: transparent;
    --_tag-text: var(--tulpar-atom-tone-warning-outline-text, #695114);
    --_tag-border: var(--tulpar-atom-tone-warning-outline-border, #b28811);
  }
  :host([tone="danger"][variant="outline"]) {
    --_tag-bg: transparent;
    --_tag-text: var(--tulpar-atom-tone-danger-outline-text, #8c2224);
    --_tag-border: var(--tulpar-atom-tone-danger-outline-border, #f84648);
  }

  /* solid → saturated fill + on-color text */
  :host([tone="neutral"][variant="solid"]) {
    --_tag-bg: var(--tulpar-atom-tone-neutral-solid-bg, #404243);
    --_tag-text: var(--tulpar-atom-tone-neutral-solid-text, #f0f7f5);
    --_tag-border: transparent;
  }
  :host([tone="info"][variant="solid"]) {
    --_tag-bg: var(--tulpar-atom-tone-info-solid-bg, #1c6eb3);
    --_tag-text: var(--tulpar-atom-tone-info-solid-text, #ffffff);
    --_tag-border: transparent;
  }
  :host([tone="success"][variant="solid"]) {
    --_tag-bg: var(--tulpar-atom-tone-success-solid-bg, #245d48);
    --_tag-text: var(--tulpar-atom-tone-success-solid-text, #ffffff);
    --_tag-border: transparent;
  }
  :host([tone="warning"][variant="solid"]) {
    --_tag-bg: var(--tulpar-atom-tone-warning-solid-bg, #d7a40f);
    --_tag-text: var(--tulpar-atom-tone-warning-solid-text, #15110b);
    --_tag-border: transparent;
  }
  :host([tone="danger"][variant="solid"]) {
    --_tag-bg: var(--tulpar-atom-tone-danger-solid-bg, #b22128);
    --_tag-text: var(--tulpar-atom-tone-danger-solid-text, #ffffff);
    --_tag-border: transparent;
  }

  /* Custom tone, outline / solid variants reuse the inline -l/-d surface vars
     but adjust which inline slot drives the visible fill/border. */
  :host([tone="custom"][variant="outline"]) {
    --_tag-bg: transparent;
    --_tag-text: var(--tulpar-tag-on-surface-l, inherit);
    --_tag-border: var(--tulpar-tag-border-l, transparent);
  }
  :host-context(.dark)[tone="custom"][variant="outline"] {
    --_tag-text: var(--tulpar-tag-on-surface-d, inherit);
    --_tag-border: var(--tulpar-tag-border-d, transparent);
  }

  /* ── Host / chip layout ───────────────────────────────────────────────── */
  :host {
    display: inline-flex;
    vertical-align: middle;
    box-sizing: border-box;
    max-width: var(--tulpar-tag-max-width, 160px);
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: var(--_tag-gap);
    box-sizing: border-box;
    height: var(--_tag-h);
    padding: 0 var(--_tag-px);
    min-width: 0;
    max-width: 100%;
    border: 1px solid var(--_tag-border);
    border-radius: var(--_tag-radius);
    background: var(--_tag-bg);
    color: var(--_tag-text);
    font-family: inherit;
    font-size: var(--_tag-font);
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
  }

  /* Shape overrides (square is the per-size radius default). */
  :host([shape="pill"]) .tag {
    border-radius: 9999px;
  }
  :host([shape="sharp"]) .tag {
    border-radius: 2px;
  }

  /* ── Leading dot (hidden unless [data-show-dot]) ──────────────────────── */
  .dot {
    display: none;
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.9;
  }
  :host([data-show-dot]) .dot {
    display: block;
  }
  :host([size="xs"]) .dot,
  :host([size="sm"]) .dot {
    width: 6px;
    height: 6px;
  }

  /* ── Leading icon (hidden unless [data-show-icon]) ────────────────────── */
  .icon {
    display: none;
    flex: none;
    align-items: center;
    justify-content: center;
    width: var(--_tag-icon);
    height: var(--_tag-icon);
    font-size: var(--_tag-icon);
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
    width: var(--_tag-icon);
    height: var(--_tag-icon);
    font-size: var(--_tag-icon);
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
    width: var(--_tag-icon);
    height: var(--_tag-icon);
    display: block;
  }

  /* ── Label (truncates) ────────────────────────────────────────────────── */
  .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Disabled ─────────────────────────────────────────────────────────── */
  :host([disabled]) {
    opacity: 0.45;
    pointer-events: none;
  }

  /* ── Forced colors (HCM) ──────────────────────────────────────────────── */
  @media (forced-colors: active) {
    .tag {
      border: 1px solid CanvasText;
      background: Canvas;
      color: CanvasText;
    }
    /* Solid tags invert so the saturated identity survives HCM. */
    :host([variant="solid"]) .tag {
      background: CanvasText;
      color: Canvas;
    }
    .dot {
      background: CanvasText;
    }
    .icon {
      color: CanvasText;
    }
    :host([disabled]) {
      opacity: 1;
      color: GrayText;
    }
  }
`;
