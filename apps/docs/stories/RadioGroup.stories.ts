import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@tulpar-ui/core/radio";
import "@tulpar-ui/core/radio-group";

const meta: Meta = {
  title: "Components/RadioGroup",
  component: "tulpar-radio-group",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    warn: { control: "boolean" },
    "no-message-space": { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control maps to `<tulpar-radio-group>`.
 * Change orientation, size, and validation states from the controls panel.
 * Use arrow keys to navigate between radio options.
 */
export const Default: Story = {
  args: {
    label: "Preferred contact method",
    value: "email",
    orientation: "vertical",
    size: "md",
  },
  render: (args) => html`
    <tulpar-radio-group
      label=${args["label"] ?? nothing}
      value=${args["value"] ?? nothing}
      orientation=${args["orientation"] ?? nothing}
      size=${args["size"] ?? nothing}
      helper-text=${args["helper-text"] ?? nothing}
      error-text=${args["error-text"] ?? nothing}
      warn-text=${args["warn-text"] ?? nothing}
      ?disabled=${args["disabled"]}
      ?readonly=${args["readonly"]}
      ?required=${args["required"]}
      ?invalid=${args["invalid"]}
      ?warn=${args["warn"]}
      ?no-message-space=${args["no-message-space"]}
    >
      <tulpar-radio value="email" label="Email"></tulpar-radio>
      <tulpar-radio value="sms" label="SMS"></tulpar-radio>
      <tulpar-radio value="phone" label="Phone call"></tulpar-radio>
    </tulpar-radio-group>
  `,
};

// ─── 2. AllSizes ─────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px;">
      ${(["xs", "sm", "md", "lg", "xl"] as const).map(
        (size) => html`
          <tulpar-radio-group
            label=${`size="${size}"`}
            orientation="horizontal"
            size=${size}
          >
            <tulpar-radio value="a" label="Option A" checked></tulpar-radio>
            <tulpar-radio value="b" label="Option B"></tulpar-radio>
            <tulpar-radio value="c" label="Option C"></tulpar-radio>
          </tulpar-radio-group>
        `,
      )}
    </div>
  `,
};

// ─── 3. States ───────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
      <tulpar-radio-group label="Default" value="a" orientation="horizontal">
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
        <tulpar-radio value="c" label="Option C"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group
        label="Invalid"
        invalid
        error-text="Please select an option"
        orientation="horizontal"
      >
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
        <tulpar-radio value="c" label="Option C"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group
        label="Warning"
        warn
        warn-text="This selection may limit features"
        value="b"
        orientation="horizontal"
      >
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
        <tulpar-radio value="c" label="Option C"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group label="Disabled" value="a" orientation="horizontal" disabled>
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
        <tulpar-radio value="c" label="Option C"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group label="Readonly" value="b" orientation="horizontal" readonly>
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
        <tulpar-radio value="c" label="Option C"></tulpar-radio>
      </tulpar-radio-group>
    </div>
  `,
};

// ─── 4. Required + Message ───────────────────────────────────────────────────

export const RequiredWithMessage: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
      <tulpar-radio-group
        label="Billing cycle"
        required
        invalid
        error-text="Please select a billing cycle"
      >
        <tulpar-radio value="monthly" label="Monthly"></tulpar-radio>
        <tulpar-radio value="annual" label="Annual (save 20%)"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group
        label="Notification frequency"
        required
        value="daily"
        helper-text="How often you receive digest emails"
      >
        <tulpar-radio value="realtime" label="Real-time"></tulpar-radio>
        <tulpar-radio value="daily" label="Daily digest"></tulpar-radio>
        <tulpar-radio value="weekly" label="Weekly digest"></tulpar-radio>
      </tulpar-radio-group>
    </div>
  `,
};

// ─── 5. Orientation ──────────────────────────────────────────────────────────

export const Orientation: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:32px; max-width:480px;">
      <tulpar-radio-group label="Vertical (default)" value="a">
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
        <tulpar-radio value="c" label="Option C"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group label="Horizontal" value="b" orientation="horizontal">
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
        <tulpar-radio value="c" label="Option C"></tulpar-radio>
      </tulpar-radio-group>
    </div>
  `,
};

// ─── 6. LabelViaSlot ─────────────────────────────────────────────────────────

/**
 * **LabelViaSlot** — slot a group legend and description to enrich the
 * group header. Individual radios also support `slot="label"` and
 * `slot="description"` for richer option content.
 */
export const LabelViaSlot: Story = {
  render: () => html`
    <tulpar-radio-group value="pro" style="max-width:360px;">
      <span slot="label">Choose your plan</span>
      <span slot="description">You can upgrade or downgrade at any time.</span>

      <tulpar-radio value="starter">
        <span slot="label">Starter</span>
        <span slot="description">Up to 5 users, 10 GB storage.</span>
      </tulpar-radio>
      <tulpar-radio value="pro">
        <span slot="label">Pro <strong>(Most popular)</strong></span>
        <span slot="description">Up to 25 users, 100 GB storage.</span>
      </tulpar-radio>
      <tulpar-radio value="enterprise">
        <span slot="label">Enterprise</span>
        <span slot="description">Unlimited users, custom storage.</span>
      </tulpar-radio>
    </tulpar-radio-group>
  `,
};

// ─── 7. CardVariant ──────────────────────────────────────────────────────────

/**
 * **CardVariant** — radios with `variant="card"` become selectable card tiles.
 * Ideal for plan pickers, mode selectors, or any single-choice surface where
 * description text disambiguates each option.
 */
export const CardVariant: Story = {
  render: () => html`
    <tulpar-radio-group label="Notification delivery" value="push" style="max-width:480px;">
      <tulpar-radio value="email" variant="card">
        <span slot="label">Email</span>
        <span slot="description">Delivered to your inbox. Up to 3× per day.</span>
      </tulpar-radio>
      <tulpar-radio value="push" variant="card">
        <span slot="label">Push</span>
        <span slot="description">Browser and mobile alerts in real time.</span>
      </tulpar-radio>
      <tulpar-radio value="sms" variant="card">
        <span slot="label">SMS</span>
        <span slot="description">Text message to your verified phone.</span>
      </tulpar-radio>
      <tulpar-radio value="none" variant="card">
        <span slot="label">None</span>
        <span slot="description">Check the app manually for updates.</span>
      </tulpar-radio>
    </tulpar-radio-group>
  `,
};

// ─── 8. CardGrid ─────────────────────────────────────────────────────────────

/**
 * **CardGrid** — card variant radios in a responsive CSS grid for compact
 * single-choice selection (e.g., role assignment, plan, region).
 */
export const CardGrid: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <tulpar-radio-group label="Workspace region" value="eu-west">
      <div
        style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:10px; max-width:560px;"
      >
        <tulpar-radio value="us-east" variant="card">
          <span slot="label">US East</span>
          <span slot="description">Virginia, USA</span>
        </tulpar-radio>
        <tulpar-radio value="us-west" variant="card">
          <span slot="label">US West</span>
          <span slot="description">Oregon, USA</span>
        </tulpar-radio>
        <tulpar-radio value="eu-west" variant="card">
          <span slot="label">EU West</span>
          <span slot="description">Ireland</span>
        </tulpar-radio>
        <tulpar-radio value="eu-central" variant="card">
          <span slot="label">EU Central</span>
          <span slot="description">Frankfurt, Germany</span>
        </tulpar-radio>
        <tulpar-radio value="ap-east" variant="card">
          <span slot="label">AP East</span>
          <span slot="description">Singapore</span>
        </tulpar-radio>
        <tulpar-radio value="ap-northeast" variant="card">
          <span slot="label">AP Northeast</span>
          <span slot="description">Tokyo, Japan</span>
        </tulpar-radio>
      </div>
    </tulpar-radio-group>
  `,
};

// ─── 9. GroupDisabledRequired ────────────────────────────────────────────────

/**
 * **GroupDisabledRequired** — group-level `disabled` propagates to all children.
 * Individual children can also override. Use `required` at group level for
 * form validation.
 */
export const GroupDisabledRequired: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
      <tulpar-radio-group
        label="Group disabled (propagates to all radios)"
        value="a"
        disabled
      >
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
        <tulpar-radio value="c" label="Individual override (still disabled via group)" disabled></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group
        label="One item individually disabled"
        value="a"
      >
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B (disabled)" disabled></tulpar-radio>
        <tulpar-radio value="c" label="Option C"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group
        label="Required group"
        required
        invalid
        error-text="A selection is required"
      >
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
      </tulpar-radio-group>
    </div>
  `,
};

// ─── 10. KeyboardHint (interactive) ──────────────────────────────────────────

/**
 * **KeyboardHint** — demonstrates the WAI-ARIA roving tabindex keyboard model.
 * Tab into the group, then use ↑/↓ (vertical) or ←/→ (horizontal) arrows to
 * move selection. Home/End jump to the first/last non-disabled radio.
 * Selection follows focus.
 */
export const KeyboardHint: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width:440px;">
      <tulpar-radio-group label="Vertical — use ↑ / ↓ arrows" value="b">
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B (initially focused)"></tulpar-radio>
        <tulpar-radio value="c" label="Option C (disabled)" disabled></tulpar-radio>
        <tulpar-radio value="d" label="Option D"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group label="Horizontal — use ← / → arrows" value="a" orientation="horizontal">
        <tulpar-radio value="a" label="First"></tulpar-radio>
        <tulpar-radio value="b" label="Second"></tulpar-radio>
        <tulpar-radio value="c" label="Third"></tulpar-radio>
        <tulpar-radio value="d" label="Fourth"></tulpar-radio>
      </tulpar-radio-group>
    </div>
    <p style="margin-top:16px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
      Only one radio is tab-reachable (the checked one, or first non-disabled if none checked).
      Arrow keys move selection AND focus, wrapping at the ends. Home/End jump to first/last
      non-disabled option. Disabled options are skipped automatically.
    </p>
  `,
};

// ─── 11. ColorOverride ───────────────────────────────────────────────────────

export const ColorOverride: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px;">
      <tulpar-radio-group label="Brand (default)" value="a" orientation="horizontal">
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group
        label="Group color override — success"
        value="a"
        orientation="horizontal"
        color="var(--tulpar-color-success-default, #22c55e)"
      >
        <tulpar-radio value="a" label="Option A"></tulpar-radio>
        <tulpar-radio value="b" label="Option B"></tulpar-radio>
      </tulpar-radio-group>

      <tulpar-radio-group label="Per-radio color override" value="b" orientation="horizontal">
        <tulpar-radio
          value="a"
          label="Option A"
          color="var(--tulpar-color-danger-default, #ef4444)"
        ></tulpar-radio>
        <tulpar-radio
          value="b"
          label="Option B"
          color="#f59e0b"
        ></tulpar-radio>
      </tulpar-radio-group>
    </div>
  `,
};

// ─── 12. PlanPicker (real-world composition) ─────────────────────────────────

/**
 * **PlanPicker** — a subscription plan card picker using `variant="card"` radios.
 * Demonstrates the component in a real product context.
 */
export const PlanPicker: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="max-width:480px;">
      <tulpar-radio-group value="pro">
        <span slot="label" style="font-size:1.1rem; font-weight:600;">Choose your plan</span>
        <span slot="description" style="color:var(--tulpar-color-text-secondary,#74777a);">
          All plans include a 14-day free trial. No credit card required.
        </span>

        <tulpar-radio value="starter" variant="card" style="margin-top:12px;">
          <span slot="label">Starter — <strong>Free</strong></span>
          <span slot="description">Up to 3 projects, 1 GB storage, community support.</span>
        </tulpar-radio>
        <tulpar-radio value="pro" variant="card">
          <span slot="label">
            Pro — <strong>$12 / mo</strong>
            <span style="margin-left:8px; font-size:11px; background:var(--tulpar-color-brand-default,#00c57a); color:#fff; border-radius:4px; padding:1px 6px;">Popular</span>
          </span>
          <span slot="description">Unlimited projects, 50 GB storage, priority support.</span>
        </tulpar-radio>
        <tulpar-radio value="enterprise" variant="card">
          <span slot="label">Enterprise — <strong>Custom</strong></span>
          <span slot="description">SSO, audit log, SLA, dedicated account manager.</span>
        </tulpar-radio>
      </tulpar-radio-group>
    </div>
  `,
};
