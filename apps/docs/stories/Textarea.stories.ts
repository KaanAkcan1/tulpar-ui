import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/textarea";

const meta: Meta = {
  title: "Components/Textarea",
  component: "tulpar-textarea",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["outlined", "filled", "underlined", "ghost"],
    },
    resize: {
      control: "select",
      options: ["none", "both", "horizontal", "vertical"],
    },
    "label-position": {
      control: "select",
      options: ["top", "float", "float-in", "float-on", "none"],
    },
    autosize: { control: "boolean" },
    "min-rows": { control: "number" },
    "max-rows": { control: "number" },
    rows: { control: "number" },
    "show-count": { control: "boolean" },
    copyable: { control: "boolean" },
    pastable: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    warn: { control: "boolean" },
    validating: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

// ─── 1. Default ───────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { label: "Description", placeholder: "Enter a description…" },
  render: (args) => html`
    <tulpar-textarea
      label=${args["label"]}
      placeholder=${args["placeholder"] ?? ""}
      size=${args["size"] ?? "md"}
      variant=${args["variant"] ?? "outlined"}
      ?disabled=${args["disabled"]}
      ?readonly=${args["readonly"]}
      style="max-width:400px; display:block;"
    ></tulpar-textarea>
  `,
};

// ─── 2. Autosize ──────────────────────────────────────────────────────────────
// autosize is on by default. The textarea expands from min-rows to max-rows
// as content grows, then shows a scrollbar beyond the maximum.

export const Autosize: Story = {
  render: () => html`
    <tulpar-textarea
      label="Auto-growing textarea"
      min-rows="2"
      max-rows="6"
      placeholder="Type here — the textarea grows up to 6 rows then scrolls"
      style="max-width:400px; display:block;"
    ></tulpar-textarea>
    <p style="font-size:12px; color:#78716c; margin-top:8px;">
      <code>autosize</code> (default: enabled) — expands from <code>min-rows=2</code>
      up to <code>max-rows=6</code>. Paste a long paragraph to see it scroll at the cap.
    </p>
  `,
};

// ─── 3. FixedRows ─────────────────────────────────────────────────────────────
// Setting `rows` disables autosize. The control has a fixed height.

export const FixedRows: Story = {
  render: () => html`
    <tulpar-textarea
      label="Fixed height (rows=5)"
      rows="5"
      placeholder="autosize is disabled when rows is set — height is fixed"
      style="max-width:400px; display:block;"
    ></tulpar-textarea>
    <p style="font-size:12px; color:#78716c; margin-top:8px;">
      Setting <code>rows</code> disables <code>autosize</code> automatically.
    </p>
  `,
};

// ─── 4. ResizeOptions ─────────────────────────────────────────────────────────

export const ResizeOptions: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:400px;">
      <tulpar-textarea label="resize=none" resize="none" rows="3" placeholder="Not resizable"></tulpar-textarea>
      <tulpar-textarea label="resize=both" resize="both" rows="3" placeholder="Drag the corner handle"></tulpar-textarea>
      <tulpar-textarea label="resize=horizontal" resize="horizontal" rows="3" placeholder="Horizontal only"></tulpar-textarea>
      <tulpar-textarea label="resize=vertical (default)" resize="vertical" rows="3" placeholder="Vertical only"></tulpar-textarea>
    </div>
  `,
};

// ─── 5. ShowCount ─────────────────────────────────────────────────────────────
// The counter renders as an overlay badge in the bottom-right corner of the
// textarea when show-count is true. With maxlength, shows n / max.

export const ShowCount: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:400px;">
      <tulpar-textarea
        label="With maxlength"
        show-count
        maxlength="200"
        rows="4"
        placeholder="Counter shows n / 200"
      ></tulpar-textarea>
      <tulpar-textarea
        label="No maxlength"
        show-count
        rows="4"
        placeholder="Counter shows absolute character count"
      ></tulpar-textarea>
    </div>
  `,
};

// ─── 6. CopyablePastable ──────────────────────────────────────────────────────
// Action buttons appear in the top-right corner of the textarea.

export const CopyablePastable: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:400px;">
      <tulpar-textarea
        label="Copyable"
        copyable
        rows="3"
        value="This value can be copied with the button in the corner."
      ></tulpar-textarea>
      <tulpar-textarea
        label="Pastable"
        pastable
        rows="3"
        placeholder="Click the paste button to read from clipboard"
      ></tulpar-textarea>
      <tulpar-textarea
        label="Copyable + Pastable"
        copyable
        pastable
        rows="3"
        value="Both copy and paste affordances active."
      ></tulpar-textarea>
    </div>
    <p style="font-size:12px; color:#78716c; margin-top:8px;">
      Action buttons are hidden at <code>size="xs"</code> (cannot meet the 44 pt touch target minimum).
    </p>
  `,
};

// ─── 7. Statuses ──────────────────────────────────────────────────────────────

export const Statuses: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:400px;">
      <tulpar-textarea
        label="Invalid"
        invalid
        error-text="Maximum 500 characters allowed"
        rows="3"
        placeholder="Error state"
      ></tulpar-textarea>
      <tulpar-textarea
        label="Warning"
        warn
        warn-text="Markdown formatting is not supported here"
        rows="3"
        placeholder="Warn state"
      ></tulpar-textarea>
      <tulpar-textarea
        label="Validating"
        validating
        helper-text="Checking for prohibited words…"
        rows="3"
        placeholder="Async validation in progress"
      ></tulpar-textarea>
    </div>
  `,
};
