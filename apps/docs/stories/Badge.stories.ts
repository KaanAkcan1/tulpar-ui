import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/badge";

/**
 * `<tulpar-badge>` — count / status indicator.
 *
 * Renders an inline **pill** (default) showing a count or short label, or a
 * bare **dot** for status. Built for dense placement in grids and nav items.
 *
 * ## Numeric mode
 * - `count` renders as text; `count > max` (default 99) renders `` `${max}+` ``
 *   (e.g. `120` → `99+`). Counts use tabular figures so width never jitters.
 * - `count === 0 && !showZero` → nothing renders (host gets `hidden`).
 * - `dot` mode ignores `count` entirely.
 *
 * ## Variants & shape
 * `solid` (default) · `soft-tonal` · `outline`. Shape `pill` (default) ·
 * `square`. The pill default contrasts with the square Tag.
 *
 * ## Accessibility
 * A numeric badge sets `aria-label` to the count + a noun (from the `label`
 * prop, the slotted text, or "items") — e.g. `aria-label="3 notifications"` —
 * and `role="img"` so AT reads a single labeled graphic, not a bare number.
 */
const meta: Meta = {
  title: "Display & Status/Badge",
  component: "tulpar-badge",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger"],
    },
    variant: {
      control: "select",
      options: ["solid", "soft-tonal", "outline"],
    },
    shape: {
      control: "select",
      options: ["pill", "square"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    count: { control: "number" },
    max: { control: "number" },
    showZero: { control: "boolean" },
    dot: { control: "boolean" },
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
  <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px;">${children}</div>
`;

const TONES = ["neutral", "info", "success", "warning", "danger"] as const;

/** A 36px host square with a bell icon + a corner-anchored badge (illustrative). */
const bellHost = (badge: unknown) => html`
  <span
    style="position:relative; display:inline-flex; width:36px; height:36px; border-radius:8px;
           background:var(--tulpar-color-bg-subtle,#f1f3f5); align-items:center; justify-content:center;"
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      style="color:var(--tulpar-color-text-secondary,#74777a);"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
    <span style="position:absolute; top:-5px; right:-5px;">${badge}</span>
  </span>
`;

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control maps to a property/attribute on
 * `<tulpar-badge>`.
 */
export const Default: Story = {
  args: {
    tone: "danger",
    variant: "solid",
    shape: "pill",
    size: "md",
    count: 8,
    max: 99,
    label: "notifications",
  },
  render: (args) => html`
    <div style="padding:40px;">
      <tulpar-badge
        tone=${args["tone"] ?? "neutral"}
        variant=${args["variant"] ?? "solid"}
        shape=${args["shape"] ?? "pill"}
        size=${args["size"] ?? "md"}
        .count=${args["count"] ?? 8}
        .max=${args["max"] ?? 99}
        ?show-zero=${args["showZero"]}
        ?dot=${args["dot"]}
        label=${args["label"] ?? ""}
      ></tulpar-badge>
    </div>
  `,
};

// ─── 2. Tones ────────────────────────────────────────────────────────────────

/**
 * **Tones** — all five tones in the default solid variant. Each numeric badge
 * carries an accessible name (count + noun) so the number isn't bare to AT.
 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("All tones · solid")}
      ${row(
        ...TONES.map(
          (t) => html`<tulpar-badge tone=${t} .count=${8} label="items"></tulpar-badge>`,
        ),
      )}
    </div>
  `,
};

// ─── 3. Variants ─────────────────────────────────────────────────────────────

/**
 * **Variants** — `solid` (default), `soft-tonal`, `outline` across all tones.
 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const variantRow = (variant: "solid" | "soft-tonal" | "outline") => html`
      ${sectionLabel(variant)}
      ${row(
        ...TONES.map(
          (t) =>
            html`<tulpar-badge tone=${t} variant=${variant} .count=${12} label="items"></tulpar-badge>`,
        ),
      )}
    `;
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
        ${variantRow("solid")} ${variantRow("soft-tonal")} ${variantRow("outline")}
      </div>
    `;
  },
};

// ─── 4. Shapes ───────────────────────────────────────────────────────────────

/**
 * **Shapes** — `pill` (default) vs `square`.
 */
export const Shapes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("pill")}
      ${row(...TONES.map((t) => html`<tulpar-badge tone=${t} shape="pill" .count=${9} label="items"></tulpar-badge>`))}
      ${sectionLabel("square")}
      ${row(...TONES.map((t) => html`<tulpar-badge tone=${t} shape="square" .count=${9} label="items"></tulpar-badge>`))}
    </div>
  `,
};

// ─── 5. Sizes ────────────────────────────────────────────────────────────────

/**
 * **Sizes** — `sm → lg`.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("sm → lg")}
      ${row(
        ...(["sm", "md", "lg"] as const).map(
          (s) => html`<tulpar-badge tone="info" size=${s} .count=${24} label="items"></tulpar-badge>`,
        ),
      )}
    </div>
  `,
};

// ─── 6. CountOverflowDotZero ─────────────────────────────────────────────────

/**
 * **Count / Overflow / Dot / Show-zero** — the numeric-mode behaviors.
 *
 * - **Count** — plain numbers, tabular so width is stable.
 * - **Overflow** — `count > max` renders `${max}+` (`100 → 99+`, `5 → 5` at max=4).
 * - **Dot** — bare status indicator (ignores count). A `label` gives it an
 *   accessible name; without one it is decorative.
 * - **Show-zero** — `count=0` is hidden by default; `show-zero` forces it.
 */
export const CountOverflowDotZero: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Count")}
      ${row(
        html`<tulpar-badge tone="neutral" .count=${3} label="items"></tulpar-badge>`,
        html`<tulpar-badge tone="info" .count=${8} label="items"></tulpar-badge>`,
        html`<tulpar-badge tone="success" .count=${24} label="items"></tulpar-badge>`,
      )}

      ${sectionLabel("Overflow (max)")}
      ${row(
        html`<tulpar-badge tone="danger" .count=${100} .max=${99} label="notifications"></tulpar-badge>`,
        html`<tulpar-badge tone="danger" .count=${12} .max=${9} label="notifications"></tulpar-badge>`,
        html`<tulpar-badge tone="warning" .count=${1500} .max=${999} label="alerts"></tulpar-badge>`,
      )}

      ${sectionLabel("Dot (bare status)")}
      ${row(
        html`<tulpar-badge tone="success" dot label="Online"></tulpar-badge>`,
        html`<tulpar-badge tone="warning" dot label="Away"></tulpar-badge>`,
        html`<tulpar-badge tone="danger" dot label="Offline"></tulpar-badge>`,
      )}

      ${sectionLabel("Zero — hidden by default vs show-zero")}
      ${row(
        html`<span style="font-size:13px; color:var(--tulpar-color-text-secondary,#74777a);"
          >count=0 (hidden) →</span
        >`,
        html`<tulpar-badge tone="neutral" .count=${0} label="items"></tulpar-badge>`,
        html`<span style="font-size:13px; color:var(--tulpar-color-text-secondary,#74777a);"
          >show-zero →</span
        >`,
        html`<tulpar-badge tone="neutral" .count=${0} show-zero label="items"></tulpar-badge>`,
      )}
    </div>
  `,
};

// ─── 7. Attached (corner placement) ──────────────────────────────────────────

/**
 * **Attached (illustrative)** — Badge anchored to a host icon. Native attached
 * placement is **reserved for Wave 2** (the `placement` prop is type-only); here
 * the corner anchoring is composed in the story with positioning so you can see
 * the intended pattern (count badge + status dot).
 */
export const Attached: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("Corner-anchored (composed in-story — Wave 2 native API reserved)")}
      ${row(
        bellHost(html`<tulpar-badge tone="danger" .count=${5} label="notifications"></tulpar-badge>`),
        bellHost(html`<tulpar-badge tone="success" dot label="New activity"></tulpar-badge>`),
      )}
    </div>
  `,
};

// ─── 8. GridDensity ──────────────────────────────────────────────────────────

/**
 * **GridDensity** — Badges as count cells in a faux table. Tabular figures keep
 * the column aligned regardless of digit count.
 */
export const GridDensity: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const cell = "padding:7px 12px; font-size:13px;";
    const head = `${cell} font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; color:var(--tulpar-color-text-secondary,#74777a); background:var(--tulpar-color-bg-subtle,#f8f9fa);`;
    const border = "border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);";
    return html`
      <div style="padding:32px;">
        ${sectionLabel("Badges as count cells")}
        <div
          style="border:1px solid var(--tulpar-color-border-default,#e5e7eb); border-radius:8px;
                 overflow:hidden; max-width:420px; display:grid; grid-template-columns:1fr 90px;"
        >
          <div style=${head}>Inbox</div>
          <div style=${head}>Unread</div>
          <div style="${cell}${border}">Primary</div>
          <div style="${cell}${border}"><tulpar-badge size="sm" tone="info" .count=${4} label="unread"></tulpar-badge></div>
          <div style="${cell}${border}">Updates</div>
          <div style="${cell}${border}"><tulpar-badge size="sm" tone="neutral" .count=${128} label="unread"></tulpar-badge></div>
          <div style="${cell}${border}">Spam</div>
          <div style="${cell}${border}"><tulpar-badge size="sm" tone="danger" .count=${100} .max=${99} label="unread"></tulpar-badge></div>
        </div>
      </div>
    `;
  },
};

// ─── 9. DarkMode ─────────────────────────────────────────────────────────────

/**
 * **DarkMode** — all tones × variants on a dark surface.
 */
export const DarkMode: Story = {
  parameters: {
    controls: { disable: true },
    backgrounds: { default: "dark" },
  },
  render: () => {
    const variantRow = (variant: "solid" | "soft-tonal" | "outline") => html`
      ${sectionLabel(variant)}
      ${row(
        ...TONES.map(
          (t) =>
            html`<tulpar-badge tone=${t} variant=${variant} .count=${12} label="items"></tulpar-badge>`,
        ),
      )}
    `;
    return html`
      <div
        class="dark"
        style="background:var(--tulpar-color-bg-canvas,#13171a); padding:40px; border-radius:12px;
               display:flex; flex-direction:column; gap:20px;"
      >
        ${variantRow("solid")} ${variantRow("soft-tonal")} ${variantRow("outline")}
        ${sectionLabel("dot")}
        ${row(...TONES.map((t) => html`<tulpar-badge tone=${t} dot label=${t}></tulpar-badge>`))}
      </div>
    `;
  },
};
