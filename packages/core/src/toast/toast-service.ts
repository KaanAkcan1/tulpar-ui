/**
 * toast-service.ts — Imperative toast + message service (Task 4.1)
 *
 * Wires together:
 * - ToasterQueue (per-location queue, grouping, overflow)
 * - getLocationContainer (portal root)
 * - ToastTimer (auto-dismiss with pause/resume)
 * - collapsedLayout / expandedLayout (stacking math)
 * - <tulpar-toast> element (rendering)
 *
 * Exported shapes:
 *   toast(message, opts?) → id
 *   toast.success/info/warning/danger(message, opts?) → id
 *   toast.custom(message, opts?) → id
 *   toast.update(id, partialOpts) → void
 *   toast.dismiss(id?) → void
 *   toast.setDefaults(defaults) → void
 *
 *   message(text, opts?) → id
 *   message.success/info/warning/danger(text, opts?) → id
 *   message.dismiss(id?) → void
 *
 *   __resetToastServiceForTest() → void   (test-only)
 */

import { ToasterQueue } from "../_internal/toaster/queue";
import type { Location } from "../_internal/toaster/queue";
import { getLocationContainer, __resetToasterRootForTest } from "../_internal/toaster/toaster-root";
import { ToastTimer } from "../_internal/toaster/timer-controller";
import { collapsedLayout, expandedLayout } from "../_internal/toaster/stacking";
import { TulparToast } from "./tulpar-toast";
import type { ToastAction } from "./tulpar-toast";

// ─── Public types ─────────────────────────────────────────────────────────────

export type DismissReason = "timeout" | "user" | "action" | "programmatic" | "swipe";

export type { Location };
export type { ToastAction };

export interface ToastOptions {
  /** Semantic tone variant. Default: 'info' */
  tone?: "info" | "success" | "warning" | "danger" | "custom";
  /** Custom tone: brand family name or raw CSS color */
  color?: string;
  /** Custom tone surface override */
  bg?: string;
  /** Custom tone accent override */
  accent?: string;
  /** Custom tone on-surface text override */
  text?: string;
  /** High-contrast escalation (danger only) */
  highContrast?: boolean;
  /** Alias for the positional message arg (used in update) */
  title?: string;
  /** Description / body text */
  description?: string;
  /** Icon: built-in name | raw SVG | emoji | false = no icon */
  icon?: string | false;
  /** Action buttons; set as property (cannot be an HTML attribute) */
  actions?: ToastAction[];
  /** Show the × close button. Default: true */
  closable?: boolean;
  /** Auto-dismiss countdown ring. Default: true */
  timer?: boolean;
  /** Auto-dismiss duration in ms. Default: 5000. 0 = persistent */
  duration?: number;
  /** Ring visual style. Default: 'track' */
  timerStyle?: "track" | "soft";
  /** Toast location. Default: toaster global default ('bottom-right') */
  location?: Location;
  /** Caller-supplied id for update / dedupe */
  id?: string;
  /** Fires on any dismiss with the reason */
  onDismiss?: (reason: DismissReason) => void;
  /** Fires specifically on timeout expiry (before onDismiss) */
  onAutoClose?: () => void;
}

export interface MessageOptions {
  /** Semantic tone. Default: 'info' */
  tone?: "info" | "success" | "warning" | "danger";
  /** Icon: built-in name | raw SVG | emoji | false = no icon */
  icon?: string | false;
  /** Auto-dismiss duration in ms. Default: 3000 */
  duration?: number;
  /** Merge duplicate (same tone+text) into a ×N count. Default: true */
  group?: boolean;
  /** Location. Default: 'top-center' */
  location?: Location;
  /** Caller-supplied id */
  id?: string;
}

export interface ToasterDefaults {
  /** Default toast location. Default: 'bottom-right'. Message is always 'top-center'. */
  location?: Location;
  /** Max visible toasts per location. Default: 3 */
  maxVisible?: number;
  /** Always-expanded list (no collapse). Default: false */
  expand?: boolean;
  /** Global default toast duration in ms. Default: 5000 */
  duration?: number;
  /** Default ring visual style. Default: 'track' */
  timerStyle?: "track" | "soft";
}

// ─── Internal state ───────────────────────────────────────────────────────────

/** Per-toast runtime entry tracked by the service */
interface ToastEntry {
  id: string;
  location: Location;
  element: TulparToast;
  timer: ToastTimer | null;
  onDismiss?: (reason: DismissReason) => void;
}

/** Singleton mutable defaults */
let _defaults: Required<ToasterDefaults> = {
  location: "bottom-right",
  maxVisible: 3,
  expand: false,
  duration: 5000,
  timerStyle: "track",
};

/** One queue per run (reset between tests). */
let _queue: ToasterQueue = new ToasterQueue({ maxVisible: _defaults.maxVisible });

/** Fast lookup from id → ToastEntry */
const _entries = new Map<string, ToastEntry>();

// ─── Internal helpers ─────────────────────────────────────────────────────────

function _createQueue(): void {
  _queue = new ToasterQueue({ maxVisible: _defaults.maxVisible });
}

/**
 * Apply stacking transforms to all elements in a location.
 * Uses collapsedLayout (default) or expandedLayout when expand=true.
 */
function _applyStacking(location: Location): void {
  const container = getLocationContainer(location);
  const visible = _queue.visible(location);
  const elements = visible.map((r) => _entries.get(r.id)?.element).filter(Boolean) as TulparToast[];

  if (_defaults.expand) {
    // Expanded: measure actual heights
    const heights = elements.map((el) => el.offsetHeight || 60);
    const entries = expandedLayout(heights, location, { gap: 8 });
    elements.forEach((el, i) => {
      const entry = entries[i];
      if (entry) {
        el.style.transform = entry.transform;
        el.style.opacity = String(entry.opacity);
        el.style.zIndex = String(entry.zIndex);
        el.style.display = entry.visible ? "" : "none";
      }
    });
  } else {
    // Collapsed (default)
    elements.forEach((el, i) => {
      const entry = collapsedLayout(i, location, { maxVisible: _defaults.maxVisible });
      el.style.transform = entry.transform;
      el.style.opacity = String(entry.opacity);
      el.style.zIndex = String(entry.zIndex);
      el.style.display = entry.visible ? "" : "none";
    });
  }

  // Ensure the container itself exists (creates the portal root if needed)
  void container;
}

/**
 * Perform the full dismiss lifecycle for a toast entry:
 * 1. Remove from queue
 * 2. Clear timer
 * 3. Remove element from DOM
 * 4. Re-apply stacking for the location
 * 5. Fire onDismiss callback
 * 6. Remove from _entries
 */
function _doRemove(id: string, reason: DismissReason): void {
  const entry = _entries.get(id);
  if (!entry) return;

  _queue.dismiss(id);
  entry.timer?.clear();

  if (entry.element.parentElement) {
    entry.element.parentElement.removeChild(entry.element);
  }

  _applyStacking(entry.location);

  // Check if a queued toast should now be visible (queue promotion already done by _queue.dismiss)
  // — promote any queued entries not yet in DOM
  _promoteQueued(entry.location);

  _entries.delete(id);

  entry.onDismiss?.(reason);
}

/**
 * Promote queued (overflow) records into DOM if they are now visible according to the queue.
 * After `_queue.dismiss()` the queue may have promoted an entry — we need to mount its element.
 */
function _promoteQueued(location: Location): void {
  const visible = _queue.visible(location);
  for (const record of visible) {
    const entry = _entries.get(record.id);
    if (!entry) continue;
    const container = getLocationContainer(location);
    if (!entry.element.parentElement) {
      container.appendChild(entry.element);
    }
  }
  _applyStacking(location);
}

/**
 * Create and mount a <tulpar-toast> element for the given options + location,
 * add it to the queue, start its timer, and wire event listeners.
 * Returns the toast id.
 */
function _mountToast(
  title: string,
  opts: ToastOptions,
  variant: "toast" | "message",
): string {
  const location: Location =
    variant === "message"
      ? (opts.location ?? "top-center")
      : (opts.location ?? _defaults.location);

  const duration =
    opts.duration !== undefined
      ? opts.duration
      : variant === "message"
        ? 3000
        : _defaults.duration;

  const timerStyle = opts.timerStyle ?? _defaults.timerStyle;
  const tone = opts.tone ?? "info";
  const closable = variant === "message" ? false : (opts.closable ?? true);
  const timer = opts.timer ?? (duration > 0);

  // ── Grouping (message only) ─────────────────────────────────────────────────
  const group = variant === "message" ? (opts as MessageOptions).group !== false : false;
  const groupKey = group ? `${tone}::${title}` : undefined;

  const enqueuedId = _queue.enqueue({
    location,
    data: { title, opts, variant },
    id: opts.id,
    groupKey,
  });

  // ── Grouped? → update existing element ─────────────────────────────────────
  if (enqueuedId !== opts.id && _entries.has(enqueuedId)) {
    // The queue merged into existing; bump count on the live element
    const existing = _entries.get(enqueuedId)!;
    (existing.element as TulparToast & { count: number }).count++;
    // update the data-count attr imperatively (no requestUpdate loop)
    existing.element.setAttribute("data-count", String((existing.element as TulparToast & { count: number }).count));
    return enqueuedId;
  }

  // Also handle the case where caller supplied an id that already exists (dedupe)
  if (opts.id && _entries.has(opts.id)) {
    const existing = _entries.get(opts.id)!;
    (existing.element as TulparToast & { count: number }).count++;
    existing.element.setAttribute("data-count", String((existing.element as TulparToast & { count: number }).count));
    return opts.id;
  }

  const id = enqueuedId;

  // ── Create the element ─────────────────────────────────────────────────────
  // Use `new TulparToast()` rather than `document.createElement("tulpar-toast")`
  // to avoid NotSupportedError in some WTR/Chromium sandboxing contexts.
  const el = new TulparToast();

  // Set properties (not attributes for complex types)
  el.tone = tone;
  el.heading = title;
  if (opts.description !== undefined) el.description = opts.description;
  if (opts.color !== undefined) el.color = opts.color;
  if (opts.bg !== undefined) el.bg = opts.bg;
  if (opts.accent !== undefined) el.accent = opts.accent;
  if (opts.text !== undefined) el.text = opts.text;
  if (opts.highContrast !== undefined) el.highContrast = opts.highContrast;
  el.closable = closable;
  el.timer = timer;
  el.duration = duration;
  el.timerStyle = timerStyle;

  // Icon
  if (opts.icon === false) {
    el.iconProp = false;
  } else if (opts.icon !== undefined) {
    el.icon = opts.icon;
  }

  // Actions (toast only — message is minimal)
  if (variant === "toast" && opts.actions && opts.actions.length > 0) {
    el.actions = opts.actions;
  }

  // ── Timer ────────────────────────────────────────────────────────────────────
  let toastTimer: ToastTimer | null = null;
  if (timer && duration > 0) {
    toastTimer = new ToastTimer({
      duration,
      onAutoClose: opts.onAutoClose,
      onExpire: () => {
        _doRemove(id, "timeout");
      },
    });
  }

  // ── Hover / focus pause ───────────────────────────────────────────────────────
  el.addEventListener("pointerenter", () => { toastTimer?.pause(); });
  el.addEventListener("pointerleave", () => { toastTimer?.resume(); });
  el.addEventListener("focusin", () => { toastTimer?.pause(); });
  el.addEventListener("focusout", () => { toastTimer?.resume(); });

  // ── tulpar-dismiss event ──────────────────────────────────────────────────────
  el.addEventListener("tulpar-dismiss", (e: Event) => {
    const ce = e as CustomEvent<{ reason: string }>;
    const reason = (ce.detail?.reason ?? "user") as DismissReason;
    _doRemove(id, reason);
  });

  // ── Register entry ───────────────────────────────────────────────────────────
  const entry: ToastEntry = {
    id,
    location,
    element: el,
    timer: toastTimer,
    onDismiss: opts.onDismiss,
  };
  _entries.set(id, entry);

  // ── Mount into DOM ───────────────────────────────────────────────────────────
  // Only mount if it is in the visible slice (not queued overflow).
  // Prepend (insertBefore firstChild) so the newest toast is at DOM index 0,
  // matching the queue's newest-first ordering used by _applyStacking.
  const visibleIds = _queue.visible(location).map((r) => r.id);
  if (visibleIds.includes(id)) {
    const container = getLocationContainer(location);
    container.insertBefore(el, container.firstChild);
  }

  // ── Apply stacking ───────────────────────────────────────────────────────────
  _applyStacking(location);

  return id;
}

// ─── toast() ─────────────────────────────────────────────────────────────────

/**
 * Show an imperative toast notification. Returns the toast id.
 */
function _toast(message: string, opts: ToastOptions = {}): string {
  return _mountToast(message, opts, "toast");
}

/** Show a success toast */
_toast.success = (msg: string, opts: ToastOptions = {}): string =>
  _mountToast(msg, { ...opts, tone: "success" }, "toast");

/** Show an info toast */
_toast.info = (msg: string, opts: ToastOptions = {}): string =>
  _mountToast(msg, { ...opts, tone: "info" }, "toast");

/** Show a warning toast */
_toast.warning = (msg: string, opts: ToastOptions = {}): string =>
  _mountToast(msg, { ...opts, tone: "warning" }, "toast");

/** Show a danger toast */
_toast.danger = (msg: string, opts: ToastOptions = {}): string =>
  _mountToast(msg, { ...opts, tone: "danger" }, "toast");

/** Show a custom-tone toast */
_toast.custom = (msg: string, opts: ToastOptions = {}): string =>
  _mountToast(msg, { ...opts, tone: "custom" }, "toast");

/**
 * Update a live toast's options in place. Mutates the DOM element and queue record.
 * No-op for unknown ids.
 */
_toast.update = (id: string, partialOpts: Partial<ToastOptions>): void => {
  const entry = _entries.get(id);
  if (!entry) return;

  // Update queue record (data merge)
  _queue.update(id, partialOpts as Record<string, unknown>);

  // Mutate the live element
  const el = entry.element;
  if (partialOpts.title !== undefined) el.heading = partialOpts.title;
  if (partialOpts.description !== undefined) el.description = partialOpts.description;
  if (partialOpts.tone !== undefined) el.tone = partialOpts.tone;
  if (partialOpts.color !== undefined) el.color = partialOpts.color;
  if (partialOpts.bg !== undefined) el.bg = partialOpts.bg;
  if (partialOpts.accent !== undefined) el.accent = partialOpts.accent;
  if (partialOpts.text !== undefined) el.text = partialOpts.text;
  if (partialOpts.highContrast !== undefined) el.highContrast = partialOpts.highContrast;
  if (partialOpts.closable !== undefined) el.closable = partialOpts.closable;
  if (partialOpts.timer !== undefined) el.timer = partialOpts.timer;
  if (partialOpts.duration !== undefined) el.duration = partialOpts.duration;
  if (partialOpts.timerStyle !== undefined) el.timerStyle = partialOpts.timerStyle;
  if (partialOpts.icon === false) {
    el.iconProp = false;
  } else if (partialOpts.icon !== undefined) {
    el.icon = partialOpts.icon;
  }
  if (partialOpts.actions !== undefined) el.actions = partialOpts.actions;
};

/**
 * Dismiss a toast by id, or dismiss ALL toasts when id is omitted.
 */
_toast.dismiss = (id?: string): void => {
  if (id !== undefined) {
    _doRemove(id, "programmatic");
  } else {
    // Dismiss all — collect ids first to avoid mutation during iteration
    const allIds = Array.from(_entries.keys());
    for (const eid of allIds) {
      _doRemove(eid, "programmatic");
    }
  }
};

/**
 * Set global toaster defaults. Affects all subsequent toast() calls.
 * Rebuilds the queue when maxVisible changes.
 */
_toast.setDefaults = (defaults: ToasterDefaults): void => {
  const prevMaxVisible = _defaults.maxVisible;
  _defaults = { ..._defaults, ...defaults };
  if (defaults.maxVisible !== undefined && defaults.maxVisible !== prevMaxVisible) {
    _createQueue();
  }
};

/** The public `toast` export */
export const toast = _toast;

// ─── message() ───────────────────────────────────────────────────────────────

/**
 * Show a minimal message notification (top-center, grouped, no actions/close).
 */
function _message(text: string, opts: MessageOptions = {}): string {
  return _mountToast(text, { ...opts, tone: opts.tone ?? "info" }, "message");
}

_message.success = (text: string, opts: MessageOptions = {}): string =>
  _mountToast(text, { ...opts, tone: "success" }, "message");

_message.info = (text: string, opts: MessageOptions = {}): string =>
  _mountToast(text, { ...opts, tone: "info" }, "message");

_message.warning = (text: string, opts: MessageOptions = {}): string =>
  _mountToast(text, { ...opts, tone: "warning" }, "message");

_message.danger = (text: string, opts: MessageOptions = {}): string =>
  _mountToast(text, { ...opts, tone: "danger" }, "message");

/**
 * Dismiss a message by id, or dismiss ALL messages when id is omitted.
 * Note: only dismisses entries at top-center (message default) unless they
 * were placed at a custom location.
 */
_message.dismiss = (id?: string): void => {
  if (id !== undefined) {
    _doRemove(id, "programmatic");
  } else {
    const allIds = Array.from(_entries.keys());
    for (const eid of allIds) {
      _doRemove(eid, "programmatic");
    }
  }
};

/** The public `message` export */
export const message = _message;

// ─── Test-only reset ──────────────────────────────────────────────────────────

/**
 * Clear all internal state: queue, timers, DOM, and reset defaults.
 * Call in `afterEach` in tests.
 */
export function __resetToastServiceForTest(): void {
  // Clear all timers and remove all elements
  for (const entry of _entries.values()) {
    entry.timer?.clear();
    if (entry.element.parentElement) {
      entry.element.parentElement.removeChild(entry.element);
    }
  }
  _entries.clear();

  // Reset queue and defaults
  _defaults = {
    location: "bottom-right",
    maxVisible: 3,
    expand: false,
    duration: 5000,
    timerStyle: "track",
  };
  _createQueue();

  // Reset portal root
  __resetToasterRootForTest();
}
