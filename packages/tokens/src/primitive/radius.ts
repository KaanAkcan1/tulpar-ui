export const primitiveRadius = {
  none: "0", sm: "2px", md: "6px", lg: "8px",
  xl: "12px", "2xl": "16px", full: "9999px",
} as const;
export type PrimitiveRadius = typeof primitiveRadius;
