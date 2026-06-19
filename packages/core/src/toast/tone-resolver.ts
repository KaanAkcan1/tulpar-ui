/**
 * Tone resolver — pure logic (no DOM, no Lit, no element rendering).
 *
 * Given tone options, returns the data the `<tulpar-toast>` element (Task 3.2)
 * needs to render its tonal surface.
 *
 * ## Mode-flip contract (for Task 3.2)
 *
 * Custom tones emit BOTH light and dark values as separate CSS custom properties
 * so the element's `.styles.ts` can pick between them via `:host-context(.dark)`:
 *
 *   --tulpar-toast-surface-l   ← light-mode surface
 *   --tulpar-toast-surface-d   ← dark-mode surface
 *   --tulpar-toast-on-surface-l / -d
 *   --tulpar-toast-border-l   / -d
 *   --tulpar-toast-accent-l   / -d
 *
 * Task 3.2 (.styles.ts) MUST implement:
 *
 *   :host {
 *     --_toast-surface:    var(--tulpar-toast-surface-l);
 *     --_toast-on-surface: var(--tulpar-toast-on-surface-l);
 *     --_toast-border:     var(--tulpar-toast-border-l);
 *     --_toast-accent:     var(--tulpar-toast-accent-l);
 *   }
 *   :host-context(.dark) {
 *     --_toast-surface:    var(--tulpar-toast-surface-d);
 *     --_toast-on-surface: var(--tulpar-toast-on-surface-d);
 *     --_toast-border:     var(--tulpar-toast-border-d);
 *     --_toast-accent:     var(--tulpar-toast-accent-d);
 *   }
 *
 * These internal props are consumed everywhere in the shadow DOM styles.
 * The `--tulpar-primitive-*` references produced here (for brand-family custom
 * tones) live only in INLINE STYLES set on the host element, never in
 * `*.styles.ts` — ESLint's no-restricted-syntax rule on *.styles.ts is satisfied.
 *
 * ## Built-in tone path
 *
 * When `builtin:true`, `vars` is empty. The element sets a `tone` attribute;
 * its `.styles.ts` maps it to `--tulpar-feedback-tone-<tone>-*` semantic
 * tokens (e.g. `--tulpar-feedback-tone-info-surface`), which already flip
 * between light/dark automatically via the generated CSS token sheets.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type BuiltinTone = "info" | "success" | "warning" | "danger";
export type ToneValue = BuiltinTone | "custom";

export type ToneInput = {
  /** Tone variant. Defaults to 'info' when omitted. */
  tone?: ToneValue;
  /**
   * For custom: a brand family name (e.g. 'ilay', 'gok') or any raw CSS color
   * value (e.g. '#0d9488', 'rgb(13,148,136)'). Unknown strings that are not
   * recognised family names are treated as raw CSS colors.
   *
   * IMPORTANT: When this string is a raw CSS color it is injected verbatim into
   * `color-mix()` expressions and set as inline style values. The caller is
   * responsible for ensuring it is a valid CSS color — no sanitization is
   * performed here.
   */
  color?: string;
  /** Part override: replaces both the light and dark surface var with this literal. */
  bg?: string;
  /** Part override: replaces both the light and dark accent var with this literal. */
  accent?: string;
  /** Part override: replaces both the light and dark on-surface var with this literal. */
  text?: string;
  /**
   * High-contrast escalation. Honoured ONLY for `tone:'danger'` — ignored
   * (returns false) for all other tones including custom.
   */
  highContrast?: boolean;
};

export type ToneResult = {
  /**
   * True for info/success/warning/danger. The element uses a `[tone]` attr
   * and its `.styles.ts` maps it to semantic feedback tokens that auto-flip
   * for `.dark` via the CSS token sheet — no inline vars needed.
   */
  builtin: boolean;
  /**
   * Inline CSS custom properties to set on the host element (custom tones +
   * overrides). Empty for built-in tones.
   *
   * For custom tones these follow the -l/-d naming convention — Task 3.2
   * picks the right pair via `:host-context(.dark)`.
   */
  vars: Record<string, string>;
  /**
   * True only when `tone === 'danger' && highContrast === true`. The element
   * applies the `--tulpar-feedback-danger-hc-*` token pair for a saturated
   * danger surface + white text (Carbon HC notification model).
   */
  highContrast: boolean;
};

// ─── Known brand families ─────────────────────────────────────────────────────
//
// Derived from packages/tokens/src/primitive/color.ts.
// Kept in a Set for O(1) lookup. All lowercase — the primitiveColor keys ARE
// lowercase. The public ToastOptions type advertises only the most useful
// subset (gok, ulgen, kizagan, erlik, ilay, umay) but the resolver accepts
// any key in this full list.

const BRAND_FAMILIES = new Set<string>([
  "al",
  "kizagan",
  "umay",
  "ilay",
  "erlik",
  "kam",
  "mergen",
  "gok",
  "ay",
  "yersu",
  "tulpar",
  "otuken",
  "kayin",
  "ulgen",
  "kuyas",
  "alaz",
  "burkut",
  "colpan",
  "ayzit",
  "boz",
  "kara",
  "yagiz",
]);

// ─── Primitive CSS var helper ─────────────────────────────────────────────────

/**
 * Returns a `var(--tulpar-primitive-color-<family>-<step>)` reference.
 * These may appear only in INLINE styles (never in *.styles.ts — ESLint rule).
 */
function primitiveVar(family: string, step: number): string {
  return `var(--tulpar-primitive-color-${family}-${step})`;
}

// ─── Core resolution ──────────────────────────────────────────────────────────

/**
 * Resolve tone options into a ToneResult that the `<tulpar-toast>` element
 * (Task 3.2) uses to render its tonal surface.
 */
export function resolveTone(input: ToneInput): ToneResult {
  const tone = input.tone ?? "info";
  const { color, bg, accent, text, highContrast } = input;

  // ── Built-in tones ─────────────────────────────────────────────────────────
  if (tone !== "custom") {
    return {
      builtin: true,
      vars: {},
      highContrast: tone === "danger" && highContrast === true,
    };
  }

  // ── Custom tone — no color provided ────────────────────────────────────────
  if (!color) {
    return { builtin: false, vars: {}, highContrast: false };
  }

  // ── Custom tone — brand family ─────────────────────────────────────────────
  if (BRAND_FAMILIES.has(color)) {
    const vars: Record<string, string> = {
      // Light model: surface=50, onSurface=900, border=500, accent=600
      "--tulpar-toast-surface-l": primitiveVar(color, 50),
      "--tulpar-toast-on-surface-l": primitiveVar(color, 900),
      "--tulpar-toast-border-l": primitiveVar(color, 500),
      "--tulpar-toast-accent-l": primitiveVar(color, 600),

      // Dark model: surface=900, onSurface=100, border=500, accent=400.
      // NOTE: built-in dark tones use higher steps (700–800) for border to meet
      // WCAG 3:1 against their deep surfaces. The 500 step used here is a
      // generic best-effort for the custom escape hatch; callers can override via
      // `bg`/`accent`/`text` part overrides if contrast is critical.
      "--tulpar-toast-surface-d": primitiveVar(color, 900),
      "--tulpar-toast-on-surface-d": primitiveVar(color, 100),
      "--tulpar-toast-border-d": primitiveVar(color, 500),
      "--tulpar-toast-accent-d": primitiveVar(color, 400),
    };

    applyOverrides(vars, { bg, accent, text });
    return { builtin: false, vars, highContrast: false };
  }

  // ── Custom tone — raw CSS color ────────────────────────────────────────────
  //
  // Derive a tonal surface from a single arbitrary color.
  // Light: tint toward white (~90%) for surface; mid for border; the raw
  //        color for accent; very dark for on-surface text.
  // Dark:  deep tint toward a dark base for surface; brightened accent;
  //        near-white on-surface text.
  //
  // All values use `color-mix(in srgb, ...)` which is widely supported
  // (Chrome 111+, Firefox 113+, Safari 16.2+). Contrast is the author's
  // responsibility (per spec).
  const vars: Record<string, string> = {
    // Light surface: 90% white + 10% color → very tinted
    "--tulpar-toast-surface-l": `color-mix(in srgb, ${color} 10%, white)`,
    // Light on-surface: 10% white + 90% color-toward-black → dark readable text
    "--tulpar-toast-on-surface-l": `color-mix(in srgb, ${color} 20%, black)`,
    // Light border: 40% color + 60% white → visible but soft
    "--tulpar-toast-border-l": `color-mix(in srgb, ${color} 40%, white)`,
    // Light accent: the raw color itself
    "--tulpar-toast-accent-l": color,

    // Dark surface: 15% color + 85% toward #0a1628 (a dark navy base) → deep tint
    "--tulpar-toast-surface-d": `color-mix(in srgb, ${color} 15%, #0a1628)`,
    // Dark on-surface: 20% color + 80% white → near-white tinted text
    "--tulpar-toast-on-surface-d": `color-mix(in srgb, ${color} 20%, white)`,
    // Dark border: 50% color + 50% toward dark → visible mid step
    "--tulpar-toast-border-d": `color-mix(in srgb, ${color} 50%, #0a1628)`,
    // Dark accent: 80% color + 20% white → slightly lightened
    "--tulpar-toast-accent-d": `color-mix(in srgb, ${color} 80%, white)`,
  };

  applyOverrides(vars, { bg, accent, text });
  return { builtin: false, vars, highContrast: false };
}

// ─── Override helper ─────────────────────────────────────────────────────────

/**
 * Part overrides win for both -l and -d variants of their slot.
 * Applied after the base vars are computed so the author's literal always wins.
 */
function applyOverrides(
  vars: Record<string, string>,
  overrides: { bg?: string; accent?: string; text?: string },
): void {
  if (overrides.bg) {
    vars["--tulpar-toast-surface-l"] = overrides.bg;
    vars["--tulpar-toast-surface-d"] = overrides.bg;
  }
  if (overrides.accent) {
    vars["--tulpar-toast-accent-l"] = overrides.accent;
    vars["--tulpar-toast-accent-d"] = overrides.accent;
  }
  if (overrides.text) {
    vars["--tulpar-toast-on-surface-l"] = overrides.text;
    vars["--tulpar-toast-on-surface-d"] = overrides.text;
  }
}
