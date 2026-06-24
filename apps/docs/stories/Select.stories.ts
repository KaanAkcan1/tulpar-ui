import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@tulpar-ui/core/select";

/**
 * `<tulpar-select>` — single-select dropdown built on FormFieldBase.
 *
 * A form-associated combobox that renders a trigger + top-layer listbox with
 * full keyboard navigation (arrows, Home, End, Page, typeahead), virtual focus
 * (`aria-activedescendant`), light-dismiss, and a bubbling `change` event.
 *
 * ## Content
 * - Light-DOM `<tulpar-option>` children — discoverable in document order,
 *   including those nested inside `<tulpar-option-group>`.
 * - Each option supports a `label` prop, a `description` prop/slot, and an
 *   `icon` slot for a leading glyph.
 *
 * ## States
 * - `loading` — spinner in trigger; listbox shows a loading status row.
 * - `error` — listbox shows an error status row (not the field error state).
 * - Empty collection — listbox shows an `emptyText` status row.
 * - `invalid` + `errorText` — field-level validation feedback (red border + message row).
 * - `warn` + `warnText` — field-level warning.
 * - `clearable` — shows a ✕ button once a value is set (suppressed when `required`).
 */
const meta: Meta = {
  title: "Components/Select",
  component: "tulpar-select",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "filled", "underlined", "ghost"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    "label-position": {
      control: "select",
      options: ["top", "float", "float-in", "float-on", "none"],
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    "empty-text": { control: "text" },
    "loading-text": { control: "text" },
    error: { control: "text" },
    "error-text": { control: "text" },
    "warn-text": { control: "text" },
    clearable: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    warn: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

// ─── Shared helpers ───────────────────────────────────────────────────────────

const sectionLabel = (t: string) => html`
  <p
    style="margin:0 0 8px; font-size:12px; font-weight:600; letter-spacing:0.05em;
           text-transform:uppercase; color:var(--tulpar-color-text-secondary,#74777a);
           font-family:monospace;"
  >
    ${t}
  </p>
`;

const col = (...children: unknown[]) => html`
  <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">${children}</div>
`;

// ── Realistic data ────────────────────────────────────────────────────────────

const COUNTRIES = [
  { value: "tr", label: "Turkey" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "nl", label: "Netherlands" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
];

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
];

const LONG_LIST = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Belgium",
  "Bolivia",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Ecuador",
  "Egypt",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
];

const globeIcon = (slot?: string) => html`<svg
  ${slot ? `slot="${slot}"` : ""}
  viewBox="0 0 16 16"
  width="16"
  height="16"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <circle cx="8" cy="8" r="6" />
  <path d="M2 8h12M8 2a9 9 0 0 1 0 12M8 2a9 9 0 0 0 0 12" />
</svg>`;

const codeIcon = (slot?: string) => html`<svg
  ${slot ? `slot="${slot}"` : ""}
  viewBox="0 0 16 16"
  width="16"
  height="16"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <polyline points="5,4 1,8 5,12" />
  <polyline points="11,4 15,8 11,12" />
</svg>`;

// ─── 1. Playground ───────────────────────────────────────────────────────────

/**
 * **Playground** — every declared control maps to a prop. Change variant, size,
 * label-position, clearable, disabled, required, invalid, warn, loading from the
 * Controls panel and see the select update live. A few options are pre-loaded so
 * interaction is meaningful.
 */
export const Playground: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country…",
    size: "md",
    variant: "outlined",
    "label-position": "top",
    clearable: false,
    loading: false,
    disabled: false,
    required: false,
    invalid: false,
    warn: false,
  },
  render: (args) => html`
    <div style="padding:40px; max-width:360px;">
      <tulpar-select
        label=${args["label"] ?? nothing}
        placeholder=${args["placeholder"] ?? nothing}
        size=${args["size"] ?? nothing}
        variant=${args["variant"] ?? nothing}
        label-position=${args["label-position"] ?? nothing}
        error-text=${args["error-text"] ?? nothing}
        warn-text=${args["warn-text"] ?? nothing}
        empty-text=${args["empty-text"] ?? nothing}
        loading-text=${args["loading-text"] ?? nothing}
        error=${args["error"] ?? nothing}
        ?clearable=${args["clearable"]}
        ?loading=${args["loading"]}
        ?disabled=${args["disabled"]}
        ?required=${args["required"]}
        ?invalid=${args["invalid"]}
        ?warn=${args["warn"]}
        style="display:block;"
      >
        ${COUNTRIES.map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
      </tulpar-select>
    </div>
  `,
};

// ─── 2. Variants ─────────────────────────────────────────────────────────────

/**
 * **Variants** — `outlined` (default), `filled`, `underlined`, and `ghost`.
 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px;">
      ${col(
        html`<tulpar-select variant="outlined" label="Outlined" placeholder="Default border ring">
          ${FRAMEWORKS.map((f) => html`<tulpar-option value=${f.value} label=${f.label}></tulpar-option>`)}
        </tulpar-select>`,
        html`<tulpar-select variant="filled" label="Filled" placeholder="Filled background">
          ${FRAMEWORKS.map((f) => html`<tulpar-option value=${f.value} label=${f.label}></tulpar-option>`)}
        </tulpar-select>`,
        html`<tulpar-select variant="underlined" label="Underlined" placeholder="Bottom border only">
          ${FRAMEWORKS.map((f) => html`<tulpar-option value=${f.value} label=${f.label}></tulpar-option>`)}
        </tulpar-select>`,
        html`<tulpar-select variant="ghost" label="Ghost" placeholder="No visible border">
          ${FRAMEWORKS.map((f) => html`<tulpar-option value=${f.value} label=${f.label}></tulpar-option>`)}
        </tulpar-select>`,
      )}
    </div>
  `,
};

// ─── 3. Sizes ────────────────────────────────────────────────────────────────

/**
 * **Sizes** — `xs → xl`. The trigger height, font, padding, and option row
 * geometry all scale together — the select stamps its `size` onto each option.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px;">
      ${col(
        ...(["xs", "sm", "md", "lg", "xl"] as const).map(
          (s) => html`
            <tulpar-select size=${s} label=${s} placeholder="Select…">
              ${FRAMEWORKS.map((f) => html`<tulpar-option value=${f.value} label=${f.label}></tulpar-option>`)}
            </tulpar-select>
          `,
        ),
      )}
    </div>
  `,
};

// ─── 4. LabelPositions ───────────────────────────────────────────────────────

/**
 * **LabelPositions** — all five `label-position` values. `ghost` forces
 * `top` when a float variant is requested (with a dev-mode console warning).
 */
export const LabelPositions: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px;">
      <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
        <tulpar-select label-position="top" label="top (default)" placeholder="Label sits above">
          ${COUNTRIES.slice(0, 4).map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>
        <tulpar-select label-position="float" label="float" placeholder="Floats on focus / value">
          ${COUNTRIES.slice(0, 4).map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>
        <tulpar-select label-position="float-in" label="float-in" placeholder="Floats inside the control">
          ${COUNTRIES.slice(0, 4).map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>
        <tulpar-select label-position="float-on" label="float-on" placeholder="Floats on top of the border">
          ${COUNTRIES.slice(0, 4).map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>
        <tulpar-select label-position="none" label="Country (aria-label only)" placeholder="No visible label">
          ${COUNTRIES.slice(0, 4).map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>
      </div>
    </div>
  `,
};

// ─── 5. WithGroups ───────────────────────────────────────────────────────────

/**
 * **WithGroups** — `<tulpar-option-group>` groups options under a labeled
 * header. The group label can be set via the `label` prop or the `label` slot
 * (slot wins). A disabled option is included to show skip-on-keyboard behavior.
 */
export const WithGroups: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; max-width:360px;">
      <tulpar-select label="Technology stack" placeholder="Choose a technology…" style="display:block;">
        <tulpar-option-group label="Frontend">
          <tulpar-option value="react" label="React"></tulpar-option>
          <tulpar-option value="angular" label="Angular"></tulpar-option>
          <tulpar-option value="vue" label="Vue"></tulpar-option>
          <tulpar-option value="svelte" label="Svelte" disabled></tulpar-option>
        </tulpar-option-group>
        <tulpar-option-group>
          <span slot="label">Backend</span>
          <tulpar-option value="node" label="Node.js"></tulpar-option>
          <tulpar-option value="django" label="Django"></tulpar-option>
          <tulpar-option value="rails" label="Ruby on Rails"></tulpar-option>
          <tulpar-option value="go" label="Go"></tulpar-option>
        </tulpar-option-group>
        <tulpar-option-group label="Database">
          <tulpar-option value="postgres" label="PostgreSQL"></tulpar-option>
          <tulpar-option value="mysql" label="MySQL"></tulpar-option>
          <tulpar-option value="mongo" label="MongoDB"></tulpar-option>
        </tulpar-option-group>
      </tulpar-select>
      <p style="margin-top:12px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        "Svelte" is disabled — keyboard navigation skips it. The "Backend" group label uses
        <code>slot="label"</code> instead of the <code>label</code> prop.
      </p>
    </div>
  `,
};

// ─── 6. RichOptions ──────────────────────────────────────────────────────────

/**
 * **RichOptions** — `<tulpar-option>` with a leading `slot="icon"` and a
 * two-line description. Demonstrates **both** the prop form (`description="…"`)
 * and the slot form (`<span slot="description">…</span>`). The selected option's
 * icon is mirrored into the trigger automatically.
 */
export const RichOptions: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:32px; max-width:400px;">
      ${sectionLabel("Leading icon — slot='icon' (SVG) + description prop")}
      <tulpar-select label="Country" placeholder="Select a country…" style="display:block;">
        <tulpar-option value="tr" label="Turkey" description="İstanbul · GMT+3">
          ${globeIcon("icon")}
        </tulpar-option>
        <tulpar-option value="de" label="Germany" description="Berlin · GMT+1">
          ${globeIcon("icon")}
        </tulpar-option>
        <tulpar-option value="fr" label="France" description="Paris · GMT+1">
          ${globeIcon("icon")}
        </tulpar-option>
        <tulpar-option value="us" label="United States" description="New York · GMT-5">
          ${globeIcon("icon")}
        </tulpar-option>
      </tulpar-select>

      ${sectionLabel("Leading icon — emoji prop + description via slot")}
      <tulpar-select label="Framework" placeholder="Choose a framework…" style="display:block;">
        <tulpar-option value="react" icon="⚛️" label="React">
          <span slot="description">Meta · declarative, component-based</span>
        </tulpar-option>
        <tulpar-option value="angular" icon="🅰️" label="Angular">
          <span slot="description">Google · opinionated full-stack</span>
        </tulpar-option>
        <tulpar-option value="vue" icon="💚" label="Vue">
          <span slot="description">Evan You · progressive framework</span>
        </tulpar-option>
        <tulpar-option value="svelte" icon="🔥" label="Svelte">
          <span slot="description">Rich Harris · compile-time magic</span>
        </tulpar-option>
      </tulpar-select>

      ${sectionLabel("SVG icon + slot label (slot wins over label prop)")}
      <tulpar-select label="Language" placeholder="Select a language…" style="display:block;">
        <tulpar-option value="ts" label="TypeScript">
          ${codeIcon("icon")}
          <strong>TypeScript</strong>
          <span slot="description">Typed superset of JavaScript</span>
        </tulpar-option>
        <tulpar-option value="py" label="Python">
          ${codeIcon("icon")}
          <strong>Python</strong>
          <span slot="description">Batteries-included scripting</span>
        </tulpar-option>
        <tulpar-option value="rs" label="Rust">
          ${codeIcon("icon")}
          <strong>Rust</strong>
          <span slot="description">Memory-safe systems language</span>
        </tulpar-option>
      </tulpar-select>
    </div>
  `,
};

// ─── 7. Clearable ────────────────────────────────────────────────────────────

/**
 * **Clearable** — a ✕ button appears once a value is set. When `required` is
 * also set the clear button is suppressed — a required field must never offer
 * an empty state.
 */
export const Clearable: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px;">
      <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
        ${sectionLabel("clearable — value pre-selected, ✕ visible")}
        <tulpar-select label="Country" clearable value="de" style="display:block;">
          ${COUNTRIES.map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>

        ${sectionLabel("clearable + required — clear suppressed")}
        <tulpar-select
          label="Country (required)"
          clearable
          required
          value="fr"
          necessity-indicator="icon"
          style="display:block;"
        >
          ${COUNTRIES.map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>
        <p style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
          No ✕ on the required field — a required select must never be clearable to empty.
        </p>

        ${sectionLabel("clearable — no value yet, ✕ not shown")}
        <tulpar-select label="Country" clearable placeholder="Select a country…" style="display:block;">
          ${COUNTRIES.map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>
      </div>
    </div>
  `,
};

// ─── 8. Loading ──────────────────────────────────────────────────────────────

/**
 * **Loading** — `loading` shows a spinner in the trigger and a loading status
 * row inside the listbox (try opening it). `loading-text` customises the row.
 */
export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px;">
      <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
        ${sectionLabel("loading (default loading-text)")}
        <tulpar-select label="Country" loading placeholder="Fetching options…" style="display:block;">
        </tulpar-select>

        ${sectionLabel("loading + custom loading-text")}
        <tulpar-select
          label="Region"
          loading
          loading-text="Fetching regions from server…"
          placeholder="Loading…"
          style="display:block;"
        >
        </tulpar-select>
      </div>
    </div>
  `,
};

// ─── 9. Empty ────────────────────────────────────────────────────────────────

/**
 * **Empty** — when the select has no `<tulpar-option>` children it shows an
 * empty status row. `empty-text` customises the message (default: "No options").
 */
export const Empty: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px;">
      <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
        ${sectionLabel("empty (default empty-text)")}
        <tulpar-select label="Category" placeholder="Open to see empty state" style="display:block;">
        </tulpar-select>

        ${sectionLabel("empty + custom empty-text")}
        <tulpar-select
          label="Results"
          empty-text="No results match your search"
          placeholder="Open to see custom empty"
          style="display:block;"
        >
        </tulpar-select>

        ${sectionLabel("empty + slot='empty' (rich content)")}
        <tulpar-select label="Products" placeholder="Open to see slotted empty" style="display:block;">
          <span slot="empty" style="display:flex; align-items:center; gap:6px; color:var(--tulpar-color-text-secondary,#74777a);">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <circle cx="8" cy="8" r="6"/>
              <path d="M8 5v3M8 11h.01"/>
            </svg>
            No products in this category yet
          </span>
        </tulpar-select>
      </div>
    </div>
  `,
};

// ─── 10. Error (listbox state) ────────────────────────────────────────────────

/**
 * **Error (listbox state)** — the `error` prop shows an error status row INSIDE
 * the listbox (role=alert). This is a **listbox-content** error — e.g., failed
 * remote fetch — not the field-level `invalid` validation state.
 * Also shows the `slot="error"` form for rich content.
 */
export const ErrorState: Story = {
  name: "Error (listbox state)",
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px;">
      <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
        ${sectionLabel("error prop — plain text")}
        <tulpar-select
          label="Country"
          error="Failed to load options. Please try again."
          placeholder="Open to see error"
          style="display:block;"
        >
        </tulpar-select>

        ${sectionLabel("slot='error' — rich content with retry")}
        <tulpar-select label="Region" placeholder="Open to see slotted error" style="display:block;">
          <span slot="error" style="display:flex; align-items:center; gap:8px;">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <circle cx="8" cy="8" r="6"/>
              <path d="M8 5v3M8 11h.01"/>
            </svg>
            Network error —
            <button
              type="button"
              style="background:none; border:none; cursor:pointer; padding:0; text-decoration:underline; font-size:inherit; color:inherit;"
              @click=${() => alert("Retrying…")}
            >retry</button>
          </span>
        </tulpar-select>
      </div>
    </div>
  `,
};

// ─── 11. Validation ──────────────────────────────────────────────────────────

/**
 * **Validation** — field-level states: `invalid` + `errorText` (red ring +
 * message row) and `warn` + `warnText` (amber ring + message row). These are
 * distinct from the listbox-content `error` prop.
 */
export const Validation: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px;">
      <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
        ${sectionLabel("invalid + errorText")}
        <tulpar-select
          label="Country"
          invalid
          error-text="Please select a country to continue."
          placeholder="Select a country…"
          style="display:block;"
        >
          ${COUNTRIES.map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>

        ${sectionLabel("warn + warnText")}
        <tulpar-select
          label="Region"
          warn
          warn-text="This region has limited coverage — some features may be unavailable."
          value="tr"
          style="display:block;"
        >
          ${COUNTRIES.map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>

        ${sectionLabel("disabled")}
        <tulpar-select
          label="Country"
          disabled
          value="de"
          style="display:block;"
        >
          ${COUNTRIES.map((c) => html`<tulpar-option value=${c.value} label=${c.label}></tulpar-option>`)}
        </tulpar-select>
      </div>
    </div>
  `,
};

// ─── 12. LongList ────────────────────────────────────────────────────────────

/**
 * **LongList** — 25+ options in a single flat list. The listbox scrolls within
 * its constrained height. Keyboard `Page Down / Up` jumps by visible-row count;
 * typeahead jumps to the first option starting with the typed key.
 */
export const LongList: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; max-width:360px;">
      <tulpar-select label="Country" placeholder="Search by typing a letter…" style="display:block;">
        ${LONG_LIST.map(
          (name) =>
            html`<tulpar-option value=${name.toLowerCase().replace(/\s+/g, "-")} label=${name}></tulpar-option>`,
        )}
      </tulpar-select>
      <p style="margin-top:12px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        25 options. Open the listbox and press a letter key — typeahead jumps to the first match.
        <code>Page Down / Up</code> scrolls by visible row count.
      </p>
    </div>
  `,
};
