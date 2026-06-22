/**
 * Semantic atom tokens — per-tone color slots consumed by the display atoms
 * (badge / tag / status family).  Bound in the brand layer
 * (`brand/tulpar/{light,dark}.ts`); component CSS consumes ONLY these semantic
 * tokens (ESLint-enforced; atoms supply inline literal `var()` fallbacks in
 * their own styles).
 *
 * Each tone exposes three render variants:
 *   - soft    — tinted fill (surface) + tone text + tone border
 *   - outline — transparent fill, tone text + tone border (drawn on the page)
 *   - solid   — saturated fill (bg) + on-color text
 */

export interface AtomToneVariantSoft {
  /** Tinted fill for the soft variant. */
  surface: string;
  /** Foreground text/icon on top of `surface`. */
  text: string;
  /** 1 px border drawn on top of `surface`. */
  border: string;
}

export interface AtomToneVariantOutline {
  /** Foreground text/icon for the outline variant (sits on the page surface). */
  text: string;
  /** Border for the outline variant (sits on the page surface). */
  border: string;
}

export interface AtomToneVariantSolid {
  /** Saturated fill for the solid variant. */
  bg: string;
  /** On-color text/icon on top of `bg`. */
  text: string;
}

export interface AtomToneTokens {
  soft: AtomToneVariantSoft;
  outline: AtomToneVariantOutline;
  solid: AtomToneVariantSolid;
}

export interface AtomTokens {
  /** Per-tone color slots (neutral · info · success · warning · danger). */
  tone: {
    neutral: AtomToneTokens;
    info: AtomToneTokens;
    success: AtomToneTokens;
    warning: AtomToneTokens;
    danger: AtomToneTokens;
  };
}
