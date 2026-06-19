import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property, query } from "lit/decorators.js";
import { toastStyles } from "./tulpar-toast.styles";
import { resolveTone, type ToneValue } from "./tone-resolver";

// ─── Types ────────────────────────────────────────────────────────────────────

export type { ToneValue };

export interface ToastAction {
  label: string;
  onClick: () => void;
}

// ─── Built-in SVG icons (one per tone) ───────────────────────────────────────
//
// Defined as static SVG strings (not Lit svg`` templates) to avoid the
// Lit-directive dual-instance crash in hot paths — see CLAUDE.md gotcha.
// They are injected via el.innerHTML in the `updated()` lifecycle callback,
// never via Lit directives (unsafeSVG / unsafeHTML).

const ICON_INFO = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8h.01M12 12v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

const ICON_SUCCESS = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M7.5 12.5 l3 3 L16.5 9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ICON_WARNING = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M10.29 3.86 L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3 L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

const ICON_DANGER = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9 L9 15M9 9 l6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;

/** Map from tone/icon-name to built-in SVG string */
const BUILTIN_ICONS: Record<string, string> = {
  info: ICON_INFO,
  success: ICON_SUCCESS,
  warning: ICON_WARNING,
  danger: ICON_DANGER,
};

// ─── Icon content types ───────────────────────────────────────────────────────

type IconContent =
  | null
  | { kind: "svg"; markup: string }
  | { kind: "text"; value: string };

// ─── Element ──────────────────────────────────────────────────────────────────

/**
 * `<tulpar-toast>` — A single tonal toast card.
 *
 * ## Attribute / property reference
 *
 * | Property       | Attribute      | Default   | Notes |
 * |---------------|----------------|-----------|-------|
 * | `tone`        | `tone`         | `'info'`  | `'info'|'success'|'warning'|'danger'|'custom'` |
 * | `color`       | `color`        | —         | Custom tone: brand family name or raw CSS color |
 * | `bg`          | `bg`           | —         | Custom tone surface override |
 * | `accent`      | `accent`       | —         | Custom tone accent override |
 * | `text`        | `text`         | —         | Custom tone on-surface override |
 * | `highContrast`| `high-contrast`| `false`   | Danger-only saturated surface escalation |
 * | `heading`     | `heading`      | —         | Title text; avoids clash with global `title` attr |
 * | `description` | `description`  | —         | Description text; `slot="description"` wins |
 * | `icon`        | `icon`         | —         | Built-in name / raw SVG / emoji; `''` = no icon |
 * | `iconProp`    | *(property)*   | undefined | `false` = no icon; set as property only |
 * | `closable`    | `closable`     | `true`    | Show the × close button |
 * | `actions`     | *(property)*   | `[]`      | Array of `{label, onClick}` — set as property |
 *
 * ## Title attribute clash avoidance
 *
 * The HTML global attribute `title` creates a native browser tooltip on hover.
 * To avoid this UX conflict (a toast "title" tooltipping over itself is jarring),
 * the visible heading uses the attribute `heading` (`@property({ attribute: 'heading' })`).
 * The `slot="title"` named slot still uses the conventional "title" naming for slot
 * consumers since slots are not HTML attributes and carry no global-attr side effects.
 *
 * ## Icon convention
 *
 * - No icon prop / absent → built-in default SVG for the active tone.
 * - `icon="success"` → built-in "success" SVG (overrides the tone default).
 * - `icon="<svg>...</svg>"` → raw SVG string, injected imperatively as innerHTML
 *   (never via Lit directives — avoids the dual-instance directive crash).
 * - `icon="🎉"` → treated as text/emoji, rendered as text content.
 * - `icon=""` (empty string) OR `iconProp = false` → no icon.
 * - `slot="icon"` → slot content wins over all prop forms.
 *
 * ## Focus / keyboard contract
 *
 * The host carries `tabindex="-1"` so the `<tulpar-toaster>` (Task 4.x) and
 * keyboard handlers can programmatically focus the card on an F6 region jump.
 * Screen-reader users navigate into the shadow via the card's `role="status"` /
 * `role="alert"` region. The toast does NOT steal focus on appearance.
 */
export class TulparToast extends LitElement {
  static override styles = toastStyles;

  // ── Tone ──────────────────────────────────────────────────────────────────

  /** Semantic tone variant. */
  @property({ type: String, reflect: true })
  tone: ToneValue = "info";

  /** Custom tone: brand family name (e.g. 'ilay') or raw CSS color ('#0d9488'). */
  @property({ type: String, reflect: true })
  color?: string;

  /** Custom tone surface (bg) override — replaces both light and dark surface. */
  @property({ type: String, reflect: true })
  bg?: string;

  /** Custom tone accent override — replaces both light and dark accent. */
  @property({ type: String, reflect: true })
  accent?: string;

  /** Custom tone on-surface text override — replaces both light and dark on-surface. */
  @property({ type: String, reflect: true })
  text?: string;

  /**
   * High-contrast escalation.  Honoured ONLY for `tone:'danger'`; no-op for
   * all other tones.  When true + danger: saturated surface + white text
   * (Carbon HC notification model).
   */
  @property({ type: Boolean, attribute: "high-contrast", reflect: true })
  highContrast = false;

  // ── Content ───────────────────────────────────────────────────────────────

  /**
   * Toast heading / title text.
   * Attribute is `heading` (not `title`) to avoid the HTML global `title`
   * attribute side-effect (native browser tooltip on hover).
   * `slot="title"` wins when both are present.
   */
  @property({ type: String, attribute: "heading" })
  heading?: string;

  /**
   * Description / body text below the title.
   * `slot="description"` wins when both are present.
   */
  @property({ type: String, reflect: true })
  description?: string;

  /**
   * Icon control.  String form sets the attribute (`icon="success"` /
   * `icon="🎉"` / `icon="<svg>..."` / `icon=""`).
   * `slot="icon"` wins over this prop.
   */
  @property({ type: String, reflect: true })
  icon?: string;

  /**
   * Boolean false = no icon.  Set as a property only — there is no `false`
   * attribute form (absent attr means "use default", not false).
   * Decorated as a reactive property (no attribute) so setting it triggers
   * a re-render.
   * Example: `toast.iconProp = false`.
   */
  @property({ attribute: false })
  iconProp: string | false | undefined = undefined;

  // ── Behaviour ────────────────────────────────────────────────────────────

  /** Show the × close button (always visible when true). */
  @property({ type: Boolean, reflect: true })
  closable = true;

  /**
   * Action buttons.  Set as a JS property (not an attribute) since attributes
   * cannot carry functions.  The service sets this directly.
   * Reactive (no attribute) so assigning a new array triggers re-render.
   *
   * @example
   * toast.actions = [{ label: 'Undo', onClick: () => undo() }]
   */
  @property({ attribute: false })
  actions: ToastAction[] = [];

  // ── Placeholder no-ops for Task 3.3 / 3.4 props ──────────────────────────
  // These are accepted as properties but have no behavior yet.

  /** Timer ring countdown. Task 3.3. */
  timer?: boolean;

  /** Auto-dismiss duration in ms. Task 3.3. */
  duration?: number;

  /** Timer ring style. Task 3.3. */
  timerStyle?: "track" | "soft";

  // ── DOM refs for imperative innerHTML injection ────────────────────────────

  @query(".icon-prop-target")
  private _iconPropTarget?: HTMLElement;

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  constructor() {
    super();
    // Make the host programmatically focusable for F6 region jump.
    // tabindex="-1": reachable via .focus() but not in natural tab order.
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "-1");
    }
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);

    const toneRelated = ["tone", "color", "bg", "accent", "text", "highContrast"];
    if (toneRelated.some((k) => changed.has(k))) {
      this._applyToneVars();
    }

    // Update icon innerHTML imperatively (avoids unsafeSVG/unsafeHTML directive
    // dual-instance crash — see CLAUDE.md Lit directive gotcha).
    const iconRelated = ["icon", "tone"];
    if (iconRelated.some((k) => changed.has(k))) {
      this._applyIconContent();
    }
  }

  // ─── Tone application ──────────────────────────────────────────────────────

  private _applyToneVars(): void {
    const result = resolveTone({
      tone: this.tone,
      color: this.color,
      bg: this.bg,
      accent: this.accent,
      text: this.text,
      highContrast: this.highContrast,
    });

    // Clear previous custom vars (so switching back to builtin removes them).
    const customVarNames = [
      "--tulpar-toast-surface-l",
      "--tulpar-toast-surface-d",
      "--tulpar-toast-on-surface-l",
      "--tulpar-toast-on-surface-d",
      "--tulpar-toast-border-l",
      "--tulpar-toast-border-d",
      "--tulpar-toast-accent-l",
      "--tulpar-toast-accent-d",
    ];
    for (const v of customVarNames) {
      this.style.removeProperty(v);
    }

    // Set inline vars for custom tones.
    if (!result.builtin) {
      for (const [prop, value] of Object.entries(result.vars)) {
        this.style.setProperty(prop, value);
      }
    }

    // Apply/remove [data-hc] attribute for high-contrast danger.
    if (result.highContrast) {
      this.setAttribute("data-hc", "");
    } else {
      this.removeAttribute("data-hc");
    }
  }

  // ─── Icon resolution ───────────────────────────────────────────────────────

  /**
   * Resolve the icon to render (null = no icon):
   * - `iconProp === false` → null
   * - `icon === ""` → null
   * - `icon` is a known built-in name → that built-in SVG string
   * - `icon` starts with `<` → raw SVG string
   * - `icon` is any other non-empty string → emoji/text
   * - no `icon` / undefined → BUILTIN_ICONS[tone] (default for the active tone)
   */
  private _resolveIconContent(): IconContent {
    // iconProp=false wins
    if (this.iconProp === false) return null;

    // icon="" → no icon
    if (this.icon === "") return null;

    if (this.icon !== undefined && this.icon !== null) {
      // Explicit icon string — check if it's a built-in name
      if (BUILTIN_ICONS[this.icon]) {
        return { kind: "svg", markup: BUILTIN_ICONS[this.icon] };
      }
      // Raw SVG string
      if (this.icon.trimStart().startsWith("<")) {
        return { kind: "svg", markup: this.icon };
      }
      // Emoji / text
      return { kind: "text", value: this.icon };
    }

    // Default: built-in SVG for the active tone
    const defaultSvg = BUILTIN_ICONS[this.tone] ?? BUILTIN_ICONS["info"];
    return { kind: "svg", markup: defaultSvg };
  }

  /**
   * Imperatively set the icon prop target's content.
   * This avoids the Lit unsafeSVG/unsafeHTML directive dual-instance crash.
   */
  private _applyIconContent(): void {
    const target = this._iconPropTarget;
    if (!target) return;

    const content = this._resolveIconContent();
    if (content === null) {
      target.innerHTML = "";
      target.textContent = "";
    } else if (content.kind === "svg") {
      target.innerHTML = content.markup;
    } else {
      target.innerHTML = "";
      target.textContent = content.value;
    }
  }

  // ─── Event handlers ────────────────────────────────────────────────────────

  private _onActionClick(action: ToastAction): void {
    action.onClick();
    this.dispatchEvent(
      new CustomEvent("tulpar-action", {
        detail: { label: action.label, action },
        bubbles: true,
        composed: true,
        cancelable: false,
      }),
    );
  }

  private _onCloseClick(): void {
    this.dispatchEvent(
      new CustomEvent("tulpar-dismiss", {
        detail: { reason: "user" },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  // ─── ARIA helpers ─────────────────────────────────────────────────────────

  /** ARIA role derived from tone. */
  private _ariaRole(): string {
    return this.tone === "danger" ? "alert" : "status";
  }

  /** ARIA live region politeness derived from tone. */
  private _ariaLive(): string {
    return this.tone === "danger" ? "assertive" : "polite";
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────

  private _renderIcon(): TemplateResult {
    // The slot="icon" lets consumers override the icon with arbitrary content.
    // The .icon-prop-target span holds the prop-driven icon, set imperatively
    // in `_applyIconContent()` after each render (no Lit directive involved).
    return html`
      <span class="toast-icon" part="icon">
        <slot name="icon">
          <span class="icon-prop-target" aria-hidden="true"></span>
        </slot>
      </span>
    `;
  }

  override render(): TemplateResult {
    const showIcon = this.icon !== "" && this.iconProp !== false;

    return html`
      <div
        class="toast-card"
        part="card"
        role=${this._ariaRole()}
        aria-live=${this._ariaLive()}
        aria-atomic="true"
      >
        ${showIcon ? this._renderIcon() : nothing}

        <div class="toast-body" part="body">
          <!-- Title: slot wins over prop -->
          <div class="toast-title" part="title">
            <slot name="title">${this.heading ?? ""}</slot>
          </div>

          <!-- Description: rendered when prop is set or slot has content -->
          ${this.description !== undefined
            ? html`
                <div class="toast-description" part="description">
                  <slot name="description">${this.description}</slot>
                </div>
              `
            : html`
                <slot name="description" @slotchange=${this._onDescSlotChange}></slot>
              `}

          <!-- Actions -->
          ${this.actions.length > 0
            ? html`
                <div class="toast-actions" part="actions">
                  ${this.actions.map(
                    (action, i) => html`
                      <button
                        type="button"
                        class=${i === 0 ? "action-primary" : ""}
                        @click=${() => this._onActionClick(action)}
                      >
                        ${action.label}
                      </button>
                    `,
                  )}
                </div>
              `
            : nothing}
        </div>

        <!-- Close -->
        ${this.closable
          ? html`
              <button
                type="button"
                class="toast-close"
                part="close"
                aria-label="Dismiss notification"
                @click=${this._onCloseClick}
              >
                ×
              </button>
            `
          : nothing}
      </div>
    `;
  }

  // ─── Slot helpers ──────────────────────────────────────────────────────────

  /**
   * When a description slot gets content without a `description` prop, force re-render
   * so the slot wrapper is rendered in a div (allowing CSS styling).
   * The guard `_hasDescSlot` ensures we don't loop: we only re-render when the
   * presence changes (empty → occupied or vice versa), never on every slotchange.
   */
  private _hasDescSlot = false;
  private _descSlotUpdateScheduled = false;

  private _onDescSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;
    if (hasContent !== this._hasDescSlot && !this._descSlotUpdateScheduled) {
      this._hasDescSlot = hasContent;
      this._descSlotUpdateScheduled = true;
      // Defer one tick to avoid the slotchange → requestUpdate → re-render → slotchange loop.
      Promise.resolve().then(() => {
        this._descSlotUpdateScheduled = false;
        this.requestUpdate();
      });
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-toast": TulparToast;
  }
}

if (!customElements.get("tulpar-toast")) {
  customElements.define("tulpar-toast", TulparToast);
}
