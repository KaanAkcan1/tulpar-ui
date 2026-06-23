import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/tag";

/**
 * `<tulpar-tag>` — static, read-only tonal metadata.
 *
 * A tag labels an object with a tone (status / category). It is
 * **non-interactive**: no remove control, no click semantics (use
 * `<tulpar-chip>` for the interactive form). Tone always pairs with a leading
 * dot, a leading icon, or the label text — **never hue alone** (color is not
 * the sole signal).
 *
 * ## Tone
 * Built-in tones (`neutral | info | success | warning | danger`) are
 * attribute-only and auto-flip for `.dark`. `tone="custom"` resolves a brand
 * family name (`ilay`, `gok`, …) or a raw CSS color, or per-part overrides via
 * `bg` / `accent` / `text`.
 *
 * ## Variants
 * `soft-tonal` (default) · `outline` · `solid`.
 *
 * ## Shape
 * `square` (default — per-size radius) · `pill` · `sharp` (2px). The square
 * default deliberately contrasts with the pill Badge so the two object classes
 * read distinctly.
 *
 * ## Content
 * Default slot OR `label` prop → text (slot wins). `dot` → leading tone dot.
 * `icon` (raw SVG / emoji) OR `slot="icon"` → leading icon (icon wins over dot).
 * The label truncates with an ellipsis past `--tulpar-tag-max-width` (160px) and
 * sets the host `title` to the full text.
 *
 * ## Accessibility
 * The host is `role="status"`. Color is never the sole tone signal — always
 * pair with a dot, icon, or meaningful text.
 */
const meta: Meta = {
  title: "Display & Status/Tag",
  component: "tulpar-tag",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger", "custom"],
    },
    variant: {
      control: "select",
      options: ["soft-tonal", "outline", "solid"],
    },
    shape: {
      control: "select",
      options: ["square", "pill", "sharp"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    label: { control: "text" },
    dot: { control: "boolean" },
    icon: { control: "text" },
    disabled: { control: "boolean" },
    color: { control: "text" },
    bg: { control: "color" },
    accent: { control: "color" },
    text: { control: "color" },
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
  <div style="display:flex; flex-wrap:wrap; align-items:center; gap:10px;">${children}</div>
`;

const TONES = ["neutral", "info", "success", "warning", "danger"] as const;

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control maps to a property/attribute on
 * `<tulpar-tag>`.
 */
export const Default: Story = {
  args: {
    label: "Active",
    tone: "success",
    variant: "soft-tonal",
    shape: "square",
    size: "md",
    dot: true,
  },
  render: (args) => html`
    <div style="padding:40px;">
      <tulpar-tag
        tone=${args["tone"] ?? "neutral"}
        variant=${args["variant"] ?? "soft-tonal"}
        shape=${args["shape"] ?? "square"}
        size=${args["size"] ?? "md"}
        label=${args["label"] ?? ""}
        ?dot=${args["dot"]}
        icon=${args["icon"] ?? ""}
        ?disabled=${args["disabled"]}
        color=${args["color"] ?? ""}
        bg=${args["bg"] ?? ""}
        accent=${args["accent"] ?? ""}
        text=${args["text"] ?? ""}
      ></tulpar-tag>
    </div>
  `,
};

// ─── 2. Tones ────────────────────────────────────────────────────────────────

/**
 * **Tones** — all five built-in tones in the default soft-tonal variant. Each
 * carries a leading dot so tone is never conveyed by hue alone.
 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("All tones · soft-tonal · with dot")}
      ${row(
        ...TONES.map(
          (t) => html`<tulpar-tag tone=${t} dot label=${t[0].toUpperCase() + t.slice(1)}></tulpar-tag>`,
        ),
      )}
    </div>
  `,
};

// ─── 3. Variants ─────────────────────────────────────────────────────────────

/**
 * **Variants** — `soft-tonal` (default), `outline`, `solid`, each across all
 * five tones. Solid is the highest-emphasis form; soft-tonal is the default
 * for dense surfaces (grids, lists).
 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const variantRow = (variant: "soft-tonal" | "outline" | "solid") => html`
      ${sectionLabel(variant)}
      ${row(
        ...TONES.map(
          (t) =>
            html`<tulpar-tag
              tone=${t}
              variant=${variant}
              dot
              label=${t[0].toUpperCase() + t.slice(1)}
            ></tulpar-tag>`,
        ),
      )}
    `;
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
        ${variantRow("soft-tonal")} ${variantRow("outline")} ${variantRow("solid")}
      </div>
    `;
  },
};

// ─── 4. Shapes ───────────────────────────────────────────────────────────────

/**
 * **Shapes** — `square` (default, per-size radius), `pill`, and `sharp` (2px).
 * The square default is a deliberate identity choice: it contrasts with the
 * pill Badge so the two read as different object classes.
 */
export const Shapes: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const shapeRow = (shape: "square" | "pill" | "sharp") => html`
      ${sectionLabel(shape)}
      ${row(
        ...TONES.map(
          (t) =>
            html`<tulpar-tag
              tone=${t}
              shape=${shape}
              dot
              label=${t[0].toUpperCase() + t.slice(1)}
            ></tulpar-tag>`,
        ),
      )}
    `;
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
        ${shapeRow("square")} ${shapeRow("pill")} ${shapeRow("sharp")}
      </div>
    `;
  },
};

// ─── 5. Sizes ────────────────────────────────────────────────────────────────

/**
 * **Sizes** — the full `xs → xl` scale, baseline-aligned. Smaller tiers are the
 * grid-cell renderers; larger tiers suit standalone headers.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("xs → xl")}
      ${row(
        ...(["xs", "sm", "md", "lg", "xl"] as const).map(
          (s) => html`<tulpar-tag tone="success" size=${s} dot label=${s}></tulpar-tag>`,
        ),
      )}
    </div>
  `,
};

// ─── 6. DotAndIcon ───────────────────────────────────────────────────────────

/**
 * **Dot & Icon** — the two leading-element forms. A `dot` is the lightest tone
 * pairing; an `icon` (raw SVG / emoji prop, or `slot="icon"`) carries more
 * meaning. When both are set, the icon wins. Truncation is shown last.
 */
export const DotAndIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px; max-width:520px;">
      ${sectionLabel("Leading dot")}
      ${row(
        html`<tulpar-tag tone="info" dot label="In review"></tulpar-tag>`,
        html`<tulpar-tag tone="success" dot label="Active"></tulpar-tag>`,
        html`<tulpar-tag tone="warning" dot label="Pending"></tulpar-tag>`,
      )}

      ${sectionLabel("Icon — raw SVG prop")}
      ${row(
        html`<tulpar-tag
          tone="success"
          label="Verified"
          icon="<svg viewBox='0 0 16 16' fill='none' stroke='currentColor' stroke-width='2' aria-hidden='true'><path d='M3 8l3.5 3.5L13 4' stroke-linecap='round' stroke-linejoin='round'/></svg>"
        ></tulpar-tag>`,
        html`<tulpar-tag tone="warning" label="Deploying" icon="🚀"></tulpar-tag>`,
      )}

      ${sectionLabel("Icon — slot='icon' (wins over dot)")}
      ${row(
        html`<tulpar-tag tone="info" label="Synced" dot>
          <svg
            slot="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </tulpar-tag>`,
      )}

      ${sectionLabel("Truncation — overflow sets host title")}
      ${row(
        html`<tulpar-tag tone="neutral" label="This is a very long label that should truncate"></tulpar-tag>`,
      )}
    </div>
  `,
};

// ─── 7. CustomTone ───────────────────────────────────────────────────────────

/**
 * **CustomTone** — `tone="custom"` with a brand family name, a raw CSS color,
 * or per-part `bg` / `accent` / `text` overrides. Custom is the explicit escape
 * hatch — solid-variant contrast is the author's responsibility.
 */
export const CustomTone: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Brand families")}
      ${row(
        html`<tulpar-tag tone="custom" color="ilay" dot label="Ilay"></tulpar-tag>`,
        html`<tulpar-tag tone="custom" color="umay" dot label="Umay"></tulpar-tag>`,
        html`<tulpar-tag tone="custom" color="gok" dot label="Gök"></tulpar-tag>`,
      )}

      ${sectionLabel("Raw CSS color")}
      ${row(html`<tulpar-tag tone="custom" color="#0d9488" dot label="Teal"></tulpar-tag>`)}

      ${sectionLabel("Per-part overrides (bg / accent / text)")}
      ${row(
        html`<tulpar-tag
          tone="custom"
          bg="#1e1b4b"
          accent="#818cf8"
          text="#e0e7ff"
          dot
          label="Indigo"
        ></tulpar-tag>`,
      )}
    </div>
  `,
};

// ─── 8. GridDensity ──────────────────────────────────────────────────────────

/**
 * **GridDensity** — Tags as status renderers inside a faux data table at the
 * `sm` size. This is the endgame: atoms are the grid's status vocabulary.
 */
export const GridDensity: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const cell = "padding:7px 12px; font-size:13px;";
    const head = `${cell} font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; color:var(--tulpar-color-text-secondary,#74777a); background:var(--tulpar-color-bg-subtle,#f8f9fa);`;
    return html`
      <div style="padding:32px;">
        ${sectionLabel("Tags at sm in a faux grid row")}
        <div
          style="border:1px solid var(--tulpar-color-border-default,#e5e7eb); border-radius:8px;
                 overflow:hidden; max-width:480px; display:grid; grid-template-columns:1.4fr 1fr;"
        >
          <div style=${head}>Task</div>
          <div style=${head}>Status</div>
          <div style="${cell} border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);">
            Migrate database
          </div>
          <div style="${cell} border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);">
            <tulpar-tag size="sm" tone="success" dot label="Active"></tulpar-tag>
          </div>
          <div style="${cell} border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);">
            Review PR #482
          </div>
          <div style="${cell} border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);">
            <tulpar-tag size="sm" tone="warning" dot label="Pending"></tulpar-tag>
          </div>
          <div style="${cell} border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);">
            Deploy to prod
          </div>
          <div style="${cell} border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);">
            <tulpar-tag size="sm" tone="danger" dot label="Blocked"></tulpar-tag>
          </div>
        </div>
      </div>
    `;
  },
};

// ─── 9. DarkMode ─────────────────────────────────────────────────────────────

/**
 * **DarkMode** — all tones × variants on a dark surface. Built-in tones
 * auto-flip via the generated token sheet; this story forces `.dark` locally.
 */
export const DarkMode: Story = {
  parameters: {
    controls: { disable: true },
    backgrounds: { default: "dark" },
  },
  render: () => {
    const variantRow = (variant: "soft-tonal" | "outline" | "solid") => html`
      ${sectionLabel(variant)}
      ${row(
        ...TONES.map(
          (t) =>
            html`<tulpar-tag
              tone=${t}
              variant=${variant}
              dot
              label=${t[0].toUpperCase() + t.slice(1)}
            ></tulpar-tag>`,
        ),
      )}
    `;
    return html`
      <div
        class="dark"
        style="background:var(--tulpar-color-bg-canvas,#13171a); padding:40px; border-radius:12px;
               display:flex; flex-direction:column; gap:20px;"
      >
        ${variantRow("soft-tonal")} ${variantRow("outline")} ${variantRow("solid")}
      </div>
    `;
  },
};
