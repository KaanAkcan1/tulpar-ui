import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@tulpar-ui/core/number-input";

const meta: Meta = {
  title: "Components/NumberInput",
  component: "tulpar-number-input",
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
    "format-style": {
      control: "select",
      options: ["decimal", "currency", "percent"],
    },
    "label-position": {
      control: "select",
      options: ["top", "float", "float-in", "float-on", "none"],
    },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    warn: { control: "boolean" },
    validating: { control: "boolean" },
    "hide-steppers": { control: "boolean" },
    "integer-only": { control: "boolean" },
    "allow-empty": { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
};
export default meta;

type Story = StoryObj;

// ─── 1. Default ───────────────────────────────────────────────────────────────

/**
 * **Playground** — every declared control is wired: size, variant,
 * format-style, label-position, min/max/step and every boolean (hide-steppers,
 * integer-only, allow-empty, validation states) all visibly affect the field
 * from the controls panel.
 */
export const Default: Story = {
  args: {
    label: "Quantity",
    size: "md",
    variant: "outlined",
    "label-position": "top",
    min: 0,
    max: 100,
    step: 1,
  },
  render: (args) => html`
    <tulpar-number-input
      style="max-width:280px; display:block;"
      label=${args["label"] ?? nothing}
      size=${args["size"] ?? nothing}
      variant=${args["variant"] ?? nothing}
      format-style=${args["format-style"] ?? nothing}
      label-position=${args["label-position"] ?? nothing}
      min=${args["min"] ?? nothing}
      max=${args["max"] ?? nothing}
      step=${args["step"] ?? nothing}
      ?disabled=${args["disabled"]}
      ?readonly=${args["readonly"]}
      ?required=${args["required"]}
      ?invalid=${args["invalid"]}
      ?warn=${args["warn"]}
      ?validating=${args["validating"]}
      ?hide-steppers=${args["hide-steppers"]}
      ?integer-only=${args["integer-only"]}
      ?allow-empty=${args["allow-empty"]}
    ></tulpar-number-input>
  `,
};

/**
 * **OrderLine** — a realistic composition: an order line pairing an
 * integer-only quantity stepper with a currency-formatted unit price and a
 * live-computed line total. Shows the number input inside real commerce UI.
 */
export const OrderLine: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = document.createElement("div");
    root.setAttribute(
      "style",
      "max-width:440px; padding:20px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:12px; background:var(--tulpar-color-bg-raised,#fff);",
    );

    const unitPrice = 24.5;
    const qtyEl = document.createElement("tulpar-number-input") as HTMLElement & {
      value: number | null;
    };
    qtyEl.setAttribute("label", "Quantity");
    qtyEl.setAttribute("integer-only", "");
    qtyEl.setAttribute("min", "1");
    qtyEl.setAttribute("max", "99");
    qtyEl.setAttribute("step", "1");
    qtyEl.setAttribute("style", "flex:1;");
    qtyEl.value = 2;

    const priceEl = document.createElement("tulpar-number-input") as HTMLElement & {
      value: number | null;
    };
    priceEl.setAttribute("label", "Unit price");
    priceEl.setAttribute("format-style", "currency");
    priceEl.setAttribute("currency", "USD");
    priceEl.setAttribute("locale", "en-US");
    priceEl.setAttribute("readonly", "");
    priceEl.setAttribute("style", "flex:1;");
    priceEl.value = unitPrice;

    const totalFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    const total = document.createElement("strong");
    const render = () => {
      const qty = qtyEl.value ?? 0;
      total.textContent = totalFmt.format(qty * unitPrice);
    };
    qtyEl.addEventListener("input", render);

    const fields = document.createElement("div");
    fields.setAttribute("style", "display:flex; gap:12px; align-items:flex-start;");
    fields.append(qtyEl, priceEl);

    const summary = document.createElement("div");
    summary.setAttribute(
      "style",
      "display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:12px; border-top:1px solid var(--tulpar-color-border-default,#d9e0df);",
    );
    const label = document.createElement("span");
    label.textContent = "Line total";
    label.setAttribute("style", "color:var(--tulpar-color-text-secondary,#74777a);");
    summary.append(label, total);

    root.append(fields, summary);
    render();
    return root;
  },
};

// ─── 2. TRY_Currency ──────────────────────────────────────────────────────────

export const TRY_Currency: Story = {
  render: () => {
    const el = document.createElement("tulpar-number-input") as HTMLElement & {
      value: number | null;
    };
    el.setAttribute("label", "Fiyat (₺)");
    el.setAttribute("format-style", "currency");
    el.setAttribute("currency", "TRY");
    el.setAttribute("locale", "tr-TR");
    el.setAttribute("min-fraction-digits", "2");
    el.setAttribute("max-fraction-digits", "2");
    el.setAttribute("style", "max-width:280px; display:block;");
    el.value = 1234.56;
    return el;
  },
};

// ─── 3. USD_Currency ──────────────────────────────────────────────────────────

export const USD_Currency: Story = {
  render: () => {
    const el = document.createElement("tulpar-number-input") as HTMLElement & {
      value: number | null;
    };
    el.setAttribute("label", "Price (USD)");
    el.setAttribute("format-style", "currency");
    el.setAttribute("currency", "USD");
    el.setAttribute("locale", "en-US");
    el.setAttribute("min-fraction-digits", "2");
    el.setAttribute("max-fraction-digits", "2");
    el.setAttribute("style", "max-width:280px; display:block;");
    el.value = 1234.56;
    return el;
  },
};

// ─── 4. Percent ───────────────────────────────────────────────────────────────
// NOTE: Intl.NumberFormat percent style multiplies the value by 100 before
// formatting. A value of 0.125 is displayed as "12.5%". Set your model value
// as a fraction (0.0 – 1.0), not a percentage (0 – 100).

export const Percent: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Intl percent behavior:** \`Intl.NumberFormat\` with \`style: "percent"\` multiplies
the raw value by 100 before display. A model value of \`0.125\` renders as \`12.5%\`.

Store and bind values in the 0–1 range (e.g., \`0.5\` for 50%).
Do **not** store them as 0–100 — they would display as 5000% etc.
        `,
      },
    },
  },
  render: () => {
    const el = document.createElement("tulpar-number-input") as HTMLElement & {
      value: number | null;
    };
    el.setAttribute("label", "Discount");
    el.setAttribute("format-style", "percent");
    el.setAttribute("locale", "en-US");
    el.setAttribute("min-fraction-digits", "1");
    el.setAttribute("max-fraction-digits", "1");
    el.setAttribute("min", "0");
    el.setAttribute("max", "1");
    el.setAttribute("step", "0.01");
    el.setAttribute("style", "max-width:280px; display:block;");
    // 0.125 → displayed as "12.5%" by Intl percent style
    el.value = 0.125;
    return el;
  },
};

// ─── 5. IntegerOnly ───────────────────────────────────────────────────────────
// The decimal key (`.`) is rejected and triggers the shake animation.

export const IntegerOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Try pressing \`.\`** — the field shakes and rejects the character.
\`integer-only\` blocks decimal separators at the keydown level and
sets \`inputmode="numeric"\` for mobile keyboards.
        `,
      },
    },
  },
  render: () => html`
    <tulpar-number-input
      label="Quantity (integer)"
      integer-only
      min="0"
      max="9999"
      step="1"
      style="max-width:280px; display:block;"
    ></tulpar-number-input>
    <p style="font-size:12px; color:#74777a; margin-top:8px;">
      Press <kbd>.</kbd> to see the shake animation.
    </p>
  `,
};

// ─── 6. FormatSuffix ──────────────────────────────────────────────────────────

export const FormatSuffix: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:280px;">
      <tulpar-number-input
        label="Adet"
        format-suffix=" adet"
        min="0"
        step="1"
      ></tulpar-number-input>
      <tulpar-number-input
        label="Weight (kg)"
        format-suffix=" kg"
        min="0"
        step="0.1"
        min-fraction-digits="1"
        max-fraction-digits="1"
      ></tulpar-number-input>
    </div>
  `,
};

// ─── 7. AdvancedFormatOptions ─────────────────────────────────────────────────
// .formatOptions is a JS-only property — cannot be set via attribute.
// We use document.createElement to assign it before returning the element.

export const AdvancedFormatOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: `
\`formatOptions\` accepts any \`Intl.NumberFormatOptions\` object and overrides all
shorthand format attributes. This example uses compact notation + accounting
currency sign (negative shown in parentheses rather than with a minus sign).

Because \`formatOptions\` is a JS property (not an HTML attribute), this story
uses \`document.createElement\` to set it before the element renders.
        `,
      },
    },
  },
  render: () => {
    const el = document.createElement("tulpar-number-input") as HTMLElement & {
      formatOptions?: Intl.NumberFormatOptions;
      value: number | null;
    };
    el.setAttribute("label", "Compact + Accounting");
    el.setAttribute("locale", "en-US");
    el.setAttribute("style", "max-width:280px; display:block;");
    el.formatOptions = {
      style: "currency",
      currency: "TRY",
      currencySign: "accounting",
      notation: "compact",
      compactDisplay: "short",
    };
    el.value = -1234567.89;
    return el;
  },
};

// ─── 8. HiddenSteppers ────────────────────────────────────────────────────────

export const HiddenSteppers: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:280px;">
      <tulpar-number-input
        label="With steppers (default)"
        min="0"
        max="100"
      ></tulpar-number-input>
      <tulpar-number-input
        label="Hidden steppers"
        hide-steppers
        min="0"
        max="100"
        placeholder="Keyboard/scroll only"
      ></tulpar-number-input>
    </div>
    <p style="font-size:12px; color:#74777a; margin-top:8px;">
      <code>hide-steppers</code> removes the ▲/▼ buttons — useful for compact
      layouts where arrow-key or direct typing is the primary input method.
    </p>
  `,
};

// ─── 9. LongPressAcceleration ─────────────────────────────────────────────────
// Hold the increment button to see rapid stepping once the delay elapses.

export const LongPressAcceleration: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Hold the up ▲ arrow** — after \`step-hold-delay=300 ms\` the stepper begins
repeating every \`step-hold-interval=30 ms\`, producing rapid acceleration.

Default values are \`step-hold-delay=500\` and \`step-hold-interval=50\`.
        `,
      },
    },
  },
  render: () => html`
    <tulpar-number-input
      label="Long-press acceleration"
      step-hold-delay="300"
      step-hold-interval="30"
      min="0"
      max="1000"
      step="1"
      style="max-width:280px; display:block;"
    ></tulpar-number-input>
    <p style="font-size:12px; color:#74777a; margin-top:8px;">
      Hold the ▲ button — value accelerates after 300 ms, repeating every 30 ms.
    </p>
  `,
};

// ─── 10. KeyboardModifiers ────────────────────────────────────────────────────

export const KeyboardModifiers: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Keyboard modifiers change the step multiplier when using arrow keys:

| Key combo | Multiplier | Example (step=1) |
|-----------|-----------|-----------------|
| ↑ / ↓ | ×1 (default) | +/- 1 |
| Shift + ↑ / ↓ | ×10 | +/- 10 |
| Ctrl/⌘ + ↑ / ↓ | ×100 | +/- 100 |
| Home | Jump to \`min\` | → 0 |
| End | Jump to \`max\` | → 1000 |

Focus the field and try these keyboard shortcuts.
        `,
      },
    },
  },
  render: () => html`
    <tulpar-number-input
      label="Keyboard modifier demo"
      min="0"
      max="1000"
      step="1"
      style="max-width:280px; display:block;"
    ></tulpar-number-input>
    <p style="font-size:12px; color:#74777a; margin-top:8px;">
      Focus then: ↑/↓ (+1), Shift+↑/↓ (+10), Ctrl+↑/↓ (+100), Home (→0), End (→1000).
    </p>
  `,
};
