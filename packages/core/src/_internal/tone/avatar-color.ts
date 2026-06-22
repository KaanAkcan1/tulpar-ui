/**
 * Deterministic avatar monogram color — pure logic (no DOM, no Lit).
 *
 * A name is hashed to a stable index into a curated palette of brand families,
 * so the same name always renders the same monogram background. The palette
 * deliberately EXCLUDES semantic-coded hues so an avatar never reads as a
 * status:
 *   - al / kizagan       → red  (danger / invalid)
 *   - ulgen / kuyas-ish  → amber (warning)  [ulgen excluded]
 *   - and the achromatic / near-neutral families (colpan, kara, yagiz, boz,
 *     mergen, ay) which would read as the empty/disabled neutral fallback.
 *
 * The avatar's initials background binds to `--tulpar-primitive-color-<family>-600`
 * in light mode and `-500` in dark mode (the consuming `.styles.ts` swaps via
 * `:host-context(.dark)`). These primitive vars appear ONLY in inline styles set
 * on the host (never in `*.styles.ts` — ESLint no-restricted-syntax rule).
 */

import { BRAND_FAMILIES } from "./tone-resolver";

/**
 * Families excluded from deterministic avatar coloring:
 * - semantic reds (al → danger; kizagan is a red sibling) and amber (ulgen →
 *   warning) so an avatar never mimics a danger/warning state;
 * - achromatic / muted neutrals (colpan, kara, yagiz, boz, mergen, ay) which
 *   read as the empty "no identity" gray fallback.
 */
const EXCLUDED = new Set<string>(["ulgen", "al", "colpan", "kara", "yagiz", "boz", "mergen", "ay"]);

/**
 * Curated palette for deterministic avatar coloring: all brand families minus
 * the semantic-coded / neutral families above. Stable insertion order (derived
 * from BRAND_FAMILIES) so the hash → family mapping is reproducible.
 */
export const AVATAR_FAMILIES: readonly string[] = [...BRAND_FAMILIES].filter(
  (f) => !EXCLUDED.has(f),
);

/**
 * Stable 32-bit string hash (FNV-1a variant). Pure: same input → same output,
 * independent of insertion order or runtime. Always returns a non-negative
 * integer.
 */
function hashString(name: string): number {
  let h = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    // FNV prime multiply, kept in 32-bit unsigned range.
    h = Math.imul(h, 0x01000193);
  }
  // Force to an unsigned 32-bit integer.
  return h >>> 0;
}

/**
 * Map a name to a stable brand family from {@link AVATAR_FAMILIES}. The same
 * name always returns the same family; the result is NEVER an excluded
 * (semantic / neutral) family. An empty name maps to a fixed palette family.
 */
export function hashToFamily(name: string): string {
  const palette = AVATAR_FAMILIES;
  const idx = hashString(name) % palette.length;
  return palette[idx];
}
