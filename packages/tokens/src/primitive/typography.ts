export const primitiveTypography = {
  fontFamily: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, monospace',
  },
  fontSize: {
    xs: "12px", sm: "14px", md: "16px", lg: "18px",
    xl: "20px", "2xl": "24px", "3xl": "30px", "4xl": "36px",
  },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  letterSpacing: { tight: "-0.025em", normal: "0", wide: "0.025em" },
} as const;

export type PrimitiveTypography = typeof primitiveTypography;
