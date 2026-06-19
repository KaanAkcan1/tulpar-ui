import type { Directive } from "vue";

import "@tulpar-ui/core/tooltip";
import type { TooltipPlacement } from "@tulpar-ui/core/tooltip";

import { createOverlayDirective } from "./overlay-directive-factory";
import type { OverlayDirectiveValue, TulparOverlayElement } from "./overlay-directive-base";

export type { TooltipPlacement };
export type { OverlayDirectiveConfig, OverlayDirectiveValue } from "./overlay-directive-base";

/**
 * `v-tulpar-tooltip` — inline tooltip directive.
 *
 * Attaches a `<tulpar-tooltip>` to ANY host element (button/icon/div) WITHOUT
 * wrapping it. Usage:
 *
 *   v-tulpar-tooltip="'Save changes'"                          // text only
 *   v-tulpar-tooltip="{ text: 'Save', placement: 'top', arrow: true, offset: 8 }"
 *
 * Mechanics: the directive ensures the host has an `id` (mints `tulpar-trg-N`
 * only when absent — a consumer id is preserved), creates a `<tulpar-tooltip>`,
 * sets its `for` = host id + text/props, and appends it to the host's parent so
 * the `for` id resolves in the same document. Removed on `beforeUnmount`.
 *
 * Tooltips have no `tone` (the inverted chip is fixed). `arrow` is set as a DOM
 * property (Lit reads any present boolean attr as `true`).
 */
export const vTulparTooltip: Directive<HTMLElement, OverlayDirectiveValue> =
  createOverlayDirective({
    tag: "tulpar-tooltip",
    applyText: (el: TulparOverlayElement, text: string) => {
      el.text = text;
    },
  });
