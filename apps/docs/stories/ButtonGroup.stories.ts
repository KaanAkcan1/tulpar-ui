import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/button";
import "@tulpar-ui/core/button-group";

const meta: Meta = {
  title: "Components/ButtonGroup",
  component: "tulpar-button-group",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

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
