export interface InputSizeTokens {
  height: string;
  paddingX: string;
  paddingY: string;
  fontSize: string;
}

export interface InputTokens {
  bg: {
    default: string;
    disabled: string;
    readonly: string;
  };
  border: {
    default: string;
    hover: string;
    focus: string;
    invalid: string;
    warn: string;
  };
  text: {
    default: string;
    disabled: string;
    readonly: string;
    placeholder: string;
  };
  label: {
    default: string;
    required: string;
    float: {
      bg: string;
    };
  };
  message: {
    helper: string;
    error: string;
    warn: string;
  };
  icon: {
    default: string;
    invalid: string;
    warn: string;
    validating: string;
  };
  radius: string;
  size: {
    xs: InputSizeTokens;
    sm: InputSizeTokens;
    md: InputSizeTokens;
    lg: InputSizeTokens;
    xl: InputSizeTokens;
  };
  messageRowHeight: string;
}
