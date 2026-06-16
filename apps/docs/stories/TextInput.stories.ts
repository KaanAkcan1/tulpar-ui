import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@tulpar-ui/core/text-input";

const meta: Meta = {
  title: "Components/TextInput",
  component: "tulpar-text-input",
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
    "label-position": {
      control: "select",
      options: ["top", "float", "float-in", "float-on", "none"],
    },
    type: {
      control: "select",
      options: ["text", "email", "url", "tel", "search", "password"],
    },
    "necessity-indicator": {
      control: "select",
      options: ["icon", "label", "none"],
    },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    warn: { control: "boolean" },
    validating: { control: "boolean" },
    clearable: { control: "boolean" },
    "show-count": { control: "boolean" },
    copyable: { control: "boolean" },
    pastable: { control: "boolean" },
    "no-message-space": { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

// ─── 1. Default ───────────────────────────────────────────────────────────────

/**
 * **Playground** — every declared control is wired, so size, variant,
 * label-position, type, necessity-indicator and every boolean affordance
 * (clearable, show-count, copyable, pastable, no-message-space, validation
 * states) visibly affect the field from the controls panel.
 */
export const Default: Story = {
  args: {
    label: "Full name",
    placeholder: "Enter your name",
    size: "md",
    variant: "outlined",
    "label-position": "top",
    type: "text",
  },
  render: (args) => html`
    <tulpar-text-input
      style="max-width:360px; display:block;"
      label=${args["label"] ?? nothing}
      placeholder=${args["placeholder"] ?? ""}
      size=${args["size"] ?? nothing}
      variant=${args["variant"] ?? nothing}
      label-position=${args["label-position"] ?? nothing}
      type=${args["type"] ?? nothing}
      necessity-indicator=${args["necessity-indicator"] ?? nothing}
      ?disabled=${args["disabled"]}
      ?readonly=${args["readonly"]}
      ?required=${args["required"]}
      ?invalid=${args["invalid"]}
      ?warn=${args["warn"]}
      ?validating=${args["validating"]}
      ?clearable=${args["clearable"]}
      ?show-count=${args["show-count"]}
      ?copyable=${args["copyable"]}
      ?pastable=${args["pastable"]}
      ?no-message-space=${args["no-message-space"]}
    ></tulpar-text-input>
  `,
};

/**
 * **SignInForm** — a realistic composition: a sign-in card combining an email
 * field, a password field with reveal toggle, and validation messaging. Shows
 * the inputs working together inside a real product surface.
 */
export const SignInForm: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <form
      @submit=${(e: Event) => e.preventDefault()}
      style="max-width:360px; padding:24px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:12px; background:var(--tulpar-color-bg-raised,#fff); display:flex; flex-direction:column; gap:16px;"
    >
      <div>
        <h2 style="margin:0 0 4px; font-size:1.25rem;">Sign in</h2>
        <p style="margin:0; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#74777a);">
          Welcome back. Enter your credentials to continue.
        </p>
      </div>
      <tulpar-text-input
        type="email"
        label="Email"
        required
        necessity-indicator="icon"
        placeholder="you@example.com"
        autocomplete="email"
        clearable
      ></tulpar-text-input>
      <tulpar-text-input
        type="password"
        label="Password"
        required
        necessity-indicator="icon"
        placeholder="Enter your password"
        autocomplete="current-password"
        helper-text="At least 8 characters."
      ></tulpar-text-input>
      <button
        type="submit"
        style="margin-top:4px; padding:0.6rem; border:none; border-radius:8px; background:var(--tulpar-color-brand-default,#00c57a); color:#fff; font-weight:600; cursor:pointer;"
      >
        Continue
      </button>
    </form>
  `,
};

// ─── 2. Sizes ─────────────────────────────────────────────────────────────────
// xs auto-hides action buttons (reveal, clear, copy, paste) — too small to meet
// the 44 pt touch target requirement.

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-text-input size="xs" label="xs" placeholder="Extra small — action buttons hidden"></tulpar-text-input>
      <tulpar-text-input size="sm" label="sm" placeholder="Small"></tulpar-text-input>
      <tulpar-text-input size="md" label="md" placeholder="Medium (default)"></tulpar-text-input>
      <tulpar-text-input size="lg" label="lg" placeholder="Large"></tulpar-text-input>
      <tulpar-text-input size="xl" label="xl" placeholder="Extra large"></tulpar-text-input>
    </div>
  `,
};

// ─── 3. Variants ──────────────────────────────────────────────────────────────
// Side-by-side comparison of all four variants. Underlined and ghost sit adjacent
// here as the primary visual disambiguator between those two styles.

export const Variants: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-text-input variant="outlined" label="Outlined" placeholder="Default border ring"></tulpar-text-input>
      <tulpar-text-input variant="filled" label="Filled" placeholder="Filled background"></tulpar-text-input>
      <tulpar-text-input variant="underlined" label="Underlined" placeholder="Bottom border only"></tulpar-text-input>
      <tulpar-text-input variant="ghost" label="Ghost" placeholder="No visible border (panel/toolbar use)"></tulpar-text-input>
    </div>
  `,
};

// ─── 4. LabelPositions ────────────────────────────────────────────────────────
// All five label-position values side-by-side. The last example shows the
// graceful degradation fallback: ghost variant forces label-position="top" even
// when "float" is requested, and logs a dev-mode warning.

export const LabelPositions: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width:360px;">
      <tulpar-text-input label-position="top" label="top (default)" placeholder="Label sits above"></tulpar-text-input>
      <tulpar-text-input label-position="float" label="float" placeholder="Floats on focus / value"></tulpar-text-input>
      <tulpar-text-input label-position="float-in" label="float-in" placeholder="Floats inside the control"></tulpar-text-input>
      <tulpar-text-input label-position="float-on" label="float-on" placeholder="Floats on top of the border"></tulpar-text-input>
      <tulpar-text-input label-position="none" label="none (aria-label only)" placeholder="No visible label"></tulpar-text-input>
      <div>
        <p style="margin:0 0 6px; font-size:12px; color:#74777a; font-family:monospace;">
          Fallback: label-position="float" + variant="ghost" → renders as top + dev warning
        </p>
        <tulpar-text-input
          label-position="float"
          variant="ghost"
          label="Ghost + float (fallback)"
          placeholder="Check DevTools console"
        ></tulpar-text-input>
      </div>
    </div>
  `,
};

// ─── 5. Statuses ──────────────────────────────────────────────────────────────

export const Statuses: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-text-input
        label="Invalid"
        invalid
        error-text="This field is required"
        placeholder="Error state"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Warning"
        warn
        warn-text="Password is weak"
        placeholder="Warn state"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Validating"
        validating
        helper-text="Checking availability…"
        placeholder="Async check in progress"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Invalid + Validating (combo)"
        invalid
        validating
        error-text="Previous check failed"
        placeholder="Stale error while re-checking"
      ></tulpar-text-input>
    </div>
  `,
};

// ─── 6. Necessity ─────────────────────────────────────────────────────────────

export const Necessity: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-text-input
        label="Required (icon)"
        required
        necessity-indicator="icon"
        placeholder="Asterisk marker"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Required (label)"
        required
        necessity-indicator="label"
        placeholder="(required) text suffix"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Optional (label)"
        necessity-indicator="label"
        placeholder="(optional) text suffix"
      ></tulpar-text-input>
      <tulpar-text-input
        label="No indicator"
        required
        necessity-indicator="none"
        placeholder="necessity-indicator=none"
      ></tulpar-text-input>
    </div>
  `,
};

// ─── 7. TypeVariants ──────────────────────────────────────────────────────────
// email/url/tel/search/password. Search auto-injects a search icon and enables
// clearable. Password shows the reveal toggle.

export const TypeVariants: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-text-input type="email" label="Email" placeholder="you@example.com" autocomplete="email"></tulpar-text-input>
      <tulpar-text-input type="url" label="URL" placeholder="https://example.com"></tulpar-text-input>
      <tulpar-text-input type="tel" label="Phone" placeholder="+1 (555) 000-0000" autocomplete="tel"></tulpar-text-input>
      <tulpar-text-input type="search" label="Search" placeholder="Auto icon + clearable"></tulpar-text-input>
      <tulpar-text-input type="password" label="Password" placeholder="Reveal toggle →" autocomplete="current-password"></tulpar-text-input>
    </div>
  `,
};

// ─── 8. Mask_TR_Phone ─────────────────────────────────────────────────────────
// In Tulpar mask syntax, `9` is a digit slot token. The "+90" country code
// contains a literal `9` which must be escaped as `\9` in the mask string.
// In a JS string literal, backslash must itself be escaped: `"\\9"`.
// Final JS string: "+\\90 (999) 999 99 99"
// Rendered mask pattern: +\90 (999) 999 99 99 → shows as +90 (___) ___ __ __

export const Mask_TR_Phone: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Mask syntax note:** In Tulpar's mask engine, \`9\` is always a digit placeholder token.
The Turkish country code \`+90\` contains a literal \`9\`, so it must be **escaped** with a
backslash: \`\\\\9\`. In a JavaScript string literal this becomes \`"+\\\\90 (999) 999 99 99"\`.

Unescaped \`+90 (999) 999 99 99\` would treat the \`9\` in the country code as a digit slot,
producing \`+_0 (___) ___ __ __\` — wrong. Always escape literal mask characters.
        `,
      },
    },
  },
  render: () => html`
    <tulpar-text-input
      label="TR Phone"
      mask="+\\90 (999) 999 99 99"
      placeholder="+90 (___) ___ __ __"
      type="tel"
      autocomplete="tel"
    ></tulpar-text-input>
  `,
};

// ─── 9. Mask_LicensePlate ─────────────────────────────────────────────────────
// 99 AAA 999 — uppercase letter slots (A) auto-uppercase input characters.

export const Mask_LicensePlate: Story = {
  render: () => html`
    <tulpar-text-input
      label="License Plate"
      mask="99 AAA 999"
      placeholder="34 ABC 123"
    ></tulpar-text-input>
    <p style="font-size:12px; color:#74777a; margin-top:8px;">
      <code>A</code> slots auto-uppercase — try typing lowercase letters.
    </p>
  `,
};

// ─── 10. Mask_CreditCard ──────────────────────────────────────────────────────

export const Mask_CreditCard: Story = {
  render: () => html`
    <tulpar-text-input
      label="Credit Card Number"
      mask="9999 9999 9999 9999"
      placeholder="1234 5678 9012 3456"
      autocomplete="cc-number"
    ></tulpar-text-input>
  `,
};

// ─── 11. Mask_EmitRaw ─────────────────────────────────────────────────────────
// Side-by-side: left emits masked value (default), right emits raw (digits only).
// A live <output> shows el.value on the `input` event.

export const Mask_EmitRaw: Story = {
  render: () => {
    const onInput = (label: string) => (e: Event) => {
      const el = e.currentTarget as HTMLElement & { value: string };
      const out = el.parentElement?.querySelector("output");
      if (out) out.textContent = `${label}: "${el.value}"`;
    };
    return html`
      <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;">
        <div>
          <tulpar-text-input
            label="Masked emit (default)"
            mask="9999 9999 9999 9999"
            mask-emit="masked"
            placeholder="1234 5678 9012 3456"
            @input=${onInput("masked")}
          ></tulpar-text-input>
          <output style="display:block; margin-top:4px; font-family:monospace; font-size:12px; color:#57534e;">
            masked: ""
          </output>
        </div>
        <div>
          <tulpar-text-input
            label="Raw emit"
            mask="9999 9999 9999 9999"
            mask-emit="raw"
            placeholder="1234 5678 9012 3456"
            @input=${onInput("raw")}
          ></tulpar-text-input>
          <output style="display:block; margin-top:4px; font-family:monospace; font-size:12px; color:#57534e;">
            raw: ""
          </output>
        </div>
      </div>
      <p style="font-size:12px; color:#74777a; margin-top:8px;">
        Both fields share the same visual mask. The right field's <code>el.value</code>
        returns digits only — handy for form submission without stripping separators manually.
      </p>
    `;
  },
};

// ─── 12. Mask_LazyDisplay ─────────────────────────────────────────────────────
// eager (default): slot characters shown immediately on focus.
// lazy: slot characters only appear as you type into each position.

export const Mask_LazyDisplay: Story = {
  render: () => html`
    <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;">
      <tulpar-text-input
        label="Eager (default)"
        mask="99/99/9999"
        mask-display="eager"
        placeholder="Focus to see mask"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Lazy"
        mask="99/99/9999"
        mask-display="lazy"
        placeholder="Mask appears as you type"
      ></tulpar-text-input>
    </div>
    <p style="font-size:12px; color:#74777a; margin-top:8px;">
      Focus each field and start typing to see the difference.
      <em>Eager</em> shows all slot characters upfront; <em>lazy</em> reveals them as each position is filled.
    </p>
  `,
};

// ─── 13. Affordances ──────────────────────────────────────────────────────────
// clearable, show-count, copyable, pastable in one combined story.

export const Affordances: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:360px;">
      <tulpar-text-input
        label="Clearable"
        clearable
        value="Clear me with the ✕ button"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Show count (no maxlength)"
        show-count
        placeholder="Character counter (right of message row)"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Show count + maxlength"
        show-count
        maxlength="40"
        placeholder="Counter shows n / 40"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Copyable"
        copyable
        value="This value is copyable"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Pastable"
        pastable
        placeholder="Click the paste button"
      ></tulpar-text-input>
      <tulpar-text-input
        label="Copyable + Pastable"
        copyable
        pastable
        value="Both affordances active"
      ></tulpar-text-input>
    </div>
  `,
};

// ─── 14. NoMessageSpace ───────────────────────────────────────────────────────
// Removes the reserved message-row space — ideal for compact inline use cases
// such as toolbar search fields.

export const NoMessageSpace: Story = {
  render: () => html`
    <div style="display:flex; align-items:center; gap:8px; padding:8px; background:var(--tulpar-color-bg-surface, #e9f1ef); border-radius:6px;">
      <tulpar-text-input
        type="search"
        label-position="none"
        label="Search"
        no-message-space
        placeholder="Toolbar search…"
        style="flex:1;"
      ></tulpar-text-input>
    </div>
    <p style="font-size:12px; color:#74777a; margin-top:8px;">
      <code>no-message-space</code> removes the reserved row below the control —
      useful when the field lives inside a toolbar or data-table header with no room for helper text.
    </p>
  `,
};
