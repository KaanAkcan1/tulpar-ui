import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing, svg } from "lit";
import "@tulpar-ui/core/button";
import "@tulpar-ui/core/button-group";

const alignLeftIcon = svg`<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>`;
const alignCenterIcon = svg`<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>`;
const alignRightIcon = svg`<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>`;

const svgWrap = (inner: unknown) =>
  html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    ${inner}
  </svg>`;

const meta: Meta = {
  title: "Components/ButtonGroup",
  component: "tulpar-button-group",
  tags: ["autodocs"],
  argTypes: {
    stacked: { control: "boolean" },
    severity: {
      control: "select",
      options: ["primary", "secondary", "info", "success", "warn", "danger", "contrast"],
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "tonal", "ghost"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};
export default meta;

type Story = StoryObj;

/**
 * **Playground** — args drive both the group (`stacked`) and the child buttons
 * (`severity` / `variant` / `size`). Toggle `stacked` and change the variant to
 * see roving-tabindex keyboard navigation flip between horizontal and vertical.
 */
export const Playground: Story = {
  args: { stacked: false, severity: "secondary", variant: "outlined", size: "md" },
  render: (args) => html`
    <tulpar-button-group ?stacked=${args["stacked"]}>
      ${["Day", "Week", "Month", "Year"].map(
        (label) => html`<tulpar-button
          severity=${args["severity"] ?? nothing}
          variant=${args["variant"] ?? nothing}
          size=${args["size"] ?? nothing}
          >${label}</tulpar-button
        >`,
      )}
    </tulpar-button-group>
  `,
};

/**
 * **EditorToolbar** — a realistic segmented toolbar: text-style toggles grouped
 * together, alignment controls in a second group, separated by a divider. Shows
 * how grouped icon buttons compose into a product toolbar.
 */
export const EditorToolbar: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    return html`
      <div
        style="display:inline-flex; align-items:center; gap:12px; padding:8px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:10px; background:var(--tulpar-color-bg-raised,#fff);"
      >
        <tulpar-button-group>
          <tulpar-button variant="ghost" severity="secondary" icon-only aria-label="Bold"
            ><strong>B</strong></tulpar-button
          >
          <tulpar-button variant="ghost" severity="secondary" icon-only aria-label="Italic"
            ><em>I</em></tulpar-button
          >
          <tulpar-button variant="ghost" severity="secondary" icon-only aria-label="Underline"
            ><span style="text-decoration:underline;">U</span></tulpar-button
          >
        </tulpar-button-group>
        <span
          style="width:1px; height:24px; background:var(--tulpar-color-border-default,#d9e0df);"
        ></span>
        <tulpar-button-group>
          <tulpar-button variant="ghost" severity="secondary" icon-only aria-label="Align left"
            >${svgWrap(alignLeftIcon)}</tulpar-button
          >
          <tulpar-button variant="ghost" severity="secondary" icon-only aria-label="Align center"
            >${svgWrap(alignCenterIcon)}</tulpar-button
          >
          <tulpar-button variant="ghost" severity="secondary" icon-only aria-label="Align right"
            >${svgWrap(alignRightIcon)}</tulpar-button
          >
        </tulpar-button-group>
      </div>
    `;
  },
};

export const ThreeButtons: Story = {
  render: () => html`
    <tulpar-button-group>
      <tulpar-button variant="secondary">Day</tulpar-button>
      <tulpar-button variant="secondary">Week</tulpar-button>
      <tulpar-button variant="secondary">Month</tulpar-button>
    </tulpar-button-group>
  `,
};

export const PrimaryGroup: Story = {
  render: () => html`
    <tulpar-button-group>
      <tulpar-button>One</tulpar-button>
      <tulpar-button>Two</tulpar-button>
      <tulpar-button>Three</tulpar-button>
      <tulpar-button>Four</tulpar-button>
    </tulpar-button-group>
  `,
};

export const KeyboardNavigation: Story = {
  render: () => html`
    <p>Focus the first button, then use ArrowLeft / ArrowRight / Home / End.</p>
    <tulpar-button-group>
      <tulpar-button variant="secondary">A</tulpar-button>
      <tulpar-button variant="secondary">B</tulpar-button>
      <tulpar-button variant="secondary">C</tulpar-button>
      <tulpar-button variant="secondary">D</tulpar-button>
    </tulpar-button-group>
  `,
};

export const StackedGroup: Story = {
  render: () => html`
    <p>Stacked layout — use ArrowUp / ArrowDown to navigate.</p>
    <tulpar-button-group stacked>
      <tulpar-button variant="outlined">Edit profile</tulpar-button>
      <tulpar-button variant="outlined">Account settings</tulpar-button>
      <tulpar-button variant="outlined">Sign out</tulpar-button>
    </tulpar-button-group>
  `,
};
