export interface ButtonSizeTokens {
  height: string;
  paddingX: string;
  fontSize: string;
  iconSize: string;
}

export interface ButtonTokens {
  size: {
    xs: ButtonSizeTokens;
    sm: ButtonSizeTokens;
    md: ButtonSizeTokens;
    lg: ButtonSizeTokens;
    xl: ButtonSizeTokens;
    "2xl": ButtonSizeTokens;
    "3xl": ButtonSizeTokens;
  };
  borderRadius: string;
  borderWidth: string;
  fontWeight: number;
  iconGap: string;
}
