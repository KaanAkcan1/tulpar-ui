export interface ButtonSizeTokens {
  height: string;
  paddingX: string;
  fontSize: string;
  iconSize: string;
  /** Corner radius, scales with size so optical roundness holds. */
  radius: string;
  /** Letter-spacing; ~0 at small, slightly negative at large. */
  letterSpacing: string;
}

export interface ButtonTokens {
  size: { xs: ButtonSizeTokens; sm: ButtonSizeTokens; md: ButtonSizeTokens; lg: ButtonSizeTokens; xl: ButtonSizeTokens; "2xl": ButtonSizeTokens; "3xl": ButtonSizeTokens; };
  borderRadius: string;
  borderWidth: string;
  fontWeight: number;
  iconGap: string;
  pressDuration: string;
  spinnerDuration: string;
  disabled: { bg: string; fg: string; border: string };
  surfaceHighlight: string;
  surfaceShade: string;
  surfaceBorder: string;
  shadow: { rest: string; hover: string; raised: string; press: string };
  premium: { sheen: string; ambient: string };
}
