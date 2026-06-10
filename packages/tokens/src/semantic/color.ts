export interface ColorTokens {
  bg: {
    surface: string;
    subtle: string;
    muted: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    default: string;
    strong: string;
  };
  brand: VariantColorTokens;
  danger: VariantColorTokens;
  success: VariantColorTokens;
  warn: VariantColorTokens;
  info: VariantColorTokens;
  help: VariantColorTokens;
  contrast: VariantColorTokens;
  premium: VariantColorTokens;
  neutral: VariantColorTokens;
  focusRing: string;
}

export interface VariantColorTokens {
  default: string;
  hover: string;
  active: string;
  disabled: string;
  onColor: string;
  subtle: string;
  subtleHover: string;
}
