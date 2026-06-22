/**
 * Per-toast auto-dismiss countdown controller.
 *
 * A `ToastTimer` tracks the remaining time for a single toast, supports
 * pause/resume (e.g. on hover/focus), and fires `onAutoClose` + `onExpire`
 * in that order when the countdown completes.
 *
 * Timing accuracy:
 * Uses `performance.now()` accounting so that pause gaps are excluded from the
 * elapsed time — the timer picks up exactly from where it left off regardless of
 * how long the pause lasted or how much the JS thread drifted.
 *
 * Lifecycle:
 * - Construction starts the countdown immediately (unless persistent).
 * - `pause()` — freezes remaining time; safe to call multiple times.
 * - `resume()` — restarts the internal `setTimeout` with the remaining time;
 *   no-op if not paused; no-op if already disposed.
 * - `clear()` — cancels without firing callbacks. Idempotent.
 *
 * Persistent mode (`persistent: true` or `duration <= 0`):
 * No timeout is scheduled. `pause()`, `resume()`, and `clear()` are safe no-ops.
 */

export interface ToastTimerOptions {
  /**
   * Countdown length in milliseconds.
   * Values ≤ 0 produce a persistent timer (no auto-dismiss).
   */
  duration: number;
  /**
   * When `true`, the timer never fires regardless of `duration`.
   * Equivalent to `duration: 0` but makes intent explicit at the call site.
   */
  persistent?: boolean;
  /**
   * Fires on timeout expiry, before `onExpire`.
   * Convenience callback for the "author wants to know when the toast timed out"
   * case without having to check the reason in `onDismiss`.
   */
  onAutoClose?: () => void;
  /**
   * The engine's removal hook — fired after `onAutoClose` on timeout expiry.
   * This is the primary signal to the toaster engine to remove the toast record.
   */
  onExpire: () => void;
}

export class ToastTimer {
  /** `true` when no countdown should ever be scheduled. */
  private readonly _persistent: boolean;
  private readonly _duration: number;
  private readonly _onAutoClose: (() => void) | undefined;
  private readonly _onExpire: () => void;

  /** Remaining time in ms at the last pause (or the full duration before start). */
  private _remaining: number;
  /** `performance.now()` snapshot when the current run started. `-1` when paused/cleared. */
  private _startedAt = -1;
  /** The active `setTimeout` handle. `undefined` when paused, cleared, or persistent. */
  private _timerId: ReturnType<typeof setTimeout> | undefined;
  /** `true` once `clear()` has been called; blocks all further scheduling. */
  private _disposed = false;
  /** `true` while the timer is currently paused (but not disposed). */
  private _paused = false;

  constructor(options: ToastTimerOptions) {
    this._duration = options.duration;
    this._persistent = (options.persistent ?? false) || options.duration <= 0;
    this._onAutoClose = options.onAutoClose;
    this._onExpire = options.onExpire;
    this._remaining = options.duration;

    if (!this._persistent) {
      this._schedule(this._duration);
    }
  }

  // ─── public API ────────────────────────────────────────────────────────────

  /**
   * Freeze the countdown at the current remaining time.
   * Safe no-op if already paused, disposed, or persistent.
   */
  pause(): void {
    if (this._persistent || this._disposed || this._paused) return;
    // Snapshot remaining time before clearing the handle.
    this._remaining = this._calcRemaining();
    this._clearHandle();
    this._startedAt = -1;
    this._paused = true;
  }

  /**
   * Resume counting from the remaining time.
   * Safe no-op if not paused, disposed, or persistent.
   */
  resume(): void {
    if (this._persistent || this._disposed || !this._paused) return;
    this._paused = false;
    this._schedule(this._remaining);
  }

  /**
   * Cancel the countdown without firing any callbacks.
   * Idempotent — safe to call multiple times or after `resume()`.
   */
  clear(): void {
    if (this._disposed) return;
    this._disposed = true;
    this._clearHandle();
    this._startedAt = -1;
  }

  // ─── private helpers ───────────────────────────────────────────────────────

  private _schedule(delayMs: number): void {
    this._startedAt = performance.now();
    this._timerId = setTimeout(() => {
      this._timerId = undefined;
      this._startedAt = -1;
      if (this._disposed) return;
      this._disposed = true; // prevent double-fire on any accidental resume
      this._onAutoClose?.();
      this._onExpire();
    }, delayMs);
  }

  private _clearHandle(): void {
    if (this._timerId !== undefined) {
      clearTimeout(this._timerId);
      this._timerId = undefined;
    }
  }

  /**
   * Compute how many ms are still remaining as of `performance.now()`.
   * Returns `_remaining` (the frozen snapshot) if the timer is not currently running.
   */
  private _calcRemaining(): number {
    if (this._startedAt < 0) return this._remaining;
    const elapsed = performance.now() - this._startedAt;
    return Math.max(0, this._remaining - elapsed);
  }
}
