import type { DirectiveBinding } from "vue";

/**
 * Minimal structural type for the core overlay custom elements
 * (`<tulpar-tooltip>` / `<tulpar-toggletip>` / `<tulpar-popover>`). The directive
 * only touches the cross-cutting props it owns here; element-specific props
 * (`tone`, `arrow`, …) are written generically by the per-element factory.
 */
export interface TulparOverlayElement extends HTMLElement {
  for?: string;
  text?: string;
  open?: boolean;
  defaultOpen?: boolean;
  flip?: boolean;
  arrow?: boolean;
  crossOffset?: number;
  containerPadding?: number;
}

/**
 * Shared config-object surface accepted by the inline overlay directives. The
 * directive value can also be a plain `string` (text-only shorthand) — see each
 * directive's docs. `onOpenChange` is the directive analogue of `v-model:open`
 * (directives can't emit `update:open`, so a callback is offered instead).
 */
export interface OverlayDirectiveConfig {
  /** Overlay text (the trivial case). For rich content, use the Ref idiom. */
  text?: string;
  placement?: string;
  tone?: string;
  offset?: number;
  /** Set as a DOM property (camelCase) — `cross-offset` attribute on the core. */
  crossOffset?: number;
  /** Set as a DOM property (camelCase) — `container-padding` attribute. */
  containerPadding?: number;
  boundary?: string;
  /** Boolean — set as a DOM PROPERTY (Lit reads any present bool attr as true). */
  flip?: boolean;
  /** Boolean — set as a DOM PROPERTY. */
  arrow?: boolean;
  label?: string;
  /** Controlled-ish: pushed onto the element's `open` property when provided. */
  open?: boolean;
  /** Set as a DOM PROPERTY (camelCase) — `default-open` attribute on the core. */
  defaultOpen?: boolean;
  /**
   * Ref idiom (object form): id of a declared overlay element to anchor to this
   * host instead of creating an inline element. The `:ref` directive arg form is
   * equivalent (`v-tulpar-popover:ref="'declaredId'"`).
   */
  ref?: string;
  /**
   * Directive analogue of `v-model:open`. Called with `true`/`false` from the
   * element's `tulpar-open` / `tulpar-close` events. Optional.
   */
  onOpenChange?: (open: boolean) => void;
}

/** The accepted directive value shape: a string shorthand or a config object. */
export type OverlayDirectiveValue = string | OverlayDirectiveConfig | undefined | null;

let trgSeq = 0;

/** Mint a stable, unique id for a trigger host (only when the host has none). */
function mintTriggerId(): string {
  return `tulpar-trg-${++trgSeq}`;
}

/**
 * Ensure the host has an `id` so a core overlay's `for` can resolve to it. A
 * consumer-supplied id is returned as-is and NEVER overwritten; only a genuinely
 * id-less host gets a minted one.
 */
export function ensureHostId(host: HTMLElement): string {
  if (host.id) return host.id;
  const id = mintTriggerId();
  host.id = id;
  return id;
}

/** Normalize the directive value into a config object (string → `{ text }`). */
export function normalizeValue(value: OverlayDirectiveValue): OverlayDirectiveConfig {
  if (value == null) return {};
  if (typeof value === "string") return { text: value };
  return value;
}

/**
 * Resolve the ref id from binding arg + value, or `undefined` for inline mode.
 * Two equivalent idioms are accepted:
 *   - directive arg:    `v-tulpar-popover:ref="'declaredId'"`
 *   - config property:  `v-tulpar-popover="{ ref: 'declaredId' }"`
 */
export function resolveRefId(binding: DirectiveBinding<OverlayDirectiveValue>): string | undefined {
  if (binding.arg === "ref") {
    return typeof binding.value === "string" ? binding.value : normalizeValue(binding.value).ref;
  }
  return normalizeValue(binding.value).ref;
}

/**
 * Per-host state stashed by the directive between `mounted` / `updated` /
 * `beforeUnmount`. Kept in a WeakMap keyed by the host element (no DOM pollution,
 * GC-friendly).
 */
export interface OverlayHandle {
  /** The core overlay element this directive drives (created or declared). */
  el: TulparOverlayElement;
  /** True when `el` was created by this directive (so teardown removes it). */
  owned: boolean;
  /** Detach the `tulpar-open` / `tulpar-close` bridge. */
  unbridge: () => void;
}

const handles = new WeakMap<HTMLElement, OverlayHandle>();

export function getHandle(host: HTMLElement): OverlayHandle | undefined {
  return handles.get(host);
}

export function setHandle(host: HTMLElement, handle: OverlayHandle): void {
  handles.set(host, handle);
}

export function deleteHandle(host: HTMLElement): void {
  handles.delete(host);
}

/**
 * Wire the element's `tulpar-open` / `tulpar-close` events to the (optional)
 * `onOpenChange` callback. Returns a detacher. The callback is read lazily on
 * each event from the current config so `updated` can swap it freely.
 */
export function bridgeEvents(
  el: TulparOverlayElement,
  getConfig: () => OverlayDirectiveConfig,
): () => void {
  const onOpen = (): void => getConfig().onOpenChange?.(true);
  const onClose = (): void => getConfig().onOpenChange?.(false);
  el.addEventListener("tulpar-open", onOpen);
  el.addEventListener("tulpar-close", onClose);
  return () => {
    el.removeEventListener("tulpar-open", onOpen);
    el.removeEventListener("tulpar-close", onClose);
  };
}

/** String props forwarded as attributes; removed when `undefined`/`null`. */
const STRING_PROPS = ["placement", "tone", "boundary", "label", "offset"] as const;
/** Boolean props forwarded as DOM PROPERTIES (never attributes — Lit gotcha). */
const BOOLEAN_PROPS = ["flip", "arrow"] as const;
/** Numeric props forwarded as DOM PROPERTIES (camelCase). */
const NUMBER_PROPS = ["crossOffset", "containerPadding"] as const;

/**
 * Sync the shared/config-driven props onto the overlay element. `text` handling
 * differs between tooltip/toggletip (`.text`) and popover (`.textContent`) so it
 * is passed in via `applyText`. Element-specific extras can be layered by the
 * caller after this returns.
 */
export function syncProps(
  el: TulparOverlayElement,
  config: OverlayDirectiveConfig,
  applyText: (el: TulparOverlayElement, text: string) => void,
): void {
  applyText(el, config.text ?? "");

  for (const name of STRING_PROPS) {
    const value = config[name];
    if (value === undefined || value === null) {
      el.removeAttribute(name);
    } else {
      el.setAttribute(name, String(value));
    }
  }

  // Booleans: set as DOM PROPERTIES (camelCase). A present boolean ATTRIBUTE of
  // any value reads as `true` in Lit, so `flip=false` MUST be a property.
  for (const name of BOOLEAN_PROPS) {
    if (config[name] !== undefined) {
      (el as unknown as Record<string, unknown>)[name] = config[name];
    }
  }

  // Numbers: set as DOM PROPERTIES (camelCase) too — they map to hyphenated attrs.
  for (const name of NUMBER_PROPS) {
    if (config[name] !== undefined) {
      (el as unknown as Record<string, unknown>)[name] = config[name];
    }
  }

  if (config.defaultOpen !== undefined) el.defaultOpen = config.defaultOpen;
  // Controlled-ish open: push the property down when supplied.
  if (config.open !== undefined) el.open = config.open;
}
