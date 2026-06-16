import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import type { SemanticTokens } from "../../semantic/types";
import { tulparLight } from "./light";

export const tulparDark: SemanticTokens = {
  color: {
    bg: {
      surface: c.mergen[900],
      subtle: c.mergen[800],
      muted: c.mergen[700],
      elevated: c.mergen[800],
      overlay: c.mergen[700],
    },
    text: {
      primary: c.colpan[50],
      secondary: c.colpan[200],
      muted: c.colpan[400],
      inverse: c.yagiz[900],
      link: c.gok[400],
    },
    border: { default: c.mergen[800], strong: c.mergen[700] },
    brand: {
      default: c.tulpar[400],
      hover: c.tulpar[300],
      active: c.tulpar[200],
      disabled: c.mergen[800],
      onColor: c.yagiz[950],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    secondary: {
      default: c.kam[300],
      hover: c.kam[200],
      active: c.kam[100],
      disabled: c.mergen[800],
      onColor: c.yagiz[950],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    danger: {
      default: c.al[400],
      hover: c.al[300],
      active: c.al[200],
      disabled: c.mergen[800],
      onColor: c.yagiz[950],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    success: {
      default: c.otuken[300],
      hover: c.otuken[200],
      active: c.otuken[100],
      disabled: c.mergen[800],
      onColor: c.yagiz[950],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    warn: {
      default: c.kuyas[300],
      hover: c.kuyas[200],
      active: c.kuyas[100],
      disabled: c.mergen[800],
      onColor: c.yagiz[950],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    info: {
      default: c.gok[400],
      hover: c.gok[300],
      active: c.gok[200],
      disabled: c.mergen[800],
      onColor: c.yagiz[950],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    help: {
      default: c.erlik[400],
      hover: c.erlik[300],
      active: c.erlik[200],
      disabled: c.mergen[800],
      onColor: c.yagiz[950],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    contrast: {
      default: c.colpan[50],
      hover: c.colpan[100],
      active: c.colpan[200],
      disabled: c.mergen[800],
      onColor: c.yagiz[900],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    premium: {
      default: c.ulgen[400],
      hover: c.ulgen[300],
      active: c.ulgen[200],
      disabled: c.mergen[800],
      onColor: c.yagiz[950],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    neutral: {
      default: c.kara[700],
      hover: c.kara[600],
      active: c.kara[500],
      disabled: c.mergen[800],
      onColor: c.colpan[50],
      subtle: c.mergen[900],
      subtleHover: c.mergen[800],
    },
    focusRing: "rgba(132, 151, 255, 0.60)", // kam-300 @ 60%
  },

  chart: {
    1: c.tulpar[400],
    2: c.kam[400],
    3: c.kuyas[400],
    4: c.ilay[400],
    5: c.yersu[400],
    6: c.burkut[400],
    7: c.erlik[400],
    8: c.kayin[400],
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
      default: c.mergen[950],
      disabled: c.mergen[900],
      readonly: c.mergen[900],
    },
    border: {
      default: c.mergen[800],
      hover: c.mergen[700],
      focus: c.kam[400],
      invalid: c.al[400],
      warn: c.kuyas[300],
    },
    text: {
      default: c.colpan[50],
      disabled: c.kara[500],
      readonly: c.colpan[200],
      placeholder: c.kara[400],
    },
    label: {
      default: c.colpan[200],
      required: c.al[400],
      float: { bg: c.mergen[950] },
    },
    message: {
      helper: c.colpan[300],
      error: c.al[400],
      warn: c.kuyas[300],
    },
    icon: {
      default: c.kara[400],
      invalid: c.al[400],
      warn: c.kuyas[300],
      validating: c.kam[400],
    },
    radius: "0.375rem",
    size: tulparLight.input.size,
    messageRowHeight: "1.25rem",
  },

  shell: {
    topbar: { height: "4rem", bg: c.mergen[900], fg: c.colpan[100], border: c.mergen[800] },
    sidenav: {
      width: "17.5rem",
      railWidth: "4.5rem",
      bg: c.mergen[950],
      fg: c.colpan[200],
      fgMuted: c.kara[400],
      border: c.mergen[800],
      edge: "rgba(255, 255, 255, 0.04)",     // NEW
      scrollShadow: "rgba(0, 0, 0, 0.30)",   // NEW
      item: {
        height: "2.5rem",
        heightCompact: "2.25rem",
        radius: "0.5rem",
        iconSize: "1.125rem",
        bgHover: c.mergen[900],
        bgActive: c.mergen[800],
        fgActive: c.tulpar[300],
        indicator: c.tulpar[400],
        glow: "rgba(33, 217, 141, 0.50)",   // NEW — tulpar[400] @ 50%
        badgeBg: c.tulpar[400],
        badgeFg: c.yagiz[950],
        countBg: c.mergen[800],             // NEW
        countFg: c.colpan[200],             // NEW
        dot: c.tulpar[400],                 // NEW
      },
    },
    content: {
      bg: c.mergen[900],          // re-bind: was mergen[950] (lift content above nav)
      maxWidth: "80rem",
      paddingCompact: "0.75rem",
      paddingComfortable: "1.5rem",
    },
    footer: { bg: c.mergen[900], fg: c.kara[400], border: c.mergen[800] },
    aside: { width: "22rem", bg: c.mergen[900], border: c.mergen[800] },
    mask: { bg: "rgb(11 8 4 / 0.6)" }, // yagiz-950
    z: { topbar: "100", mask: "150", sidenav: "200", aside: "300" },
  },
};
