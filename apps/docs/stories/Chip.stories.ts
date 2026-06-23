import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/chip";

/**
 * `<tulpar-chip>` — the interactive display atom.
 *
 * A chip is an **activatable** tonal label. Unlike `<tulpar-tag>` (static,
 * read-only), the chip body is operable (click / Enter / Space → `tulpar-click`)
 * and can carry an independent remove control (`tulpar-remove`). It shares the
 * tag's size table + tone / variant / shape model.
 *
 * ## Variants
 * `soft-tonal` (default) · `outline` · `solid` · **`ghost`** (transparent at
 * rest, hovers into the soft-tonal surface — toolbar filter chips).
 *
 * ## Content
 * Default slot OR `label` prop → text. `icon` / `slot="icon"` → leading icon.
 * `avatar` (image URL or initials) / `slot="avatar"` → leading circular avatar
 * (wins over an icon). `removable` adds a trailing real `<button>` (its own tab
 * stop) that fires `tulpar-remove`.
 *
 * ## Interaction & a11y
 * The host is `role="button"`, focusable when enabled. Clicking the body or
 * Enter / Space fires `tulpar-click`. The remove button stops propagation;
 * Delete / Backspace on the focused chip also removes; focus then moves to a
 * neighbour so it's never orphaned. `selected` / `selectable` + `ChipGroup` are
 * **reserved for Wave 2**.
 */
const meta: Meta = {
  title: "Display & Status/Chip",
  component: "tulpar-chip",
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
      options: ["soft-tonal", "outline", "solid", "ghost"],
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
    icon: { control: "text" },
    avatar: { control: "text" },
    removable: { control: "boolean" },
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

const filterIcon = html`<svg
  slot="icon"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
</svg>`;

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control maps to a property/attribute. The
 * chip fires `tulpar-click` on the body and `tulpar-remove` on the × button.
 */
export const Default: Story = {
  args: {
    label: "Open",
    tone: "info",
    variant: "soft-tonal",
    shape: "square",
    size: "md",
    removable: true,
  },
  render: (args) => html`
    <div style="padding:40px;">
      <tulpar-chip
        tone=${args["tone"] ?? "neutral"}
        variant=${args["variant"] ?? "soft-tonal"}
        shape=${args["shape"] ?? "square"}
        size=${args["size"] ?? "md"}
        label=${args["label"] ?? ""}
        icon=${args["icon"] ?? ""}
        avatar=${args["avatar"] ?? ""}
        ?removable=${args["removable"]}
        ?disabled=${args["disabled"]}
        color=${args["color"] ?? ""}
        bg=${args["bg"] ?? ""}
        accent=${args["accent"] ?? ""}
        text=${args["text"] ?? ""}
      ></tulpar-chip>
    </div>
  `,
};

// ─── 2. Tones ────────────────────────────────────────────────────────────────

/**
 * **Tones** — all five tones in the default soft-tonal variant.
 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("All tones · soft-tonal")}
      ${row(
        ...TONES.map(
          (t) => html`<tulpar-chip tone=${t} label=${t[0].toUpperCase() + t.slice(1)}></tulpar-chip>`,
        ),
      )}
    </div>
  `,
};

// ─── 3. Variants ─────────────────────────────────────────────────────────────

/**
 * **Variants** — `soft-tonal` (default), `outline`, `solid`, and `ghost`.
 * `ghost` is transparent at rest and hovers into the tone's soft surface
 * (toolbar filter chips) — hover a ghost chip to see the surface appear.
 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const variantRow = (variant: "soft-tonal" | "outline" | "solid" | "ghost") => html`
      ${sectionLabel(variant)}
      ${row(
        ...TONES.map(
          (t) =>
            html`<tulpar-chip
              tone=${t}
              variant=${variant}
              label=${t[0].toUpperCase() + t.slice(1)}
            ></tulpar-chip>`,
        ),
      )}
    `;
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
        ${variantRow("soft-tonal")} ${variantRow("outline")} ${variantRow("solid")}
        ${variantRow("ghost")}
      </div>
    `;
  },
};

// ─── 4. Shapes ───────────────────────────────────────────────────────────────

/**
 * **Shapes** — `square` (default), `pill`, `sharp`.
 */
export const Shapes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("square")}
      ${row(...TONES.map((t) => html`<tulpar-chip tone=${t} shape="square" label=${t}></tulpar-chip>`))}
      ${sectionLabel("pill")}
      ${row(...TONES.map((t) => html`<tulpar-chip tone=${t} shape="pill" label=${t}></tulpar-chip>`))}
      ${sectionLabel("sharp")}
      ${row(...TONES.map((t) => html`<tulpar-chip tone=${t} shape="sharp" label=${t}></tulpar-chip>`))}
    </div>
  `,
};

// ─── 5. Sizes ────────────────────────────────────────────────────────────────

/**
 * **Sizes** — `xs → xl`.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("xs → xl")}
      ${row(
        ...(["xs", "sm", "md", "lg", "xl"] as const).map(
          (s) => html`<tulpar-chip tone="info" size=${s} label=${s}></tulpar-chip>`,
        ),
      )}
    </div>
  `,
};

// ─── 6. ClickableRemovable ───────────────────────────────────────────────────

/**
 * **Clickable & Removable** — interactive forms. The body fires `tulpar-click`;
 * the × fires `tulpar-remove` (independent tab stop). Removable chips below
 * remove themselves on the event so you can verify focus moves to a neighbour.
 */
export const ClickableRemovable: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const onClick = (e: Event) => {
      const chip = e.target as HTMLElement;
      const out = chip.parentElement?.parentElement?.querySelector(".chip-log");
      if (out) out.textContent = `tulpar-click → ${chip.getAttribute("label") ?? chip.textContent?.trim()}`;
    };
    const onRemove = (e: Event) => {
      const chip = e.currentTarget as HTMLElement;
      chip.remove();
    };
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
        <div @tulpar-click=${onClick}>
          ${sectionLabel("Clickable (body fires tulpar-click)")}
          ${row(
            html`<tulpar-chip label="All"></tulpar-chip>`,
            html`<tulpar-chip tone="info" label="Open"></tulpar-chip>`,
            html`<tulpar-chip tone="success" label="Closed"></tulpar-chip>`,
          )}
          <p class="chip-log" style="margin:8px 0 0; font-size:12px; min-height:16px; color:var(--tulpar-color-text-secondary,#74777a);">
            Click a chip…
          </p>
        </div>

        <div>
          ${sectionLabel("Removable (× fires tulpar-remove; focus moves to neighbour)")}
          ${row(
            html`<tulpar-chip removable label="kaan@example.com" @tulpar-remove=${onRemove}></tulpar-chip>`,
            html`<tulpar-chip removable tone="info" label="design" @tulpar-remove=${onRemove}></tulpar-chip>`,
            html`<tulpar-chip removable tone="success" label="approved" @tulpar-remove=${onRemove}></tulpar-chip>`,
          )}
        </div>

        <div>
          ${sectionLabel("Disabled (no events, not focusable)")}
          ${row(html`<tulpar-chip disabled label="Disabled"></tulpar-chip>`, html`<tulpar-chip disabled removable tone="info" label="Disabled + ×"></tulpar-chip>`)}
        </div>
      </div>
    `;
  },
};

// ─── 7. IconAndAvatar ────────────────────────────────────────────────────────

/**
 * **Icon & Avatar** — leading-element forms. An `icon` (prop or `slot="icon"`)
 * is a glyph; an `avatar` (image URL or initials, prop or `slot="avatar"`) is a
 * circular identity that bleeds to the leading edge and **wins over an icon**.
 */
export const IconAndAvatar: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Leading icon — slot='icon'")}
      ${row(
        html`<tulpar-chip variant="ghost" label="Status">${filterIcon}</tulpar-chip>`,
        html`<tulpar-chip variant="ghost" label="Owner">${filterIcon}</tulpar-chip>`,
        html`<tulpar-chip variant="ghost" label="Label">${filterIcon}</tulpar-chip>`,
      )}

      ${sectionLabel("Leading icon — emoji prop")}
      ${row(html`<tulpar-chip tone="warning" icon="🔥" label="Trending"></tulpar-chip>`)}

      ${sectionLabel("Leading avatar — initials (prop)")}
      ${row(
        html`<tulpar-chip removable avatar="JD" label="Jane Doe"></tulpar-chip>`,
        html`<tulpar-chip removable avatar="KA" tone="info" label="Kaan Akcan"></tulpar-chip>`,
      )}

      ${sectionLabel("Leading avatar — image (prop)")}
      ${row(
        html`<tulpar-chip
          removable
          avatar="https://i.pravatar.cc/64?img=12"
          label="Ada Lovelace"
        ></tulpar-chip>`,
      )}
    </div>
  `,
};

// ─── 8. CustomTone ───────────────────────────────────────────────────────────

/**
 * **CustomTone** — `tone="custom"` with a brand family, raw color, or per-part
 * overrides. Same model as Tag.
 */
export const CustomTone: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Brand families")}
      ${row(
        html`<tulpar-chip tone="custom" color="ilay" label="Ilay"></tulpar-chip>`,
        html`<tulpar-chip tone="custom" color="umay" label="Umay"></tulpar-chip>`,
        html`<tulpar-chip tone="custom" color="gok" label="Gök"></tulpar-chip>`,
      )}
      ${sectionLabel("Raw CSS color")}
      ${row(html`<tulpar-chip tone="custom" color="#0d9488" label="Teal"></tulpar-chip>`)}
      ${sectionLabel("Per-part overrides")}
      ${row(
        html`<tulpar-chip tone="custom" bg="#1e1b4b" accent="#818cf8" text="#e0e7ff" label="Indigo"></tulpar-chip>`,
      )}
    </div>
  `,
};

// ─── 9. DarkMode ─────────────────────────────────────────────────────────────

/**
 * **DarkMode** — all tones × variants (including ghost) on a dark surface.
 */
export const DarkMode: Story = {
  parameters: {
    controls: { disable: true },
    backgrounds: { default: "dark" },
  },
  render: () => {
    const variantRow = (variant: "soft-tonal" | "outline" | "solid" | "ghost") => html`
      ${sectionLabel(variant)}
      ${row(
        ...TONES.map(
          (t) =>
            html`<tulpar-chip
              tone=${t}
              variant=${variant}
              label=${t[0].toUpperCase() + t.slice(1)}
            ></tulpar-chip>`,
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
        ${variantRow("ghost")}
        ${sectionLabel("with avatar + removable")}
        ${row(
          html`<tulpar-chip removable avatar="JD" tone="info" label="Jane Doe"></tulpar-chip>`,
          html`<tulpar-chip removable avatar="KA" tone="success" label="Kaan Akcan"></tulpar-chip>`,
        )}
      </div>
    `;
  },
};
