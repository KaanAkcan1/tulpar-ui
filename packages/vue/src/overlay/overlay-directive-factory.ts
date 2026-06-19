import type { Directive, DirectiveBinding } from "vue";

import {
  bridgeEvents,
  deleteHandle,
  ensureHostId,
  getHandle,
  normalizeValue,
  resolveRefId,
  setHandle,
  syncProps,
  type OverlayDirectiveConfig,
  type OverlayDirectiveValue,
  type TulparOverlayElement,
} from "./overlay-directive-base";

/** Per-element wiring the factory needs to build one overlay directive. */
export interface OverlayDirectiveSpec {
  /** Custom element tag, e.g. `"tulpar-tooltip"`. */
  tag: string;
  /**
   * Write the text into the created element. Tooltip/toggletip use the `text`
   * property (chip label); popover renders default-slot content, so the inline
   * text case is set as `textContent`.
   */
  applyText: (el: TulparOverlayElement, text: string) => void;
}

/**
 * Build a Vue overlay directive (`mounted` / `updated` / `beforeUnmount`) that
 * attaches a core overlay element to ANY host WITHOUT wrapping it, driven by the
 * `for`=hostId model.
 *
 * Two idioms, ONE directive:
 *
 * - **Inline** — value is a string or a config object. The directive ensures the
 *   host has an id (minting `tulpar-trg-N` only if absent — a consumer id is
 *   preserved), creates the core element, sets its `for` = host id + props, and
 *   appends it to the host's parent (so `for` resolves in the same document).
 *   On teardown the created element is removed.
 *
 * - **Ref** — anchor an already-DECLARED overlay element by id, via the directive
 *   arg `:ref` (`v-tulpar-popover:ref="'declaredId'"`) or the config property
 *   `{ ref: 'declaredId' }`. The directive ensures the host id, finds the declared
 *   element and sets its `for` = host id (single-active-trigger, last-wins). It
 *   does NOT create or destroy the declared element — the consumer owns it.
 *
 * Booleans (`flip`/`arrow`) are set as DOM PROPERTIES (Lit reads any present bool
 * attribute as `true`). `crossOffset`/`containerPadding`/`defaultOpen` are set as
 * camelCase properties directly. The optional `onOpenChange` config callback is
 * the directive analogue of `v-model:open`.
 */
export function createOverlayDirective(spec: OverlayDirectiveSpec): Directive<HTMLElement, OverlayDirectiveValue> {
  const getConfig = (host: HTMLElement, binding: DirectiveBinding<OverlayDirectiveValue>): OverlayDirectiveConfig => {
    void host;
    return normalizeValue(binding.value);
  };

  return {
    mounted(host, binding) {
      const id = ensureHostId(host);
      const refId = resolveRefId(binding);

      if (refId) {
        // Ref mode: anchor an existing declared element. Don't create/destroy it.
        const declared = (host.ownerDocument ?? document).getElementById(refId) as
          | TulparOverlayElement
          | null;
        if (!declared) return;
        declared.setAttribute("for", id);
        const unbridge = bridgeEvents(declared, () => normalizeValue(binding.value));
        setHandle(host, { el: declared, owned: false, unbridge });
        return;
      }

      // Inline mode: create + append the core element.
      const config = getConfig(host, binding);
      const el = (host.ownerDocument ?? document).createElement(spec.tag) as TulparOverlayElement;
      el.setAttribute("for", id);
      syncProps(el, config, spec.applyText);
      (host.parentNode ?? (host.ownerDocument ?? document).body).appendChild(el);
      const unbridge = bridgeEvents(el, () => normalizeValue(binding.value));
      setHandle(host, { el, owned: true, unbridge });
    },

    updated(host, binding) {
      const handle = getHandle(host);
      if (!handle) return;
      const refId = resolveRefId(binding);
      if (refId) {
        // Keep the declared element anchored (id is stable; re-assert `for`).
        handle.el.setAttribute("for", ensureHostId(host));
        return;
      }
      if (handle.owned) syncProps(handle.el, getConfig(host, binding), spec.applyText);
    },

    beforeUnmount(host) {
      const handle = getHandle(host);
      if (!handle) return;
      handle.unbridge();
      if (handle.owned) handle.el.remove();
      deleteHandle(host);
    },
  };
}
