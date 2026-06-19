export interface OverlayToneTokens {
  surface: string;
  onSurface: string;
  border: string;
}

export interface OverlayMotionTokens {
  delayOpen: string;
  delayClose: string;
  durationEnter: string;
  durationExit: string;
  easing: string;
}

export interface OverlayTokens {
  surface: { bg: string; border: string };
  /** Inverted chip — its own slot, not bg.surface. */
  tooltip: { bg: string; text: string };
  shadow: string;
  focusRing: string;
  zIndex: string;
  tone: {
    info: OverlayToneTokens;
    success: OverlayToneTokens;
    warning: OverlayToneTokens;
    danger: OverlayToneTokens;
  };
  motion: OverlayMotionTokens;
  size: {
    tooltipMaxWidth: string;
    popoverMaxH: string;
    tooltipPadding: string;
    popoverPadding: string;
  };
}
