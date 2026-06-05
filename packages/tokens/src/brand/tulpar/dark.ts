import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import type { SemanticTokens } from "../../semantic/types";

export const tulparDark: SemanticTokens = {
  color: {
    bg: { surface: c.gray[900], subtle: c.gray[800], muted: c.gray[700] },
    text: { primary: c.gray[50], secondary: c.gray[300], muted: c.gray[500], inverse: c.gray[900] },
    border: { default: c.gray[700], strong: c.gray[600] },
    brand: {
      default: c.blue[400], hover: c.blue[300], active: c.blue[200],
      disabled: c.gray[700], onColor: c.gray[900],
      subtle: c.gray[800], subtleHover: c.gray[700],
    },
    danger: {
      default: c.red[400], hover: c.red[300], active: c.red[200],
      disabled: c.gray[700], onColor: c.gray[900],
      subtle: c.gray[800], subtleHover: c.gray[700],
    },
    success: {
      default: c.green[400], hover: c.green[300], active: c.green[200],
      disabled: c.gray[700], onColor: c.gray[900],
      subtle: c.gray[800], subtleHover: c.gray[700],
    },
    warning: {
      default: c.yellow[300], hover: c.yellow[200], active: c.yellow[100],
      disabled: c.gray[700], onColor: c.gray[900],
      subtle: c.gray[800], subtleHover: c.gray[700],
    },
    neutral: {
      default: c.gray[700], hover: c.gray[600], active: c.gray[500],
      disabled: c.gray[800], onColor: c.gray[50],
      subtle: c.gray[800], subtleHover: c.gray[700],
    },
    focusRing: "rgba(96, 165, 250, 0.6)",
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
