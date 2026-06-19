import { expect } from "@open-wc/testing";
import { ToastTimer } from "./timer-controller";

/** Real-timer wait — matches the delay-controller.test.ts approach. */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("ToastTimer", () => {
  // ─── basic expiry ──────────────────────────────────────────────────────────

  it("fires onExpire after the specified duration", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: 50, onExpire: () => { expired = true; } });
    await wait(30);
    expect(expired).to.equal(false);
    await wait(40);
    expect(expired).to.equal(true);
    t.clear();
  });

  it("fires onAutoClose before onExpire on timeout", async () => {
    const order: string[] = [];
    const t = new ToastTimer({
      duration: 50,
      onAutoClose: () => { order.push("autoClose"); },
      onExpire: () => { order.push("expire"); },
    });
    await wait(80);
    expect(order).to.deep.equal(["autoClose", "expire"]);
    t.clear();
  });

  it("fires onExpire even when onAutoClose is omitted", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: 50, onExpire: () => { expired = true; } });
    await wait(80);
    expect(expired).to.equal(true);
    t.clear();
  });

  // ─── pause / resume ────────────────────────────────────────────────────────

  it("does not fire while paused", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: 80, onExpire: () => { expired = true; } });
    await wait(30);
    t.pause();
    await wait(80); // would have expired without pause
    expect(expired).to.equal(false);
    t.clear();
  });

  it("resumes from remaining time after pause", async () => {
    let expired = false;
    // duration 100ms; pause at ~40ms → remaining ≈ 60ms
    const t = new ToastTimer({ duration: 100, onExpire: () => { expired = true; } });
    await wait(40);
    t.pause();
    await wait(20); // idle — still paused
    expect(expired).to.equal(false);
    t.resume();
    // After resume it should fire in ~60ms more; allow generous margin for CI.
    await wait(100);
    expect(expired).to.equal(true);
    t.clear();
  });

  it("total wall time before expiry is ≈ duration even with a pause gap", async () => {
    // Total wall clock will be ≈ duration (100ms) + pause gap (50ms)
    // but from the timer's perspective only 100ms of running time passes.
    const start = Date.now();
    let expiredAt = -1;
    const duration = 100;
    const pauseGapMs = 50;
    const t = new ToastTimer({
      duration,
      onExpire: () => { expiredAt = Date.now() - start; },
    });
    await wait(40); // let 40ms of running time pass
    t.pause();
    await wait(pauseGapMs); // idle for 50ms
    t.resume();
    await wait(duration + 30); // generous
    expect(expiredAt).to.be.greaterThan(0);
    // Wall time ≈ duration + pauseGap; must be ≥ duration + pauseGap - small jitter
    expect(expiredAt).to.be.greaterThan(duration + pauseGapMs - 30);
    // And should not have fired way too early (without the pause gap accounting)
    expect(expiredAt).to.be.greaterThan(duration - 20);
    t.clear();
  });

  it("double-pause is idempotent — resume fires only once after a single resume", async () => {
    let count = 0;
    const t = new ToastTimer({ duration: 100, onExpire: () => { count++; } });
    await wait(20);
    t.pause();
    t.pause(); // second pause: no-op
    t.resume();
    await wait(150);
    expect(count).to.equal(1);
    t.clear();
  });

  it("double-resume is idempotent — does not double-schedule", async () => {
    let count = 0;
    const t = new ToastTimer({ duration: 100, onExpire: () => { count++; } });
    await wait(20);
    t.pause();
    t.resume();
    t.resume(); // second resume: no-op
    await wait(150);
    expect(count).to.equal(1);
    t.clear();
  });

  // ─── clear / dispose ───────────────────────────────────────────────────────

  it("clear() cancels the timer — onExpire never fires", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: 50, onExpire: () => { expired = true; } });
    await wait(20);
    t.clear();
    await wait(60);
    expect(expired).to.equal(false);
  });

  it("clear() while paused does not fire on resume", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: 80, onExpire: () => { expired = true; } });
    await wait(20);
    t.pause();
    t.clear();
    t.resume(); // no-op after clear
    await wait(100);
    expect(expired).to.equal(false);
  });

  it("clear() is idempotent — calling twice does not throw", () => {
    const t = new ToastTimer({ duration: 100, onExpire: () => {} });
    expect(() => { t.clear(); t.clear(); }).to.not.throw();
  });

  // ─── persistent (duration 0 / timer:false) ─────────────────────────────────

  it("duration 0 → never fires", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: 0, onExpire: () => { expired = true; } });
    await wait(50);
    expect(expired).to.equal(false);
    t.clear();
  });

  it("persistent:true → never fires regardless of duration value", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: 50, persistent: true, onExpire: () => { expired = true; } });
    await wait(100);
    expect(expired).to.equal(false);
    t.clear();
  });

  it("pause/resume are safe no-ops when persistent", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: 50, persistent: true, onExpire: () => { expired = true; } });
    expect(() => { t.pause(); t.resume(); }).to.not.throw();
    await wait(100);
    expect(expired).to.equal(false);
    t.clear();
  });

  it("negative duration → treated as persistent, never fires", async () => {
    let expired = false;
    const t = new ToastTimer({ duration: -1, onExpire: () => { expired = true; } });
    await wait(50);
    expect(expired).to.equal(false);
    t.clear();
  });
});
