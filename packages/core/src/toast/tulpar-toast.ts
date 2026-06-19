import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
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

// ─── ID generator ────────────────────────────────────────────────────────────

let _toastIdSeq = 0;
function nextToastId(): string {
  return `tulpar-toast-${++_toastIdSeq}`;
}

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

  // ── Stable per-instance IDs for ARIA labelling ────────────────────────────
  //
  // These IDs live in the shadow DOM so they are scoped — no global collision.
  // Generated once per instance in the constructor and never changed, making
  // aria-labelledby / aria-describedby stable across re-renders.
  //
  // MANUAL SCREEN-READER PASS REQUIRED (spec §14):
  //   The alertdialog role + aria-labelledby combo must be verified with a real
  //   AT (NVDA+Chrome, VoiceOver+Safari). Automated tests confirm the ARIA
  //   attributes are wired correctly but cannot prove the AT announcement.
  private readonly _headingId: string = nextToastId() + "-heading";
  private readonly _descId: string = nextToastId() + "-desc";

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
   *
   * **Security note:** SVG / raw-markup values are injected via `innerHTML`
   * (the element's internal `.icon-prop-target` span).  Only pass trusted,
   * sanitised markup — never unsanitised user input.  This mirrors the
   * constraint on `ToneInput.color` and other raw-markup props.
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

  /**
   * Show the × close button (always visible when true).
   *
   * **Attribute-binding caveat:** `closable="false"` as an HTML string attribute
   * coerces to `true` because Lit's Boolean converter treats any non-absent
   * attribute as truthy.  To disable the close button, use a **property binding**:
   * `.closable=${false}` (Lit / Vue) or `[closable]="false"` (Angular).
   * Setting the JS property directly (`toast.closable = false`) also works.
   */
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

  // ── Timer ring (Task 3.3) ────────────────────────────────────────────────

  /**
   * Show the perimeter countdown ring.
   * Set to `false` for persistent toasts (no ring, no auto-dismiss).
   * Reflected as `timer` attribute so CSS can key off it.
   */
  @property({ type: Boolean, reflect: true })
  timer = true;

  /**
   * Auto-dismiss duration in ms.
   * `0` = persistent (treated same as `timer:false`).
   * Default: 5000ms.
   */
  @property({ type: Number, reflect: true })
  duration = 5000;

  /**
   * Ring visual style.
   * - `'track'` (default): faint static full-perimeter track + depleting fill.
   * - `'soft'`: depleting fill only (~1.5px, ~0.6 opacity).
   */
  @property({ type: String, reflect: true, attribute: "timer-style" })
  timerStyle: "track" | "soft" = "track";

  /**
   * Grouping count — for message grouping. When >1, the toast service has
   * merged duplicate messages and this shows the deduplicated count (e.g. ×3).
   * Rendered as a `data-count` attribute; CSS / `::after` can show the badge.
   * Updated imperatively by the service (no requestUpdate loop).
   */
  @property({ type: Number, attribute: false })
  count = 1;

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
    // Esc handler: when this toast or any of its shadow descendants has focus
    // and Esc is pressed, dispatch a cancelable tulpar-dismiss event with
    // reason:'user'. The host listens at the shadow root so composed keyboard
    // events from shadow children bubble up here first.
    //
    // We listen on the host element itself (not document) so the handler only
    // fires when focus is inside *this* toast — zero collision risk with other
    // Esc consumers (modals, dropdowns) because those handle Esc at higher
    // levels and stop propagation there if needed.
    this.addEventListener("keydown", this._onKeydown);
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);

    const toneRelated = ["tone", "color", "bg", "accent", "text", "highContrast"];
    if (toneRelated.some((k) => changed.has(k))) {
      this._applyToneVars();
    }

    // Update icon innerHTML imperatively (avoids unsafeSVG/unsafeHTML directive
    // dual-instance crash — see CLAUDE.md Lit directive gotcha).
    const iconRelated = ["icon", "tone", "iconProp"];
    if (iconRelated.some((k) => changed.has(k))) {
      this._applyIconContent();
    }

    // Re-sync [data-has-description] when the description prop changes so
    // the CSS visibility rule stays correct without a slot interaction.
    if (changed.has("description")) {
      this._syncDescriptionAttr();
    }

    // Sync [data-no-timer] when timer visibility props change.
    // This is attribute-driven (no requestUpdate) — same pattern as data-has-description.
    const timerRelated = ["timer", "duration"];
    if (timerRelated.some((k) => changed.has(k))) {
      this._syncTimerAttr();
    }

    // Update the ring SVG's --_toast-ring-dur CSS custom property imperatively
    // when duration changes (avoids any Lit directive involvement).
    if (changed.has("duration")) {
      this._applyRingDuration();
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

  /**
   * Keyboard handler bound on the host so it fires for the host itself and for
   * composed keydown events bubbling up from shadow descendants (close button,
   * action buttons).
   *
   * Esc only: dismisses the toast with reason:'user'. No other keys are handled.
   * We do NOT call stopPropagation() — we let the event continue to bubble so
   * outer Esc handlers (e.g. modal backdrop) can also react if they need to.
   *
   * MANUAL SR PASS (spec §14): confirm that pressing Esc while screen-reader
   * focus is on the toast's close button or action announces the dismissal.
   */
  private _onKeydown = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") return;
    this.dispatchEvent(
      new CustomEvent("tulpar-dismiss", {
        detail: { reason: "user" },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  };

  // ─── ARIA helpers ─────────────────────────────────────────────────────────

  /** ARIA role derived from actions and tone (spec §5.3). */
  private _ariaRole(): string {
    // Actionable toasts require user input → alertdialog takes precedence over
    // tone-based status/alert (spec §5.3).
    if (this.actions.length > 0) return "alertdialog";
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
    const isAlertDialog = this._ariaRole() === "alertdialog";
    // alertdialog MUST have an accessible name (spec §5.3).
    // We wire aria-labelledby to the heading element's id so the AT reads the
    // toast heading when announcing the alertdialog role.
    // aria-describedby is additionally wired to the description element (when
    // description content is present) so the AT reads the body text.
    // For status/alert roles these attributes are omitted — aria-live + aria-atomic
    // already deliver the content to the AT without an explicit labelling contract.
    const ariaLabelledBy = isAlertDialog ? this._headingId : nothing;
    const ariaDescribedBy =
      isAlertDialog && (this.description || this.hasAttribute("data-has-description"))
        ? this._descId
        : nothing;

    return html`
      <div
        class="toast-card"
        part="card"
        role=${this._ariaRole()}
        aria-live=${this._ariaLive()}
        aria-atomic="true"
        aria-labelledby=${ariaLabelledBy}
        aria-describedby=${ariaDescribedBy}
      >
        ${this._renderRing()}
        ${showIcon ? this._renderIcon() : nothing}

        <div class="toast-body" part="body">
          <!-- Title: slot wins over prop.
               id is always present so aria-labelledby can reference it even when
               the card is not yet an alertdialog (keeps the id stable). -->
          <div class="toast-title" id=${this._headingId} part="title">
            <slot name="title">${this.heading ?? ""}</slot>
            ${this.count > 1
              ? html`<span class="toast-count" aria-label="×${this.count} notifications">×${this.count}</span>`
              : nothing}
          </div>

          <!-- Description: always-rendered wrapper; visibility controlled by
               [data-has-description] attribute toggled from _onDescSlotChange.
               This avoids the slotchange → requestUpdate → slot-removal-slotchange
               infinite loop that results from replacing the <slot> element itself.
               id is always present so aria-describedby can reference it. -->
          <div class="toast-description" id=${this._descId} part="description">
            <slot name="description" @slotchange=${this._onDescSlotChange}>${this.description ?? ""}</slot>
          </div>

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

  // ─── Swipe-to-dismiss (Task 3.4) ──────────────────────────────────────────

  /**
   * State for an in-progress horizontal swipe gesture.
   * Cleared on pointerup/pointercancel.
   */
  private _swipe: {
    startX: number;
    startTime: number;
    pointerId: number;
    card: HTMLElement;
  } | null = null;

  /**
   * Attach pointer-event listeners for swipe-to-dismiss on the .toast-card.
   * Called once from firstUpdated() — no Lit re-render involvement.
   *
   * Gate: pointerdown on a <button> (close, action) is ignored so those
   * interactions remain independent.
   *
   * Disabled when `prefers-reduced-motion: reduce` is active — checked at
   * each pointerdown so the gate responds to system preference changes in
   * long-lived sessions.
   */
  private _initSwipe(card: HTMLElement): void {
    card.addEventListener("pointerdown", this._onSwipeDown);
    card.addEventListener("pointermove", this._onSwipeMove);
    card.addEventListener("pointerup", this._onSwipeUp);
    card.addEventListener("pointercancel", this._onSwipeCancel);
  }

  private _onSwipeDown = (e: PointerEvent): void => {
    // Ignore if another swipe is already active.
    if (this._swipe) return;

    // Gate: prefers-reduced-motion — check at event time.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Gate: ignore pointerdown that originated on a button (close / action).
    // e.target is the deepest element in the shadow DOM that received the event.
    const target = e.composedPath()[0] as Element | null;
    if (target instanceof HTMLButtonElement || target?.closest("button")) return;

    const card = e.currentTarget as HTMLElement;

    // Attempt pointer capture so we receive move/up even outside the element.
    // setPointerCapture may throw in non-real-pointer environments (tests).
    try {
      card.setPointerCapture(e.pointerId);
    } catch {
      // Guard: continue without capture (synthetic test events, non-standard env).
    }

    this._swipe = {
      startX: e.clientX,
      startTime: Date.now(),
      pointerId: e.pointerId,
      card,
    };
  };

  private _onSwipeMove = (e: PointerEvent): void => {
    const s = this._swipe;
    if (!s || e.pointerId !== s.pointerId) return;

    const dx = e.clientX - s.startX;
    // Apply 1:1 follow (no rubber-band — keeps motion predictable).
    s.card.style.transform = `translateX(${dx}px)`;

    // Reduce opacity as distance grows (max reduction at 160px away).
    const ratio = Math.min(Math.abs(dx) / 160, 1);
    s.card.style.opacity = String(1 - ratio * 0.6);
  };

  private _onSwipeUp = (e: PointerEvent): void => {
    const s = this._swipe;
    if (!s || e.pointerId !== s.pointerId) return;
    this._swipe = null;

    const dx = e.clientX - s.startX;
    const elapsed = Date.now() - s.startTime;
    const velocity = elapsed > 0 ? Math.abs(dx) / elapsed : 0;

    const width = s.card.offsetWidth || 360; // fallback for test env
    const threshold = width * 0.45;
    const pastThreshold = Math.abs(dx) >= threshold;
    const fastEnough = velocity >= 0.11; // px/ms

    try {
      s.card.releasePointerCapture(s.pointerId);
    } catch {
      // Guard: may throw if capture was never acquired or element detached.
    }

    if (pastThreshold || fastEnough) {
      this._dismissViaSwipe(s.card, dx);
    } else {
      this._springBack(s.card);
    }
  };

  private _onSwipeCancel = (e: PointerEvent): void => {
    const s = this._swipe;
    if (!s || e.pointerId !== s.pointerId) return;
    this._swipe = null;

    try {
      s.card.releasePointerCapture(s.pointerId);
    } catch {
      // Guard: may throw if capture was never acquired or element detached.
    }

    this._springBack(s.card);
  };

  /**
   * Fire the cancelable `tulpar-dismiss` event with `reason:'swipe'`.
   * If a listener calls `preventDefault()`, spring back instead of removing.
   * The actual DOM removal is the service's responsibility (Task 4.x); we
   * animate out and fire the event only.
   */
  private _dismissViaSwipe(card: HTMLElement, dx: number): void {
    const evt = new CustomEvent("tulpar-dismiss", {
      detail: { reason: "swipe" },
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    const dispatched = this.dispatchEvent(evt);

    if (!dispatched) {
      // preventDefault() was called — spring back.
      this._springBack(card);
    } else {
      // Animate out in the swipe direction, then clear.
      const direction = dx >= 0 ? 1 : -1;
      const exitX = direction * (card.offsetWidth + 24);
      card.style.transition = "transform 200ms ease, opacity 160ms ease";
      card.style.transform = `translateX(${exitX}px)`;
      card.style.opacity = "0";
    }
  }

  /**
   * Animate the card back to origin (no dismiss).
   */
  private _springBack(card: HTMLElement): void {
    card.style.transition = "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease";
    card.style.transform = "translateX(0px)";
    card.style.opacity = "1";

    // After the spring-back animation completes, clear the inline properties
    // so they don't interfere with other transitions (e.g. toast enter/exit).
    // Guard: wait for the transform transition (300ms) to finish — the opacity
    // transition (200ms) fires its transitionend first; clearing styles then
    // would abort the still-running transform spring.
    const cleanup = (e: TransitionEvent) => {
      if (e.propertyName !== "transform") return;
      card.style.transition = "";
      card.style.transform = "";
      card.style.opacity = "";
      card.removeEventListener("transitionend", cleanup);
    };
    card.addEventListener("transitionend", cleanup);
  }

  // ─── Slot helpers ──────────────────────────────────────────────────────────

  /**
   * Toggle the host [data-has-description] attribute without triggering a
   * Lit re-render.  Because the .toast-description wrapper is always in the
   * DOM, there is no slot element replacement and therefore no
   * slotchange → requestUpdate → slot-removal-slotchange infinite loop.
   * CSS uses :host([data-has-description]) to show the wrapper; it is hidden
   * by default via display:none on .toast-description.
   *
   * The attribute is seeded in firstUpdated() to cover the prop-only path
   * (slotchange does not fire when the slot has no assigned light DOM).
   */
  private _onDescSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;
    // Mirror the established SelectionControlBase pattern: toggle a data
    // attribute on the host instead of calling requestUpdate().  No Lit
    // update cycle is triggered, so there is no loop.
    if (hasContent || this.description !== undefined) {
      this.setAttribute("data-has-description", "");
    } else {
      this.removeAttribute("data-has-description");
    }
  };

  /**
   * Seed [data-has-description] and [data-no-timer] on first render, and
   * apply the initial ring duration CSS var.
   * Also wires the swipe-to-dismiss pointer listeners on the card element.
   */
  override firstUpdated(changed: PropertyValues): void {
    super.firstUpdated(changed);
    this._syncDescriptionAttr();
    this._syncTimerAttr();
    this._applyRingDuration();

    // Wire swipe gesture listeners on the card.
    const card = this.shadowRoot?.querySelector<HTMLElement>(".toast-card");
    if (card) {
      this._initSwipe(card);
    }
  }

  private _syncDescriptionAttr(): void {
    const hasSlot = Array.from(this.children).some((c) => (c as Element).slot === "description");
    if (this.description !== undefined || hasSlot) {
      this.setAttribute("data-has-description", "");
    } else {
      this.removeAttribute("data-has-description");
    }
  }

  // ─── Timer ring helpers ────────────────────────────────────────────────────

  /**
   * Returns true when the ring should be visible (timer on + positive duration).
   * This is the single source of truth for the [data-no-timer] toggle.
   */
  private _ringActive(): boolean {
    return this.timer === true && this.duration > 0;
  }

  /**
   * Toggle [data-no-timer] on the host without triggering a Lit re-render.
   * CSS uses :host([data-no-timer]) .toast-ring { display: none } to hide the ring.
   * This follows the exact same pattern as [data-has-description] — attribute
   * flip, no requestUpdate(), no loop.
   */
  private _syncTimerAttr(): void {
    if (this._ringActive()) {
      this.removeAttribute("data-no-timer");
    } else {
      this.setAttribute("data-no-timer", "");
    }
  }

  /**
   * Set the ring SVG's --_toast-ring-dur custom property imperatively so the
   * CSS animation reads the current duration without using Lit directives.
   * Plain el.style.setProperty — safe, no directive crash risk.
   */
  private _applyRingDuration(): void {
    const ringSvg = this.shadowRoot?.querySelector<SVGElement>(".toast-ring svg");
    if (ringSvg) {
      ringSvg.style.setProperty("--_toast-ring-dur", `${this.duration}ms`);
    }
  }

  // ─── Ring render ──────────────────────────────────────────────────────────

  /**
   * Render the perimeter timer ring SVG.
   *
   * The ring is always present in the DOM (following the data-has-description
   * pattern) — it is hidden via CSS when [data-no-timer] is on the host.
   * This avoids the slotchange-induced re-render loop that removing a DOM node
   * in updated() can cause.
   *
   * SVG geometry:
   * - x/y/width/height offset by 1px from the border so the ring sits ON the
   *   card border edge (not outside it, not covering content).
   * - pathLength="100" + stroke-dasharray:100 means dashoffset 0→100 depletes
   *   the full perimeter regardless of actual pixel length.
   * - `--_toast-ring-dur` is set imperatively in _applyRingDuration().
   * - Stroke color = var(--_toast-accent) (tone accent, already in scope).
   *
   * track style: adds a faint static .ring-track rect under the animated fill.
   * soft style: animated fill only.
   */
  private _renderRing(): TemplateResult {
    const isTrack = this.timerStyle === "track";
    return html`
      <div class="toast-ring" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          overflow="visible"
        >
          ${isTrack
            ? html`<rect
                class="ring-track"
                x="1px"
                y="1px"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                fill="none"
              />`
            : nothing}
          <rect
            class="ring-fill"
            x="1px"
            y="1px"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            fill="none"
            pathLength="100"
          />
        </svg>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-toast": TulparToast;
  }
}

if (!customElements.get("tulpar-toast")) {
  customElements.define("tulpar-toast", TulparToast);
}
