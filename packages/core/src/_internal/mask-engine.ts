export type MaskTokenKind =
  | "upper"
  | "lower"
  | "letter"
  | "digit"
  | "special"
  | "any"
  | "literal";

export type MaskToken =
  | { kind: Exclude<MaskTokenKind, "literal"> }
  | { kind: "literal"; literal: string };

export function compileMask(mask: string): MaskToken[] {
  const out: MaskToken[] = [];
  for (let i = 0; i < mask.length; i++) {
    const ch = mask[i];
    if (ch === "\\" && i + 1 < mask.length) {
      out.push({ kind: "literal", literal: mask[i + 1] });
      i++;
      continue;
    }
    switch (ch) {
      case "A":
        out.push({ kind: "upper" });
        break;
      case "a":
        out.push({ kind: "lower" });
        break;
      case "L":
        out.push({ kind: "letter" });
        break;
      case "9":
        out.push({ kind: "digit" });
        break;
      case "S":
        out.push({ kind: "special" });
        break;
      case "*":
        out.push({ kind: "any" });
        break;
      default:
        out.push({ kind: "literal", literal: ch });
    }
  }
  return out;
}

const SPECIAL_RE = /[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]/;

export function tokenAccepts(token: MaskToken, ch: string): boolean {
  switch (token.kind) {
    case "literal":
      return ch === token.literal;
    case "digit":
      return /[0-9]/.test(ch);
    case "upper":
    case "lower":
    case "letter":
      return /[A-Za-z]/.test(ch);
    case "special":
      return SPECIAL_RE.test(ch);
    case "any":
      return /[\x20-\x7E]/.test(ch);
  }
}

export function tokenTransform(token: MaskToken, ch: string): string {
  if (token.kind === "upper") return ch.toUpperCase();
  if (token.kind === "lower") return ch.toLowerCase();
  return ch;
}
