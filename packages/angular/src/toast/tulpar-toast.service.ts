/**
 * tulpar-toast.service.ts — Angular DI wrappers for the core toast + message services.
 *
 * # Architecture
 * This module exposes two injectables:
 *   - `TulparToastService`   → delegates to core `toast` (rich toasts, stacking, promise)
 *   - `TulparMessageService` → delegates to core `message` (lightweight, grouped, top-center)
 *
 * Both are `providedIn: 'root'` so they work without any provider setup.
 * `provideTulparToast()` is a convenience provider function that enables explicit app-level
 * configuration (e.g. calling `setDefaults` on import) — pattern matches the spec §8 contract.
 *
 * # Side effects
 * Importing this module transitively imports `@tulpar-ui/core/toast`, which:
 * 1. Registers the `<tulpar-toast>` custom element via Lit's `customElements.define`.
 * 2. The toaster auto-creates and mounts its portal root on the first `toast()`/`message()` call.
 *    No explicit `<tulpar-toast-ng>` element is required for the imperative path.
 *
 * # Queue state signal
 * The core toast service is a plain imperative singleton; it does not expose a reactive
 * active-toast list. Wrapping it into an Angular `signal()` would require either polling or
 * a custom event bus not provided by core — both are out of scope for Task 5.1.
 * When core exposes a reactive interface, a `activeToasts` computed signal can be added here
 * without breaking the existing API surface.
 *
 * NO RxJS — no Observable, Subject, BehaviorSubject, or 'rxjs' imports anywhere in this file.
 */

import { Injectable, makeEnvironmentProviders } from "@angular/core";
import type { EnvironmentProviders } from "@angular/core";

import { toast, message } from "@tulpar-ui/core/toast";
import type {
  ToastOptions,
  MessageOptions,
  ToasterDefaults,
  DismissReason,
  ToastLocation,
  ToastPromiseMsgs,
} from "@tulpar-ui/core/toast";

// Re-export core types so consumers don't need to import from core directly.
export type { ToastOptions, MessageOptions, ToasterDefaults, DismissReason, ToastLocation };
export type { ToastPromiseMsgs };

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Angular injectable wrapper for the core `toast` imperative service.
 *
 * Usage (inject in a component or service):
 * ```ts
 * const toast = inject(TulparToastService);
 * toast.success('Kaydedildi');
 * await toast.promise(save(), { loading: 'Kaydediliyor…', success: 'Tamam', error: 'Hata' });
 * ```
 *
 * All methods return the toast id (string) except `update`, `dismiss`, `setDefaults`
 * (void) and `promise` (returns the original Promise — NO RxJS Observable).
 */
@Injectable({ providedIn: "root" })
export class TulparToastService {
  /**
   * Show a toast with full options. Equivalent to `toast(message, opts)`.
   * Prefer the typed sugar methods (`success`, `info`, `warning`, `danger`, `custom`)
   * for common cases.
   */
  show(msg: string, opts: ToastOptions = {}): string {
    return toast(msg, opts);
  }

  /** Show a success toast. */
  success(msg: string, opts: ToastOptions = {}): string {
    return toast.success(msg, opts);
  }

  /** Show an info toast. */
  info(msg: string, opts: ToastOptions = {}): string {
    return toast.info(msg, opts);
  }

  /** Show a warning toast. */
  warning(msg: string, opts: ToastOptions = {}): string {
    return toast.warning(msg, opts);
  }

  /** Show a danger toast. */
  danger(msg: string, opts: ToastOptions = {}): string {
    return toast.danger(msg, opts);
  }

  /** Show a custom-tone toast. `opts.color` accepts a brand family name or raw CSS color. */
  custom(msg: string, opts: ToastOptions = {}): string {
    return toast.custom(msg, opts);
  }

  /**
   * Show a loading toast immediately and update it when the promise settles.
   *
   * - While pending: spinner icon, persistent, not closable.
   * - On resolve: `tone:'success'`, `msgs.success` text (string or fn receiving the value).
   * - On reject: `tone:'danger'`, `msgs.error` text (string or fn receiving the reason), persistent.
   *
   * Returns the ORIGINAL promise so callers can `await` it or `.catch()` it.
   * The toast update is a side effect — it never swallows rejections.
   * NO RxJS — do not wrap this in an Observable.
   */
  promise<T>(
    p: Promise<T>,
    msgs: ToastPromiseMsgs<T>,
    opts: Omit<ToastOptions, "tone" | "icon" | "closable" | "timer"> = {},
  ): Promise<T> {
    return toast.promise(p, msgs, opts);
  }

  /**
   * Update a live toast's options in place. No-op for unknown ids.
   * Use to mutate the toast shown by `promise()` or any other call.
   */
  update(id: string, partialOpts: Partial<ToastOptions>): void {
    toast.update(id, partialOpts);
  }

  /**
   * Dismiss a toast by id, or dismiss ALL toasts when id is omitted.
   */
  dismiss(id?: string): void {
    toast.dismiss(id);
  }

  /**
   * Set global toaster defaults. Affects all subsequent `toast()` calls.
   * Rebuilds the internal queue when `maxVisible` changes.
   */
  setDefaults(defaults: ToasterDefaults): void {
    toast.setDefaults(defaults);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Angular injectable wrapper for the core `message` imperative service.
 *
 * Messages are minimal: auto-dismiss (3s), grouped by tone+text, top-center, no actions,
 * no close button. Use `TulparToastService` for richer feedback.
 *
 * Usage:
 * ```ts
 * const msg = inject(TulparMessageService);
 * msg.success('Kaydedildi');
 * ```
 */
@Injectable({ providedIn: "root" })
export class TulparMessageService {
  /**
   * Show a message with full options. Prefer the typed sugar methods for common cases.
   */
  show(text: string, opts: MessageOptions = {}): string {
    return message(text, opts);
  }

  /** Show a success message. */
  success(text: string, opts: MessageOptions = {}): string {
    return message.success(text, opts);
  }

  /** Show an info message. */
  info(text: string, opts: MessageOptions = {}): string {
    return message.info(text, opts);
  }

  /** Show a warning message. */
  warning(text: string, opts: MessageOptions = {}): string {
    return message.warning(text, opts);
  }

  /** Show a danger message. */
  danger(text: string, opts: MessageOptions = {}): string {
    return message.danger(text, opts);
  }

  /**
   * Dismiss a message by id, or dismiss ALL messages when id is omitted.
   */
  dismiss(id?: string): void {
    message.dismiss(id);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convenience provider function for explicit app-level configuration.
 *
 * Both `TulparToastService` and `TulparMessageService` are `providedIn: 'root'`
 * and work without this function. Use `provideTulparToast()` in `app.config.ts`
 * when you want to:
 *   - Make the dependency explicit in the provider chain for reviewability.
 *   - Set global defaults at app startup (pass them as `setDefaults` opts below
 *     or call `inject(TulparToastService).setDefaults(…)` in an `APP_INITIALIZER`).
 *
 * Example:
 * ```ts
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTulparToast(),
 *     // …
 *   ]
 * };
 * ```
 */
export function provideTulparToast(): EnvironmentProviders {
  return makeEnvironmentProviders([TulparToastService, TulparMessageService]);
}
