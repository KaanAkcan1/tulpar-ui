import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import type { SemanticTokens } from "../../semantic/types";

export const tulparLight: SemanticTokens = {
  color: {
    bg: {
      surface: c.white,
      subtle: c.colpan[50],
      muted: c.colpan[100],
      elevated: c.white,
      overlay: c.white,
    },
    text: {
      primary: c.yagiz[900],
      secondary: c.yagiz[700],
      muted: c.kara[500],
      inverse: c.colpan[50],
      link: c.gok[600],
    },
    border: { default: c.colpan[200], strong: c.colpan[300] },
    brand: {
      // Signature bright green (#00C57A) kept visible as primary; dark ink
      // label clears WCAG AA where white text would fail (~2:1). Hover/active
      // deepen the green.
      default: c.tulpar[500],
      hover: c.tulpar[600],
      active: c.tulpar[700],
      disabled: c.colpan[300],
      onColor: c.yagiz[900],
      subtle: c.tulpar[50],
      subtleHover: c.tulpar[100],
    },
    secondary: {
      default: c.kam[700],
      hover: c.kam[800],
      active: c.kam[900],
      disabled: c.colpan[300],
      onColor: c.colpan[50],
      subtle: c.kam[50],
      subtleHover: c.kam[100],
    },
    danger: {
      default: c.al[600],
      hover: c.al[700],
      active: c.al[800],
      disabled: c.colpan[300],
      onColor: c.colpan[50],
      subtle: c.al[50],
      subtleHover: c.al[100],
    },
    success: {
      default: c.otuken[500],
      hover: c.otuken[600],
      active: c.otuken[700],
      disabled: c.colpan[300],
      onColor: c.colpan[50],
      subtle: c.otuken[50],
      subtleHover: c.otuken[100],
    },
    warn: {
      default: c.kuyas[700],
      hover: c.kuyas[800],
      active: c.kuyas[900],
      disabled: c.colpan[300],
      onColor: c.colpan[50],
      subtle: c.kuyas[50],
      subtleHover: c.kuyas[100],
    },
    info: {
      default: c.gok[600],
      hover: c.gok[700],
      active: c.gok[800],
      disabled: c.colpan[300],
      onColor: c.colpan[50],
      subtle: c.gok[50],
      subtleHover: c.gok[100],
    },
    help: {
      default: c.erlik[600],
      hover: c.erlik[700],
      active: c.erlik[800],
      disabled: c.colpan[300],
      onColor: c.colpan[50],
      subtle: c.erlik[50],
      subtleHover: c.erlik[100],
    },
    contrast: {
      default: c.yagiz[900],
      hover: c.yagiz[800],
      active: c.yagiz[700],
      disabled: c.colpan[300],
      onColor: c.colpan[50],
      subtle: c.yagiz[100],
      subtleHover: c.yagiz[200],
    },
    premium: {
      // Antique gold (mid-luminance): dark ink + brighten-on-interaction,
      // mirroring the prior gold=premium pattern.
      default: c.ulgen[500],
      hover: c.ulgen[400],
      active: c.ulgen[300],
      disabled: c.colpan[300],
      onColor: c.yagiz[900],
      subtle: c.ulgen[50],
      subtleHover: c.ulgen[100],
    },
    neutral: {
      default: c.kara[700],
      hover: c.kara[800],
      active: c.kara[900],
      disabled: c.colpan[300],
      onColor: c.colpan[50],
      subtle: c.kara[50],
      subtleHover: c.kara[100],
    },
    focusRing: "rgba(81, 78, 207, 0.40)", // kam-500 @ 40%
  },

  chart: {
    1: c.tulpar[500],
    2: c.kam[500],
    3: c.kuyas[500],
    4: c.ilay[500],
    5: c.yersu[500],
    6: c.burkut[500],
    7: c.erlik[500],
    8: c.kayin[500],
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
      disabled: c.colpan[100],
      readonly: c.colpan[50],
    },
    border: {
      default: c.colpan[200],
      hover: c.kara[400],
      focus: c.kam[500],
      invalid: c.al[600],
      warn: c.kuyas[700],
    },
    text: {
      default: c.yagiz[900],
      disabled: c.kara[400],
      readonly: c.yagiz[700],
      placeholder: c.kara[400],
    },
    label: {
      default: c.yagiz[700],
      required: c.al[600],
      float: { bg: c.white },
    },
    message: {
      helper: c.kara[600],
      error: c.al[600],
      warn: c.kuyas[700],
    },
    icon: {
      default: c.kara[500],
      invalid: c.al[600],
      warn: c.kuyas[700],
      validating: c.kam[500],
    },
    radius: "0.375rem",
    size: {
      xs: { height: "1.5rem", paddingX: "0.5rem", paddingY: "0.125rem", fontSize: primitiveTypography.fontSize.xs },
      sm: { height: "1.75rem", paddingX: "0.625rem", paddingY: "0.25rem", fontSize: primitiveTypography.fontSize.sm },
      md: { height: "2.25rem", paddingX: "0.75rem", paddingY: "0.375rem", fontSize: primitiveTypography.fontSize.sm },
      lg: { height: "2.75rem", paddingX: "0.875rem", paddingY: "0.5rem", fontSize: primitiveTypography.fontSize.md },
      xl: { height: "3.25rem", paddingX: "1rem", paddingY: "0.625rem", fontSize: primitiveTypography.fontSize.lg },
    },
    messageRowHeight: "1.25rem",
  },

  shell: {
    topbar: { height: "4rem", bg: c.white, fg: c.yagiz[900], border: c.colpan[200] },
    sidenav: {
      width: "17.5rem",
      railWidth: "4.5rem",
      bg: c.white,                 // re-bind: was colpan[50]
      fg: c.yagiz[700],
      fgMuted: c.kara[500],
      border: c.colpan[200],
      edge: "rgba(11, 8, 4, 0.06)",          // NEW — yagiz[950] @ 6%
      scrollShadow: "rgba(11, 8, 4, 0.08)",  // NEW — yagiz[950] @ 8%
      item: {
        height: "2.5rem",          // re-bind: was 2.75rem
        radius: "0.5rem",          // re-bind: was 0.375rem
        heightCompact: "2.25rem",  // NEW
        iconSize: "1.125rem",      // NEW
        bgHover: c.colpan[100],
        bgActive: c.tulpar[50],
        fgActive: c.tulpar[700],
        indicator: c.tulpar[500],
        glow: "rgba(0, 197, 122, 0.5)",    // NEW — tulpar[500] @ 50%
        badgeBg: c.tulpar[500],
        badgeFg: c.yagiz[900],
        countBg: c.colpan[100],            // NEW
        countFg: c.kara[600],              // NEW
        dot: c.tulpar[500],                // NEW
      },
    },
    content: {
      bg: c.colpan[100],
      maxWidth: "80rem",
      paddingCompact: "0.75rem",
      paddingComfortable: "1.5rem",
    },
    footer: { bg: c.white, fg: c.kara[500], border: c.colpan[200] },
    aside: { width: "22rem", bg: c.white, border: c.colpan[200] },
    mask: { bg: "rgb(27 34 48 / 0.5)" }, // mergen-950
    z: { topbar: "100", mask: "150", sidenav: "200", aside: "300" },
  },
};
