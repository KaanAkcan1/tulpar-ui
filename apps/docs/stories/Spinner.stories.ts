import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/spinner";

/**
 * `<tulpar-spinner>` — indeterminate loader (quarter-arc).
 *
 * A round-cap quarter-arc spins at 0.7s linear (house consistency with the
 * switch busy spinner) over an optional faint full track ring.
 *
 * ## Tone (optional)
 * Unlike the other tonal atoms, tone is **optional**: when omitted the arc/track
 * inherit the page `currentColor` (so a spinner inside a muted grid cell or a
 * button label adopts that color). A built-in tone, or `tone="custom"` + `color`,
 * colorizes it explicitly.
 *
 * ## Delay
 * `delay > 0` renders **nothing** until the delay elapses — this suppresses the
 * flash of a loader for operations that resolve quickly (a common anti-flicker
 * pattern). The matrices here use `delay=0` so the spinner is always visible.
 *
 * ## Accessibility
 * The host is `role="status"` with a visually-hidden accessible name (`label`
 * prop, default "Loading"; `slot="label"` overrides). Under
 * `prefers-reduced-motion` the arc swaps to a 3-dot opacity cycle.
 */
const meta: Meta = {
  title: "Display & Status/Spinner",
  component: "tulpar-spinner",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger", "custom"],
    },
    color: { control: "text" },
    track: { control: "boolean" },
    delay: { control: "number" },
    label: { control: "text" },
  },
};
export default meta;

type Story = StoryObj;

// ─── Shared helpers ───────────────────────────────────────────────────────────

const sectionLabel = (t: string) => html`
  <p
    style="margin:0 0 8px; font-size:12px; font-weight:600; letter-spacing:0.05em;
           text-transform:uppercase; color:var(--tulpar-color-text-secondary,#74777a);
           font-family:monospace;"
  >
    ${t}
  </p>
`;

const row = (...children: unknown[]) => html`
  <div style="display:flex; flex-wrap:wrap; align-items:center; gap:20px;">${children}</div>
`;

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const TONES = ["neutral", "info", "success", "warning", "danger"] as const;

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control. Leave `tone` empty to inherit the
 * page `currentColor`.
 */
export const Default: Story = {
  args: {
    size: "md",
    track: true,
    delay: 0,
    label: "Loading",
  },
  render: (args) => html`
    <div style="padding:40px;">
      <tulpar-spinner
        size=${args["size"] ?? "md"}
        tone=${args["tone"] ?? ""}
        color=${args["color"] ?? ""}
        ?track=${args["track"] ?? true}
        .delay=${args["delay"] ?? 0}
        label=${args["label"] ?? "Loading"}
      ></tulpar-spinner>
    </div>
  `,
};

// ─── 2. Sizes ────────────────────────────────────────────────────────────────

/**
 * **Sizes** — `xs(14) → xl(28)`. No tone is set, so each inherits the page text
 * color.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("xs → xl (inherits currentColor)")}
      ${row(...SIZES.map((s) => html`<tulpar-spinner size=${s} label="Loading"></tulpar-spinner>`))}
    </div>
  `,
};

// ─── 3. Tones ────────────────────────────────────────────────────────────────

/**
 * **Tones** — built-in tones colorize the arc + track. The last cell omits tone
 * and inherits the parent's `currentColor` (set to a brand swatch here).
 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Built-in tones")}
      ${row(
        ...TONES.map((t) => html`<tulpar-spinner size="lg" tone=${t} label="Loading"></tulpar-spinner>`),
      )}

      ${sectionLabel("custom + color (brand family / raw color)")}
      ${row(
        html`<tulpar-spinner size="lg" tone="custom" color="ilay" label="Loading"></tulpar-spinner>`,
        html`<tulpar-spinner size="lg" tone="custom" color="gok" label="Loading"></tulpar-spinner>`,
        html`<tulpar-spinner size="lg" tone="custom" color="#0d9488" label="Loading"></tulpar-spinner>`,
      )}

      ${sectionLabel("No tone → inherits currentColor")}
      <div style="color:var(--tulpar-color-brand-default,#00C57A);">
        ${row(html`<tulpar-spinner size="lg" label="Loading"></tulpar-spinner>`)}
      </div>
    </div>
  `,
};

// ─── 4. Track ────────────────────────────────────────────────────────────────

/**
 * **Track** — the faint full ring behind the arc. On by default; `track=false`
 * shows the bare arc.
 */
export const Track: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("track on (default) vs off")}
      ${row(
        html`<tulpar-spinner size="xl" tone="info" label="Loading"></tulpar-spinner>`,
        html`<tulpar-spinner size="xl" tone="info" ?track=${false} label="Loading"></tulpar-spinner>`,
      )}
    </div>
  `,
};

// ─── 5. Delay ────────────────────────────────────────────────────────────────

/**
 * **Delay** — `delay > 0` renders nothing until it elapses, suppressing a flash
 * for fast operations. Re-render the story (or remount via the Storybook control)
 * to watch the delayed spinner appear.
 */
export const Delay: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("delay=0 (immediate) · delay=500 · delay=1000")}
      ${row(
        html`<div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <tulpar-spinner size="lg" tone="info" .delay=${0} label="Loading"></tulpar-spinner>
          <span style="font-size:11px; color:var(--tulpar-color-text-secondary,#74777a);">0ms</span>
        </div>`,
        html`<div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <tulpar-spinner size="lg" tone="info" .delay=${500} label="Loading"></tulpar-spinner>
          <span style="font-size:11px; color:var(--tulpar-color-text-secondary,#74777a);">500ms</span>
        </div>`,
        html`<div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <tulpar-spinner size="lg" tone="info" .delay=${1000} label="Loading"></tulpar-spinner>
          <span style="font-size:11px; color:var(--tulpar-color-text-secondary,#74777a);">1000ms</span>
        </div>`,
      )}
      <p style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        Delayed spinners are empty until their timer elapses — remount the story to replay.
      </p>
    </div>
  `,
};

// ─── 6. InContext ────────────────────────────────────────────────────────────

/**
 * **In context** — spinner inside a button label and a muted grid cell. With no
 * tone set it inherits the surrounding `currentColor`, so it stays on-brand
 * without extra wiring.
 */
export const InContext: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Inside a button (inherits the label color)")}
      <div>
        <button
          style="display:inline-flex; align-items:center; gap:8px; font:inherit; color:#fff;
                 background:var(--tulpar-color-brand-default,#00C57A); border:none;
                 padding:8px 16px; border-radius:8px; cursor:progress;"
        >
          <tulpar-spinner size="sm" label="Saving"></tulpar-spinner>
          Saving…
        </button>
      </div>

      ${sectionLabel("Inside a muted grid cell")}
      <div
        style="display:flex; align-items:center; gap:8px; color:var(--tulpar-color-text-secondary,#74777a);
               font-size:13px; border:1px solid var(--tulpar-color-border-default,#e5e7eb);
               border-radius:8px; padding:10px 14px; max-width:240px;"
      >
        <tulpar-spinner size="sm" label="Loading row"></tulpar-spinner>
        Resolving…
      </div>
    </div>
  `,
};

// ─── 7. DarkMode ─────────────────────────────────────────────────────────────

/**
 * **DarkMode** — tones on a dark surface; built-in accents auto-flip.
 */
export const DarkMode: Story = {
  parameters: {
    controls: { disable: true },
    backgrounds: { default: "dark" },
  },
  render: () => html`
    <div
      class="dark"
      style="background:var(--tulpar-color-bg-canvas,#13171a); padding:40px; border-radius:12px;
             display:flex; flex-direction:column; gap:20px; color:var(--tulpar-color-text-primary,#e9ecef);"
    >
      ${sectionLabel("Built-in tones — dark")}
      ${row(...TONES.map((t) => html`<tulpar-spinner size="lg" tone=${t} label="Loading"></tulpar-spinner>`))}
      ${sectionLabel("No tone → inherits dark text color")}
      ${row(...SIZES.map((s) => html`<tulpar-spinner size=${s} label="Loading"></tulpar-spinner>`))}
    </div>
  `,
};
