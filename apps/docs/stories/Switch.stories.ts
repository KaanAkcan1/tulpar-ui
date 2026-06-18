import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@tulpar-ui/core/switch";

// ─── Inline SVG icons (Lucide MIT) ───────────────────────────────────────────

const sunIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <circle cx="12" cy="12" r="4" />
  <line x1="12" y1="2" x2="12" y2="6" />
  <line x1="12" y1="18" x2="12" y2="22" />
  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
  <line x1="2" y1="12" x2="6" y2="12" />
  <line x1="18" y1="12" x2="22" y2="12" />
  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
</svg>`;

const moonIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
</svg>`;

const meta: Meta = {
  title: "Components/Switch",
  component: "tulpar-switch",
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
    "on-color": { control: "color" },
    "off-color": { control: "color" },
    checked: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    warn: { control: "boolean" },
    "show-icon": { control: "boolean" },
    "no-message-space": { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control maps to an observed attribute on
 * `<tulpar-switch>`. Toggle `checked`, flip `show-icon`, set custom
 * `on-color` / `off-color`, or try the validation states from the controls panel.
 */
export const Default: Story = {
  args: {
    label: "Enable notifications",
    checked: false,
    size: "md",
    "label-position": "end",
  },
  render: (args) => html`
    <tulpar-switch
      label=${args["label"] ?? nothing}
      size=${args["size"] ?? nothing}
      label-position=${args["label-position"] ?? nothing}
      on-color=${args["on-color"] ?? nothing}
      off-color=${args["off-color"] ?? nothing}
      helper-text=${args["helper-text"] ?? nothing}
      error-text=${args["error-text"] ?? nothing}
      warn-text=${args["warn-text"] ?? nothing}
      ?checked=${args["checked"]}
      ?loading=${args["loading"]}
      ?disabled=${args["disabled"]}
      ?readonly=${args["readonly"]}
      ?required=${args["required"]}
      ?invalid=${args["invalid"]}
      ?warn=${args["warn"]}
      ?show-icon=${args["show-icon"]}
      ?no-message-space=${args["no-message-space"]}
    ></tulpar-switch>
  `,
};

// ─── 2. AllSizes ─────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; align-items:center; gap:24px; flex-wrap:wrap;">
      <tulpar-switch size="xs" label="xs" checked></tulpar-switch>
      <tulpar-switch size="sm" label="sm" checked></tulpar-switch>
      <tulpar-switch size="md" label="md" checked></tulpar-switch>
      <tulpar-switch size="lg" label="lg" checked></tulpar-switch>
      <tulpar-switch size="xl" label="xl" checked></tulpar-switch>
    </div>
  `,
};

// ─── 3. States ───────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; max-width:320px;">
      <tulpar-switch label="Default (unchecked)"></tulpar-switch>
      <tulpar-switch label="Checked" checked></tulpar-switch>
      <tulpar-switch
        label="Invalid"
        invalid
        error-text="This setting is required"
      ></tulpar-switch>
      <tulpar-switch
        label="Warning"
        warn
        warn-text="This may affect other settings"
      ></tulpar-switch>
      <tulpar-switch label="Disabled off" disabled></tulpar-switch>
      <tulpar-switch label="Disabled on" checked disabled></tulpar-switch>
      <tulpar-switch label="Readonly off" readonly></tulpar-switch>
      <tulpar-switch label="Readonly on" checked readonly></tulpar-switch>
    </div>
  `,
};

// ─── 4. Required + Message ───────────────────────────────────────────────────

export const RequiredWithMessage: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; max-width:320px;">
      <tulpar-switch
        label="Accept terms of service"
        required
        invalid
        error-text="You must accept to continue"
      ></tulpar-switch>
      <tulpar-switch
        label="Marketing emails"
        required
        helper-text="We send at most 2 emails per month"
      ></tulpar-switch>
    </div>
  `,
};

// ─── 5. LabelPosition ────────────────────────────────────────────────────────

export const LabelPosition: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; max-width:320px;">
      <tulpar-switch
        label="Label at end (default)"
        label-position="end"
        checked
      ></tulpar-switch>
      <tulpar-switch
        label="Label at start"
        label-position="start"
        checked
      ></tulpar-switch>
    </div>
  `,
};

// ─── 6. LabelViaSlot ─────────────────────────────────────────────────────────

/**
 * **LabelViaSlot** — when `label` attribute alone is not enough, slot rich
 * content into `slot="label"` and `slot="description"`. The slot wins over the
 * attribute when both are present.
 */
export const LabelViaSlot: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-switch checked>
        <span slot="label">Dark mode <strong>(recommended)</strong></span>
      </tulpar-switch>
      <tulpar-switch>
        <span slot="label">Weekly digest</span>
        <span slot="description">Sent every Monday morning with your activity summary.</span>
      </tulpar-switch>
    </div>
  `,
};

// ─── 7. ShowIcon ─────────────────────────────────────────────────────────────

/**
 * **ShowIcon** — `show-icon` reveals the built-in check/cross glyphs inside
 * the thumb. Off by default; on here to demonstrate.
 */
export const ShowIcon: Story = {
  render: () => html`
    <div style="display:flex; gap:24px; align-items:center; flex-wrap:wrap;">
      <tulpar-switch label="show-icon off (default)"></tulpar-switch>
      <tulpar-switch label="show-icon off, checked" checked></tulpar-switch>
      <tulpar-switch label="show-icon on" show-icon></tulpar-switch>
      <tulpar-switch label="show-icon on, checked" show-icon checked></tulpar-switch>
    </div>
  `,
};

// ─── 8. CustomIcons (theme toggle) ───────────────────────────────────────────

/**
 * **CustomIcons** — sun/moon slotted into `icon-on` / `icon-off` for a classic
 * theme-toggle affordance. The `show-icon` attribute is implied when either
 * icon slot is populated.
 */
export const CustomIcons: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-switch label="Theme toggle" checked show-icon>
        <span slot="icon-on">${sunIcon}</span>
        <span slot="icon-off">${moonIcon}</span>
      </tulpar-switch>
      <tulpar-switch label="Theme toggle (unchecked)" show-icon>
        <span slot="icon-on">${sunIcon}</span>
        <span slot="icon-off">${moonIcon}</span>
      </tulpar-switch>
      <p style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        Slot sun into <code>icon-on</code>, moon into <code>icon-off</code>; the
        correct icon shows depending on <code>checked</code>.
      </p>
    </div>
  `,
};

// ─── 9. ColorOverride ────────────────────────────────────────────────────────

/**
 * **ColorOverride** — `on-color` / `off-color` override the track hue per
 * instance without touching tokens. Use sparingly; the default brand color is
 * correct for most product contexts.
 */
export const ColorOverride: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; max-width:320px;">
      <tulpar-switch
        label="Custom on-color (danger)"
        on-color="var(--tulpar-color-danger-default, #ef4444)"
        checked
      ></tulpar-switch>
      <tulpar-switch
        label="Custom on-color (amber)"
        on-color="#f59e0b"
        checked
      ></tulpar-switch>
      <tulpar-switch
        label="Custom off-color"
        off-color="#94a3b8"
      ></tulpar-switch>
      <tulpar-switch
        label="Both overridden"
        on-color="#10b981"
        off-color="#f43f5e"
      ></tulpar-switch>
      <tulpar-switch
        label="color= semantic token alias"
        color="var(--tulpar-color-success-default, #22c55e)"
        checked
      ></tulpar-switch>
    </div>
  `,
};

// ─── 10. LoadingAsync ────────────────────────────────────────────────────────

/**
 * **LoadingAsync** — click the switch to trigger a simulated async save
 * (1.5 s delay). During that window the switch enters `loading` state (spinner
 * in the thumb, toggle suppressed, `aria-busy`). After the promise resolves the
 * switch lands in `checked=true` and exits loading.
 *
 * This is the recommended pattern for settings that require a server round-trip
 * before the toggle should commit.
 */
export const LoadingAsync: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const handleChange = (e: Event) => {
      const sw = e.currentTarget as HTMLElement & {
        loading: boolean;
        checked: boolean;
      };
      // Revert the optimistic toggle — we'll apply it after the async call.
      const intended = sw.checked;
      sw.checked = !intended;
      sw.loading = true;
      // Simulate a 1.5 s API call.
      setTimeout(() => {
        sw.loading = false;
        sw.checked = intended;
      }, 1500);
    };
    return html`
      <div style="max-width:360px;">
        <tulpar-switch
          label="Auto-save (click to toggle)"
          @change=${handleChange}
          helper-text="Changes are saved remotely — a 1.5 s delay is simulated."
        ></tulpar-switch>
      </div>
    `;
  },
};

// ─── 11. SettingsCard (real-world composition) ───────────────────────────────

/**
 * **SettingsCard** — a realistic "Notification preferences" panel composed of
 * multiple switches at different states. Shows how switches read inside
 * a product settings surface.
 */
export const SettingsCard: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div
      style="max-width:420px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:12px; background:var(--tulpar-color-bg-raised,#fff); overflow:hidden;"
    >
      <div style="padding:20px 20px 0;">
        <h3 style="margin:0 0 4px; font-size:1.05rem;">Notification preferences</h3>
        <p style="margin:0; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#74777a);">
          Choose how and when you want to be notified.
        </p>
      </div>
      <div style="display:flex; flex-direction:column; gap:0; padding:12px 20px 20px;">
        <tulpar-switch
          label="Email notifications"
          checked
          no-message-space
          style="padding:12px 0; border-bottom:1px solid var(--tulpar-color-border-subtle,#eef2f1);"
        >
          <span slot="description">Receive updates via email.</span>
        </tulpar-switch>
        <tulpar-switch
          label="Push notifications"
          no-message-space
          style="padding:12px 0; border-bottom:1px solid var(--tulpar-color-border-subtle,#eef2f1);"
        >
          <span slot="description">Browser and mobile push alerts.</span>
        </tulpar-switch>
        <tulpar-switch
          label="Weekly digest"
          checked
          no-message-space
          style="padding:12px 0;"
        >
          <span slot="description">A summary every Monday at 9 AM.</span>
        </tulpar-switch>
      </div>
    </div>
  `,
};
