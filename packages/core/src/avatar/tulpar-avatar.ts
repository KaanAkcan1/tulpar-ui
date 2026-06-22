import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { BRAND_FAMILIES } from "../_internal/tone/tone-resolver";
import { hashToFamily } from "../_internal/tone/avatar-color";
import { avatarStyles } from "./tulpar-avatar.styles";

export type AvatarShape = "rounded-square" | "circle";
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Box size per tier, in CSS px. Mirrors the `--_av-size` table in
 * tulpar-avatar.styles.ts and is used to stamp intrinsic `width`/`height`
 * HTML attributes on the rendered `<img>` so the browser reserves layout
 * before the image loads (prevents CLS).
 */
const AVATAR_SIZE_PX: Record<AvatarSize, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
};

/**
 * `<tulpar-avatar>` — identity atom.
 *
 * Renders a user's identity with a graceful fallback cascade:
 *
 *   src (loads OK)  →  <img>            (object-fit: cover, lazy)
 *   src fails / none →  initials        (manual `initials` or derived from `name`)
 *   no initials/name →  generic user icon (neutral soft)
 *
 * ## Deterministic color
 * The initials background is a stable brand-family color derived from `name`
 * (`hashToFamily`), drawn from a curated palette that skips semantic-coded hues
 * (red / amber) and neutrals so an avatar never reads as a danger/warning state.
 * The `color` prop is a first-class single-accent override: a known brand-family
 * name uses that family's primitive var; any other string is used as a raw CSS
 * color.
 *
 * ## Accessibility
 * - Image avatar → `alt` (falls back to `name`) on the `<img>`.
 * - Initials / icon fallback → host gets `role="img"` + `aria-label="{name}"`
 *   when a name is present; both clear when there is no name.
 *
 * NOTE: AvatarGroup (stacking / overlap) and the status-dot slot are reserved
 * for Wave 2 — there is NO stacking or status-dot rendering in this element.
 */
export class TulparAvatar extends LitElement {
  static override styles = [avatarStyles];

  /** Image source. When it loads, the image renders over all fallbacks. */
  @property({ type: String }) src?: string;

  /** Person / entity name — drives initials, deterministic color + a11y name. */
  @property({ type: String }) name?: string;

  /** Manual initials override (wins over name-derived initials). */
  @property({ type: String }) initials?: string;

  /** Image alt text. Falls back to `name` when omitted. */
  @property({ type: String }) alt?: string;

  /** Corner shape. */
  @property({ type: String, reflect: true }) shape: AvatarShape = "rounded-square";

  /** Size tier. */
  @property({ type: String, reflect: true }) size: AvatarSize = "md";

  /**
   * Single-accent override for the initials background. A known brand-family
   * name (e.g. "ilay", "gok") uses that family's primitive var; any other
   * string is treated as a raw CSS color.
   */
  @property({ type: String }) color?: string;

  /** True once the image has failed to load (forces the initials/icon fallback). */
  @state() private _imgError = false;

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    // A new src clears any prior load error so the image can be retried.
    if (changed.has("src")) this._imgError = false;

    if (
      changed.has("color") ||
      changed.has("name") ||
      changed.has("src") ||
      changed.has("_imgError")
    ) {
      this._applyColorVars();
    }

    if (
      changed.has("name") ||
      changed.has("alt") ||
      changed.has("initials") ||
      changed.has("src") ||
      changed.has("_imgError")
    ) {
      this._syncA11y();
    }
  }

  // ─── Image ─────────────────────────────────────────────────────────────────
  private get _showImage(): boolean {
    return !!this.src && !this._imgError;
  }

  private _onImgError = (): void => {
    this._imgError = true;
  };

  // ─── Initials ────────────────────────────────────────────────────────────────
  /** Whether the initials fallback should render. */
  private get _showInitials(): boolean {
    if (this._showImage) return false;
    return this._initials.length > 0;
  }

  /**
   * Display initials: manual `initials` wins, else derived from `name`.
   * One letter at xs/sm, two letters at md+ (locale-aware uppercase).
   */
  private get _initials(): string {
    const manual = this.initials?.trim();
    if (manual) {
      return this._maxLetters(manual.toLocaleUpperCase());
    }
    const name = this.name?.trim();
    if (!name) return "";
    const parts = name.split(/\s+/).filter(Boolean);
    let raw: string;
    if (parts.length >= 2) {
      raw = (parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "");
    } else {
      raw = parts[0].slice(0, 2);
    }
    return this._maxLetters(raw.toLocaleUpperCase());
  }

  /** Cap to 1 letter at xs/sm, 2 letters otherwise. */
  private _maxLetters(s: string): string {
    const max = this.size === "xs" || this.size === "sm" ? 1 : 2;
    // Array spread is grapheme-naive but adequate for monogram initials.
    return [...s].slice(0, max).join("");
  }

  // ─── Color ───────────────────────────────────────────────────────────────────
  private static _colorVarNames = ["--tulpar-avatar-bg-l", "--tulpar-avatar-bg-d"];

  /**
   * Set the initials-background vars on the host (light `-l` / dark `-d`).
   * Cleared when an image is showing (the image covers the surface) so the
   * neutral icon fallback never inherits a stale family color.
   */
  private _applyColorVars(): void {
    for (const v of TulparAvatar._colorVarNames) this.style.removeProperty(v);

    // Only the initials fallback uses a colored surface.
    if (!this._showInitials) return;

    const override = this.color?.trim();
    if (override) {
      if (BRAND_FAMILIES.has(override)) {
        this.style.setProperty(
          "--tulpar-avatar-bg-l",
          `var(--tulpar-primitive-color-${override}-600)`,
        );
        this.style.setProperty(
          "--tulpar-avatar-bg-d",
          `var(--tulpar-primitive-color-${override}-500)`,
        );
      } else {
        // Raw CSS color: same value both modes (single accent).
        this.style.setProperty("--tulpar-avatar-bg-l", override);
        this.style.setProperty("--tulpar-avatar-bg-d", override);
      }
      return;
    }

    // Deterministic family from the name (skips semantic / neutral hues).
    const family = hashToFamily(this.name?.trim() ?? "");
    this.style.setProperty("--tulpar-avatar-bg-l", `var(--tulpar-primitive-color-${family}-600)`);
    this.style.setProperty("--tulpar-avatar-bg-d", `var(--tulpar-primitive-color-${family}-500)`);
  }

  // ─── Accessibility ────────────────────────────────────────────────────────────
  /**
   * Image avatars get their name from the `<img alt>`; the host stays a plain
   * decorative wrapper. The initials / icon fallback exposes `role="img"` +
   * `aria-label="{name}"` so AT announces a single labeled graphic.
   */
  private _syncA11y(): void {
    if (this._showImage) {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
      return;
    }
    const name = this.name?.trim();
    if (name) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", name);
    } else {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
    }
  }

  override render() {
    const showImage = this._showImage;
    const showInitials = !showImage && this._showInitials;
    const showIcon = !showImage && !showInitials;
    const altText = this.alt ?? this.name ?? "";
    // Intrinsic px box for the current tier → reserve layout (prevent CLS).
    const px = AVATAR_SIZE_PX[this.size] ?? AVATAR_SIZE_PX.md;

    // The status-dot slot is RESERVED for Wave 2 — intentionally not rendered.
    return html`
      ${showImage
        ? html`<img
            part="image"
            src=${this.src!}
            alt=${altText}
            width=${px}
            height=${px}
            loading="lazy"
            decoding="async"
            @error=${this._onImgError}
          />`
        : nothing}
      ${showInitials
        ? html`<span class="initials" part="initials" aria-hidden="true">${this._initials}</span>`
        : nothing}
      ${showIcon
        ? html`<span class="icon" part="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <circle cx="12" cy="8" r="3.2"></circle>
              <path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"></path>
            </svg>
          </span>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-avatar": TulparAvatar;
  }
}

if (!customElements.get("tulpar-avatar")) {
  customElements.define("tulpar-avatar", TulparAvatar);
}
