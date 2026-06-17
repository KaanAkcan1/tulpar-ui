import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@tulpar-ui/core/button";

/**
 * Reusable inline-SVG icons (Lucide MIT) so stories don't need a CDN.
 * Real consumers project their own icons via slots — these are just demos.
 */
const checkIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`;

const arrowRightIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>`;

const trashIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <polyline points="3 6 5 6 21 6"></polyline>
  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
</svg>`;

const customSpinner = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="3"
  stroke-linecap="round"
  style="animation: tulpar-spin 600ms linear infinite; transform-origin: center;"
>
  <line x1="12" y1="2" x2="12" y2="6"></line>
  <line x1="12" y1="18" x2="12" y2="22"></line>
  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
</svg>`;

const meta: Meta = {
  title: "Components/Button",
  component: "tulpar-button",
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "info",
        "success",
        "warn",
        "help",
        "danger",
        "contrast",
        "premium",
      ],
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "tonal", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
    },
    shape: {
      control: "select",
      options: ["default", "round", "circle"],
    },
    color: {
      control: "select",
      options: [
        undefined, "al", "kizagan", "umay", "ilay", "erlik", "kam", "mergen",
        "gok", "ay", "yersu", "tulpar", "otuken", "kayin", "ulgen", "kuyas",
        "alaz", "burkut", "colpan", "ayzit", "boz", "kara", "yagiz",
      ],
    },
    "icon-position": { control: "select", options: ["start", "end", "top", "bottom"] },
    "loading-position": { control: "select", options: ["start", "center", "end"] },
    justify: { control: "select", options: ["start", "center", "end", "between"] },
    raised: { control: "boolean" },
    block: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    iconOnly: { control: "boolean" },
    "icon-separator": { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

/**
 * **Playground** — every declared control is wired to a real observed attribute
 * on `<tulpar-button>`, so changing severity, variant, size, shape, **color**,
 * icon-position, loading-position, **justify**, **raised**, **block**,
 * **icon-only** and **icon-separator** in the controls panel all visibly affect
 * the rendered button. Toggle `icon-only` together with `severity="danger"` for
 * the destructive icon button, or pick a `color` to override the severity hue.
 */
export const Default: Story = {
  args: { severity: "primary", variant: "solid", size: "md", shape: "default" },
  render: (args) => html`
    <tulpar-button
      severity=${args["severity"] ?? nothing}
      variant=${args["variant"] ?? nothing}
      size=${args["size"] ?? nothing}
      shape=${args["shape"] ?? nothing}
      color=${args["color"] ?? nothing}
      icon-position=${args["icon-position"] ?? nothing}
      loading-position=${args["loading-position"] ?? nothing}
      justify=${args["justify"] ?? nothing}
      ?raised=${args["raised"]}
      ?block=${args["block"]}
      ?disabled=${args["disabled"]}
      ?loading=${args["loading"]}
      ?icon-only=${args["iconOnly"]}
      ?icon-separator=${args["icon-separator"]}
    >
      <span slot="start">${checkIcon}</span>
      Button
    </tulpar-button>
  `,
};

/**
 * **CardActions** — a realistic composition: a settings card whose footer pairs
 * a ghost "Cancel" with a primary "Save changes", plus a destructive icon-only
 * action. Demonstrates how the button family reads inside real product UI.
 */
export const CardActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div
      style="max-width:420px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:12px; background:var(--tulpar-color-bg-raised,#fff); overflow:hidden;"
    >
      <div style="padding:20px 20px 0;">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
          <div>
            <h3 style="margin:0 0 4px; font-size:1.05rem;">Workspace settings</h3>
            <p style="margin:0; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#74777a);">
              Manage how your team collaborates in this workspace.
            </p>
          </div>
          <tulpar-button icon-only variant="ghost" severity="danger" aria-label="Delete workspace">
            ${trashIcon}
          </tulpar-button>
        </div>
      </div>
      <div
        style="display:flex; justify-content:flex-end; gap:8px; padding:16px 20px; margin-top:20px; border-top:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-surface,#f6f8f8);"
      >
        <tulpar-button variant="ghost" severity="secondary">Cancel</tulpar-button>
        <tulpar-button severity="primary">
          <span slot="start">${checkIcon}</span>
          Save changes
        </tulpar-button>
      </div>
    </div>
  `,
};

export const AllSeverities: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px; flex-wrap: wrap;">
      <tulpar-button severity="primary">Primary</tulpar-button>
      <tulpar-button severity="secondary">Secondary</tulpar-button>
      <tulpar-button severity="info">Info</tulpar-button>
      <tulpar-button severity="success">Success</tulpar-button>
      <tulpar-button severity="warn">Warn</tulpar-button>
      <tulpar-button severity="help">Help</tulpar-button>
      <tulpar-button severity="danger">Danger</tulpar-button>
      <tulpar-button severity="contrast">Contrast</tulpar-button>
      <tulpar-button severity="premium">Premium</tulpar-button>
    </div>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <tulpar-button variant="solid">Solid</tulpar-button>
      <tulpar-button variant="outlined">Outlined</tulpar-button>
      <tulpar-button variant="tonal">Tonal</tulpar-button>
      <tulpar-button variant="ghost">Ghost</tulpar-button>
      <tulpar-button variant="link">Link</tulpar-button>
    </div>
  `,
};

export const SeverityVariantMatrix: Story = {
  render: () => {
    const sevs = ["primary", "secondary", "info", "success", "warn", "help", "danger", "contrast"] as const;
    const vars = ["solid", "outlined", "tonal", "ghost"] as const;
    return html`
      <table style="border-spacing: 8px;">
        ${vars.map(
          (v) => html`
            <tr>
              <td style="font-family: monospace; color: #74777a; padding-right: 12px;">${v}</td>
              ${sevs.map(
                (s) => html`<td><tulpar-button severity=${s} variant=${v}>${s}</tulpar-button></td>`,
              )}
            </tr>
          `,
        )}
      </table>
    `;
  },
};

export const ColorOverrides: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px; flex-wrap: wrap;">
      <tulpar-button color="ulgen">Ulgen (Upgrade)</tulpar-button>
      <tulpar-button color="otuken">Otuken</tulpar-button>
      <tulpar-button color="kizagan">Kizagan</tulpar-button>
      <tulpar-button color="kam">Kam</tulpar-button>
      <tulpar-button color="yersu" variant="outlined">Yersu outlined</tulpar-button>
      <tulpar-button color="erlik" variant="tonal">Erlik tonal</tulpar-button>
      <tulpar-button color="kuyas" variant="ghost">Kuyas ghost</tulpar-button>
      <tulpar-button color="ulgen">Ulgen (dark text auto)</tulpar-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px; align-items: center; flex-wrap: wrap;">
      <tulpar-button size="xs">xs</tulpar-button>
      <tulpar-button size="sm">sm</tulpar-button>
      <tulpar-button size="md">md</tulpar-button>
      <tulpar-button size="lg">lg</tulpar-button>
      <tulpar-button size="xl">xl</tulpar-button>
      <tulpar-button size="2xl">2xl</tulpar-button>
      <tulpar-button size="3xl">3xl</tulpar-button>
    </div>
  `,
};

export const Shapes: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px; align-items: center;">
      <tulpar-button shape="default">Default</tulpar-button>
      <tulpar-button shape="round">Round pill</tulpar-button>
      <tulpar-button shape="circle" aria-label="Confirm">${checkIcon}</tulpar-button>
    </div>
  `,
};

export const WithStartIcon: Story = {
  render: () => html`
    <tulpar-button>
      <span slot="start">${checkIcon}</span>
      Confirm
    </tulpar-button>
  `,
};

export const WithEndIcon: Story = {
  render: () => html`
    <tulpar-button>
      Continue
      <span slot="end">${arrowRightIcon}</span>
    </tulpar-button>
  `,
};

export const WithBothIcons: Story = {
  render: () => html`
    <tulpar-button>
      <span slot="start">${checkIcon}</span>
      Save and continue
      <span slot="end">${arrowRightIcon}</span>
    </tulpar-button>
  `,
};

export const IconPositionTop: Story = {
  render: () => html`
    <div style="display:flex; gap: 12px;">
      <tulpar-button icon-position="top" size="lg">
        <span slot="start">${checkIcon}</span>
        Confirm
      </tulpar-button>
      <tulpar-button icon-position="bottom" size="lg">
        <span slot="start">${checkIcon}</span>
        Confirm
      </tulpar-button>
    </div>
  `,
};

export const IconSeparator: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px; flex-wrap: wrap;">
      <tulpar-button icon-separator>
        <span slot="start">${checkIcon}</span>
        With separator
      </tulpar-button>
      <tulpar-button icon-separator variant="outlined">
        <span slot="start">${checkIcon}</span>
        Outlined + separator
      </tulpar-button>
      <tulpar-button icon-separator icon-position="top" size="lg">
        <span slot="start">${checkIcon}</span>
        Column + separator
      </tulpar-button>
    </div>
  `,
};

export const IconOnlyVariants: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px; align-items: center;">
      <tulpar-button icon-only aria-label="Confirm">${checkIcon}</tulpar-button>
      <tulpar-button icon-only shape="circle" aria-label="Confirm">${checkIcon}</tulpar-button>
      <tulpar-button icon-only severity="danger" aria-label="Delete">${trashIcon}</tulpar-button>
      <tulpar-button icon-only severity="danger" shape="circle" variant="outlined" aria-label="Delete">${trashIcon}</tulpar-button>
    </div>
  `,
};

export const Raised: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px;">
      <tulpar-button raised>Raised solid</tulpar-button>
      <tulpar-button raised variant="outlined">Raised outlined</tulpar-button>
      <tulpar-button raised variant="tonal" severity="info">Raised tonal info</tulpar-button>
    </div>
  `,
};

export const Block: Story = {
  render: () => html`
    <div style="width: 400px; display: flex; flex-direction: column; gap: 8px;">
      <tulpar-button block>Full-width primary</tulpar-button>
      <tulpar-button block variant="outlined" justify="between">
        <span slot="start">${checkIcon}</span>
        Justified between
        <span slot="end">${arrowRightIcon}</span>
      </tulpar-button>
    </div>
  `,
};

export const LoadingCenter: Story = {
  render: () => html`<tulpar-button loading>Save</tulpar-button>`,
};

export const LoadingWithLabel: Story = {
  render: () => html`<tulpar-button loading loading-label="Saving…">Save</tulpar-button>`,
};

export const LoadingStart: Story = {
  render: () => html`
    <tulpar-button loading loading-position="start">
      <span slot="start">${checkIcon}</span>
      Save
    </tulpar-button>
  `,
};

export const LoadingEnd: Story = {
  render: () => html`
    <tulpar-button loading loading-position="end">
      Continue
      <span slot="end">${arrowRightIcon}</span>
    </tulpar-button>
  `,
};

export const LoadingCustomIcon: Story = {
  render: () => html`
    <tulpar-button loading>
      <span slot="loading-icon">${customSpinner}</span>
      Save
    </tulpar-button>
  `,
};

export const DataDisabledTooltipPattern: Story = {
  render: () => html`
    <div title="You don't have permission to delete">
      <tulpar-button data-disabled severity="danger">Delete</tulpar-button>
    </div>
    <p style="font-size: 12px; color: #74777a; margin-top: 8px;">
      Hover the button — the tooltip remains active because <code>data-disabled</code>
      styles disabled but does NOT block pointer events.
    </p>
  `,
};

export const GoldUpgradeCTA: Story = {
  render: () => html`
    <tulpar-button color="ulgen" raised>
      <span slot="start">${checkIcon}</span>
      Upgrade to Pro
    </tulpar-button>
  `,
};

export const AsLink: Story = {
  render: () => html`
    <tulpar-button href="https://example.com" target="_blank" rel="noopener">
      Open in new tab
    </tulpar-button>
  `,
};

export const FormSubmission: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        alert("Form submitted!");
      }}
    >
      <input name="email" type="email" placeholder="Email" />
      <tulpar-button type="submit">Submit</tulpar-button>
    </form>
  `,
};

// ─── v0.3.1 additions ─────────────────────────────────────────────────────────
// These stories demonstrate the new :icon prop, auto icon-only, and tooltip.
// Existing slot-based stories above are preserved — they document the escape
// hatch pattern for non-Lucide icon libraries.

/**
 * **WithIconProp** — demonstrates the `icon` / `icon-size` convenience
 * attribute vs. the slot-based fallback shown in `WithStartIcon`.
 *
 * In the core Web Component the `icon` attribute is not wired — icon rendering
 * lives in the Vue/Angular wrappers. This story uses inline SVG via
 * `<span slot="start">` to simulate the same visual output for documentation
 * parity, showing both patterns side-by-side.
 */
export const WithIconProp: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px;">
      <!-- Vue/Angular wrapper usage (shown as code comment for documentation) -->
      <div>
        <p style="margin:0 0 8px; font-size:12px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:#74777a; font-family:monospace;">
          :icon prop (Vue) / [icon] input (Angular)
        </p>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <!-- Simulated: <TulparButton severity="success" :icon="Check">Save</TulparButton> -->
          <tulpar-button severity="success">
            <span slot="start">${checkIcon}</span>
            Save
          </tulpar-button>
          <!-- Simulated: icon-size override -->
          <tulpar-button severity="premium" size="lg">
            <span slot="start"
              ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
            Go Pro
          </tulpar-button>
          <!-- Simulated: icon-position="top" -->
          <tulpar-button icon-position="top" size="lg">
            <span slot="start">${checkIcon}</span>
            Confirm
          </tulpar-button>
        </div>
      </div>

      <div style="background:#15110b; padding:16px 20px; border-radius:6px; font-family:monospace; font-size:13px; color:#d9e0df; white-space:pre;"><!-- Vue -->
&lt;TulparButton severity="success" :icon="Check"&gt;Save&lt;/TulparButton&gt;
&lt;TulparButton severity="premium" size="lg" :icon="Crown" :icon-size="24"&gt;Go Pro&lt;/TulparButton&gt;
&lt;TulparButton :icon="Check" icon-position="top" size="lg"&gt;Confirm&lt;/TulparButton&gt;

&lt;!-- Angular --&gt;
&lt;tulpar-button-ng severity="success" [icon]="Check"&gt;Save&lt;/tulpar-button-ng&gt;
&lt;tulpar-button-ng severity="premium" size="lg" [icon]="Crown" [iconSize]="24"&gt;Go Pro&lt;/tulpar-button-ng&gt;</div>
    </div>
  `,
};

/**
 * **IconOnlyAutoDetect** — when `icon` is set AND no text is in the default slot,
 * the wrapper automatically applies `icon-only` mode (square, fixed width = height).
 * No explicit `icon-only` attribute needed.
 *
 * This story uses explicit `icon-only` on the core element to simulate the same
 * result, since the auto-detection lives in the Vue/Angular wrappers.
 */
export const IconOnlyAutoDetect: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px;">
      <div>
        <p style="margin:0 0 8px; font-size:12px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:#74777a; font-family:monospace;">
          Auto icon-only — no text in default slot
        </p>
        <div style="display:flex; gap:8px; align-items:center;">
          <!-- icon + no text → auto icon-only -->
          <tulpar-button icon-only severity="danger" aria-label="Delete item">${trashIcon}</tulpar-button>
          <tulpar-button icon-only severity="secondary" aria-label="Settings">${checkIcon}</tulpar-button>
          <tulpar-button icon-only severity="success" shape="circle" aria-label="Save">${checkIcon}</tulpar-button>
          <!-- explicit iconOnly is still valid -->
          <tulpar-button icon-only severity="premium" shape="round" aria-label="Premium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </tulpar-button>
        </div>
      </div>

      <div style="background:#15110b; padding:16px 20px; border-radius:6px; font-family:monospace; font-size:13px; color:#d9e0df; white-space:pre;"><!-- Vue: icon + no text = auto icon-only, no :icon-only prop needed -->
&lt;TulparButton severity="danger" :icon="Trash2" aria-label="Delete item" /&gt;
&lt;TulparButton severity="secondary" :icon="Settings" aria-label="Settings" /&gt;
&lt;TulparButton severity="success" :icon="Save" shape="circle" aria-label="Save" /&gt;

&lt;!-- Angular --&gt;
&lt;tulpar-button-ng severity="danger" [icon]="Trash2" ariaLabel="Delete item"&gt;&lt;/tulpar-button-ng&gt;
&lt;tulpar-button-ng severity="secondary" [icon]="Settings" ariaLabel="Settings"&gt;&lt;/tulpar-button-ng&gt;</div>
    </div>
  `,
};

// ─── v0.7 additions ───────────────────────────────────────────────────────────
// InteractionStates, Premium, RadiusScale demonstrate the v0.7 button polish:
// surface physics, press feedback, hover lift, semantic disabled, radius scale,
// premium +1 light, and reflow-safe loading spinner.

/**
 * **InteractionStates** — rest / hover / active / focus / disabled / loading
 * laid out side by side for `solid` and `outlined`.
 *
 * Hover/active/focus are interaction-driven — the viewer triggers them by
 * hovering or clicking. `disabled` and `loading` are static so they are always
 * visible without interaction.
 */
export const InteractionStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <style>
      .state-grid {
        display: grid;
        grid-template-columns: 80px repeat(6, auto);
        align-items: center;
        gap: 12px 16px;
        font-size: 11px;
        font-family: monospace;
        color: var(--tulpar-color-text-secondary, #74777a);
      }
      .state-grid .header { font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    </style>
    <div class="state-grid">
      <span class="header">variant</span>
      <span class="header">rest</span>
      <span class="header">hover →</span>
      <span class="header">active ↓</span>
      <span class="header">focus ⌨</span>
      <span class="header">disabled</span>
      <span class="header">loading</span>

      <span>solid</span>
      <tulpar-button severity="primary">Save</tulpar-button>
      <tulpar-button severity="primary">Save</tulpar-button>
      <tulpar-button severity="primary">Save</tulpar-button>
      <tulpar-button severity="primary">Save</tulpar-button>
      <tulpar-button severity="primary" disabled>Save</tulpar-button>
      <tulpar-button severity="primary" loading>Save</tulpar-button>

      <span>outlined</span>
      <tulpar-button severity="primary" variant="outlined">Save</tulpar-button>
      <tulpar-button severity="primary" variant="outlined">Save</tulpar-button>
      <tulpar-button severity="primary" variant="outlined">Save</tulpar-button>
      <tulpar-button severity="primary" variant="outlined">Save</tulpar-button>
      <tulpar-button severity="primary" variant="outlined" disabled>Save</tulpar-button>
      <tulpar-button severity="primary" variant="outlined" loading>Save</tulpar-button>

      <span>ghost</span>
      <tulpar-button severity="primary" variant="ghost">Save</tulpar-button>
      <tulpar-button severity="primary" variant="ghost">Save</tulpar-button>
      <tulpar-button severity="primary" variant="ghost">Save</tulpar-button>
      <tulpar-button severity="primary" variant="ghost">Save</tulpar-button>
      <tulpar-button severity="primary" variant="ghost" disabled>Save</tulpar-button>
      <tulpar-button severity="primary" variant="ghost" loading>Save</tulpar-button>
    </div>
    <p style="margin-top:16px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
      Hover the <em>hover</em> column buttons and press the <em>active</em> column buttons to
      see lift / depression transitions. The <em>disabled</em> and <em>loading</em> columns
      are always static — v0.7 uses semantic disabled (not <code>opacity:0.5</code>).
    </p>
  `,
};

/**
 * **Premium** — `severity="premium"` with `variant="solid"` demonstrating the
 * v0.7 +1 light surface treatment: tonal top highlight + elevated ambient shadow.
 */
export const Premium: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <tulpar-button severity="premium">
        <span slot="start">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </span>
        Upgrade to Pro
      </tulpar-button>
      <tulpar-button severity="premium" size="lg">
        <span slot="start">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </span>
        Go Premium
      </tulpar-button>
      <tulpar-button severity="premium" variant="outlined">Premium outlined</tulpar-button>
      <tulpar-button severity="premium" variant="tonal">Premium tonal</tulpar-button>
      <tulpar-button severity="premium" raised>Premium raised</tulpar-button>
    </div>
    <p style="margin-top:12px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
      v0.7 premium solid: tonal top highlight + brand-tinted ambient shadow.
      Raised adds an extra shadow layer. Outlined/tonal share the same hue.
    </p>
  `,
};

/**
 * **RadiusScale** — all sizes rendered together to show the 5→12 px radius
 * ramp (xs:5px → sm:6px → md:7px → lg:8px → xl:9px → 2xl:10px → 3xl:12px).
 */
export const RadiusScale: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <tulpar-button size="xs" severity="primary">xs</tulpar-button>
        <span style="font-size:11px; font-family:monospace; color:var(--tulpar-color-text-secondary,#74777a);">r=5px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <tulpar-button size="sm" severity="primary">sm</tulpar-button>
        <span style="font-size:11px; font-family:monospace; color:var(--tulpar-color-text-secondary,#74777a);">r=6px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <tulpar-button size="md" severity="primary">md</tulpar-button>
        <span style="font-size:11px; font-family:monospace; color:var(--tulpar-color-text-secondary,#74777a);">r=7px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <tulpar-button size="lg" severity="primary">lg</tulpar-button>
        <span style="font-size:11px; font-family:monospace; color:var(--tulpar-color-text-secondary,#74777a);">r=8px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <tulpar-button size="xl" severity="primary">xl</tulpar-button>
        <span style="font-size:11px; font-family:monospace; color:var(--tulpar-color-text-secondary,#74777a);">r=9px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <tulpar-button size="2xl" severity="primary">2xl</tulpar-button>
        <span style="font-size:11px; font-family:monospace; color:var(--tulpar-color-text-secondary,#74777a);">r=10px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <tulpar-button size="3xl" severity="primary">3xl</tulpar-button>
        <span style="font-size:11px; font-family:monospace; color:var(--tulpar-color-text-secondary,#74777a);">r=12px</span>
      </div>
    </div>
    <p style="margin-top:12px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
      v0.7 per-size radius ramp — 5 → 6 → 7 → 8 → 9 → 10 → 12 px (xs→3xl).
      Driven by <code>--tulpar-button-radius-{size}</code> tokens.
    </p>
  `,
};

/**
 * **WithTooltip** — string tooltip shown on hover and `:focus-visible`.
 * Rendered natively by the core Web Component via `tooltip` attribute.
 * Especially useful for icon-only buttons where visual label is absent.
 */
export const WithTooltip: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px;">
      <div>
        <p style="margin:0 0 8px; font-size:12px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:#74777a; font-family:monospace;">
          Hover or focus each button to see the tooltip
        </p>
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; padding:32px 0 16px;">
          <!-- Icon-only + tooltip -->
          <tulpar-button icon-only aria-label="Open settings" tooltip="Open settings">
            ${checkIcon}
          </tulpar-button>
          <!-- Labelled button + tooltip -->
          <tulpar-button severity="danger" tooltip="Permanently delete this item">
            <span slot="start">${trashIcon}</span>
            Delete
          </tulpar-button>
          <!-- Anchor + tooltip -->
          <tulpar-button
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            tooltip="Opens in a new tab"
          >
            <span slot="start">${arrowRightIcon}</span>
            Visit Example
          </tulpar-button>
        </div>
        <p style="font-size:12px; color:#74777a; margin:0;">
          Tooltip uses <code>role="tooltip"</code> + <code>aria-describedby</code> for full
          keyboard and screen reader support. Shows on hover and focus-visible.
        </p>
      </div>

      <div style="background:#15110b; padding:16px 20px; border-radius:6px; font-family:monospace; font-size:13px; color:#d9e0df; white-space:pre;">&lt;!-- Core Web Component --&gt;
&lt;tulpar-button icon-only aria-label="Open settings" tooltip="Open settings"&gt;...&lt;/tulpar-button&gt;
&lt;tulpar-button severity="danger" tooltip="Permanently delete this item"&gt;Delete&lt;/tulpar-button&gt;

&lt;!-- Vue wrapper --&gt;
&lt;TulparButton :icon="Settings" tooltip="Open settings" aria-label="Open settings" /&gt;

&lt;!-- Angular wrapper --&gt;
&lt;tulpar-button-ng [icon]="Settings" tooltip="Open settings" ariaLabel="Open settings"&gt;&lt;/tulpar-button-ng&gt;</div>
    </div>
  `,
};
