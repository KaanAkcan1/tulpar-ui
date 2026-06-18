import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import { primitiveShadow } from "../../primitive/shadow";
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
      xs: {
        height: "24px",
        paddingX: "8px",
        fontSize: "12px",
        iconSize: "12px",
        radius: "5px",
        letterSpacing: "0",
      },
      sm: {
        height: "32px",
        paddingX: "12px",
        fontSize: "14px",
        iconSize: "14px",
        radius: "6px",
        letterSpacing: "0",
      },
      md: {
        height: "40px",
        paddingX: "16px",
        fontSize: "14px",
        iconSize: "16px",
        radius: "7px",
        letterSpacing: "0",
      },
      lg: {
        height: "48px",
        paddingX: "20px",
        fontSize: "16px",
        iconSize: "18px",
        radius: "8px",
        letterSpacing: "-0.006em",
      },
      xl: {
        height: "56px",
        paddingX: "24px",
        fontSize: "18px",
        iconSize: "20px",
        radius: "9px",
        letterSpacing: "-0.008em",
      },
      "2xl": {
        height: "64px",
        paddingX: "28px",
        fontSize: "20px",
        iconSize: "24px",
        radius: "10px",
        letterSpacing: "-0.01em",
      },
      "3xl": {
        height: "72px",
        paddingX: "32px",
        fontSize: "24px",
        iconSize: "28px",
        radius: "12px",
        letterSpacing: "-0.01em",
      },
    },
    borderRadius: "7px",
    borderWidth: "1px",
    fontWeight: primitiveTypography.fontWeight.medium,
    iconGap: "8px",
    pressDuration: "80ms", // button-specific; faster than primitive scale for tactile press
    spinnerDuration: "600ms", // button-specific; no primitive-scale equivalent
    disabled: { bg: c.mergen[800], fg: c.kara[400], border: c.mergen[800] },
    surfaceHighlight: "rgba(255, 255, 255, 0.22)",
    surfaceShade: "rgba(0, 0, 0, 0.28)",
    surfaceBorder: "color-mix(in oklch, var(--_btn-color-default) 85%, black)",
    shadow: {
      rest:
        "inset 0 1px 0 0 var(--tulpar-button-surface-highlight), " +
        "inset 0 -1px 0 0 var(--tulpar-button-surface-shade), " +
        "0 1px 2px -1px color-mix(in oklch, var(--_btn-color-default) 60%, black 30%), " +
        "0 5px 14px -3px color-mix(in oklch, var(--_btn-color-default) 48%, transparent)",
      hover:
        "inset 0 1px 0 0 var(--tulpar-button-surface-highlight), " +
        "inset 0 -1px 0 0 var(--tulpar-button-surface-shade), " +
        "0 2px 5px -1px color-mix(in oklch, var(--_btn-color-default) 60%, black 30%), " +
        "0 10px 24px -5px color-mix(in oklch, var(--_btn-color-default) 52%, transparent)",
      raised:
        "inset 0 1px 0 0 var(--tulpar-button-surface-highlight), " +
        "inset 0 -1px 0 0 var(--tulpar-button-surface-shade), " +
        "0 2px 6px -1px color-mix(in oklch, var(--_btn-color-default) 55%, black 30%), " +
        "0 16px 32px -8px color-mix(in oklch, var(--_btn-color-default) 54%, transparent)",
      press: "inset 0 1px 3px 0 color-mix(in oklch, black 26%, transparent)",
    },
    premium: {
      sheen: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 42%)",
      ambient: "0 6px 18px -4px color-mix(in oklch, var(--_btn-color-default) 45%, transparent)",
    },
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
    easeStandard: primitiveTransition.easing.emphasized,
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

  selection: {
    control: {
      bg: c.mergen[800],
      bgChecked: c.tulpar[400],
      bgDisabled: c.mergen[800],
      border: c.mergen[600],
      borderHover: c.mergen[500],
      borderChecked: c.tulpar[400],
      borderInvalid: c.al[400],
    },
    glyph: {
      default: c.yagiz[950],
      onCustom: c.colpan[50],
      disabled: c.kara[400],
    },
    focusRing: "rgba(132, 151, 255, 0.60)",
    label: c.colpan[50],
    description: c.colpan[300],
    card: {
      bg: c.mergen[900],
      border: c.mergen[800],
      bgHover: c.mergen[800],
      // Bespoke pre-baked tint: live selected bg is color-mix(--_sel-fill 12%, surface)
      // in component CSS (follows per-instance color); this is the no-mix fallback only.
      bgSelected: "#173a2e",
    },
  },

  switch: {
    trackOff: c.mergen[700],
    trackOn: c.tulpar[400],
    thumb: c.white,
    thumbIconOff: c.kara[400],
    spinnerDuration: "700ms",
  },

  shell: {
    topbar: { height: "4rem", bg: c.mergen[900], fg: c.colpan[100], border: c.mergen[800] },
    sidenav: {
      width: "17.5rem",
      railWidth: "4.5rem",
      bg: c.mergen[950], // unchanged: nav stays darker than content (mergen[950])
      fg: c.colpan[200],
      fgMuted: c.kara[400],
      border: c.mergen[800],
      edge: "rgba(255, 255, 255, 0.04)", // NEW
      scrollShadow: "rgba(0, 0, 0, 0.3)", // NEW
      flyoutBg: c.mergen[800],
      flyoutBorder: c.mergen[700],
      flyoutHeaderFg: c.kara[400],
      flyoutDivider: c.mergen[700],
      railCue: c.kara[400],
      item: {
        height: "2.5rem",
        radius: "0.5rem",
        heightCompact: "2.25rem",
        iconSize: "1.125rem",
        bgHover: c.mergen[900],
        bgActive: c.mergen[800],
        fgActive: c.tulpar[300],
        indicator: c.tulpar[400],
        glow: "rgba(33, 217, 141, 0.5)", // NEW — tulpar[400] @ 50%
        badgeBg: c.tulpar[400],
        badgeFg: c.yagiz[950],
        countBg: c.mergen[800], // NEW
        countFg: c.colpan[200], // NEW
        dot: c.tulpar[400], // NEW
      },
    },
    content: {
      bg: c.mergen[900], // re-bind: was mergen[950] (lift content above nav)
      maxWidth: "80rem",
      paddingCompact: "0.75rem",
      paddingComfortable: "1.5rem",
    },
    footer: { bg: c.mergen[900], fg: c.kara[400], border: c.mergen[800] },
    aside: { width: "22rem", bg: c.mergen[900], border: c.mergen[800] },
    mask: { bg: "rgb(11 8 4 / 0.6)" }, // yagiz-950
    z: { topbar: "100", mask: "150", sidenav: "200", aside: "300" },
  },

  easing: { decelerate: primitiveTransition.easing.decelerate },
  shadow: {
    // dark mode is border-led: sm/md intentionally reuse the navy-tinted primitives
    // (low-contrast on dark surfaces by design — do not "fix" by darkening them).
    sm: primitiveShadow.sm,
    md: primitiveShadow.md,
    // flyout keeps its own pure-black contact shadow so the popover still separates.
    flyout: "0 2px 4px rgba(0, 0, 0, 0.32), 0 8px 20px rgba(0, 0, 0, 0.28)",
  },
};
