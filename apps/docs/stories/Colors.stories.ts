import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const FAMILIES = [
  "al",
  "kizagan",
  "umay",
  "ilay",
  "erlik",
  "kam",
  "mergen",
  "gok",
  "ay",
  "yersu",
  "tulpar",
  "otuken",
  "kayin",
  "ulgen",
  "kuyas",
  "alaz",
  "burkut",
  "colpan",
  "ayzit",
  "boz",
  "kara",
  "yagiz",
] as const;
const SEMANTICS = [
  "brand",
  "secondary",
  "success",
  "danger",
  "warn",
  "info",
  "help",
  "premium",
  "neutral",
  "contrast",
] as const;

const meta: Meta = { title: "Foundations/Colors" };
export default meta;

export const Palette: StoryObj = {
  render: () => html`
    <div style="padding:24px;max-width:1100px;font-family:system-ui">
      <h2>Chromatic Mythology — 22 families</h2>
      ${FAMILIES.map(
        (f) => html`
          <div style="margin:8px 0">
            <code>${f}</code>
            <div
              style="display:grid;grid-template-columns:repeat(11,1fr);border-radius:8px;overflow:hidden"
            >
              ${STOPS.map(
                (s) =>
                  html`<div
                    title="${f}-${s}"
                    style="aspect-ratio:2/1;background:var(--tulpar-primitive-color-${f}-${s})"
                  ></div>`,
              )}
            </div>
          </div>
        `,
      )}
      <h3>Semantic roles</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${SEMANTICS.map(
          (r) => html`<span
            style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border:1px solid #ccc;border-radius:999px"
          >
            <span
              style="width:14px;height:14px;border-radius:50%;background:var(--tulpar-color-${r}-default)"
            ></span
            >${r}</span
          >`,
        )}
      </div>
      <h3>Chart series</h3>
      <div style="display:flex;gap:4px">
        ${[1, 2, 3, 4, 5, 6, 7, 8].map(
          (n) =>
            html`<span
              style="width:48px;height:48px;border-radius:6px;background:var(--tulpar-chart-${n})"
            ></span>`,
        )}
      </div>
    </div>
  `,
};
