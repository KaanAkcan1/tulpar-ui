export interface FontTokens {
  family: {
    display: string;
    ui: string;
    mono: string;
  };
}

export interface TransitionTokens {
  default: string;
  /** Signature ease-out curve for component micro-interactions. */
  easeStandard: string;
}

/**
 * Standalone easing curves. Kept top-level (a sibling of `transition`, not nested
 * under it) because `transition.default` is a full shorthand string (duration +
 * easing combined) for the common case, whereas `easing.*` exposes the raw curve
 * for components that compose their own animations (e.g. the rail flyout).
 */
export interface EasingTokens {
  decelerate: string;
}

/** Elevation shadows. `flyout` is mode-specific (light = ambient, dark = contact). */
export interface ShadowTokens {
  sm: string;
  md: string;
  flyout: string;
}
