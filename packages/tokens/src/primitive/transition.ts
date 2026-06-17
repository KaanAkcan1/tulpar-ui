export const primitiveTransition = {
  duration: { instant: "0ms", fast: "150ms", normal: "200ms", slow: "300ms" },
  easing: {
    linear: "linear",
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1)", // signature ease-out for component micro-interactions (v0.7)
  },
} as const;
export type PrimitiveTransition = typeof primitiveTransition;
