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

/**
 * Produces the display string from a raw character array.
 *
 * - `slotChar=""` → lazy mode (empty token slots render as a single space placeholder).
 * - `slotChar` non-empty → eager mode (empty slots render the slot char).
 */
export function applyMask(rawChars: string[], tokens: MaskToken[], slotChar: string): string {
  let out = "";
  let r = 0;
  for (const t of tokens) {
    if (t.kind === "literal") {
      out += t.literal;
      continue;
    }
    if (r < rawChars.length) {
      out += tokenTransform(t, rawChars[r]);
      r++;
    } else {
      out += slotChar || " ";
    }
  }
  return out;
}

/**
 * Inverts applyMask: walks tokens positionally, extracting only token-slot
 * characters that the token accepts (skipping literals). Unfilled slot chars
 * (e.g. "_" or " ") are stripped — they are placeholders, not user data.
 */
export function extractRaw(display: string, tokens: MaskToken[]): string {
  let out = "";
  const len = Math.min(display.length, tokens.length);
  for (let i = 0; i < len; i++) {
    const t = tokens[i];
    if (t.kind === "literal") continue;
    const ch = display[i];
    if (tokenAccepts(t, ch)) {
      out += ch;
    }
    // unfilled slot chars (_, space) are silently skipped
  }
  return out;
}
