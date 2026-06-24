/**
 * Pure substring matcher for a searchable listbox (Select now; Combobox/
 * MultiSelect later). DOM-free + side-effect free so the matching CONTRACT is
 * unit-testable in isolation.
 *
 * The fold is strictly **1:1** (one input char → one output char), NOT a
 * Unicode NFD expansion: output length equals input length, so a match range in
 * normalized space maps back to the ORIGINAL label with an identity index map
 * and highlight spans never shift. (NFD would split `İ` U+0130 into `i`+mark and
 * shift every later index.)
 */

/** Single-codepoint fold table: lowercase + Turkish + common Latin diacritics. */
const FOLD: Record<string, string> = {
  // Turkish
  İ: "i",
  I: "i",
  ı: "i",
  Ş: "s",
  ş: "s",
  Ğ: "g",
  ğ: "g",
  Ç: "c",
  ç: "c",
  Ö: "o",
  ö: "o",
  Ü: "u",
  ü: "u",
  // common Latin
  á: "a",
  à: "a",
  â: "a",
  ä: "a",
  ã: "a",
  å: "a",
  é: "e",
  è: "e",
  ê: "e",
  ë: "e",
  í: "i",
  ì: "i",
  î: "i",
  ï: "i",
  ó: "o",
  ò: "o",
  ô: "o",
  õ: "o",
  ú: "u",
  ù: "u",
  û: "u",
  ñ: "n",
};
// NOTE: every key must be UNIQUE — duplicate object keys are a TS1117 error that
// fails `vite-plugin-dts` at `pnpm build` (ESLint won't catch it). ç/ş/ö/ü/ğ are
// already declared once in the Turkish block above; do NOT repeat them here.

/**
 * Fold a string 1:1. Returns the normalized text plus a map where `map[i]` is the
 * ORIGINAL index of the char that produced normalized char `i` (identity here,
 * kept so the API survives a future non-1:1 fold).
 */
export function normalize(s: string): { text: string; map: number[] } {
  let text = "";
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const folded = FOLD[ch] ?? ch.toLowerCase();
    // Guard: keep 1:1 — if a fold ever produces >1 char, take the first (and
    // document that such a fold breaks range alignment, so don't add one).
    text += folded[0] ?? folded;
    map.push(i);
  }
  return { text, map };
}

export interface FilterResult {
  /** Per-label: did the normalized query occur as a substring? */
  matched: boolean[];
  /** Per-label: `[start,end]` in ORIGINAL-label indices, or null (no match / empty query). */
  ranges: Array<[number, number] | null>;
}

/**
 * Match `query` against each label. Empty/whitespace query → all matched, null
 * ranges (no highlight). Otherwise substring (anywhere), diacritic-insensitive.
 */
export function filterOptions(labels: readonly string[], query: string): FilterResult {
  const q = normalize(query.trim()).text;
  if (q === "") {
    return { matched: labels.map(() => true), ranges: labels.map(() => null) };
  }
  const matched: boolean[] = [];
  const ranges: Array<[number, number] | null> = [];
  for (const label of labels) {
    const { text: hay, map } = normalize(label); // normalize ONCE per label
    const at = hay.indexOf(q);
    if (at < 0) {
      matched.push(false);
      ranges.push(null);
    } else {
      matched.push(true);
      const start = map[at];
      const endNorm = at + q.length - 1;
      const end = (map[endNorm] ?? label.length - 1) + 1; // +1 → exclusive end
      ranges.push([start, end]);
    }
  }
  return { matched, ranges };
}
