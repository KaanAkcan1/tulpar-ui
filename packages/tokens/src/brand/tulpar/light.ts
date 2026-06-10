import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import type { SemanticTokens } from "../../semantic/types";

export const tulparLight: SemanticTokens = {
  color: {
    bg: { surface: c.white, subtle: c.stone[50], muted: c.stone[100] },
    text: {
      primary: c.stone[900],
      secondary: c.stone[700],
      muted: c.stone[500],
      inverse: c.stone[50],
    },
    border: { default: c.stone[200], strong: c.stone[300] },
    brand: {
      default: c.navy[700],
      hover: c.navy[800],
      active: c.navy[900],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.navy[50],
      subtleHover: c.navy[100],
    },
    danger: {
      default: c.red[700],
      hover: c.red[800],
      active: c.red[900],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.red[50],
      subtleHover: c.red[100],
    },
    success: {
      default: c.green[700],
      hover: c.green[800],
      active: c.green[900],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.green[50],
      subtleHover: c.green[100],
    },
    warn: {
      default: c.amber[700],
      hover: c.amber[800],
      active: c.amber[900],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.amber[50],
      subtleHover: c.amber[100],
    },
    info: {
      default: c.blue[700],
      hover: c.blue[800],
      active: c.blue[900],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.blue[50],
      subtleHover: c.blue[100],
    },
    help: {
      default: c.purple[700],
      hover: c.purple[800],
      active: c.purple[900],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.purple[50],
      subtleHover: c.purple[100],
    },
    contrast: {
      default: c.stone[900],
      hover: c.stone[800],
      active: c.stone[700],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.stone[100],
      subtleHover: c.stone[200],
    },
    premium: {
      // Gold is mid-luminance — using DARK text + BRIGHTENING on hover/active
      // (vs the standard "deepen on interaction" pattern) is the only path
      // that keeps every state above WCAG AA contrast. Visual reflex: a
      // "premium glow up" on interaction — gold gets brighter as you push.
      // gold.500 default matches the original D4 spec brand accent value.
      default: c.gold[500],
      hover: c.gold[400],
      active: c.gold[300],
      disabled: c.stone[300],
      onColor: c.stone[900],
      subtle: c.gold[50],
      subtleHover: c.gold[100],
    },
    neutral: {
      default: c.stone[700],
      hover: c.stone[800],
      active: c.stone[900],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.stone[50],
      subtleHover: c.stone[100],
    },
    focusRing: "rgba(10, 37, 64, 0.40)",
  },

  button: {
    size: {
      xs: { height: "24px", paddingX: "8px", fontSize: "12px", iconSize: "12px" },
      sm: { height: "32px", paddingX: "12px", fontSize: "14px", iconSize: "14px" },
      md: { height: "40px", paddingX: "16px", fontSize: "14px", iconSize: "16px" },
      lg: { height: "48px", paddingX: "20px", fontSize: "16px", iconSize: "18px" },
      xl: { height: "56px", paddingX: "24px", fontSize: "18px", iconSize: "20px" },
      "2xl": { height: "64px", paddingX: "28px", fontSize: "20px", iconSize: "24px" },
      "3xl": { height: "72px", paddingX: "32px", fontSize: "24px", iconSize: "28px" },
    },
    borderRadius: "4px",
    borderWidth: "1px",
    fontWeight: primitiveTypography.fontWeight.medium,
    iconGap: "8px",
  },

  font: {
    family: {
      display: primitiveTypography.fontFamily.display,
      ui: primitiveTypography.fontFamily.ui,
      mono: primitiveTypography.fontFamily.mono,
    },
  },

  transition: {
    default: `all ${primitiveTransition.duration.fast} ${primitiveTransition.easing.standard}`,
  },

  input: {
    bg: {
      default: c.white,
      disabled: c.stone[100],
      readonly: c.stone[50],
    },
    border: {
      default: c.stone[200],
      hover: c.stone[400],
      focus: c.navy[600],
      invalid: c.red[700],
      warn: c.amber[700],
    },
    text: {
      default: c.stone[900],
      disabled: c.stone[400],
      readonly: c.stone[700],
      placeholder: c.stone[400],
    },
    label: {
      default: c.stone[700],
      required: c.red[700],
      float: { bg: c.white },
    },
    message: {
      helper: c.stone[600],
      error: c.red[700],
      warn: c.amber[700],
    },
    icon: {
      default: c.stone[500],
      invalid: c.red[700],
      warn: c.amber[700],
      validating: c.navy[600],
    },
    radius: "0.375rem",
    size: {
      xs: { height: "1.5rem",  paddingX: "0.5rem",   paddingY: "0.125rem", fontSize: primitiveTypography.fontSize.xs },
      sm: { height: "1.75rem", paddingX: "0.625rem", paddingY: "0.25rem",  fontSize: primitiveTypography.fontSize.sm },
      md: { height: "2.25rem", paddingX: "0.75rem",  paddingY: "0.375rem", fontSize: primitiveTypography.fontSize.sm },
      lg: { height: "2.75rem", paddingX: "0.875rem", paddingY: "0.5rem",   fontSize: primitiveTypography.fontSize.md },
      xl: { height: "3.25rem", paddingX: "1rem",     paddingY: "0.625rem", fontSize: primitiveTypography.fontSize.lg },
    },
    messageRowHeight: "1.25rem",
  },
};
