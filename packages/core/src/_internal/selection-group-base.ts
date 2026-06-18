import { LitElement, html, nothing, type CSSResultGroup, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { selectionGroupBaseStyles } from "./selection-group-base.styles";
import { selectionMessageRowStyles } from "./selection-message-row.styles";
import { renderMessageRow, type SelectionMessageHost } from "./selection-message-row";
import type { SelectionSize } from "./selection-control-base";

/**
 * Internal abstract base for the Tulpar UI selection GROUP family
 * (CheckboxGroup / RadioGroup).
 *
 * Owns: the fieldset-like anatomy (legend + description + child slot + message
 * row), the shared reflected props, ARIA wiring, and child-attribute
 * propagation. The selection model (how the group's value maps to/from the
 * children) and any keyboard model are supplied by the subclass.
 *
 * NOT `formAssociated`: the children carry the form values, so the group never
 * registers a value of its own. NOT exported from @tulpar-ui/core — never added
 * to src/index.ts. Public groups subclass it but never expose its type.
 */
export abstract class SelectionGroupBase extends LitElement implements SelectionMessageHost {
  static override styles: CSSResultGroup = [selectionGroupBaseStyles, selectionMessageRowStyles];

  // --- Identity (propagated to children, not form-associated here) ---
  @property({ type: String, reflect: true }) name?: string;

  // --- Label / layout ---
  @property({ type: String }) label?: string;
  @property({ type: String }) description?: string;
  @property({ type: String, reflect: true }) orientation: "vertical" | "horizontal" = "vertical";
  @property({ type: String, reflect: true }) size: SelectionSize = "md";
  @property({ type: String }) color?: string;

  // --- State ---
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) warn = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;

  // --- Message row ---
  @property({ type: String, attribute: "helper-text" }) helperText?: string;
  @property({ type: String, attribute: "error-text" }) errorText?: string;
  @property({ type: String, attribute: "warn-text" }) warnText?: string;
  @property({ type: Boolean, attribute: "no-message-space", reflect: true }) noMessageSpace = false;

  private static _idCounter = 0;
  _msgId = `tulpar-sel-group-msg-${++SelectionGroupBase._idCounter}`;
  private _legendId = `tulpar-sel-group-legend-${SelectionGroupBase._idCounter}`;

  // ── Abstract hooks (subclass supplies the selection / keyboard model) ──────

  /** The core child custom-element tag, e.g. `tulpar-checkbox`. */
  protected abstract get _childTag(): string;

  /** ARIA role for the group container, e.g. `group` | `radiogroup`. */
  protected abstract get _groupRole(): string;

  /** Up: recompute the group's value from the current child selection. */
  protected abstract _reconcileFromChildren(): void;

  /** Down: reflect the group's value onto the children. */
  protected abstract _applyValueToChildren(): void;

  /** Optional keyboard model (roving focus etc.). Checkbox group: none. */
  protected _onChildKeydown?(e: KeyboardEvent): void;

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  override connectedCallback() {
    super.connectedCallback();
    this._propagate();
    this._applyValueToChildren();
    this._reconcileFromChildren();
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    // The propagated identity/state props changed → re-mirror onto children.
    if (
      changed.has("name") ||
      changed.has("size") ||
      changed.has("disabled") ||
      changed.has("readonly") ||
      changed.has("color")
    ) {
      this._propagate();
    }
  }

  // ── Children access + propagation ───────────────────────────────────────────

  /**
   * Light-DOM children matching the core child tag. Querying by the CORE tag
   * (not a wrapper selector) keeps propagation wrapper-agnostic: a future
   * `-ng` wrapper renders the core element as a descendant, so a descendant
   * query still reaches it.
   */
  protected _childElements(): HTMLElement[] {
    return Array.from(this.querySelectorAll(this._childTag)) as HTMLElement[];
  }

  /**
   * Mirror identity + state onto each child:
   *   - name / size: always set
   *   - disabled / readonly: OR-ed with the child's own (group OR child). The
   *     group marks the attrs it adds (`data-group-disabled`/`-readonly`) so
   *     that re-enabling the group only clears the disables IT added — a child
   *     disabled on its own stays disabled.
   *   - color: only when the group sets one
   *
   * Also sets `data-has-cards` on the host when any child has variant="card",
   * so the group styles can switch to a responsive grid for horizontal card groups.
   */
  protected _propagate() {
    const children = this._childElements();
    for (const child of children) {
      if (this.name !== undefined) child.setAttribute("name", this.name);
      child.setAttribute("size", this.size);

      this._mirrorGroupFlag(child, "disabled", this.disabled);
      this._mirrorGroupFlag(child, "readonly", this.readonly);

      this._mirrorGroupColor(child);
    }

    // Detect card children and toggle data-has-cards on the host.
    const hasCards = children.some((c) => c.getAttribute("variant") === "card");
    if (hasCards) this.setAttribute("data-has-cards", "");
    else this.removeAttribute("data-has-cards");
  }

  /**
   * Mirror the group `color` onto a child WITHOUT clobbering a child's own
   * authored `color` (per-item override). Uses a `data-group-color` marker so
   * we only ever clear / replace the color the group itself introduced.
   */
  private _mirrorGroupColor(child: HTMLElement) {
    // `color` is a property (not a reflected attribute), so a per-item override
    // set by a framework wrapper won't show up as an attribute. Read the live
    // property and track what the group itself applied via a marker, so a
    // child's own `color` (per-item override) is never clobbered.
    const marker = "data-group-color";
    const colorChild = child as HTMLElement & { color?: string };
    const ownColor = colorChild.color;
    const groupApplied = child.getAttribute(marker) || undefined;
    if (this.color) {
      // Apply only when the child has no color of its own, OR its current color
      // is exactly the one the group previously applied.
      if (!ownColor || ownColor === groupApplied) {
        colorChild.color = this.color;
        child.setAttribute(marker, this.color);
      }
    } else if (groupApplied !== undefined) {
      // The group cleared its color — remove only the one it added.
      if (ownColor === groupApplied) colorChild.color = undefined;
      child.removeAttribute(marker);
    }
  }

  /** Add/remove a boolean attr the group owns, without clobbering the child's own. */
  private _mirrorGroupFlag(child: HTMLElement, attr: "disabled" | "readonly", on: boolean) {
    const marker = `data-group-${attr}`;
    if (on) {
      // Only introduce (and mark) the attr if the child didn't already have its
      // own — otherwise we'd later clear the child's own state on re-enable.
      if (!child.hasAttribute(attr)) {
        child.setAttribute(attr, "");
        child.setAttribute(marker, "");
      }
    } else if (child.hasAttribute(marker)) {
      // Only the group put it there — safe to clear.
      child.removeAttribute(attr);
      child.removeAttribute(marker);
    }
  }

  protected _onSlotChange = () => {
    this._propagate();
    this._applyValueToChildren();
    this._reconcileFromChildren();
  };

  // ── ARIA helpers ────────────────────────────────────────────────────────────

  protected _hasLabel(): boolean {
    return !!this.label || this._hasLabelSlotContent();
  }

  protected _hasLabelSlotContent(): boolean {
    return Array.from(this.children).some((c) => c.slot === "label");
  }

  protected _ariaDescribedBy(): string | undefined {
    const hasMessage = !this.noMessageSpace && (this.helperText || this.errorText || this.warnText);
    return hasMessage ? this._msgId : undefined;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  protected override render(): TemplateResult {
    return html`
      <div
        class="group"
        part="group"
        role=${this._groupRole}
        aria-labelledby=${this._hasLabel() ? this._legendId : nothing}
        aria-describedby=${this._ariaDescribedBy() ?? nothing}
        aria-required=${this.required ? "true" : "false"}
        aria-invalid=${this.invalid ? "true" : "false"}
      >
        <div class="legend" id=${this._legendId} part="legend" ?hidden=${!this._hasLabel()}>
          <slot name="label">${this.label}</slot>
        </div>
        <div class="description" part="description">
          <slot name="description">${this.description}</slot>
        </div>
        <div class="items" part="items">
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
        ${renderMessageRow(this)}
      </div>
    `;
  }
}
