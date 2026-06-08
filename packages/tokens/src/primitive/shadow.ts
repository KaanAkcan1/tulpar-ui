export const primitiveShadow = {
  none: "none",
  xs: "0 1px 1px rgba(10, 37, 64, 0.04)",
  sm: "0 1px 3px rgba(10, 37, 64, 0.06), 0 2px 6px rgba(10, 37, 64, 0.04)",
  md: "0 1px 3px rgba(10, 37, 64, 0.08), 0 8px 24px rgba(10, 37, 64, 0.06)",
  lg: "0 2px 6px rgba(10, 37, 64, 0.10), 0 16px 40px rgba(10, 37, 64, 0.08)",
  xl: "0 4px 12px rgba(10, 37, 64, 0.12), 0 32px 64px rgba(10, 37, 64, 0.10)",
  focus: "0 0 0 3px var(--tulpar-color-focus-ring, rgba(10, 37, 64, 0.40))",
} as const;
export type PrimitiveShadow = typeof primitiveShadow;
