/**
 * Shared open/close delay coordinator for hover-driven overlays (primarily
 * tooltips, but reusable by any hover overlay).
 *
 * Behaviour:
 * - The first open waits `delayOpen` (default 400ms) — avoids flashing tooltips
 *   on incidental pointer passes.
 * - Once any overlay has opened, a "skip-delay grace" window (default 300ms)
 *   begins: while it is active, subsequent opens for *other* keys fire
 *   immediately, so moving between adjacent triggers feels instant.
 * - Closes wait `delayClose` (default 120ms) and are cancellable, letting a
 *   hover-bridge keep the surface open when the pointer briefly leaves.
 *
 * The controller is a module singleton (timers must be coordinated globally),
 * with injectable durations via `configureOverlayDelays` for fast, deterministic
 * tests.
 */

export interface OverlayDelayConfig {
  delayOpen: number;
  delayClose: number;
  skipDelayGrace: number;
}

const DEFAULTS: OverlayDelayConfig = {
  delayOpen: 400,
  delayClose: 120,
  skipDelayGrace: 300,
};

type TimerId = ReturnType<typeof setTimeout>;

class OverlayDelayController {
  private config: OverlayDelayConfig = { ...DEFAULTS };
  /** Pending timer per key (open or close). Only one is pending at a time. */
  private timers = new Map<string, TimerId>();
  /** Timestamp of the most recent successful open (any key), for grace logic. */
  private lastOpenAt = -Infinity;

  configure(partial: Partial<OverlayDelayConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  /** Open `key`, immediately if within the skip-delay grace window. */
  requestOpen(key: string, fn: () => void): void {
    this.clearTimer(key);
    const withinGrace = performance.now() - this.lastOpenAt < this.config.skipDelayGrace;
    if (withinGrace) {
      this.lastOpenAt = performance.now();
      fn();
      return;
    }
    const id = setTimeout(() => {
      this.timers.delete(key);
      this.lastOpenAt = performance.now();
      fn();
    }, this.config.delayOpen);
    this.timers.set(key, id);
  }

  /** Close `key` after `delayClose`; cancellable via `cancel(key)`. */
  requestClose(key: string, fn: () => void): void {
    this.clearTimer(key);
    const id = setTimeout(() => {
      this.timers.delete(key);
      fn();
    }, this.config.delayClose);
    this.timers.set(key, id);
  }

  /** Cancel any pending open/close for `key`. */
  cancel(key: string): void {
    this.clearTimer(key);
  }

  /** Test-only: clear all pending timers and reset the grace clock. */
  reset(): void {
    for (const id of this.timers.values()) clearTimeout(id);
    this.timers.clear();
    this.lastOpenAt = -Infinity;
    this.config = { ...DEFAULTS };
  }

  private clearTimer(key: string): void {
    const existing = this.timers.get(key);
    if (existing !== undefined) {
      clearTimeout(existing);
      this.timers.delete(key);
    }
  }
}

export const overlayDelay = new OverlayDelayController();

/** Override the open/close/grace durations (primarily for tests). */
export function configureOverlayDelays(partial: Partial<OverlayDelayConfig>): void {
  overlayDelay.configure(partial);
}
