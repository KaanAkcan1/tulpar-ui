import { describe, it, expect } from "vitest";
import type { InputTokens, SemanticTokens } from "./types";

describe("InputTokens", () => {
  it("includes all token slots required by the v0.5 input family", () => {
    const sample: InputTokens = {
      bg: { default: "#fff", disabled: "#f3f3f3", readonly: "#f8f8f8" },
      border: {
        default: "#ddd",
        hover: "#bbb",
        focus: "#3b82f6",
        invalid: "#dc2626",
        warn: "#d97706",
      },
      text: { default: "#111", disabled: "#999", readonly: "#444", placeholder: "#999" },
      label: { default: "#333", required: "#dc2626", float: { bg: "#fff" } },
      message: { helper: "#666", error: "#dc2626", warn: "#d97706" },
      icon: {
        default: "#666",
        invalid: "#dc2626",
        warn: "#d97706",
        validating: "#3b82f6",
      },
      radius: "0.375rem",
      size: {
        xs: { height: "1.5rem", paddingX: "0.5rem", paddingY: "0.125rem", fontSize: "0.75rem" },
        sm: { height: "1.75rem", paddingX: "0.625rem", paddingY: "0.25rem", fontSize: "0.875rem" },
        md: { height: "2.25rem", paddingX: "0.75rem", paddingY: "0.375rem", fontSize: "0.875rem" },
        lg: { height: "2.75rem", paddingX: "0.875rem", paddingY: "0.5rem", fontSize: "1rem" },
        xl: { height: "3.25rem", paddingX: "1rem", paddingY: "0.625rem", fontSize: "1.125rem" },
      },
      messageRowHeight: "1.25rem",
    };
    expect(sample.label.float.bg).toBeDefined();
    const semantic: Pick<SemanticTokens, "input"> = { input: sample };
    expect(semantic.input).toEqual(sample);
  });
});
