export const primitiveTransition = {
  duration: { instant: "0ms", fast: "150ms", normal: "200ms", slow: "300ms" },
  easing: {
    linear: "linear",
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  },
} as const;
export type PrimitiveTransition = typeof primitiveTransition;
