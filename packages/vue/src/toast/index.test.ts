/**
 * Toast plugin + composables smoke tests (Task 6.1).
 *
 * Strategy: spy on the core `toast` and `message` exports so we never actually
 * touch the DOM or timers. happy-dom lacks several APIs the toast engine uses
 * (setPointerCapture, matchMedia) — spying on the core surface avoids all of that
 * and stays within the "smoke test" convention used by other Vue wrappers.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { createApp } from "vue";

// ── Spy on core BEFORE the module under test is imported ──────────────────────
// vi.mock hoisting means the factory runs before any import, so mocking here is safe.
vi.mock("@tulpar-ui/core/toast", () => {
  const toastFn = vi.fn(() => "toast-id-1");
  toastFn.success  = vi.fn(() => "toast-id-2");
  toastFn.info     = vi.fn(() => "toast-id-3");
  toastFn.warning  = vi.fn(() => "toast-id-4");
  toastFn.danger   = vi.fn(() => "toast-id-5");
  toastFn.custom   = vi.fn(() => "toast-id-6");
  toastFn.update   = vi.fn();
  toastFn.dismiss  = vi.fn();
  toastFn.setDefaults = vi.fn();
  toastFn.promise  = vi.fn(
    <T>(p: Promise<T>) => p,
  );

  const messageFn = vi.fn(() => "msg-id-1");
  messageFn.success = vi.fn(() => "msg-id-2");
  messageFn.info    = vi.fn(() => "msg-id-3");
  messageFn.warning = vi.fn(() => "msg-id-4");
  messageFn.danger  = vi.fn(() => "msg-id-5");
  messageFn.dismiss = vi.fn();

  return {
    toast: toastFn,
    message: messageFn,
  };
});

import * as coreMock from "@tulpar-ui/core/toast";
import {
  useTulparToast,
  useTulparMessage,
  TulparToastPlugin,
} from "./index";
import type {
  ToastOptions,
  MessageOptions,
  ToasterDefaults,
  DismissReason,
  ToastLocation,
  ToastPromiseMsgs,
} from "./index";

const coreToast   = coreMock.toast   as ReturnType<typeof vi.fn> & typeof coreMock.toast;
const coreMessage = coreMock.message as ReturnType<typeof vi.fn> & typeof coreMock.message;

afterEach(() => {
  vi.clearAllMocks();
});

// ─── useTulparToast ───────────────────────────────────────────────────────────

describe("useTulparToast()", () => {
  it("returns an object (is defined)", () => {
    const t = useTulparToast();
    expect(t).toBeDefined();
    expect(typeof t).toBe("object");
  });

  it("exposes success / info / warning / danger / custom / update / dismiss / setDefaults / promise", () => {
    const t = useTulparToast();
    expect(typeof t.success).toBe("function");
    expect(typeof t.info).toBe("function");
    expect(typeof t.warning).toBe("function");
    expect(typeof t.danger).toBe("function");
    expect(typeof t.custom).toBe("function");
    expect(typeof t.update).toBe("function");
    expect(typeof t.dismiss).toBe("function");
    expect(typeof t.setDefaults).toBe("function");
    expect(typeof t.promise).toBe("function");
  });

  it("success() delegates to core toast.success", () => {
    const t = useTulparToast();
    const id = t.success("Kayıt başarılı");
    expect(coreToast.success).toHaveBeenCalledWith("Kayıt başarılı", undefined);
    expect(id).toBe("toast-id-2");
  });

  it("success() forwards opts", () => {
    const t = useTulparToast();
    const opts: ToastOptions = { duration: 3000 };
    t.success("msg", opts);
    expect(coreToast.success).toHaveBeenCalledWith("msg", opts);
  });

  it("info() delegates to core toast.info", () => {
    const t = useTulparToast();
    t.info("Info mesajı");
    expect(coreToast.info).toHaveBeenCalledWith("Info mesajı", undefined);
  });

  it("warning() delegates to core toast.warning", () => {
    const t = useTulparToast();
    t.warning("Uyarı");
    expect(coreToast.warning).toHaveBeenCalledWith("Uyarı", undefined);
  });

  it("danger() delegates to core toast.danger", () => {
    const t = useTulparToast();
    t.danger("Hata", { highContrast: true });
    expect(coreToast.danger).toHaveBeenCalledWith("Hata", { highContrast: true });
  });

  it("custom() delegates to core toast.custom", () => {
    const t = useTulparToast();
    t.custom("Özel", { color: "ilay" });
    expect(coreToast.custom).toHaveBeenCalledWith("Özel", { color: "ilay" });
  });

  it("update() delegates to core toast.update", () => {
    const t = useTulparToast();
    t.update("some-id", { title: "Güncellendi" });
    expect(coreToast.update).toHaveBeenCalledWith("some-id", { title: "Güncellendi" });
  });

  it("dismiss(id) delegates to core toast.dismiss with id", () => {
    const t = useTulparToast();
    t.dismiss("abc");
    expect(coreToast.dismiss).toHaveBeenCalledWith("abc");
  });

  it("dismiss() (no id) delegates to core toast.dismiss with no args", () => {
    const t = useTulparToast();
    t.dismiss();
    expect(coreToast.dismiss).toHaveBeenCalledWith(undefined);
  });

  it("setDefaults() delegates to core toast.setDefaults", () => {
    const t = useTulparToast();
    const defaults: ToasterDefaults = { location: "top-right", maxVisible: 5 };
    t.setDefaults(defaults);
    expect(coreToast.setDefaults).toHaveBeenCalledWith(defaults);
  });

  describe("promise()", () => {
    it("resolve path: awaiting the result yields the resolved value", async () => {
      const t = useTulparToast();
      const p = Promise.resolve(42);
      const msgs: ToastPromiseMsgs<number> = {
        loading: "Yükleniyor…",
        success: (v) => `Başarılı: ${v}`,
        error: "Hata",
      };
      const result = t.promise(p, msgs);
      // The composable delegates to core — result is whatever core returns (the original promise).
      const value = await result;
      expect(value).toBe(42);
    });

    it("reject path: rejection propagates from the returned promise", async () => {
      const t = useTulparToast();
      const err = new Error("test fail");
      // Attach a .catch immediately to avoid unhandled rejection before we assert.
      const p = Promise.reject<number>(err);
      const msgs: ToastPromiseMsgs<number> = {
        loading: "Yükleniyor…",
        success: "Başarılı",
        error: "Hata",
      };
      const result = t.promise(p, msgs);
      await expect(result).rejects.toThrow("test fail");
    });

    it("delegates to core toast.promise", () => {
      const t = useTulparToast();
      const p = Promise.resolve(1);
      const msgs: ToastPromiseMsgs<number> = { loading: "L", success: "S", error: "E" };
      t.promise(p, msgs);
      expect(coreToast.promise).toHaveBeenCalledWith(p, msgs, undefined);
    });

    it("forwards opts to core toast.promise", () => {
      const t = useTulparToast();
      const p = Promise.resolve(1);
      const msgs: ToastPromiseMsgs<number> = { loading: "L", success: "S", error: "E" };
      const opts = { location: "top-right" as ToastLocation };
      t.promise(p, msgs, opts);
      expect(coreToast.promise).toHaveBeenCalledWith(p, msgs, opts);
    });
  });
});

// ─── useTulparMessage ─────────────────────────────────────────────────────────

describe("useTulparMessage()", () => {
  it("returns an object with success / info / warning / danger / dismiss", () => {
    const m = useTulparMessage();
    expect(typeof m.success).toBe("function");
    expect(typeof m.info).toBe("function");
    expect(typeof m.warning).toBe("function");
    expect(typeof m.danger).toBe("function");
    expect(typeof m.dismiss).toBe("function");
  });

  it("success() delegates to core message.success", () => {
    const m = useTulparMessage();
    const id = m.success("Kaydedildi");
    expect(coreMessage.success).toHaveBeenCalledWith("Kaydedildi", undefined);
    expect(id).toBe("msg-id-2");
  });

  it("success() forwards opts", () => {
    const m = useTulparMessage();
    const opts: MessageOptions = { duration: 2000 };
    m.success("msg", opts);
    expect(coreMessage.success).toHaveBeenCalledWith("msg", opts);
  });

  it("info() delegates to core message.info", () => {
    const m = useTulparMessage();
    m.info("Bilgi");
    expect(coreMessage.info).toHaveBeenCalledWith("Bilgi", undefined);
  });

  it("warning() delegates to core message.warning", () => {
    const m = useTulparMessage();
    m.warning("Dikkat");
    expect(coreMessage.warning).toHaveBeenCalledWith("Dikkat", undefined);
  });

  it("danger() delegates to core message.danger", () => {
    const m = useTulparMessage();
    m.danger("Kritik hata");
    expect(coreMessage.danger).toHaveBeenCalledWith("Kritik hata", undefined);
  });

  it("dismiss(id) delegates to core message.dismiss with id", () => {
    const m = useTulparMessage();
    m.dismiss("msg-abc");
    expect(coreMessage.dismiss).toHaveBeenCalledWith("msg-abc");
  });

  it("dismiss() (no id) delegates to core message.dismiss with no args", () => {
    const m = useTulparMessage();
    m.dismiss();
    expect(coreMessage.dismiss).toHaveBeenCalledWith(undefined);
  });
});

// ─── TulparToastPlugin ────────────────────────────────────────────────────────

describe("TulparToastPlugin", () => {
  it("is a valid Vue plugin (has install function)", () => {
    expect(TulparToastPlugin).toBeDefined();
    expect(typeof TulparToastPlugin.install).toBe("function");
  });

  it("app.use(TulparToastPlugin) installs without error", () => {
    const app = createApp({ template: "<div />" });
    expect(() => app.use(TulparToastPlugin)).not.toThrow();
  });

  it("app.use(TulparToastPlugin, defaults) calls core toast.setDefaults", () => {
    const app = createApp({ template: "<div />" });
    const defaults: ToasterDefaults = { location: "bottom-left", maxVisible: 5 };
    app.use(TulparToastPlugin, defaults);
    expect(coreToast.setDefaults).toHaveBeenCalledWith(defaults);
  });

  it("app.use(TulparToastPlugin) without defaults does NOT call setDefaults", () => {
    const app = createApp({ template: "<div />" });
    app.use(TulparToastPlugin);
    expect(coreToast.setDefaults).not.toHaveBeenCalled();
  });
});

// ─── Re-exported types (compile-time check via assignment) ────────────────────

describe("re-exported types", () => {
  it("ToastOptions, MessageOptions, ToasterDefaults, DismissReason, ToastLocation, ToastPromiseMsgs are importable from the module", () => {
    // TypeScript compile-time only — if the types are not exported the import
    // above fails at tsc. At runtime we just assert the module loaded.
    const _opts: ToastOptions = { tone: "info" };
    const _mOpts: MessageOptions = { duration: 3000 };
    const _defs: ToasterDefaults = { maxVisible: 3 };
    const _reason: DismissReason = "timeout";
    const _loc: ToastLocation = "bottom-right";
    const _msgs: ToastPromiseMsgs<number> = { loading: "L", success: "S", error: "E" };
    expect(_opts).toBeDefined();
    expect(_mOpts).toBeDefined();
    expect(_defs).toBeDefined();
    expect(_reason).toBeDefined();
    expect(_loc).toBeDefined();
    expect(_msgs).toBeDefined();
  });
});
