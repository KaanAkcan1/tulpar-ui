/**
 * Semantic feedback tokens — purpose-named slots consumed by the toast/message
 * family.  Bound in the brand layer (`brand/tulpar/{light,dark}.ts`); component
 * CSS consumes ONLY these semantic tokens (ESLint-enforced; always provide a
 * `var()` fallback for environments where the token sheet is absent).
 *
 * CSS custom-property hooks for the `custom` tone part-overrides
 * (`--tulpar-toast-bg`, `--tulpar-toast-accent`, `--tulpar-toast-text`) are
 * author-facing and intentionally NOT modelled as interface fields — they are
 * raw CSS variables that any author may set, not bound semantic values.
 */

export interface FeedbackToneTokens {
  /** Tinted card background for this tone. */
  surface: string;
  /** Foreground color (text + default icon) on top of `surface`. */
  onSurface: string;
  /** 1 px border / separator; also used in HCM as the sole tone cue. */
  border: string;
  /** Accent color: timer-ring stroke, icon fill, action link. */
  accent: string;
}

export interface FeedbackDangerHcTokens {
  /** Saturated danger surface for the high-contrast opt-in (`highContrast:true`). */
  surface: string;
  /** On-text for the high-contrast danger surface (typically white). */
  on: string;
}

export interface FeedbackMotionTokens {
  /** Enter transition duration (opacity + translate + scale). Default 220 ms. */
  durationEnter: string;
  /** Exit transition duration (opacity + height collapse). Default 160 ms. */
  durationExit: string;
  /** Stack-reposition transition duration when a peer is dismissed. Default 300 ms. */
  durationReposition: string;
  /** Shared easing for enter / reposition. */
  easing: string;
  /** Default toast auto-dismiss duration (serialised as CSS-compatible ms string). */
  defaultDuration: string;
  /** Default message auto-dismiss duration (serialised as CSS-compatible ms string). */
  messageDuration: string;
}

export interface FeedbackSizeTokens {
  /** Maximum width of a single toast card (desktop). */
  toastMaxWidth: string;
  /** Corner radius of a toast card. */
  toastRadius: string;
  /** Internal padding of a toast card (block-inline shorthand). */
  toastPadding: string;
  /** Internal padding of a message pill (block-inline shorthand). */
  messagePadding: string;
  /** SVG stroke width of the perimeter timer ring. */
  ringStroke: string;
}

export interface FeedbackTokens {
  /** Per-tone surface/text/border/accent slots (info · success · warning · danger). */
  tone: {
    info: FeedbackToneTokens;
    success: FeedbackToneTokens;
    warning: FeedbackToneTokens;
    danger: FeedbackToneTokens;
  };
  /**
   * High-contrast danger escalation (`highContrast:true`).
   * Saturated surface + white text; no-op for non-danger tones.
   */
  dangerHc: FeedbackDangerHcTokens;
  /** Box-shadow value for the toast card (elevation distinct from cards/overlay). */
  shadow: string;
  /**
   * z-index tier for the toaster portal.
   * Must sit above shell/sidenav and the overlay family.
   * Serialised as a plain integer string (e.g. `"9000"`).
   */
  zIndex: string;
  /** CSS transition/animation timing tokens for toast and message. */
  motion: FeedbackMotionTokens;
  /** Sizing tokens for toast cards, message pills, and the timer ring. */
  size: FeedbackSizeTokens;
}
