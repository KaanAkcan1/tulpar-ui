import { css } from "lit";

export const formFieldBaseStyles = css`
  :host {
    display: block;
    width: 100%;
    font-family: inherit;
    color: var(--tulpar-input-text-default, #15110b);
  }

  :host([disabled]) {
    pointer-events: none;
    cursor: not-allowed;
  }

  .field-label {
    display: block;
    font-size: 0.875rem;
    color: var(--tulpar-input-label-default, #27231d);
    margin-bottom: 0.25rem;
    line-height: 1.25;
  }

  .field-required-marker {
    color: var(--tulpar-input-label-required, #dc2626);
    margin-left: 0.125rem;
  }

  .field-necessity-text {
    color: var(--tulpar-input-message-helper, #57534e);
    font-weight: normal;
  }

  .field-message-row {
    min-height: var(--tulpar-input-message-row-height, 1.25rem);
    margin-top: 0.25rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    line-height: 1.25rem;
  }

  .field-message {
    color: var(--tulpar-input-message-helper, #57534e);
  }

  .field-message[data-kind="error"] {
    color: var(--tulpar-input-message-error, #b91c1c);
  }

  .field-message[data-kind="warn"] {
    color: var(--tulpar-input-message-warn, #b45309);
  }

  .field-status-zone {
    display: inline-flex;
    align-items: center;
    margin-left: 0.25rem;
    transition: opacity 150ms ease-out;
  }

  .field-status-zone:empty {
    display: none;
  }

  .field-status-icon[data-kind="invalid"] {
    color: var(--tulpar-input-icon-invalid, #b91c1c);
  }
  .field-status-icon[data-kind="warn"] {
    color: var(--tulpar-input-icon-warn, #d97706);
  }
  .field-status-icon[data-kind="validating"] {
    color: var(--tulpar-input-icon-validating, #133a66);
  }

  .field-status-icon--spin {
    animation: tulpar-input-spinner 800ms linear infinite;
  }

  @keyframes tulpar-input-spinner {
    to {
      transform: rotate(360deg);
    }
  }

  .field-prefix-host,
  .field-suffix-host {
    display: inline-flex;
    align-items: center;
    pointer-events: none;
    padding: 0 0.25rem;
  }

  :host([prefix-interactive]) .field-prefix-host {
    pointer-events: auto;
  }
  :host([suffix-interactive]) .field-suffix-host {
    pointer-events: auto;
  }

  :host {
    --field-resolved-height: var(--tulpar-input-size-md-height, 2.25rem);
    --field-resolved-padding-x: var(--tulpar-input-size-md-padding-x, 0.75rem);
    --field-resolved-padding-y: var(--tulpar-input-size-md-padding-y, 0.375rem);
    --field-resolved-font-size: var(--tulpar-input-size-md-font-size, 0.875rem);
  }

  :host([size="xs"]) {
    --field-resolved-height: var(--tulpar-input-size-xs-height, 1.5rem);
    --field-resolved-padding-x: var(--tulpar-input-size-xs-padding-x, 0.5rem);
    --field-resolved-padding-y: var(--tulpar-input-size-xs-padding-y, 0.125rem);
    --field-resolved-font-size: var(--tulpar-input-size-xs-font-size, 0.75rem);
  }
  :host([size="sm"]) {
    --field-resolved-height: var(--tulpar-input-size-sm-height, 1.75rem);
    --field-resolved-padding-x: var(--tulpar-input-size-sm-padding-x, 0.625rem);
    --field-resolved-padding-y: var(--tulpar-input-size-sm-padding-y, 0.25rem);
    --field-resolved-font-size: var(--tulpar-input-size-sm-font-size, 0.875rem);
  }
  :host([size="lg"]) {
    --field-resolved-height: var(--tulpar-input-size-lg-height, 2.75rem);
    --field-resolved-padding-x: var(--tulpar-input-size-lg-padding-x, 0.875rem);
    --field-resolved-padding-y: var(--tulpar-input-size-lg-padding-y, 0.5rem);
    --field-resolved-font-size: var(--tulpar-input-size-lg-font-size, 1rem);
  }
  :host([size="xl"]) {
    --field-resolved-height: var(--tulpar-input-size-xl-height, 3.25rem);
    --field-resolved-padding-x: var(--tulpar-input-size-xl-padding-x, 1rem);
    --field-resolved-padding-y: var(--tulpar-input-size-xl-padding-y, 0.625rem);
    --field-resolved-font-size: var(--tulpar-input-size-xl-font-size, 1.125rem);
  }

  /* ── Variant: control-row shell ─────────────────────────────────────── */

  .control-row {
    display: inline-flex;
    align-items: center;
    width: 100%;
    min-height: var(--field-resolved-height);
    padding: var(--field-resolved-padding-y) var(--field-resolved-padding-x);
    font-size: var(--field-resolved-font-size);
    background: var(--tulpar-input-bg-default, #fff);
    color: var(--tulpar-input-text-default, #15110b);
    border: 1px solid var(--tulpar-input-border-default, #d9e0df);
    border-radius: var(--tulpar-input-radius, 0.375rem);
    position: relative;
  }

  :host([variant="filled"]) .control-row {
    background: var(--tulpar-input-bg-readonly, #f0f7f5);
    border-color: transparent;
  }

  :host([variant="underlined"]) .control-row {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--tulpar-input-border-default, #d9e0df);
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
  }

  :host([variant="ghost"]) .control-row {
    background: transparent;
    border-color: transparent;
  }

  /* ── Soft keyboard focus ring (shared input-family treatment) ─────────────
     A 3px soft ring drawn AROUND the field box, shown ONLY on KEYBOARD focus
     (:focus-visible) — never on a mouse click. It is ADDITIVE (sits on top of
     the border) and follows the control-row's own border-radius automatically
     (box-shadow spread, not inset).

     Cross-control: the inner focusable element differs per family member — an
     input/textarea for the text fields, the .select-trigger div for
     tulpar-select — so we key off the control-row with :has(:focus-visible)
     (Chromium target) rather than the element itself. One rule, every member.

     OPT-OUT IS THE TOKEN: there is no boolean prop. A consumer sets
     --tulpar-color-focus-ring: transparent at theme / scope / instance level
     to suppress the ring entirely. */
  .control-row:has(:focus-visible) {
    box-shadow: 0 0 0 3px var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
  }

  /* Invalid / warn tint the ring toward the matching field-border hue via
     color-mix (both are semantic input-border tokens). The status border wins
     over the neutral focus ring so the field still reads as errored/warned
     while focused. */
  :host([invalid]) .control-row:has(:focus-visible) {
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--tulpar-input-border-invalid, #b91c1c) 32%, transparent);
  }
  :host([warn]) .control-row:has(:focus-visible) {
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--tulpar-input-border-warn, #b45309) 32%, transparent);
  }

  /* Underlined has no box — a full rectangular ring around a bottom-border-only
     field reads wrong. Keep its minimal language: the ring collapses to the
     baseline only. */
  :host([variant="underlined"]) .control-row:has(:focus-visible) {
    box-shadow: 0 2px 0 0 var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
  }
  :host([variant="underlined"][invalid]) .control-row:has(:focus-visible) {
    box-shadow: 0 2px 0 0
      color-mix(in srgb, var(--tulpar-input-border-invalid, #b91c1c) 32%, transparent);
  }
  :host([variant="underlined"][warn]) .control-row:has(:focus-visible) {
    box-shadow: 0 2px 0 0
      color-mix(in srgb, var(--tulpar-input-border-warn, #b45309) 32%, transparent);
  }

  /* Ghost previously drew its OWN 2px focus outline; replacing it with the
     shared soft ring keeps the family consistent and avoids a doubled
     ring + outline. (:focus-visible, not :focus-within — keyboard only.) */
  :host([variant="ghost"]) .control-row:has(:focus-visible) {
    outline: none;
  }

  /* ── Float label common ──────────────────────────────────────────────── */

  /* Positioned containing block for the absolute float label. Without this,
     the label would resolve its containing block OUTSIDE the shadow root
     (nearest positioned page ancestor / viewport) and render far away from
     the field. The wrap contains only the control row + the float label, so
     top: 50% centers the label on the control row exactly. */
  .field-control-wrap {
    position: relative;
  }

  .field-label--float,
  .field-label--float-in,
  .field-label--float-on {
    position: absolute;
    pointer-events: none;
    margin-bottom: 0;
  }

  /* While the float label rests inside the field (empty + unfocused), hide
     the native placeholder — otherwise label and placeholder overlap (MUI
     behaves the same way). The placeholder reappears once the label floats
     up on focus. float-on is static on the border, so no overlap there. */
  [data-label-position="float"] .control-row:not(:focus-within) input::placeholder,
  [data-label-position="float"] .control-row:not(:focus-within) textarea::placeholder,
  [data-label-position="float-in"] .control-row:not(:focus-within) input::placeholder,
  [data-label-position="float-in"] .control-row:not(:focus-within) textarea::placeholder {
    color: transparent;
  }

  /* float ("over"): the floated label rests fully ABOVE the input's top
     border (PrimeNG FloatLabel "over"). Reserve its vertical space up front
     so the rest→float transition causes zero layout shift, and so the label
     never overlaps content above the field. */
  [data-label-position="float"] .field-control-wrap {
    margin-top: 1.125rem;
  }

  /* Resting state shared by float and float-in: when the field is empty and
     unfocused, both look identical — a placeholder-colored label centered in
     the field. They diverge only in WHERE the label goes on focus/value. */
  .field-label--float,
  .field-label--float-in {
    top: 50%;
    left: var(--field-resolved-padding-x);
    transform: translateY(-50%);
    transform-origin: left center;
    color: var(--tulpar-input-text-placeholder, #a8a29e);
    background: transparent;
    transition:
      transform 150ms ease,
      top 150ms ease,
      font-size 150ms ease,
      color 150ms ease;
  }

  [data-label-position="float"] .control-row:focus-within ~ .field-label--float,
  [data-label-position="float"][data-has-value] .field-label--float {
    top: -0.125rem;
    transform: translateY(-100%) scale(0.85);
    color: var(--tulpar-input-label-default, #27231d);
  }

  [data-label-position="float-in"] .control-row:focus-within ~ .field-label--float-in,
  [data-label-position="float-in"][data-has-value] .field-label--float-in {
    top: 0.25rem;
    transform: none;
    font-size: 0.7rem;
    color: var(--tulpar-input-label-default, #27231d);
  }

  [data-label-position="float-on"] .field-label--float-on {
    top: 0;
    left: var(--field-resolved-padding-x);
    transform: translateY(-50%);
    background: var(--tulpar-input-label-float-bg, #fff);
    padding: 0 0.25rem;
    font-size: 0.75rem;
    color: var(--tulpar-input-label-default, #27231d);
  }

  /* Truncation for long labels in float modes (full text preserved for screen readers
     via the <label> element; only visual rendering ellipsizes). */
  .field-label--float,
  .field-label--float-in,
  .field-label--float-on {
    max-width: calc(80% - var(--field-resolved-padding-x));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .field-validating-live {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .field-status-icon {
    transition: opacity 150ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-status-icon,
    .field-label--float,
    .field-label--float-in,
    .field-label--float-on {
      transition: none !important;
    }
    .field-status-icon--spin {
      animation: none;
      opacity: 0.7;
    }
    :host([data-mask-rejected]) {
      animation: none !important;
    }
  }
`;
