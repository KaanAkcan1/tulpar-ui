export const primitiveTypography = {
  fontFamily: {
    display: '"Source Serif 4", "Source Serif Pro", Georgia, serif',
    ui: '"Source Sans 3", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, monospace',
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "60px",
    "7xl": "72px",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
  },
  lineHeight: {
    tight: 1.05,
    snug: 1.2,
    normal: 1.55,
    relaxed: 1.75,
  },
  letterSpacing: {
    tighter: "-0.03em",
    tight: "-0.015em",
    normal: "0",
    wide: "0.025em",
    wider: "0.08em",
  },
} as const;

export type PrimitiveTypography = typeof primitiveTypography;
