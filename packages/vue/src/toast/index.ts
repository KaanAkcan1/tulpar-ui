/**
 * @tulpar-ui/vue — Toast plugin + composables (Task 6.1)
 *
 * ## Imperative API (composables)
 *
 * ```ts
 * import { useTulparToast, useTulparMessage } from "@tulpar-ui/vue";
 *
 * const toast = useTulparToast();
 * toast.success("Kaydedildi");
 * toast.danger("Yükleme başarısız", { action: { label: "Tekrar dene", onClick: retry } });
 *
 * const msg = useTulparMessage();
 * msg.success("Dosya yüklendi");
 * ```
 *
 * ## Plugin (idiomatic entry point)
 *
 * ```ts
 * // main.ts
 * import { TulparToastPlugin } from "@tulpar-ui/vue";
 * app.use(TulparToastPlugin);
 * // Optionally set global defaults:
 * app.use(TulparToastPlugin, { location: "top-right", maxVisible: 5 });
 * ```
 *
 * `app.use(TulparToastPlugin)` is the idiomatic entry point per spec §8 (Vue),
 * but `useTulparToast()` / `useTulparMessage()` work even without it — importing
 * `@tulpar-ui/core/toast` side-effect-registers the `<tulpar-toast>` element and
 * lazily mounts the `<tulpar-toaster>` region on the first service call.
 *
 * ## Vite config reminder
 *
 * Apps consuming `@tulpar-ui/vue` must configure:
 * ```ts
 * vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("tulpar-") } } })
 * ```
 * The toaster mounts `<tulpar-toast>` elements to `document.body` via core (outside Vue's
 * compiler), so this is mainly relevant for the declarative `<TulparToast>` SFC (Task 6.2),
 * but the flag must be set for the whole app to avoid Vue treating any `tulpar-*` tag as an
 * unknown component.
 */

import type { App, Plugin } from "vue";
import { toast, message } from "@tulpar-ui/core/toast";
export type {
  ToastOptions,
  MessageOptions,
  ToasterDefaults,
  DismissReason,
  ToastPromiseMsgs,
  /** Re-exported as ToastLocation to avoid ambiguity with the browser's native `Location` */
  ToastLocation,
} from "@tulpar-ui/core/toast";

// ─── useTulparToast ───────────────────────────────────────────────────────────

/**
 * Returns the imperative toast service. Delegates every call to the
 * framework-agnostic `toast` object from `@tulpar-ui/core/toast`.
 *
 * Can be called from anywhere — setup(), event handlers, stores, utils.
 * Does not require `TulparToastPlugin` to be installed (the toaster
 * auto-mounts on the first call), but `app.use(TulparToastPlugin)` is
 * the idiomatic entry point for apps that want explicit control.
 */
export function useTulparToast() {
  return {
    /**
     * Show a toast with full options. Alias for the base `toast(msg, opts)` call.
     * Matches `TulparToastService.show()` in the Angular wrapper for parity.
     * Returns the toast id.
     */
    show(message: string, opts?: Parameters<typeof toast>[1]) {
      return toast(message, opts);
    },
    /** Show a success toast. Returns the toast id. */
    success(message: string, opts?: Parameters<typeof toast.success>[1]) {
      return toast.success(message, opts);
    },
    /** Show an info toast. Returns the toast id. */
    info(message: string, opts?: Parameters<typeof toast.info>[1]) {
      return toast.info(message, opts);
    },
    /** Show a warning toast. Returns the toast id. */
    warning(message: string, opts?: Parameters<typeof toast.warning>[1]) {
      return toast.warning(message, opts);
    },
    /** Show a danger toast. Returns the toast id. */
    danger(message: string, opts?: Parameters<typeof toast.danger>[1]) {
      return toast.danger(message, opts);
    },
    /**
     * Show a custom-tone toast. Returns the toast id.
     * When `message` is an `HTMLElement`, it is appended as a light-DOM child of
     * the toast host and projects into the element's default slot for rich content.
     */
    custom(message: string | HTMLElement, opts?: Parameters<typeof toast.custom>[1]) {
      return toast.custom(message, opts);
    },
    /**
     * Show a loading toast immediately, update it to success/error when
     * `promise` settles. Returns the **original** promise so callers can
     * `await`/`catch` it — the toast update is a side-effect, never a swallow.
     */
    promise<T>(
      promise: Promise<T>,
      msgs: Parameters<typeof toast.promise>[1],
      opts?: Parameters<typeof toast.promise>[2],
    ): Promise<T> {
      return toast.promise(promise, msgs, opts);
    },
    /** Update a live toast's options in place. No-op for unknown ids. */
    update(id: string, opts: Parameters<typeof toast.update>[1]) {
      toast.update(id, opts);
    },
    /**
     * Dismiss a toast by id, or dismiss ALL toasts when id is omitted.
     * Fires `onDismiss` with `reason:'programmatic'`.
     */
    dismiss(id?: string) {
      toast.dismiss(id);
    },
    /** Set global toaster defaults affecting all subsequent toast() calls. */
    setDefaults(defaults: Parameters<typeof toast.setDefaults>[0]) {
      toast.setDefaults(defaults);
    },
  };
}

// ─── useTulparMessage ─────────────────────────────────────────────────────────

/**
 * Returns the imperative message service. Messages are top-center pills,
 * auto-dismiss (3 s), and grouped by (tone + text) by default. For richer
 * content (actions, close button, custom durations) use `useTulparToast()`.
 *
 * Can be called from anywhere — setup(), event handlers, stores, utils.
 */
export function useTulparMessage() {
  return {
    /**
     * Show a message with full options. Alias for the base `message(text, opts)` call.
     * Matches `TulparMessageService.show()` in the Angular wrapper for parity.
     * Returns the message id.
     */
    show(text: string, opts?: Parameters<typeof message>[1]) {
      return message(text, opts);
    },
    /** Show a success message. Returns the message id. */
    success(text: string, opts?: Parameters<typeof message.success>[1]) {
      return message.success(text, opts);
    },
    /** Show an info message. Returns the message id. */
    info(text: string, opts?: Parameters<typeof message.info>[1]) {
      return message.info(text, opts);
    },
    /** Show a warning message. Returns the message id. */
    warning(text: string, opts?: Parameters<typeof message.warning>[1]) {
      return message.warning(text, opts);
    },
    /** Show a danger message. Returns the message id. */
    danger(text: string, opts?: Parameters<typeof message.danger>[1]) {
      return message.danger(text, opts);
    },
    /**
     * Dismiss a message by id, or dismiss ALL messages when id is omitted.
     */
    dismiss(id?: string) {
      message.dismiss(id);
    },
  };
}

// ─── TulparToastPlugin ────────────────────────────────────────────────────────

/**
 * Vue plugin for `app.use(...)`. Registers the toast system with optional
 * global defaults.
 *
 * ```ts
 * app.use(TulparToastPlugin);
 * app.use(TulparToastPlugin, { location: "top-right", maxVisible: 5 });
 * ```
 *
 * The toaster auto-mounts on the first `toast.*()` call even without this
 * plugin — `app.use` is the idiomatic explicit-setup path, not a requirement.
 * Its install hook also ensures the core module (and `<tulpar-toast>` element
 * registration) is loaded at app startup rather than lazily on first use.
 */
export const TulparToastPlugin: Plugin<Parameters<typeof toast.setDefaults>[0] | undefined> = {
  install(_app: App, defaults?: Parameters<typeof toast.setDefaults>[0]) {
    if (defaults !== undefined) {
      toast.setDefaults(defaults);
    }
  },
};
