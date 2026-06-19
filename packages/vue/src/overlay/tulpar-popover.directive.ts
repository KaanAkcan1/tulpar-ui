import type { Directive } from "vue";

import "@tulpar-ui/core/popover";
import type { PopoverPlacement, PopoverTone } from "@tulpar-ui/core/popover";

import { createOverlayDirective } from "./overlay-directive-factory";
import type { OverlayDirectiveValue, TulparOverlayElement } from "./overlay-directive-base";

export type { PopoverPlacement, PopoverTone };
export type { OverlayDirectiveConfig, OverlayDirectiveValue } from "./overlay-directive-base";

/**
 * `v-tulpar-popover` — popover directive (inline trivial case + Ref rich case).
 *
 * INLINE (plain text):
 *
 *   v-tulpar-popover="'Quick note'"
 *   v-tulpar-popover="{ text: 'Quick note', placement: 'bottom-start', tone: 'info' }"
 *
 * The directive ensures the host id, creates a `<tulpar-popover>`, sets its
 * `for` = host id, populates it from `text` (as `textContent`, since the popover
 * surface renders default-slot content), and appends it to the host's parent.
 * Removed on teardown.
 *
 * REF (rich content) — for forms/menus/headings, declare the element yourself and
 * reference it by id. Two equivalent idioms:
 *
 *   <tulpar-popover id="acct"><h2>Account</h2>…</tulpar-popover>
 *   <button v-tulpar-popover:ref="'acct'">Open</button>     // arg form
 *   <button v-tulpar-popover="{ ref: 'acct' }">Open</button> // object form
 *
 * In Ref mode the directive only sets the declared element's `for` = host id
 * (single-active-trigger, last-wins); it never creates or destroys the declared
 * element — the consumer owns its lifecycle and content.
 *
 * Booleans (`flip`/`arrow`) are set as DOM properties; `crossOffset`,
 * `containerPadding`, `defaultOpen` are set as camelCase properties.
 */
export const vTulparPopover: Directive<HTMLElement, OverlayDirectiveValue> =
  createOverlayDirective({
    tag: "tulpar-popover",
    applyText: (el: TulparOverlayElement, text: string) => {
      el.textContent = text;
    },
  });
