import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import type { SemanticTokens } from "../../semantic/types";

export const tulparLight: SemanticTokens = {
  color: {
    bg: { surface: c.white, subtle: c.gray[50], muted: c.gray[100] },
    text: { primary: c.gray[900], secondary: c.gray[700], muted: c.gray[500], inverse: c.white },
    border: { default: c.gray[200], strong: c.gray[300] },
    brand: {
      default: c.blue[600], hover: c.blue[700], active: c.blue[800],
      disabled: c.gray[300], onColor: c.white,
      subtle: c.blue[50], subtleHover: c.blue[100],
    },
    danger: {
      default: c.red[600], hover: c.red[700], active: c.red[800],
      disabled: c.gray[300], onColor: c.white,
      subtle: c.red[50], subtleHover: c.red[100],
    },
    success: {
      default: c.green[600], hover: c.green[700], active: c.green[800],
      disabled: c.gray[300], onColor: c.white,
      subtle: c.green[50], subtleHover: c.green[100],
    },
    warning: {
      default: c.yellow[500], hover: c.yellow[600], active: c.yellow[700],
      disabled: c.gray[300], onColor: c.gray[900],
      subtle: c.yellow[50], subtleHover: c.yellow[100],
    },
    neutral: {
      default: c.gray[200], hover: c.gray[300], active: c.gray[400],
      disabled: c.gray[100], onColor: c.gray[900],
      subtle: c.gray[50], subtleHover: c.gray[100],
    },
    focusRing: "rgba(59, 130, 246, 0.5)",
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
    borderRadius: "6px",
    borderWidth: "1px",
    fontWeight: primitiveTypography.fontWeight.medium,
    iconGap: "8px",
  },
  font: { family: { body: primitiveTypography.fontFamily.body, mono: primitiveTypography.fontFamily.mono } },
  transition: { default: `all ${primitiveTransition.duration.fast} ${primitiveTransition.easing.standard}` },
};
