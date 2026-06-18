import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@tulpar-ui/core/checkbox";

// ─── Custom check icon (star, for custom-icon demo) ───────────────────────────

const starIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
>
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
</svg>`;

const heartIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
</svg>`;

const meta: Meta = {
  title: "Components/Checkbox",
  component: "tulpar-checkbox",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    "label-position": {
      control: "select",
      options: ["start", "end"],
    },
    variant: {
      control: "select",
      options: ["default", "card"],
    },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
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
 * **Playground** — every declared control maps to an observed attribute on
 * `<tulpar-checkbox>`. Toggle checked/indeterminate, switch size/variant, or
 * trigger validation states from the controls panel.
 */
export const Default: Story = {
  args: {
    label: "I agree to the terms",
    checked: false,
    size: "md",
    "label-position": "end",
    variant: "default",
  },
  render: (args) => html`
    <tulpar-checkbox
      label=${args["label"] ?? nothing}
      size=${args["size"] ?? nothing}
      label-position=${args["label-position"] ?? nothing}
      variant=${args["variant"] ?? nothing}
      helper-text=${args["helper-text"] ?? nothing}
      error-text=${args["error-text"] ?? nothing}
      warn-text=${args["warn-text"] ?? nothing}
      ?checked=${args["checked"]}
      ?indeterminate=${args["indeterminate"]}
      ?disabled=${args["disabled"]}
      ?readonly=${args["readonly"]}
      ?required=${args["required"]}
      ?invalid=${args["invalid"]}
      ?warn=${args["warn"]}
      ?no-message-space=${args["no-message-space"]}
    ></tulpar-checkbox>
  `,
};

// ─── 2. AllSizes ─────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; align-items:center; gap:24px; flex-wrap:wrap;">
      <tulpar-checkbox size="xs" label="xs" checked></tulpar-checkbox>
      <tulpar-checkbox size="sm" label="sm" checked></tulpar-checkbox>
      <tulpar-checkbox size="md" label="md" checked></tulpar-checkbox>
      <tulpar-checkbox size="lg" label="lg" checked></tulpar-checkbox>
      <tulpar-checkbox size="xl" label="xl" checked></tulpar-checkbox>
    </div>
  `,
};

// ─── 3. States ───────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; max-width:320px;">
      <tulpar-checkbox label="Default (unchecked)"></tulpar-checkbox>
      <tulpar-checkbox label="Checked" checked></tulpar-checkbox>
      <tulpar-checkbox label="Indeterminate" indeterminate></tulpar-checkbox>
      <tulpar-checkbox
        label="Invalid"
        invalid
        error-text="This field is required"
      ></tulpar-checkbox>
      <tulpar-checkbox
        label="Warning"
        warn
        warn-text="Please review before continuing"
      ></tulpar-checkbox>
      <tulpar-checkbox label="Disabled off" disabled></tulpar-checkbox>
      <tulpar-checkbox label="Disabled checked" checked disabled></tulpar-checkbox>
      <tulpar-checkbox label="Disabled indeterminate" indeterminate disabled></tulpar-checkbox>
      <tulpar-checkbox label="Readonly off" readonly></tulpar-checkbox>
      <tulpar-checkbox label="Readonly checked" checked readonly></tulpar-checkbox>
    </div>
  `,
};

// ─── 4. Required + Message ───────────────────────────────────────────────────

export const RequiredWithMessage: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; max-width:360px;">
      <tulpar-checkbox
        label="Accept terms of service"
        required
        invalid
        error-text="You must accept the terms to continue"
      ></tulpar-checkbox>
      <tulpar-checkbox
        label="Subscribe to newsletter"
        required
        helper-text="You can unsubscribe at any time"
      ></tulpar-checkbox>
    </div>
  `,
};

// ─── 5. LabelPosition ────────────────────────────────────────────────────────

export const LabelPosition: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; max-width:320px;">
      <tulpar-checkbox
        label="Label at end (default)"
        label-position="end"
        checked
      ></tulpar-checkbox>
      <tulpar-checkbox
        label="Label at start"
        label-position="start"
        checked
      ></tulpar-checkbox>
    </div>
  `,
};

// ─── 6. LabelViaSlot ─────────────────────────────────────────────────────────

/**
 * **LabelViaSlot** — slot rich content into `slot="label"` and
 * `slot="description"` when the `label` attribute is not expressive enough.
 */
export const LabelViaSlot: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-checkbox checked>
        <span slot="label">I agree to the <a href="#" @click=${(e: Event) => e.preventDefault()}>Terms of Service</a></span>
      </tulpar-checkbox>
      <tulpar-checkbox>
        <span slot="label">Marketing communications</span>
        <span slot="description">Occasional product updates and feature announcements. Unsubscribe any time.</span>
      </tulpar-checkbox>
    </div>
  `,
};

// ─── 7. Indeterminate + SelectAll ────────────────────────────────────────────

/**
 * **IndeterminateSelectAll** — a classic "select all" parent checkbox driving
 * a group of children. The parent is `indeterminate` when some (but not all)
 * children are checked. This recipe is ~12 lines of consumer JS — the component
 * does not ship an opinionated select-all slot.
 */
export const IndeterminateSelectAll: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const items = [
      { id: "a", label: "Dashboard", checked: true },
      { id: "b", label: "Reports", checked: false },
      { id: "c", label: "Settings", checked: true },
    ];
    let state = [...items];

    const getParentState = () => {
      const checkedCount = state.filter((i) => i.checked).length;
      if (checkedCount === 0) return { checked: false, indeterminate: false };
      if (checkedCount === state.length) return { checked: true, indeterminate: false };
      return { checked: false, indeterminate: true };
    };

    const render = () => {
      const parentState = getParentState();
      const parentEl = document.querySelector<HTMLElement & { checked: boolean; indeterminate: boolean }>(
        "#select-all-parent",
      );
      if (parentEl) {
        parentEl.checked = parentState.checked;
        parentEl.indeterminate = parentState.indeterminate;
      }
      for (const item of state) {
        const el = document.querySelector<HTMLElement & { checked: boolean }>(`#sel-item-${item.id}`);
        if (el) el.checked = item.checked;
      }
    };

    const onParentChange = () => {
      const parentEl = document.querySelector<HTMLElement & { checked: boolean }>(
        "#select-all-parent",
      );
      if (!parentEl) return;
      const shouldCheck = parentEl.checked;
      state = state.map((i) => ({ ...i, checked: shouldCheck }));
      render();
    };

    const onChildChange = (id: string) => () => {
      const el = document.querySelector<HTMLElement & { checked: boolean }>(`#sel-item-${id}`);
      if (!el) return;
      state = state.map((i) => (i.id === id ? { ...i, checked: el.checked } : i));
      render();
    };

    const parentState = getParentState();
    return html`
      <div style="max-width:280px;">
        <tulpar-checkbox
          id="select-all-parent"
          label="Select all modules"
          ?checked=${parentState.checked}
          ?indeterminate=${parentState.indeterminate}
          @change=${onParentChange}
          style="padding-bottom:8px; border-bottom:1px solid var(--tulpar-color-border-default,#d9e0df); margin-bottom:8px; display:block;"
        ></tulpar-checkbox>
        ${state.map(
          (item) => html`
            <tulpar-checkbox
              id="sel-item-${item.id}"
              label=${item.label}
              value=${item.id}
              ?checked=${item.checked}
              @change=${onChildChange(item.id)}
              no-message-space
              style="display:block; padding-left:8px; margin-bottom:4px;"
            ></tulpar-checkbox>
          `,
        )}
      </div>
      <p style="margin-top:12px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        The parent checkbox becomes <code>indeterminate</code> when some children are
        checked. Clicking it checks or unchecks all.
      </p>
    `;
  },
};

// ─── 8. CustomIcon ───────────────────────────────────────────────────────────

/**
 * **CustomIcon** — slot any SVG into `slot="icon"` to replace the built-in
 * tick mark. The custom icon only renders when `checked` is true.
 */
export const CustomIcon: Story = {
  render: () => html`
    <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:center;">
      <tulpar-checkbox label="Favorite (star icon)" checked size="lg">
        <span slot="icon">${starIcon}</span>
      </tulpar-checkbox>
      <tulpar-checkbox label="Like (heart icon)" checked size="lg">
        <span slot="icon">${heartIcon}</span>
      </tulpar-checkbox>
      <tulpar-checkbox label="Unchecked — icon hidden" size="lg">
        <span slot="icon">${starIcon}</span>
      </tulpar-checkbox>
    </div>
    <p style="margin-top:12px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
      Custom icon only shows when <code>checked</code>. The default tick is replaced entirely.
    </p>
  `,
};

// ─── 9. CardVariant ──────────────────────────────────────────────────────────

/**
 * **CardVariant** — `variant="card"` wraps the checkbox in a bordered card
 * surface. Ideal for option pickers where each choice has a label and a
 * supporting description.
 */
export const CardVariant: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; max-width:360px;">
      <tulpar-checkbox variant="card" checked>
        <span slot="label">Email notifications</span>
        <span slot="description">Delivered to your inbox up to 3× per day.</span>
      </tulpar-checkbox>
      <tulpar-checkbox variant="card">
        <span slot="label">Push notifications</span>
        <span slot="description">Browser and mobile alerts in real time.</span>
      </tulpar-checkbox>
      <tulpar-checkbox variant="card" disabled>
        <span slot="label">SMS notifications</span>
        <span slot="description">Coming soon — requires a verified phone number.</span>
      </tulpar-checkbox>
    </div>
  `,
};

// ─── 10. CardGrid ────────────────────────────────────────────────────────────

/**
 * **CardGrid** — `variant="card"` laid out in a responsive CSS grid for
 * multi-column option selection (e.g., feature selection, plan extras).
 */
export const CardGrid: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div
      style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:12px; max-width:640px;"
    >
      <tulpar-checkbox variant="card" checked>
        <span slot="label">Analytics</span>
        <span slot="description">Track usage and events.</span>
      </tulpar-checkbox>
      <tulpar-checkbox variant="card" checked>
        <span slot="label">Integrations</span>
        <span slot="description">Connect third-party tools.</span>
      </tulpar-checkbox>
      <tulpar-checkbox variant="card">
        <span slot="label">Automation</span>
        <span slot="description">Trigger actions on events.</span>
      </tulpar-checkbox>
      <tulpar-checkbox variant="card">
        <span slot="label">Custom domain</span>
        <span slot="description">Serve from your own domain.</span>
      </tulpar-checkbox>
      <tulpar-checkbox variant="card" disabled>
        <span slot="label">White-label</span>
        <span slot="description">Requires Enterprise plan.</span>
      </tulpar-checkbox>
      <tulpar-checkbox variant="card">
        <span slot="label">Audit log</span>
        <span slot="description">Full action history.</span>
      </tulpar-checkbox>
    </div>
  `,
};

// ─── 11. ColorOverride ───────────────────────────────────────────────────────

export const ColorOverride: Story = {
  render: () => html`
    <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:center;">
      <tulpar-checkbox label="Brand default" checked></tulpar-checkbox>
      <tulpar-checkbox
        label="Danger"
        color="var(--tulpar-color-danger-default, #ef4444)"
        checked
      ></tulpar-checkbox>
      <tulpar-checkbox
        label="Success"
        color="var(--tulpar-color-success-default, #22c55e)"
        checked
      ></tulpar-checkbox>
      <tulpar-checkbox
        label="Custom amber"
        color="#f59e0b"
        checked
      ></tulpar-checkbox>
    </div>
  `,
};
