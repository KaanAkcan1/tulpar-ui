export type MaskTokenKind = "upper" | "lower" | "letter" | "digit" | "special" | "any" | "literal";

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

export interface MaskHost {
  value: string;
  rawValue: string;
  mask: string;
  maskEmit: "masked" | "raw";
  maskDisplay: "eager" | "lazy";
  maskSlotChar: string;
  requestUpdate(): void;
  dispatchEvent(e: Event): boolean;
  markRejected(): void;
}

export class MaskController {
  private _tokens: MaskToken[] = [];
  constructor(private host: MaskHost) {}

  compile() {
    this._tokens = compileMask(this.host.mask);
  }

  tokens(): MaskToken[] {
    return this._tokens;
  }

  /** Accept a single character at the next unfilled token slot. Returns true if accepted. */
  acceptChar(ch: string): boolean {
    const raw = Array.from(this.host.rawValue);
    let r = 0;
    let nextTokenIndex = -1;
    for (let i = 0; i < this._tokens.length; i++) {
      const t = this._tokens[i];
      if (t.kind === "literal") continue;
      if (r >= raw.length) {
        nextTokenIndex = i;
        break;
      }
      r++;
    }
    if (nextTokenIndex === -1) {
      // mask is full
      this.host.markRejected();
      return false;
    }
    const token = this._tokens[nextTokenIndex];
    if (!tokenAccepts(token, ch)) {
      this.host.markRejected();
      return false;
    }
    const transformed = tokenTransform(token, ch);
    this._setRaw(this.host.rawValue + transformed);
    return true;
  }

  /** Display string for the visible input (always mask-formatted; eager/lazy per host setting). */
  displayString(): string {
    return applyMask(
      Array.from(this.host.rawValue),
      this._tokens,
      this.host.maskDisplay === "eager" ? this.host.maskSlotChar : "",
    );
  }

  /** Apply a paste: filter chars left-to-right against tokens, ignore non-matching. */
  applyPaste(text: string) {
    let raw = "";
    let tokenIdx = 0;
    for (let i = 0; i < text.length; i++) {
      // advance past literal tokens
      while (tokenIdx < this._tokens.length && this._tokens[tokenIdx].kind === "literal")
        tokenIdx++;
      if (tokenIdx >= this._tokens.length) break;
      const t = this._tokens[tokenIdx];
      const ch = text[i];
      if (tokenAccepts(t, ch)) {
        raw += tokenTransform(t, ch);
        tokenIdx++;
      }
    }
    this._setRaw(raw);
  }

  /** Backspace removes the last raw char. */
  backspace() {
    if (this.host.rawValue.length === 0) return;
    this._setRaw(this.host.rawValue.slice(0, -1));
  }

  private _setRaw(raw: string) {
    this.host.rawValue = raw;
    this.host.value =
      this.host.maskEmit === "raw"
        ? raw
        : applyMask(Array.from(raw), this._tokens, this.host.maskSlotChar);
    this.host.requestUpdate();
  }
}
