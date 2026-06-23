import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/avatar";

/**
 * `<tulpar-avatar>` — identity atom.
 *
 * Renders a user's identity with a graceful fallback cascade:
 *
 *   `src` (loads) → `<img>` · src fails / none → **initials** (manual or derived
 *   from `name`) · no initials → **generic user icon**.
 *
 * ## Deterministic color
 * The initials background is a stable brand-family color derived from `name`
 * (skips semantic-coded red / amber so an avatar never reads as a danger state).
 * The `color` prop overrides with a brand-family name or a raw CSS color.
 *
 * ## Shape & size
 * `rounded-square` (default) or `circle`; `xs → xl`.
 *
 * ## Custom content
 * The default slot overrides the whole cascade (e.g. a custom icon).
 *
 * ## Accessibility
 * Image avatars use `alt` (falls back to `name`). Initials / icon fallbacks set
 * `role="img"` + `aria-label="{name}"` when a name is present. AvatarGroup
 * (stacking) is **reserved for Wave 2** — the group look below is composed
 * in-story.
 */
const meta: Meta = {
  title: "Display & Status/Avatar",
  component: "tulpar-avatar",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    src: { control: "text" },
    name: { control: "text" },
    initials: { control: "text" },
    alt: { control: "text" },
    shape: {
      control: "select",
      options: ["rounded-square", "circle"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    color: { control: "text" },
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
  <div style="display:flex; flex-wrap:wrap; align-items:flex-end; gap:14px;">${children}</div>
`;

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

// A reliable avatar image source for the docs.
const IMG = (n: number) => `https://i.pravatar.cc/96?img=${n}`;

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control. With a `name` and no `src`, the
 * initials + deterministic color fallback renders.
 */
export const Default: Story = {
  args: {
    name: "Jane Doe",
    shape: "rounded-square",
    size: "lg",
  },
  render: (args) => html`
    <div style="padding:40px;">
      <tulpar-avatar
        src=${args["src"] ?? ""}
        name=${args["name"] ?? ""}
        initials=${args["initials"] ?? ""}
        alt=${args["alt"] ?? ""}
        shape=${args["shape"] ?? "rounded-square"}
        size=${args["size"] ?? "md"}
        color=${args["color"] ?? ""}
      ></tulpar-avatar>
    </div>
  `,
};

// ─── 2. Fallbacks ────────────────────────────────────────────────────────────

/**
 * **Fallbacks** — the three rungs of the cascade: image (loads), initials
 * (from `name` or manual `initials`), and the generic user icon (no name).
 * A broken `src` falls through to initials.
 */
export const Fallbacks: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Image (src loads)")}
      ${row(
        html`<tulpar-avatar size="lg" src=${IMG(11)} name="Ada Lovelace"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" src=${IMG(5)} name="Alan Turing"></tulpar-avatar>`,
      )}

      ${sectionLabel("Initials (derived from name · deterministic color)")}
      ${row(
        html`<tulpar-avatar size="lg" name="Jane Doe"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Kaan Akcan"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Mehmet Yılmaz"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" initials="RT" name="Reşat Tunç"></tulpar-avatar>`,
      )}

      ${sectionLabel("Icon fallback (no name)")}
      ${row(html`<tulpar-avatar size="lg"></tulpar-avatar>`)}

      ${sectionLabel("Broken src → falls through to initials")}
      ${row(html`<tulpar-avatar size="lg" src="https://invalid.example/none.png" name="Grace Hopper"></tulpar-avatar>`)}
    </div>
  `,
};

// ─── 3. Shapes ───────────────────────────────────────────────────────────────

/**
 * **Shapes** — `rounded-square` (default identity) vs `circle`, across image and
 * initials.
 */
export const Shapes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("rounded-square (default)")}
      ${row(
        html`<tulpar-avatar size="lg" shape="rounded-square" src=${IMG(11)} name="Ada"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" shape="rounded-square" name="Jane Doe"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" shape="rounded-square"></tulpar-avatar>`,
      )}
      ${sectionLabel("circle")}
      ${row(
        html`<tulpar-avatar size="lg" shape="circle" src=${IMG(11)} name="Ada"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" shape="circle" name="Jane Doe"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" shape="circle"></tulpar-avatar>`,
      )}
    </div>
  `,
};

// ─── 4. Sizes ────────────────────────────────────────────────────────────────

/**
 * **Sizes** — `xs → xl`. xs/sm cap initials to one letter; md+ show two.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Image · xs → xl")}
      ${row(...SIZES.map((s) => html`<tulpar-avatar size=${s} src=${IMG(8)} name="Ada"></tulpar-avatar>`))}
      ${sectionLabel("Initials · xs → xl")}
      ${row(...SIZES.map((s) => html`<tulpar-avatar size=${s} name="Jane Doe"></tulpar-avatar>`))}
      ${sectionLabel("Icon · xs → xl")}
      ${row(...SIZES.map((s) => html`<tulpar-avatar size=${s}></tulpar-avatar>`))}
    </div>
  `,
};

// ─── 5. Color ────────────────────────────────────────────────────────────────

/**
 * **Color** — the initials background. By default it's deterministic from
 * `name`; the `color` prop overrides with a brand-family name or a raw CSS
 * color. Custom slot content (last) overrides the entire cascade.
 */
export const Color: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
      ${sectionLabel("Deterministic (varies by name)")}
      ${row(
        html`<tulpar-avatar size="lg" name="Ada Lovelace"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Grace Hopper"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Alan Turing"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Katherine Johnson"></tulpar-avatar>`,
      )}
      ${sectionLabel("color override — brand family / raw color")}
      ${row(
        html`<tulpar-avatar size="lg" name="Ilay" color="ilay"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Gok" color="gok"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" initials="TE" name="Teal" color="#0d9488"></tulpar-avatar>`,
      )}
      ${sectionLabel("Custom slot content (overrides cascade)")}
      ${row(
        html`<tulpar-avatar size="lg" shape="circle">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            style="width:60%; height:60%; color:var(--tulpar-color-text-secondary,#74777a);"
            aria-hidden="true"
          >
            <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" />
          </svg>
        </tulpar-avatar>`,
      )}
    </div>
  `,
};

// ─── 6. GroupLook ────────────────────────────────────────────────────────────

/**
 * **Group look** — overlapping stack with a surface ring + an overflow count.
 * AvatarGroup is **reserved for Wave 2**; this stack is composed in-story
 * (negative margin + box-shadow ring) to show the intended pattern.
 */
export const GroupLook: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const ring =
      "box-shadow:0 0 0 2px var(--tulpar-color-bg-canvas,#fff); border-radius:6px;";
    const overlap = "margin-left:-8px;";
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:20px;">
        ${sectionLabel("Overlapping stack + overflow (composed — Wave 2 native API reserved)")}
        <div style="display:inline-flex; align-items:center;">
          <tulpar-avatar size="md" src=${IMG(11)} name="Ada" style=${ring}></tulpar-avatar>
          <tulpar-avatar size="md" name="Bob King" style="${ring}${overlap}"></tulpar-avatar>
          <tulpar-avatar size="md" name="Cara Liu" style="${ring}${overlap}"></tulpar-avatar>
          <tulpar-avatar size="md" name="Jane Doe" style="${ring}${overlap}"></tulpar-avatar>
          <span
            style="${ring}${overlap} display:inline-flex; align-items:center; justify-content:center;
                   width:32px; height:32px; font-size:11px; font-weight:600;
                   background:var(--tulpar-color-bg-subtle,#f1f3f5);
                   color:var(--tulpar-color-text-secondary,#74777a);"
            >+5</span
          >
        </div>
      </div>
    `;
  },
};

// ─── 7. GridDensity ──────────────────────────────────────────────────────────

/**
 * **GridDensity** — Avatars as the leading cell in a faux table at `sm`.
 */
export const GridDensity: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const cell = "padding:7px 12px; font-size:13px;";
    const head = `${cell} font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; color:var(--tulpar-color-text-secondary,#74777a); background:var(--tulpar-color-bg-subtle,#f8f9fa);`;
    const border = "border-top:1px solid var(--tulpar-color-border-default,#e5e7eb);";
    const nameCell = "display:flex; align-items:center; gap:8px;";
    return html`
      <div style="padding:32px;">
        ${sectionLabel("Avatars at sm in a faux grid")}
        <div
          style="border:1px solid var(--tulpar-color-border-default,#e5e7eb); border-radius:8px;
                 overflow:hidden; max-width:420px; display:grid; grid-template-columns:1fr 120px;"
        >
          <div style=${head}>User</div>
          <div style=${head}>Role</div>
          <div style="${cell}${border}${nameCell}">
            <tulpar-avatar size="sm" src=${IMG(11)} name="Ada Byron"></tulpar-avatar>Ada Byron
          </div>
          <div style="${cell}${border}">Owner</div>
          <div style="${cell}${border}${nameCell}">
            <tulpar-avatar size="sm" name="Jane Doe"></tulpar-avatar>Jane Doe
          </div>
          <div style="${cell}${border}">Editor</div>
          <div style="${cell}${border}${nameCell}">
            <tulpar-avatar size="sm"></tulpar-avatar>Invited user
          </div>
          <div style="${cell}${border}">Viewer</div>
        </div>
      </div>
    `;
  },
};

// ─── 8. DarkMode ─────────────────────────────────────────────────────────────

/**
 * **DarkMode** — the cascade on a dark surface. Initials colors use the
 * dark-mode variant of each brand family.
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
             display:flex; flex-direction:column; gap:20px;"
    >
      ${sectionLabel("Image · initials · icon")}
      ${row(
        html`<tulpar-avatar size="lg" src=${IMG(11)} name="Ada"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Jane Doe"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Kaan Akcan"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" name="Mehmet Yılmaz"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg"></tulpar-avatar>`,
      )}
      ${sectionLabel("circle")}
      ${row(
        html`<tulpar-avatar size="lg" shape="circle" src=${IMG(5)} name="Alan"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" shape="circle" name="Grace Hopper"></tulpar-avatar>`,
        html`<tulpar-avatar size="lg" shape="circle"></tulpar-avatar>`,
      )}
    </div>
  `,
};
