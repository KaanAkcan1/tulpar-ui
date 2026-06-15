import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import type { SemanticTokens } from "../../semantic/types";
import { tulparLight } from "./light";

export const tulparDark: SemanticTokens = {
  color: {
    bg: { surface: c.stone[900], subtle: c.stone[800], muted: c.stone[700] },
    text: {
      primary: c.stone[50],
      secondary: c.stone[300],
      muted: c.stone[500],
      inverse: c.stone[900],
    },
    border: { default: c.stone[700], strong: c.stone[600] },
    brand: {
      // Navy's .400 stop is intrinsically darker than other families' .400
      // (red.400/green.400/blue.400 are bright). Using navy.300 brings the
      // dark-mode primary into visual luminance parity with other severities
      // AND clears WCAG AA (navy.300 + stone.900 ≈ 4.77).
      default: c.navy[300],
      hover: c.navy[200],
      active: c.navy[100],
      disabled: c.stone[700],
      onColor: c.stone[900],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    danger: {
      default: c.red[400],
      hover: c.red[300],
      active: c.red[200],
      disabled: c.stone[700],
      onColor: c.stone[900],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    success: {
      default: c.green[400],
      hover: c.green[300],
      active: c.green[200],
      disabled: c.stone[700],
      onColor: c.stone[900],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    warn: {
      default: c.amber[300],
      hover: c.amber[200],
      active: c.amber[100],
      disabled: c.stone[700],
      onColor: c.stone[900],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    info: {
      default: c.blue[400],
      hover: c.blue[300],
      active: c.blue[200],
      disabled: c.stone[700],
      onColor: c.stone[900],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    help: {
      default: c.purple[400],
      hover: c.purple[300],
      active: c.purple[200],
      disabled: c.stone[700],
      onColor: c.stone[900],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    contrast: {
      default: c.stone[50],
      hover: c.stone[100],
      active: c.stone[200],
      disabled: c.stone[700],
      onColor: c.stone[900],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    premium: {
      default: c.gold[400],
      hover: c.gold[300],
      active: c.gold[200],
      disabled: c.stone[700],
      onColor: c.stone[900],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    neutral: {
      default: c.stone[700],
      hover: c.stone[600],
      active: c.stone[500],
      disabled: c.stone[800],
      onColor: c.stone[50],
      subtle: c.stone[800],
      subtleHover: c.stone[700],
    },
    focusRing: "rgba(102, 137, 184, 0.60)",
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
      default: c.stone[900],
      disabled: c.stone[800],
      readonly: c.stone[800],
    },
    border: {
      default: c.stone[700],
      hover: c.stone[600],
      focus: c.navy[400],
      invalid: c.red[400],
      warn: c.amber[300],
    },
    text: {
      default: c.stone[50],
      disabled: c.stone[600],
      readonly: c.stone[300],
      placeholder: c.stone[500],
    },
    label: {
      default: c.stone[300],
      required: c.red[400],
      float: { bg: c.stone[900] },
    },
    message: {
      helper: c.stone[300],
      error: c.red[400],
      warn: c.amber[300],
    },
    icon: {
      default: c.stone[400],
      invalid: c.red[400],
      warn: c.amber[300],
      validating: c.navy[400],
    },
    radius: "0.375rem",
    size: tulparLight.input.size,
    messageRowHeight: "1.25rem",
  },

  shell: {
    topbar: { height: "4rem", bg: c.stone[900], fg: c.stone[100], border: c.stone[800] },
    sidenav: {
      width: "17.5rem",
      railWidth: "4.5rem",
      bg: c.stone[950],
      fg: c.stone[300],
      fgMuted: c.stone[500],
      border: c.stone[800],
      item: {
        height: "2.75rem",
        radius: "0.375rem",
        bgHover: c.stone[800],
        bgActive: c.navy[900],
        fgActive: c.navy[200],
        indicator: c.navy[400],
        badgeBg: c.navy[400],
        badgeFg: c.stone[950],
      },
    },
    content: {
      bg: c.stone[900],
      maxWidth: "80rem",
      paddingCompact: "0.75rem",
      paddingComfortable: "1.5rem",
    },
    footer: { bg: c.stone[900], fg: c.stone[500], border: c.stone[800] },
    aside: { width: "22rem", bg: c.stone[900], border: c.stone[800] },
    mask: { bg: "rgb(2 6 23 / 0.6)" },
    z: { topbar: "100", mask: "150", sidenav: "200", aside: "300" },
  },
};
