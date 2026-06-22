import { css } from "lit";

/**
 * Styles for <tulpar-avatar> — identity atom.
 *
 * House idioms (matching tulpar-tag.styles.ts / tulpar-badge.styles.ts):
 * - Only semantic / atom tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 *   The deterministic family color is supplied as INLINE --tulpar-avatar-bg-l/-d
 *   vars set on the host by the element; this stylesheet only reads them.
 * - @media (forced-colors: active) draws a CanvasText border so the shape
 *   survives HCM.
 *
 * ## Color pipeline (initials fallback)
 * The element sets --tulpar-avatar-bg-l (light) / -d (dark) inline. This sheet
 * picks the active one into --_av-bg via :host-context(.dark). Foreground is
 * always white on the saturated 600/500 family fill (per mockup).
 *
 * ## Size table (px) — box / initials-font / radius(rounded-square)
 *   xs 20 / 9  / 4
 *   sm 24 / 10 / 5
 *   md 32 / 13 / 6   (default)
 *   lg 40 / 16 / 8
 *   xl 48 / 19 / 10
 * circle → border-radius 50%. Icon glyph = 60% of the box.
 */
export const avatarStyles = css`
  /* ── Size tier vars (default md) ──────────────────────────────────────── */
  :host {
    --_av-size: 32px;
    --_av-font: 13px;
    --_av-radius: 6px;
  }
  :host([size="xs"]) {
    --_av-size: 20px;
    --_av-font: 9px;
    --_av-radius: 4px;
  }
  :host([size="sm"]) {
    --_av-size: 24px;
    --_av-font: 10px;
    --_av-radius: 5px;
  }
  :host([size="lg"]) {
    --_av-size: 40px;
    --_av-font: 16px;
    --_av-radius: 8px;
  }
  :host([size="xl"]) {
    --_av-size: 48px;
    --_av-font: 19px;
    --_av-radius: 10px;
  }

  /* ── Color pipeline (light / dark family swap) ────────────────────────── */
  /* --tulpar-avatar-bg-l/-d are set INLINE by the element (deterministic family
     or the color override prop). The neutral fallbacks below apply to the icon
     state where no inline vars are set. */
  :host {
    --_av-bg: var(--tulpar-avatar-bg-l, var(--tulpar-atom-tone-neutral-soft-surface, #e3eaee));
    --_av-fg: #ffffff;
  }
  :host-context(.dark) {
    --_av-bg: var(--tulpar-avatar-bg-d, var(--tulpar-atom-tone-neutral-soft-surface, #2a2d2e));
  }

  /* ── Host / box ───────────────────────────────────────────────────────── */
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    box-sizing: border-box;
    flex: none;
    width: var(--_av-size);
    height: var(--_av-size);
    border-radius: var(--_av-radius);
    background: var(--_av-bg);
    color: var(--_av-fg);
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
  }
  :host([shape="circle"]) {
    border-radius: 50%;
  }

  /* ── Image ────────────────────────────────────────────────────────────── */
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* The image fully covers the surface; no family tint shows through. */
    background: transparent;
  }

  /* ── Initials (serif monogram) ────────────────────────────────────────── */
  .initials {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-size: var(--_av-font);
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1;
    text-transform: none;
    color: inherit;
  }

  /* ── Icon fallback (neutral soft) ─────────────────────────────────────── */
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    /* Neutral icon: muted foreground on the soft neutral surface. */
    color: var(--tulpar-atom-tone-neutral-soft-text, #6b7280);
  }
  /* The icon state has no inline family bg → falls back to the neutral surface. */
  .icon svg {
    width: 60%;
    height: 60%;
    display: block;
  }

  /* ── Forced colors (HCM) ──────────────────────────────────────────────── */
  @media (forced-colors: active) {
    :host {
      border: 1px solid CanvasText;
      background: Canvas;
      color: CanvasText;
    }
    .initials {
      color: CanvasText;
    }
    .icon {
      color: CanvasText;
    }
    img {
      /* Images survive HCM; keep the outline visible around them. */
      border: 1px solid CanvasText;
    }
  }
`;
