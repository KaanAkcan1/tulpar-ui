import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/progress";

/**
 * `<tulpar-progress>` — linear + circular progress.
 *
 * Reports a task as a **determinate** bar/ring (a known fraction) or an
 * **indeterminate** animation (unknown duration). The fill defaults to brand
 * green; a `tone` (or `tone="custom"` + `color`) recolors it.
 *
 * ## Determinate vs indeterminate
 * - Determinate: `value` between `min`..`max` (linear width / circular
 *   `stroke-dashoffset`, both 320ms).
 * - `indeterminate`: a traveling bar / rotating arc. `aria-valuenow` is dropped.
 *
 * ## Buffer (linear only)
 * `buffer` paints a fainter secondary segment behind the fill (e.g. a video's
 * buffered range).
 *
 * ## Labels
 * - `valueLabel` (**property**, not an attribute): `true` → `${pct}%`; a
 *   formatter → its return (also seeds `aria-valuetext`, e.g. "Step 3 of 5").
 * - `slot="label"` → descriptive text wired as the accessible name via
 *   `aria-labelledby`.
 *
 * ## State tone
 * `state-tone` auto-promotes to `success` at `value >= max`; a consumer's
 * `tone="danger"` (or `data-error`) always wins.
 *
 * ## Accessibility
 * The host is `role="progressbar"` with `aria-valuemin`/`-valuemax` and, when
 * determinate, `aria-valuenow`. Under `prefers-reduced-motion`, indeterminate
 * animations become an opacity pulse.
 */
const meta: Meta = {
  title: "Display & Status/Progress",
  component: "tulpar-progress",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["linear", "circular"],
    },
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger", "custom"],
    },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    buffer: { control: { type: "range", min: 0, max: 100, step: 1 } },
    indeterminate: { control: "boolean" },
    stateTone: { control: "boolean" },
    thickness: {
      control: "select",
      options: ["thin", "regular", "thick"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: { control: "text" },
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

const TONES = ["neutral", "info", "success", "warning", "danger"] as const;

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control. `valueLabel` is bound as a property.
 */
export const Default: Story = {
  args: {
    variant: "linear",
    value: 60,
    min: 0,
    max: 100,
    thickness: "regular",
    size: "md",
  },
  render: (args) => html`
    <div style="padding:40px; max-width:360px;">
      <tulpar-progress
        variant=${args["variant"] ?? "linear"}
        tone=${args["tone"] ?? ""}
        .value=${args["value"] ?? 0}
        .min=${args["min"] ?? 0}
        .max=${args["max"] ?? 100}
        .buffer=${args["buffer"] ?? undefined}
        ?indeterminate=${args["indeterminate"]}
        ?state-tone=${args["stateTone"]}
        thickness=${args["thickness"] ?? "regular"}
        size=${args["size"] ?? "md"}
        color=${args["color"] ?? ""}
        .valueLabel=${true}
      ></tulpar-progress>
    </div>
  `,
};

// ─── 2. LinearDeterminate ────────────────────────────────────────────────────

/**
 * **Linear · determinate** — known fractions with value labels, across tones,
 * plus the thickness scale.
 */
export const LinearDeterminate: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px; max-width:420px;">
      ${sectionLabel("Values + value label")}
      <tulpar-progress .value=${24} .valueLabel=${true}></tulpar-progress>
      <tulpar-progress .value=${58} .valueLabel=${true}></tulpar-progress>
      <tulpar-progress .value=${92} .valueLabel=${true}></tulpar-progress>

      ${sectionLabel("Tones")}
      ${TONES.map(
        (t) => html`<tulpar-progress tone=${t} .value=${66} .valueLabel=${true}></tulpar-progress>`,
      )}

      ${sectionLabel("Thickness — thin / regular / thick")}
      <tulpar-progress thickness="thin" .value=${50}></tulpar-progress>
      <tulpar-progress thickness="regular" .value=${50}></tulpar-progress>
      <tulpar-progress thickness="thick" .value=${50}></tulpar-progress>
    </div>
  `,
};

// ─── 3. LinearIndeterminateAndBuffer ─────────────────────────────────────────

/**
 * **Linear · indeterminate & buffer** — the traveling bar (unknown duration,
 * `aria-valuenow` dropped) and the buffer segment (a fainter band ahead of the
 * fill, linear only).
 */
export const LinearIndeterminateAndBuffer: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px; max-width:420px;">
      ${sectionLabel("Indeterminate (traveling bar)")}
      <tulpar-progress indeterminate></tulpar-progress>
      <tulpar-progress tone="info" indeterminate></tulpar-progress>

      ${sectionLabel("Buffer — fill at 35%, buffered to 70%")}
      <tulpar-progress .value=${35} .buffer=${70} .valueLabel=${true}></tulpar-progress>

      ${sectionLabel("Buffer + tone")}
      <tulpar-progress tone="info" .value=${50} .buffer=${85}></tulpar-progress>
    </div>
  `,
};

// ─── 4. Circular ─────────────────────────────────────────────────────────────

/**
 * **Circular** — determinate ring (animated `stroke-dashoffset`) and
 * indeterminate rotating arc, across the size scale and tones.
 */
export const Circular: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const cell = (inner: unknown, caption: string) => html`
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        ${inner}
        <span style="font-size:11px; color:var(--tulpar-color-text-secondary,#74777a);">${caption}</span>
      </div>
    `;
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:24px;">
        ${sectionLabel("Determinate · sizes sm / md / lg")}
        <div style="display:flex; gap:24px; align-items:flex-end; flex-wrap:wrap;">
          ${cell(html`<tulpar-progress variant="circular" size="sm" .value=${70}></tulpar-progress>`, "sm")}
          ${cell(
            html`<tulpar-progress variant="circular" size="md" .value=${70} .valueLabel=${true}></tulpar-progress>`,
            "md + label",
          )}
          ${cell(html`<tulpar-progress variant="circular" size="lg" .value=${70}></tulpar-progress>`, "lg")}
        </div>

        ${sectionLabel("Determinate · tones")}
        <div style="display:flex; gap:24px; align-items:center; flex-wrap:wrap;">
          ${TONES.map(
            (t) => html`<tulpar-progress variant="circular" tone=${t} .value=${65}></tulpar-progress>`,
          )}
        </div>

        ${sectionLabel("Indeterminate (rotating arc)")}
        <div style="display:flex; gap:24px; align-items:center; flex-wrap:wrap;">
          <tulpar-progress variant="circular" indeterminate></tulpar-progress>
          <tulpar-progress variant="circular" tone="info" indeterminate></tulpar-progress>
        </div>
      </div>
    `;
  },
};

// ─── 5. Labels ───────────────────────────────────────────────────────────────

/**
 * **Labels** — the two distinct label concepts. `valueLabel` shows the numeric
 * % (or a formatter's text, which also becomes `aria-valuetext`); `slot="label"`
 * is descriptive text wired as the accessible name via `aria-labelledby`.
 */
export const Labels: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const stepFormatter = (v: number) => `Step ${Math.round((v / 100) * 5)} of 5`;
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:20px; max-width:420px;">
        ${sectionLabel("valueLabel = true → percent")}
        <tulpar-progress .value=${72} .valueLabel=${true}></tulpar-progress>

        ${sectionLabel("valueLabel = formatter → custom text (+ aria-valuetext)")}
        <tulpar-progress .value=${60} .valueLabel=${stepFormatter}></tulpar-progress>

        ${sectionLabel("slot='label' → descriptive accessible name")}
        <tulpar-progress .value=${40} .valueLabel=${true}>
          <span slot="label">Uploading project assets…</span>
        </tulpar-progress>

        ${sectionLabel("Circular with descriptive label")}
        <tulpar-progress variant="circular" .value=${45} .valueLabel=${true}>
          <span slot="label">Sync</span>
        </tulpar-progress>
      </div>
    `;
  },
};

// ─── 6. StateTone ────────────────────────────────────────────────────────────

/**
 * **State tone** — `state-tone` promotes the fill to `success` once
 * `value >= max`. A consumer's `tone="danger"` (or `data-error`) always wins,
 * even past max.
 */
export const StateTone: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px; max-width:420px;">
      ${sectionLabel("state-tone — in progress (brand) vs complete (success)")}
      <tulpar-progress state-tone .value=${64} .valueLabel=${true}></tulpar-progress>
      <tulpar-progress state-tone .value=${100} .valueLabel=${true}></tulpar-progress>

      ${sectionLabel("Error — tone='danger' wins even at 100%")}
      <tulpar-progress tone="danger" state-tone .value=${100} .valueLabel=${true}></tulpar-progress>
    </div>
  `,
};

// ─── 7. CustomTone ───────────────────────────────────────────────────────────

/**
 * **CustomTone** — `tone="custom"` + `color` (brand family or raw color)
 * recolors the fill / ring.
 */
export const CustomTone: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:20px; max-width:420px;">
      ${sectionLabel("Brand families")}
      <tulpar-progress tone="custom" color="ilay" .value=${60}></tulpar-progress>
      <tulpar-progress tone="custom" color="gok" .value=${60}></tulpar-progress>
      ${sectionLabel("Raw CSS color")}
      <tulpar-progress tone="custom" color="#0d9488" .value=${60} .valueLabel=${true}></tulpar-progress>
      ${sectionLabel("Circular custom")}
      <tulpar-progress variant="circular" tone="custom" color="ilay" .value=${72}></tulpar-progress>
    </div>
  `,
};

// ─── 8. DarkMode ─────────────────────────────────────────────────────────────

/**
 * **DarkMode** — linear + circular, determinate + indeterminate, on a dark
 * surface. Tracks use the dark track tone.
 */
export const DarkMode: Story = {
  parameters: {
    controls: { disable: true },
    backgrounds: { default: "dark" },
  },
  render: () => html`
    <div
      class="dark"
      style="background:var(--tulpar-color-bg-canvas,#13171a); padding:40px; border-radius:12px;
             display:flex; flex-direction:column; gap:20px; max-width:420px;
             color:var(--tulpar-color-text-primary,#e9ecef);"
    >
      ${sectionLabel("Linear — determinate (tones)")}
      ${TONES.map((t) => html`<tulpar-progress tone=${t} .value=${66} .valueLabel=${true}></tulpar-progress>`)}

      ${sectionLabel("Linear — indeterminate + buffer")}
      <tulpar-progress indeterminate></tulpar-progress>
      <tulpar-progress .value=${35} .buffer=${70}></tulpar-progress>

      ${sectionLabel("Circular")}
      <div style="display:flex; gap:24px; align-items:center; flex-wrap:wrap;">
        <tulpar-progress variant="circular" .value=${70} .valueLabel=${true}></tulpar-progress>
        <tulpar-progress variant="circular" tone="info" .value=${40}></tulpar-progress>
        <tulpar-progress variant="circular" indeterminate></tulpar-progress>
      </div>
    </div>
  `,
};
