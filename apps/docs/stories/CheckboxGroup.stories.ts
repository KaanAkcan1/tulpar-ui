import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@tulpar-ui/core/checkbox";
import "@tulpar-ui/core/checkbox-group";

const meta: Meta = {
  title: "Components/CheckboxGroup",
  component: "tulpar-checkbox-group",
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
 * **Playground** — every declared control maps to `<tulpar-checkbox-group>`.
 * Change orientation, size, and validation states from the controls panel.
 * Children keep independent Tab/Space focus — no roving tabindex.
 */
export const Default: Story = {
  args: {
    label: "Notification channels",
    orientation: "vertical",
    size: "md",
  },
  render: (args) => html`
    <tulpar-checkbox-group
      label=${args["label"] ?? nothing}
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
      <tulpar-checkbox value="email" label="Email" checked></tulpar-checkbox>
      <tulpar-checkbox value="sms" label="SMS"></tulpar-checkbox>
      <tulpar-checkbox value="push" label="Push notifications" checked></tulpar-checkbox>
    </tulpar-checkbox-group>
  `,
};

// ─── 2. AllSizes ─────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px;">
      ${(["xs", "sm", "md", "lg", "xl"] as const).map(
        (size) => html`
          <tulpar-checkbox-group
            label=${`size="${size}"`}
            orientation="horizontal"
            size=${size}
          >
            <tulpar-checkbox value="a" label="Option A" checked></tulpar-checkbox>
            <tulpar-checkbox value="b" label="Option B"></tulpar-checkbox>
            <tulpar-checkbox value="c" label="Option C" checked></tulpar-checkbox>
          </tulpar-checkbox-group>
        `,
      )}
    </div>
  `,
};

// ─── 3. States ───────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
      <tulpar-checkbox-group label="Default" orientation="horizontal">
        <tulpar-checkbox value="a" label="Option A" checked></tulpar-checkbox>
        <tulpar-checkbox value="b" label="Option B"></tulpar-checkbox>
        <tulpar-checkbox value="c" label="Option C" checked></tulpar-checkbox>
      </tulpar-checkbox-group>

      <tulpar-checkbox-group
        label="Invalid"
        invalid
        error-text="Select at least one option"
        orientation="horizontal"
      >
        <tulpar-checkbox value="a" label="Option A"></tulpar-checkbox>
        <tulpar-checkbox value="b" label="Option B"></tulpar-checkbox>
        <tulpar-checkbox value="c" label="Option C"></tulpar-checkbox>
      </tulpar-checkbox-group>

      <tulpar-checkbox-group
        label="Warning"
        warn
        warn-text="Selecting all options may increase costs"
        orientation="horizontal"
      >
        <tulpar-checkbox value="a" label="Option A" checked></tulpar-checkbox>
        <tulpar-checkbox value="b" label="Option B" checked></tulpar-checkbox>
        <tulpar-checkbox value="c" label="Option C" checked></tulpar-checkbox>
      </tulpar-checkbox-group>

      <tulpar-checkbox-group label="Disabled" orientation="horizontal" disabled>
        <tulpar-checkbox value="a" label="Option A" checked></tulpar-checkbox>
        <tulpar-checkbox value="b" label="Option B"></tulpar-checkbox>
        <tulpar-checkbox value="c" label="Option C"></tulpar-checkbox>
      </tulpar-checkbox-group>

      <tulpar-checkbox-group label="Readonly" orientation="horizontal" readonly>
        <tulpar-checkbox value="a" label="Option A" checked></tulpar-checkbox>
        <tulpar-checkbox value="b" label="Option B"></tulpar-checkbox>
        <tulpar-checkbox value="c" label="Option C" checked></tulpar-checkbox>
      </tulpar-checkbox-group>
    </div>
  `,
};

// ─── 4. Required + Message ───────────────────────────────────────────────────

export const RequiredWithMessage: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
      <tulpar-checkbox-group
        label="Required permissions"
        required
        invalid
        error-text="You must grant all required permissions"
      >
        <tulpar-checkbox value="read" label="Read"></tulpar-checkbox>
        <tulpar-checkbox value="write" label="Write"></tulpar-checkbox>
        <tulpar-checkbox value="delete" label="Delete"></tulpar-checkbox>
      </tulpar-checkbox-group>

      <tulpar-checkbox-group
        label="Notification channels"
        required
        helper-text="Select at least one channel to receive alerts"
      >
        <tulpar-checkbox value="email" label="Email" checked></tulpar-checkbox>
        <tulpar-checkbox value="push" label="Push"></tulpar-checkbox>
        <tulpar-checkbox value="sms" label="SMS"></tulpar-checkbox>
      </tulpar-checkbox-group>
    </div>
  `,
};

// ─── 5. Orientation ──────────────────────────────────────────────────────────

export const Orientation: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:32px; max-width:480px;">
      <tulpar-checkbox-group label="Vertical (default)">
        <tulpar-checkbox value="a" label="Option A" checked></tulpar-checkbox>
        <tulpar-checkbox value="b" label="Option B"></tulpar-checkbox>
        <tulpar-checkbox value="c" label="Option C" checked></tulpar-checkbox>
      </tulpar-checkbox-group>

      <tulpar-checkbox-group label="Horizontal" orientation="horizontal">
        <tulpar-checkbox value="a" label="Option A" checked></tulpar-checkbox>
        <tulpar-checkbox value="b" label="Option B"></tulpar-checkbox>
        <tulpar-checkbox value="c" label="Option C" checked></tulpar-checkbox>
      </tulpar-checkbox-group>
    </div>
  `,
};

// ─── 6. LabelViaSlot ─────────────────────────────────────────────────────────

/**
 * **LabelViaSlot** — slot a group legend and description. Individual checkboxes
 * also support `slot="label"` and `slot="description"`.
 */
export const LabelViaSlot: Story = {
  render: () => html`
    <tulpar-checkbox-group style="max-width:380px;">
      <span slot="label">Feature access</span>
      <span slot="description">Choose which features this API key can access.</span>

      <tulpar-checkbox value="analytics" checked>
        <span slot="label">Analytics</span>
        <span slot="description">Read usage data and reports.</span>
      </tulpar-checkbox>
      <tulpar-checkbox value="deployments">
        <span slot="label">Deployments</span>
        <span slot="description">Trigger and manage deployments.</span>
      </tulpar-checkbox>
      <tulpar-checkbox value="secrets">
        <span slot="label">Secrets</span>
        <span slot="description">Read and write environment variables.</span>
      </tulpar-checkbox>
    </tulpar-checkbox-group>
  `,
};

// ─── 7. ArrayValue ───────────────────────────────────────────────────────────

/**
 * **ArrayValue** — demonstrates the group's `value` as a `string[]` and how the
 * `change` event carries `detail.value`. The live output below the group updates
 * on every change.
 */
export const ArrayValue: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const onChange = (e: Event) => {
      const ce = e as CustomEvent<{ value: string[] }>;
      const out = (e.currentTarget as HTMLElement)
        .closest("div")
        ?.querySelector<HTMLElement>("#value-output");
      if (out) out.textContent = JSON.stringify(ce.detail.value);
    };
    return html`
      <div style="max-width:360px;">
        <tulpar-checkbox-group
          label="Select capabilities"
          @change=${onChange}
        >
          <tulpar-checkbox value="read" label="Read" checked></tulpar-checkbox>
          <tulpar-checkbox value="write" label="Write"></tulpar-checkbox>
          <tulpar-checkbox value="delete" label="Delete"></tulpar-checkbox>
          <tulpar-checkbox value="admin" label="Admin"></tulpar-checkbox>
        </tulpar-checkbox-group>
        <p style="margin-top:12px; font-size:12px; font-family:monospace; color:var(--tulpar-color-text-secondary,#74777a);">
          value: <span id="value-output" style="color:var(--tulpar-color-text-default,#111);">["read"]</span>
        </p>
      </div>
      <p style="margin-top:8px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        The group emits <code>CustomEvent('change', { detail: { value: string[] } })</code>
        with the current array of checked values in DOM order.
      </p>
    `;
  },
};

// ─── 8. SelectAllParent ──────────────────────────────────────────────────────

/**
 * **SelectAllParent** — the recommended consumer recipe for "select all" with
 * an indeterminate parent checkbox outside the group. The group ships no
 * opinionated select-all built-in — this ~15-line pattern is deliberately left
 * to the consumer so layout assumptions aren't baked in.
 */
export const SelectAllParent: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    type Item = { id: string; label: string; checked: boolean };
    const items: Item[] = [
      { id: "dashboard", label: "Dashboard", checked: true },
      { id: "reports", label: "Reports", checked: false },
      { id: "settings", label: "Settings", checked: true },
      { id: "users", label: "User management", checked: false },
    ];
    let state = [...items];

    const getParentState = () => {
      const n = state.filter((i) => i.checked).length;
      if (n === 0) return { checked: false, indeterminate: false };
      if (n === state.length) return { checked: true, indeterminate: false };
      return { checked: false, indeterminate: true };
    };

    const syncParent = () => {
      const ps = getParentState();
      const p = document.querySelector<HTMLElement & { checked: boolean; indeterminate: boolean }>(
        "#select-all-cb",
      );
      if (!p) return;
      p.checked = ps.checked;
      p.indeterminate = ps.indeterminate;
    };

    const onParentChange = () => {
      const p = document.querySelector<HTMLElement & { checked: boolean }>(
        "#select-all-cb",
      );
      if (!p) return;
      const shouldCheck = p.checked;
      state = state.map((i) => ({ ...i, checked: shouldCheck }));
      // Reflect into the group's children.
      for (const item of state) {
        const el = document.querySelector<HTMLElement & { checked: boolean }>(
          `[data-id="${item.id}"]`,
        );
        if (el) el.checked = item.checked;
      }
      syncParent();
    };

    const onGroupChange = (e: Event) => {
      const ce = e as CustomEvent<{ value: string[] }>;
      state = state.map((i) => ({
        ...i,
        checked: ce.detail.value.includes(i.id),
      }));
      syncParent();
    };

    const ps = getParentState();
    return html`
      <div style="max-width:320px;">
        <tulpar-checkbox
          id="select-all-cb"
          label="Select all modules"
          ?checked=${ps.checked}
          ?indeterminate=${ps.indeterminate}
          @change=${onParentChange}
          style="display:block; padding-bottom:8px; margin-bottom:8px; border-bottom:1px solid var(--tulpar-color-border-default,#d9e0df);"
        ></tulpar-checkbox>

        <tulpar-checkbox-group @change=${onGroupChange} no-message-space>
          ${items.map(
            (item) => html`
              <tulpar-checkbox
                data-id=${item.id}
                value=${item.id}
                label=${item.label}
                ?checked=${item.checked}
                no-message-space
              ></tulpar-checkbox>
            `,
          )}
        </tulpar-checkbox-group>
      </div>
      <p style="margin-top:12px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        The parent checkbox lives outside the group — so layout isn't constrained.
        It reflects <code>indeterminate</code> when some children are checked.
        The group's <code>change</code> event keeps the parent in sync.
      </p>
    `;
  },
};

// ─── 9. CardVariant ──────────────────────────────────────────────────────────

/**
 * **CardVariant** — checkboxes with `variant="card"` inside a group,
 * rendered as a list of selectable card tiles.
 */
export const CardVariant: Story = {
  render: () => html`
    <tulpar-checkbox-group label="Select features" style="max-width:400px;">
      <tulpar-checkbox value="analytics" variant="card" checked>
        <span slot="label">Analytics</span>
        <span slot="description">Usage reports and event tracking.</span>
      </tulpar-checkbox>
      <tulpar-checkbox value="integrations" variant="card" checked>
        <span slot="label">Integrations</span>
        <span slot="description">Connect Slack, Jira, and 50+ tools.</span>
      </tulpar-checkbox>
      <tulpar-checkbox value="automation" variant="card">
        <span slot="label">Automation</span>
        <span slot="description">Trigger workflows on any event.</span>
      </tulpar-checkbox>
      <tulpar-checkbox value="white-label" variant="card" disabled>
        <span slot="label">White-label</span>
        <span slot="description">Requires Enterprise plan.</span>
      </tulpar-checkbox>
    </tulpar-checkbox-group>
  `,
};

// ─── 10. CardGrid ────────────────────────────────────────────────────────────

/**
 * **CardGrid** — `variant="card"` checkboxes in a CSS grid for multi-select
 * option picking (feature selection, report columns, filter presets).
 */
export const CardGrid: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <tulpar-checkbox-group label="Report columns">
      <div
        style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:10px; max-width:600px;"
      >
        <tulpar-checkbox value="name" variant="card" checked>
          <span slot="label">Name</span>
        </tulpar-checkbox>
        <tulpar-checkbox value="email" variant="card" checked>
          <span slot="label">Email</span>
        </tulpar-checkbox>
        <tulpar-checkbox value="role" variant="card" checked>
          <span slot="label">Role</span>
        </tulpar-checkbox>
        <tulpar-checkbox value="created" variant="card">
          <span slot="label">Created at</span>
        </tulpar-checkbox>
        <tulpar-checkbox value="last-login" variant="card">
          <span slot="label">Last login</span>
        </tulpar-checkbox>
        <tulpar-checkbox value="status" variant="card" checked>
          <span slot="label">Status</span>
        </tulpar-checkbox>
        <tulpar-checkbox value="plan" variant="card">
          <span slot="label">Plan</span>
        </tulpar-checkbox>
        <tulpar-checkbox value="revenue" variant="card">
          <span slot="label">MRR</span>
        </tulpar-checkbox>
      </div>
    </tulpar-checkbox-group>
  `,
};

// ─── 11. ColorOverride ───────────────────────────────────────────────────────

export const ColorOverride: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px;">
      <tulpar-checkbox-group
        label="Group color — danger"
        orientation="horizontal"
        color="var(--tulpar-color-danger-default, #ef4444)"
      >
        <tulpar-checkbox value="a" label="Option A" checked></tulpar-checkbox>
        <tulpar-checkbox value="b" label="Option B" checked></tulpar-checkbox>
        <tulpar-checkbox value="c" label="Option C"></tulpar-checkbox>
      </tulpar-checkbox-group>

      <tulpar-checkbox-group
        label="Per-item color override"
        orientation="horizontal"
      >
        <tulpar-checkbox
          value="a"
          label="Danger"
          color="var(--tulpar-color-danger-default, #ef4444)"
          checked
        ></tulpar-checkbox>
        <tulpar-checkbox
          value="b"
          label="Success"
          color="var(--tulpar-color-success-default, #22c55e)"
          checked
        ></tulpar-checkbox>
        <tulpar-checkbox
          value="c"
          label="Amber"
          color="#f59e0b"
          checked
        ></tulpar-checkbox>
      </tulpar-checkbox-group>
    </div>
  `,
};

// ─── 12. MultiSelectFilter (real-world composition) ──────────────────────────

/**
 * **MultiSelectFilter** — a realistic "Filter by status" panel using
 * `<tulpar-checkbox-group>` with a live count badge driven by the `change`
 * event. Shows the component in a product sidebar context.
 */
export const MultiSelectFilter: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const initialValue = ["active", "pending"];
    const onChange = (e: Event) => {
      const ce = e as CustomEvent<{ value: string[] }>;
      const badge = (e.currentTarget as HTMLElement)
        .closest("div")
        ?.querySelector<HTMLElement>("#filter-count");
      if (badge) {
        const n = ce.detail.value.length;
        badge.textContent = n === 0 ? "None" : `${n} selected`;
      }
    };

    return html`
      <div
        style="max-width:260px; padding:16px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:10px; background:var(--tulpar-color-bg-raised,#fff);"
      >
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
          <span style="font-weight:600; font-size:0.9rem;">Status filter</span>
          <span
            id="filter-count"
            style="font-size:12px; color:var(--tulpar-color-brand-default,#00c57a); font-weight:500;"
          >${initialValue.length} selected</span>
        </div>
        <tulpar-checkbox-group
          name="status"
          @change=${onChange}
          no-message-space
        >
          <tulpar-checkbox value="active" label="Active" checked no-message-space></tulpar-checkbox>
          <tulpar-checkbox value="pending" label="Pending" checked no-message-space></tulpar-checkbox>
          <tulpar-checkbox value="suspended" label="Suspended" no-message-space></tulpar-checkbox>
          <tulpar-checkbox value="archived" label="Archived" no-message-space></tulpar-checkbox>
        </tulpar-checkbox-group>
      </div>
    `;
  },
};
