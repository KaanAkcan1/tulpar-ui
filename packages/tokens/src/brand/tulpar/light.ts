import { primitiveColor as c } from "../../primitive/color";
import { primitiveTypography } from "../../primitive/typography";
import { primitiveTransition } from "../../primitive/transition";
import { primitiveShadow } from "../../primitive/shadow";
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
    disabled: { bg: c.colpan[100], fg: c.kara[500], border: c.colpan[200] },
    surfaceHighlight: "rgba(255, 255, 255, 0.18)",
    surfaceShade: "rgba(0, 0, 0, 0.12)",
    surfaceBorder: "color-mix(in oklch, var(--_btn-color-default) 85%, black)",
    shadow: {
      rest:
        "inset 0 1px 0 0 var(--tulpar-button-surface-highlight), " +
        "inset 0 -1px 0 0 var(--tulpar-button-surface-shade), " +
        "0 1px 2px -1px color-mix(in oklch, var(--_btn-color-default) 60%, black 30%), " +
        "0 5px 14px -3px color-mix(in oklch, var(--_btn-color-default) 42%, transparent)",
      hover:
        "inset 0 1px 0 0 var(--tulpar-button-surface-highlight), " +
        "inset 0 -1px 0 0 var(--tulpar-button-surface-shade), " +
        "0 2px 5px -1px color-mix(in oklch, var(--_btn-color-default) 60%, black 30%), " +
        "0 10px 24px -5px color-mix(in oklch, var(--_btn-color-default) 46%, transparent)",
      raised:
        "inset 0 1px 0 0 var(--tulpar-button-surface-highlight), " +
        "inset 0 -1px 0 0 var(--tulpar-button-surface-shade), " +
        "0 2px 6px -1px color-mix(in oklch, var(--_btn-color-default) 55%, black 30%), " +
        "0 16px 32px -8px color-mix(in oklch, var(--_btn-color-default) 48%, transparent)",
      press: "inset 0 1px 3px 0 color-mix(in oklch, black 22%, transparent)",
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
      xs: {
        height: "1.5rem",
        paddingX: "0.5rem",
        paddingY: "0.125rem",
        fontSize: primitiveTypography.fontSize.xs,
      },
      sm: {
        height: "1.75rem",
        paddingX: "0.625rem",
        paddingY: "0.25rem",
        fontSize: primitiveTypography.fontSize.sm,
      },
      md: {
        height: "2.25rem",
        paddingX: "0.75rem",
        paddingY: "0.375rem",
        fontSize: primitiveTypography.fontSize.sm,
      },
      lg: {
        height: "2.75rem",
        paddingX: "0.875rem",
        paddingY: "0.5rem",
        fontSize: primitiveTypography.fontSize.md,
      },
      xl: {
        height: "3.25rem",
        paddingX: "1rem",
        paddingY: "0.625rem",
        fontSize: primitiveTypography.fontSize.lg,
      },
    },
    messageRowHeight: "1.25rem",
  },

  selection: {
    control: {
      bg: c.white,
      bgChecked: c.tulpar[500],
      bgDisabled: c.colpan[100],
      border: c.colpan[400],
      borderHover: c.kara[400],
      borderChecked: c.tulpar[500],
      borderInvalid: c.al[600],
    },
    glyph: {
      default: c.yagiz[900],
      onCustom: c.colpan[50],
      disabled: c.kara[500],
    },
    focusRing: "rgba(81, 78, 207, 0.40)",
    label: c.yagiz[900],
    description: c.kara[700],
    card: {
      bg: c.white,
      border: c.colpan[200],
      bgHover: c.colpan[50],
      // Bespoke pre-baked tint: the live selected bg is computed in component CSS as
      // color-mix(--_sel-fill 8%, surface) so it follows the per-instance color. This
      // static value is only the no-color-mix fallback; no palette step matches it.
      bgSelected: "#e6f9f1",
    },
  },

  switch: {
    trackOff: c.colpan[300],
    trackOn: c.tulpar[500],
    thumb: c.white,
    thumbIconOff: c.kara[600],
    thumbShadow:
      "0 1px 2px rgba(11, 8, 4, 0.28), 0 2px 6px -1px rgba(11, 8, 4, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
    spinnerDuration: "700ms",
  },

  overlay: {
    surface: { bg: c.white, border: c.colpan[200] },
    // Inverted dark chip on light mode.
    tooltip: { bg: c.yagiz[900], text: c.colpan[50] },
    shadow: "0 10px 30px -10px rgba(2,8,23,.28), 0 2px 6px -2px rgba(2,8,23,.12)",
    focusRing: "rgba(81, 78, 207, 0.40)", // kam-500 @ 40% (project focus-ring convention)
    zIndex: "1000",
    tone: {
      // soft tonal map: surface=family[100], onSurface=family[800].
      // border lifted to family[700] (from the [200] starting point) so the
      // tonal border clears WCAG 3:1 against its own [100] surface — a [200]
      // border is near-invisible on a [100] fill. Enforced by overlay.contrast.test.ts.
      info: { surface: c.gok[100], onSurface: c.gok[800], border: c.gok[700] }, // gok = blue
      success: { surface: c.otuken[100], onSurface: c.otuken[800], border: c.otuken[700] }, // otuken = green
      warning: { surface: c.ulgen[100], onSurface: c.ulgen[800], border: c.ulgen[700] }, // ulgen = amber
      danger: { surface: c.al[100], onSurface: c.al[800], border: c.al[700] }, // al = red (matches input/selection invalid)
    },
    motion: {
      delayOpen: "400ms",
      delayClose: "120ms",
      durationEnter: "160ms",
      durationExit: "110ms",
      easing: "cubic-bezier(0.2,0.9,0.3,1)",
    },
    size: {
      tooltipMaxWidth: "32ch",
      popoverMaxH: "min(28rem, 60vh)",
      tooltipPadding: "7px 11px",
      popoverPadding: "16px",
    },
  },

  shell: {
    topbar: { height: "4rem", bg: c.white, fg: c.yagiz[900], border: c.colpan[200] },
    sidenav: {
      width: "17.5rem",
      railWidth: "4.5rem",
      bg: c.white, // re-bind: was colpan[50]
      fg: c.yagiz[700],
      fgMuted: c.kara[500],
      border: c.colpan[200],
      edge: "rgba(11, 8, 4, 0.06)", // NEW — yagiz[950] @ 6%
      scrollShadow: "rgba(11, 8, 4, 0.08)", // NEW — yagiz[950] @ 8%
      flyoutBg: c.white,
      flyoutBorder: c.colpan[200],
      flyoutHeaderFg: c.kara[600],
      flyoutDivider: c.colpan[200],
      railCue: c.kara[500],
      item: {
        height: "2.5rem", // re-bind: was 2.75rem
        radius: "0.5rem", // re-bind: was 0.375rem
        heightCompact: "2.25rem", // NEW
        iconSize: "1.125rem", // NEW
        bgHover: c.colpan[100],
        bgActive: c.tulpar[50],
        fgActive: c.tulpar[700],
        indicator: c.tulpar[500],
        glow: "rgba(0, 197, 122, 0.5)", // NEW — tulpar[500] @ 50%
        badgeBg: c.tulpar[500],
        badgeFg: c.yagiz[900],
        countBg: c.colpan[100], // NEW
        countFg: c.kara[600], // NEW
        dot: c.tulpar[500], // NEW
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

  feedback: {
    tone: {
      // Tonal surface model (light): surface=family[50], onSurface=family[900], border=family[200], accent=semantic default.
      // Families mirror the overlay family→intent mapping exactly:
      //   info → gok (blue), success → otuken (green), warning → ulgen (amber), danger → al (red).
      // accent = the "default" step for that intent in the semantic color layer (lighter/more saturated
      // than the surface step so it reads on the tinted card and serves as icon fill / ring stroke).
      // border raised to clear WCAG 3:1 against the [50] surface (enforced by feedback.contrast.test.ts):
      //   info [500]=3.69, success [400]=3.60, warning [700]=4.72 ([600] only 2.97), danger [400]=3.11.
      // warning accent also raised to [700] — [600]=2.97 narrowly fails 3:1.
      info: { surface: c.gok[50], onSurface: c.gok[900], border: c.gok[500], accent: c.gok[600] },
      success: {
        surface: c.otuken[50],
        onSurface: c.otuken[900],
        border: c.otuken[400],
        accent: c.otuken[500],
      },
      warning: {
        surface: c.ulgen[50],
        onSurface: c.ulgen[900],
        border: c.ulgen[700],
        accent: c.ulgen[700],
      },
      danger: { surface: c.al[50], onSurface: c.al[900], border: c.al[400], accent: c.al[600] },
    },
    // High-contrast danger: saturated al[600] surface + white text (Carbon HC notification model).
    dangerHc: { surface: c.al[600], on: "#ffffff" },
    // Toast elevation — distinct from card/overlay shadows; stronger vertical lift.
    shadow:
      "0 4px 6px -2px rgba(10, 37, 64, 0.10), " +
      "0 12px 28px -6px rgba(10, 37, 64, 0.18), " +
      "0 0 0 1px rgba(0, 0, 0, 0.04)",
    // Must sit above overlay (1000) + shell/sidenav (200/300).
    zIndex: "9000",
    motion: {
      durationEnter: "220ms",
      durationExit: "160ms",
      durationReposition: "300ms",
      easing: "cubic-bezier(.22,1,.36,1)",
      defaultDuration: "5000ms",
      messageDuration: "3000ms",
    },
    size: {
      toastMaxWidth: "360px",
      toastRadius: "12px",
      toastPadding: "12px 16px",
      messagePadding: "8px 14px",
      ringStroke: "1.5px",
    },
  },

  atom: {
    // Display-atom tone palette (light). Family→tone mapping:
    //   neutral → kara (slate), info → gok (blue), success → otuken (green),
    //   warning → ulgen (amber), danger → al (red).
    // soft    = tinted [100] surface + [800] text + tone border (contrast-tuned).
    // outline = tone text + tone border drawn on the page surface (white).
    // solid   = saturated fill + on-color text (white, or yagiz ink on amber).
    // Border steps raised above the spec starting points to clear WCAG 3:1 on the
    // [100] fill / white page (enforced by atom.contrast.test.ts):
    //   soft border [200|300]→[400|500|700]; info outline border [400]→[500].
    tone: {
      neutral: {
        soft: { surface: c.kara[100], text: c.kara[800], border: c.kara[500] },
        outline: { text: c.kara[700], border: c.kara[400] },
        solid: { bg: c.kara[800], text: c.colpan[50] },
      },
      info: {
        soft: { surface: c.gok[100], text: c.gok[800], border: c.gok[500] },
        outline: { text: c.gok[700], border: c.gok[500] },
        solid: { bg: c.gok[600], text: "#ffffff" },
      },
      success: {
        soft: { surface: c.otuken[100], text: c.otuken[800], border: c.otuken[400] },
        outline: { text: c.otuken[700], border: c.otuken[400] },
        solid: { bg: c.otuken[600], text: "#ffffff" },
      },
      warning: {
        soft: { surface: c.ulgen[100], text: c.ulgen[800], border: c.ulgen[700] },
        outline: { text: c.ulgen[800], border: c.ulgen[600] },
        solid: { bg: c.ulgen[500], text: c.yagiz[900] },
      },
      danger: {
        soft: { surface: c.al[100], text: c.al[800], border: c.al[500] },
        outline: { text: c.al[700], border: c.al[400] },
        solid: { bg: c.al[600], text: "#ffffff" },
      },
    },
    // Flow-gradient anchors (light): solid-bg-weight steps that read on a light
    // track. low=al red, mid=ulgen amber, high=otuken green. These auto-flip to
    // the dark anchors under `.dark` via the generated sheet — so a fill that
    // references them re-resolves on a runtime dark toggle even across a shadow
    // boundary (custom-property inheritance crosses it; :host-context does not).
    flow: { low: c.al[500], mid: c.ulgen[500], high: c.otuken[600] },
  },

  easing: { decelerate: primitiveTransition.easing.decelerate },
  shadow: {
    sm: primitiveShadow.sm,
    md: primitiveShadow.md,
    flyout: "0 4px 6px -2px rgba(10, 37, 64, 0.10), 0 12px 28px -6px rgba(10, 37, 64, 0.14)",
  },
};
