import type { Directive } from "vue";

import "@tulpar-ui/core/toggletip";
import type { ToggletipPlacement, ToggletipTone } from "@tulpar-ui/core/toggletip";

import { createOverlayDirective } from "./overlay-directive-factory";
import type { OverlayDirectiveValue, TulparOverlayElement } from "./overlay-directive-base";

export type { ToggletipPlacement, ToggletipTone };
export type { OverlayDirectiveConfig, OverlayDirectiveValue } from "./overlay-directive-base";

/**
 * `v-tulpar-toggletip` — inline (click-triggered) toggletip directive.
 *
 * Attaches a `<tulpar-toggletip>` to ANY host WITHOUT wrapping it. Usage:
 *
 *   v-tulpar-toggletip="'More info'"
 *   v-tulpar-toggletip="{ text: 'More info', placement: 'top', tone: 'info' }"
 *
 * Same mechanics as the tooltip directive (id-mint → create → append → sync →
 * remove on teardown), with a `tone` config field. Booleans (`arrow`) are set as
 * DOM properties.
 */
export const vTulparToggletip: Directive<HTMLElement, OverlayDirectiveValue> =
  createOverlayDirective({
    tag: "tulpar-toggletip",
    applyText: (el: TulparOverlayElement, text: string) => {
      el.text = text;
    },
  });
