import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
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
        undefined, "navy", "gold", "stone", "slate",
        "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
        "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
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

export const Default: Story = {
  args: { severity: "primary", variant: "solid", size: "md" },
  render: (args) => html`
    <tulpar-button
      severity=${args["severity"]}
      variant=${args["variant"]}
      size=${args["size"]}
      shape=${args["shape"] ?? "default"}
      ?disabled=${args["disabled"]}
      ?loading=${args["loading"]}
    >
      Button
    </tulpar-button>
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
              <td style="font-family: monospace; color: #78716c; padding-right: 12px;">${v}</td>
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
      <tulpar-button color="gold">Gold (Upgrade)</tulpar-button>
      <tulpar-button color="emerald">Emerald</tulpar-button>
      <tulpar-button color="rose">Rose</tulpar-button>
      <tulpar-button color="indigo">Indigo</tulpar-button>
      <tulpar-button color="cyan" variant="outlined">Cyan outlined</tulpar-button>
      <tulpar-button color="purple" variant="tonal">Purple tonal</tulpar-button>
      <tulpar-button color="amber" variant="ghost">Amber ghost</tulpar-button>
      <tulpar-button color="yellow">Yellow (dark text auto)</tulpar-button>
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
    <p style="font-size: 12px; color: #78716c; margin-top: 8px;">
      Hover the button — the tooltip remains active because <code>data-disabled</code>
      styles disabled but does NOT block pointer events.
    </p>
  `,
};

export const GoldUpgradeCTA: Story = {
  render: () => html`
    <tulpar-button color="gold" raised>
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
