import { expect } from "@open-wc/testing";
import { resolveTone } from "./tone-resolver";

// ─── Built-in tones ──────────────────────────────────────────────────────────

describe("resolveTone — built-in tones", () => {
  it("info: builtin=true, vars={}", () => {
    const r = resolveTone({ tone: "info" });
    expect(r.builtin).to.equal(true);
    expect(Object.keys(r.vars).length).to.equal(0);
  });

  it("success: builtin=true, vars={}", () => {
    const r = resolveTone({ tone: "success" });
    expect(r.builtin).to.equal(true);
    expect(Object.keys(r.vars).length).to.equal(0);
  });

  it("warning: builtin=true, vars={}", () => {
    const r = resolveTone({ tone: "warning" });
    expect(r.builtin).to.equal(true);
    expect(Object.keys(r.vars).length).to.equal(0);
  });

  it("danger: builtin=true, vars={}", () => {
    const r = resolveTone({ tone: "danger" });
    expect(r.builtin).to.equal(true);
    expect(Object.keys(r.vars).length).to.equal(0);
  });

  it("undefined tone defaults to info (builtin=true)", () => {
    const r = resolveTone({});
    expect(r.builtin).to.equal(true);
    expect(Object.keys(r.vars).length).to.equal(0);
  });
});

// ─── highContrast flag ───────────────────────────────────────────────────────

describe("resolveTone — highContrast", () => {
  it("danger + highContrast=true → highContrast:true", () => {
    const r = resolveTone({ tone: "danger", highContrast: true });
    expect(r.highContrast).to.equal(true);
  });

  it("danger + highContrast=false → highContrast:false", () => {
    const r = resolveTone({ tone: "danger", highContrast: false });
    expect(r.highContrast).to.equal(false);
  });

  it("info + highContrast=true → highContrast:false (no-op for non-danger)", () => {
    const r = resolveTone({ tone: "info", highContrast: true });
    expect(r.highContrast).to.equal(false);
  });

  it("success + highContrast=true → highContrast:false", () => {
    const r = resolveTone({ tone: "success", highContrast: true });
    expect(r.highContrast).to.equal(false);
  });

  it("warning + highContrast=true → highContrast:false", () => {
    const r = resolveTone({ tone: "warning", highContrast: true });
    expect(r.highContrast).to.equal(false);
  });

  it("highContrast false by default for built-in non-danger", () => {
    const r = resolveTone({ tone: "success" });
    expect(r.highContrast).to.equal(false);
  });
});

// ─── custom tone: brand family ───────────────────────────────────────────────

describe("resolveTone — custom tone with brand family name", () => {
  it("ilay family: builtin=false, vars contain -l/-d surface/on-surface/border/accent props", () => {
    const r = resolveTone({ tone: "custom", color: "ilay" });
    expect(r.builtin).to.equal(false);

    // light-mode vars
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("var(--tulpar-primitive-color-ilay-50)");
    expect(r.vars["--tulpar-toast-on-surface-l"]).to.equal("var(--tulpar-primitive-color-ilay-900)");
    expect(r.vars["--tulpar-toast-border-l"]).to.equal("var(--tulpar-primitive-color-ilay-500)");
    expect(r.vars["--tulpar-toast-accent-l"]).to.equal("var(--tulpar-primitive-color-ilay-600)");

    // dark-mode vars
    expect(r.vars["--tulpar-toast-surface-d"]).to.equal("var(--tulpar-primitive-color-ilay-900)");
    expect(r.vars["--tulpar-toast-on-surface-d"]).to.equal("var(--tulpar-primitive-color-ilay-100)");
    expect(r.vars["--tulpar-toast-border-d"]).to.equal("var(--tulpar-primitive-color-ilay-500)");
    expect(r.vars["--tulpar-toast-accent-d"]).to.equal("var(--tulpar-primitive-color-ilay-400)");
  });

  it("gok family emits gok primitive refs", () => {
    const r = resolveTone({ tone: "custom", color: "gok" });
    expect(r.builtin).to.equal(false);
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("var(--tulpar-primitive-color-gok-50)");
    expect(r.vars["--tulpar-toast-surface-d"]).to.equal("var(--tulpar-primitive-color-gok-900)");
    expect(r.vars["--tulpar-toast-accent-l"]).to.equal("var(--tulpar-primitive-color-gok-600)");
    expect(r.vars["--tulpar-toast-accent-d"]).to.equal("var(--tulpar-primitive-color-gok-400)");
  });

  it("umay family emits umay primitive refs", () => {
    const r = resolveTone({ tone: "custom", color: "umay" });
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("var(--tulpar-primitive-color-umay-50)");
    expect(r.vars["--tulpar-toast-surface-d"]).to.equal("var(--tulpar-primitive-color-umay-900)");
  });

  it("erlik family emits erlik primitive refs", () => {
    const r = resolveTone({ tone: "custom", color: "erlik" });
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("var(--tulpar-primitive-color-erlik-50)");
    expect(r.vars["--tulpar-toast-on-surface-l"]).to.equal("var(--tulpar-primitive-color-erlik-900)");
  });

  it("ulgen family emits ulgen primitive refs", () => {
    const r = resolveTone({ tone: "custom", color: "ulgen" });
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("var(--tulpar-primitive-color-ulgen-50)");
    expect(r.vars["--tulpar-toast-border-l"]).to.equal("var(--tulpar-primitive-color-ulgen-500)");
  });

  it("kizagan family emits kizagan primitive refs", () => {
    const r = resolveTone({ tone: "custom", color: "kizagan" });
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("var(--tulpar-primitive-color-kizagan-50)");
  });

  it("highContrast is false for custom tones (no-op)", () => {
    const r = resolveTone({ tone: "custom", color: "ilay", highContrast: true });
    expect(r.highContrast).to.equal(false);
  });

  it("returns exactly 8 vars for a plain custom family (4 light + 4 dark)", () => {
    const r = resolveTone({ tone: "custom", color: "ilay" });
    expect(Object.keys(r.vars).length).to.equal(8);
  });
});

// ─── custom tone: raw CSS color ───────────────────────────────────────────────

describe("resolveTone — custom tone with raw CSS color", () => {
  it("hex color: builtin=false, vars contain -l/-d pairs (derived values)", () => {
    const r = resolveTone({ tone: "custom", color: "#0d9488" });
    expect(r.builtin).to.equal(false);
    // Should emit -l and -d variants for all 4 slots
    expect("--tulpar-toast-surface-l" in r.vars).to.equal(true);
    expect("--tulpar-toast-surface-d" in r.vars).to.equal(true);
    expect("--tulpar-toast-on-surface-l" in r.vars).to.equal(true);
    expect("--tulpar-toast-on-surface-d" in r.vars).to.equal(true);
    expect("--tulpar-toast-border-l" in r.vars).to.equal(true);
    expect("--tulpar-toast-border-d" in r.vars).to.equal(true);
    expect("--tulpar-toast-accent-l" in r.vars).to.equal(true);
    expect("--tulpar-toast-accent-d" in r.vars).to.equal(true);
  });

  it("hex color: light surface is a tinted (very light) color-mix", () => {
    const r = resolveTone({ tone: "custom", color: "#0d9488" });
    // Light surface should mix toward white for a tinted background
    expect(r.vars["--tulpar-toast-surface-l"]).to.include("color-mix");
    expect(r.vars["--tulpar-toast-surface-l"]).to.include("#0d9488");
  });

  it("hex color: dark surface is a tinted dark color-mix", () => {
    const r = resolveTone({ tone: "custom", color: "#0d9488" });
    expect(r.vars["--tulpar-toast-surface-d"]).to.include("color-mix");
    expect(r.vars["--tulpar-toast-surface-d"]).to.include("#0d9488");
  });

  it("hex color: accent-l is the raw color itself", () => {
    const r = resolveTone({ tone: "custom", color: "#0d9488" });
    expect(r.vars["--tulpar-toast-accent-l"]).to.equal("#0d9488");
  });

  it("rgb() color is treated as raw color (not a family name)", () => {
    const r = resolveTone({ tone: "custom", color: "rgb(13, 148, 136)" });
    expect(r.builtin).to.equal(false);
    expect("--tulpar-toast-surface-l" in r.vars).to.equal(true);
  });

  it("unknown non-family string treated as raw color", () => {
    const r = resolveTone({ tone: "custom", color: "notafamily" });
    expect(r.builtin).to.equal(false);
    // Should still emit the vars (raw color path)
    expect("--tulpar-toast-surface-l" in r.vars).to.equal(true);
  });

  it("returns exactly 8 vars for a raw hex (4 light + 4 dark)", () => {
    const r = resolveTone({ tone: "custom", color: "#abc123" });
    expect(Object.keys(r.vars).length).to.equal(8);
  });
});

// ─── part overrides ──────────────────────────────────────────────────────────

describe("resolveTone — part overrides", () => {
  it("bg override replaces both surface-l and surface-d with the literal value", () => {
    const r = resolveTone({ tone: "custom", color: "ilay", bg: "#ff0000" });
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("#ff0000");
    expect(r.vars["--tulpar-toast-surface-d"]).to.equal("#ff0000");
  });

  it("accent override replaces both accent-l and accent-d", () => {
    const r = resolveTone({ tone: "custom", color: "ilay", accent: "#00ff00" });
    expect(r.vars["--tulpar-toast-accent-l"]).to.equal("#00ff00");
    expect(r.vars["--tulpar-toast-accent-d"]).to.equal("#00ff00");
  });

  it("text override replaces both on-surface-l and on-surface-d", () => {
    const r = resolveTone({ tone: "custom", color: "ilay", text: "white" });
    expect(r.vars["--tulpar-toast-on-surface-l"]).to.equal("white");
    expect(r.vars["--tulpar-toast-on-surface-d"]).to.equal("white");
  });

  it("multiple overrides all apply simultaneously", () => {
    const r = resolveTone({
      tone: "custom",
      color: "gok",
      bg: "#111",
      accent: "#222",
      text: "#333",
    });
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("#111");
    expect(r.vars["--tulpar-toast-surface-d"]).to.equal("#111");
    expect(r.vars["--tulpar-toast-accent-l"]).to.equal("#222");
    expect(r.vars["--tulpar-toast-accent-d"]).to.equal("#222");
    expect(r.vars["--tulpar-toast-on-surface-l"]).to.equal("#333");
    expect(r.vars["--tulpar-toast-on-surface-d"]).to.equal("#333");
  });

  it("overrides also apply when color is a raw hex", () => {
    const r = resolveTone({ tone: "custom", color: "#0d9488", bg: "teal" });
    expect(r.vars["--tulpar-toast-surface-l"]).to.equal("teal");
    expect(r.vars["--tulpar-toast-surface-d"]).to.equal("teal");
  });

  it("override still leaves border vars unchanged (only bg/accent/text override their slots)", () => {
    const r = resolveTone({ tone: "custom", color: "ilay", bg: "#111" });
    // border should still be the derived family ref
    expect(r.vars["--tulpar-toast-border-l"]).to.equal("var(--tulpar-primitive-color-ilay-500)");
    expect(r.vars["--tulpar-toast-border-d"]).to.equal("var(--tulpar-primitive-color-ilay-500)");
  });

  it("total vars count stays 8 even with overrides", () => {
    const r = resolveTone({ tone: "custom", color: "ilay", bg: "#ff0000", accent: "blue" });
    expect(Object.keys(r.vars).length).to.equal(8);
  });
});

// ─── custom tone: no color provided ──────────────────────────────────────────

describe("resolveTone — custom tone without color", () => {
  it("tone=custom with no color: builtin=false, vars={} (nothing to derive)", () => {
    const r = resolveTone({ tone: "custom" });
    expect(r.builtin).to.equal(false);
    expect(Object.keys(r.vars).length).to.equal(0);
  });
});

// ─── result shape ────────────────────────────────────────────────────────────

describe("resolveTone — result shape", () => {
  it("always returns { builtin, vars, highContrast }", () => {
    const r = resolveTone({ tone: "info" });
    expect(typeof r.builtin).to.equal("boolean");
    expect(typeof r.vars).to.equal("object");
    expect(typeof r.highContrast).to.equal("boolean");
    expect(r.vars).to.not.equal(null);
  });
});
