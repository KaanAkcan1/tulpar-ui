import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import type { SemanticTokens } from "../../semantic/types";

export const tulparLight: SemanticTokens = {
  color: {
    bg: {
      surface: c.white,
      subtle: c.stone[50],
      muted: c.stone[100],
    },
    text: {
      primary: c.stone[900],
      secondary: c.stone[700],
      muted: c.stone[500],
      inverse: c.stone[50],
    },
    border: {
      default: c.stone[200],
      strong: c.stone[300],
    },
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
    warning: {
      default: c.amber[700],
      hover: c.amber[800],
      active: c.amber[900],
      disabled: c.stone[300],
      onColor: c.stone[50],
      subtle: c.amber[50],
      subtleHover: c.amber[100],
    },
    neutral: {
      default: c.stone[200],
      hover: c.stone[300],
      active: c.stone[400],
      disabled: c.stone[100],
      onColor: c.stone[900],
      subtle: c.stone[50],
      subtleHover: c.stone[100],
    },
    focusRing: "rgba(10, 37, 64, 0.40)", // navy.700 @ 40%
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
};
