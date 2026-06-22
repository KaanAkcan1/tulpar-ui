import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/skeleton";

/**
 * `<tulpar-skeleton>` — loading placeholder.
 *
 * Reserves layout while content loads to avoid cumulative layout shift (CLS).
 * The default animation is a **directional 100° shimmer sweep** (calmer than an
 * opacity pulse across many rows); `pulse` and `none` are alternatives, and
 * `prefers-reduced-motion` swaps to a static diagonal tint automatically.
 *
 * ## Variants
 * - `text` (default) — one or more line bars (`lines`). When `lines > 1` the
 *   last bar is shortened (~60%) for a ragged paragraph end.
 * - `rect` — a block (cards, thumbnails, media); 6px radius.
 * - `circle` — a round placeholder (avatars); 50% radius.
 *
 * `width` / `height` / `radius` override the per-variant sizing.
 *
 * ## Accessibility
 * Purely decorative: the host is `aria-hidden="true"`. The **loading container**
 * (the region being populated) should expose the busy state itself, e.g.
 * `<div aria-busy="true" aria-live="polite">…`.
 */
const meta: Meta = {
  title: "Display & Status/Skeleton",
  component: "tulpar-skeleton",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "rect", "circle"],
    },
    animation: {
      control: "select",
      options: ["shimmer", "pulse", "none"],
    },
    lines: { control: "number" },
    width: { control: "text" },
    height: { control: "text" },
    radius: { control: "text" },
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

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control. Empty `width` / `height` / `radius`
 * fall back to the per-variant defaults.
 */
export const Default: Story = {
  args: {
    variant: "text",
    animation: "shimmer",
    lines: 3,
  },
  render: (args) => html`
    <div style="padding:40px; max-width:360px;">
      <tulpar-skeleton
        variant=${args["variant"] ?? "text"}
        animation=${args["animation"] ?? "shimmer"}
        .lines=${args["lines"] ?? 1}
        width=${args["width"] ?? ""}
        height=${args["height"] ?? ""}
        radius=${args["radius"] ?? ""}
      ></tulpar-skeleton>
    </div>
  `,
};

// ─── 2. Variants ─────────────────────────────────────────────────────────────

/**
 * **Variants** — `text` (single + multi-line, ragged last line), `rect`, and
 * `circle`. The width/height props size rect and circle.
 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px; max-width:420px;">
      ${sectionLabel("text · single line")}
      <tulpar-skeleton variant="text" width="70%"></tulpar-skeleton>

      ${sectionLabel("text · multi-line (lines=4, ragged last)")}
      <tulpar-skeleton variant="text" .lines=${4}></tulpar-skeleton>

      ${sectionLabel("rect · block")}
      <tulpar-skeleton variant="rect" height="96px"></tulpar-skeleton>

      ${sectionLabel("circle · avatar placeholder")}
      <tulpar-skeleton variant="circle" width="48px" height="48px"></tulpar-skeleton>
    </div>
  `,
};

// ─── 3. Animations ───────────────────────────────────────────────────────────

/**
 * **Animations** — `shimmer` (default, directional sweep), `pulse` (opacity),
 * and `none` (static). Under `prefers-reduced-motion: reduce` shimmer/pulse
 * become a static diagonal tint; emulate it in DevTools → Rendering to verify.
 */
export const Animations: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px; max-width:420px;">
      ${sectionLabel("shimmer (default)")}
      <tulpar-skeleton variant="text" .lines=${3} animation="shimmer"></tulpar-skeleton>

      ${sectionLabel("pulse")}
      <tulpar-skeleton variant="text" .lines=${3} animation="pulse"></tulpar-skeleton>

      ${sectionLabel("none (static)")}
      <tulpar-skeleton variant="text" .lines=${3} animation="none"></tulpar-skeleton>

      <p style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        DevTools → Rendering → emulate <code>prefers-reduced-motion: reduce</code> →
        shimmer/pulse become a static diagonal tint.
      </p>
    </div>
  `,
};

// ─── 4. ContentShapes ────────────────────────────────────────────────────────

/**
 * **Content shapes** — realistic composed placeholders: a media card and a
 * list-row (avatar + two lines). Reserving these shapes prevents layout shift
 * when the real content swaps in.
 */
export const ContentShapes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; gap:32px; flex-wrap:wrap;">
      <div style="width:240px;">
        ${sectionLabel("Media card")}
        <tulpar-skeleton variant="rect" height="140px"></tulpar-skeleton>
        <div style="margin-top:12px;">
          <tulpar-skeleton variant="text" width="80%"></tulpar-skeleton>
          <tulpar-skeleton variant="text" .lines=${2}></tulpar-skeleton>
        </div>
      </div>

      <div style="width:280px;">
        ${sectionLabel("List rows")}
        ${[0, 1, 2].map(
          () => html`
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
              <tulpar-skeleton variant="circle" width="40px" height="40px"></tulpar-skeleton>
              <div style="flex:1;">
                <tulpar-skeleton variant="text" width="70%"></tulpar-skeleton>
                <tulpar-skeleton variant="text" width="45%"></tulpar-skeleton>
              </div>
            </div>
          `,
        )}
      </div>
    </div>
  `,
};

// ─── 5. GridDensity ──────────────────────────────────────────────────────────

/**
 * **GridDensity** — Skeletons as loading cells in a faux table row (the cell is
 * still resolving while its neighbours have data).
 */
export const GridDensity: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const cell = "padding:8px 12px; font-size:13px;";
    const head = `${cell} font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; color:var(--tulpar-color-text-secondary,#74777a); background:var(--tulpar-color-bg-subtle,#f8f9fa);`;
    const border = "border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);";
    return html`
      <div style="padding:32px;">
        ${sectionLabel("Loading cells in a grid")}
        <div
          style="border:1px solid var(--tulpar-color-border-default,#e5e7eb); border-radius:8px;
                 overflow:hidden; max-width:480px; display:grid; grid-template-columns:40px 1fr 110px;"
        >
          <div style=${head}></div>
          <div style=${head}>Name</div>
          <div style=${head}>Status</div>
          ${[0, 1, 2].map(
            () => html`
              <div style="${cell}${border} display:flex; align-items:center;">
                <tulpar-skeleton variant="circle" width="24px" height="24px"></tulpar-skeleton>
              </div>
              <div style="${cell}${border} display:flex; align-items:center;">
                <tulpar-skeleton variant="text" width="60%" height="12px"></tulpar-skeleton>
              </div>
              <div style="${cell}${border} display:flex; align-items:center;">
                <tulpar-skeleton variant="text" width="70px" height="12px"></tulpar-skeleton>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  },
};

// ─── 6. DarkMode ─────────────────────────────────────────────────────────────

/**
 * **DarkMode** — placeholders on a dark surface use the dark base / sheen tones.
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
             display:flex; gap:32px; flex-wrap:wrap;"
    >
      <div style="width:240px;">
        ${sectionLabel("Media card — dark")}
        <tulpar-skeleton variant="rect" height="120px"></tulpar-skeleton>
        <div style="margin-top:12px;">
          <tulpar-skeleton variant="text" width="80%"></tulpar-skeleton>
          <tulpar-skeleton variant="text" .lines=${2}></tulpar-skeleton>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:12px; width:240px;">
        <tulpar-skeleton variant="circle" width="40px" height="40px"></tulpar-skeleton>
        <div style="flex:1;">
          <tulpar-skeleton variant="text" width="70%"></tulpar-skeleton>
          <tulpar-skeleton variant="text" width="45%"></tulpar-skeleton>
        </div>
      </div>
    </div>
  `,
};
