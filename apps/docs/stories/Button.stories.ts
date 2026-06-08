import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/button";

const meta: Meta = {
  title: "Components/Button",
  component: "tulpar-button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
    },
    type: { control: "select", options: ["button", "submit", "reset"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    iconOnly: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: { variant: "primary", size: "md" },
  render: (args) => html`
    <tulpar-button
      variant=${args["variant"]}
      size=${args["size"]}
      ?disabled=${args["disabled"]}
      ?loading=${args["loading"]}
    >
      Button
    </tulpar-button>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex; gap: 8px; flex-wrap: wrap;">
      <tulpar-button variant="primary">Primary</tulpar-button>
      <tulpar-button variant="secondary">Secondary</tulpar-button>
      <tulpar-button variant="danger">Danger</tulpar-button>
      <tulpar-button variant="ghost">Ghost</tulpar-button>
      <tulpar-button variant="link">Link</tulpar-button>
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

export const Disabled: Story = {
  render: () => html`<tulpar-button disabled>Disabled</tulpar-button>`,
};

export const Loading: Story = {
  render: () => html`<tulpar-button loading>Loading</tulpar-button>`,
};

export const AsLink: Story = {
  render: () => html`
    <tulpar-button href="https://example.com" target="_blank" rel="noopener">
      As link (anchor)
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
