import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/tooltip";

/** Imperative handle for the overlay element (Storybook has no typed element ref). */
type OverlayEl = HTMLElement & { show(): void; hide(): void; toggle(): void; reposition(): void };

/**
 * `<tulpar-tooltip>` — an accessible, collision-aware tooltip chip.
 *
 * **Composition is by id, never by wrapping.** The tooltip is a sibling of its
 * trigger and references it with `for="triggerId"` (the `<label for>` model). It
 * self-wires hover/focus listeners + `aria-describedby` onto the resolved
 * element. Apps use the framework directive (`tulparTooltip="…"` /
 * `v-tulpar-tooltip="…"`); Storybook is framework-agnostic so these stories use
 * the core `for`-id form directly.
 *
 * Tooltip has **no `tone`** — the inverted neutral chip is its identity and its
 * strongest contrast guarantee. It is non-interactive, shows on hover **and**
 * keyboard focus, satisfies WCAG 1.4.13 (dismissible / hoverable / persistent),
 * and degrades to a toggletip on touch.
 */
const meta: Meta = {
  title: "Overlay/Tooltip",
  component: "tulpar-tooltip",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    placement: {
      control: "select",
      options: [
        "auto",
        "top", "top-start", "top-end",
        "bottom", "bottom-start", "bottom-end",
        "left", "left-start", "left-end",
        "right", "right-start", "right-end",
      ],
    },
    text: { control: "text" },
    offset: { control: "number" },
    crossOffset: { control: "number" },
    containerPadding: { control: "number" },
    flip: { control: "boolean" },
    arrow: { control: "boolean" },
    open: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

const sectionLabel = (t: string) => html`
  <p
    style="margin:0 0 8px; font-size:12px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:var(--tulpar-color-text-secondary,#74777a); font-family:monospace;"
  >
    ${t}
  </p>
`;

const triggerBtn = (id: string, label: string) => html`
  <button
    id=${id}
    style="font:inherit; padding:8px 14px; border-radius:8px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-raised,#fff); cursor:pointer;"
  >
    ${label}
  </button>
`;

/**
 * **Playground** — every declared control maps to a real observed attribute on
 * `<tulpar-tooltip>`. Hover or keyboard-focus the trigger to show the chip;
 * toggle `open` to force it visible while you tweak `placement` / `offset`.
 */
export const Default: Story = {
  args: { text: "Saves the current draft", placement: "top", arrow: true, flip: true },
  render: (args) => html`
    <div style="padding:64px; display:flex; justify-content:center;">
      ${triggerBtn("pg-trigger", "Save")}
      <tulpar-tooltip
        for="pg-trigger"
        text=${args["text"]}
        placement=${args["placement"]}
        .offset=${args["offset"] ?? 8}
        .crossOffset=${args["crossOffset"] ?? 0}
        .containerPadding=${args["containerPadding"] ?? 12}
        ?flip=${args["flip"]}
        ?arrow=${args["arrow"]}
        ?open=${args["open"]}
      ></tulpar-tooltip>
    </div>
  `,
};

/**
 * **Placements** — the 12-position grid (`top/bottom/left/right` ×
 * `start/center/end`) plus `auto` (best-fit by available space). Each tooltip is
 * forced `open` so the whole matrix is visible at once; the resolved
 * `data-placement` is reflected on the surface after flip/shift.
 */
export const Placements: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const placements = [
      "top-start", "top-center", "top-end",
      "bottom-start", "bottom-center", "bottom-end",
      "left-start", "left-center", "left-end",
      "right-start", "right-center", "right-end",
      "auto",
    ];
    return html`
      <div
        style="display:grid; grid-template-columns:repeat(3,1fr); gap:64px 48px; padding:80px 64px;"
      >
        ${placements.map(
          (p) => html`
            <div style="display:flex; justify-content:center;">
              ${triggerBtn(`pl-${p}`, p)}
              <tulpar-tooltip for=${`pl-${p}`} placement=${p} text=${p} open></tulpar-tooltip>
            </div>
          `,
        )}
      </div>
    `;
  },
};

/**
 * **Flip at edge** — a trigger pinned to the top edge of the viewport asks for
 * `placement="top"`, but there is no room above, so the engine flips it to
 * `bottom`. The reflected `data-placement` and the arrow track the resolved side.
 */
export const FlipAtEdge: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="position:relative; height:240px;">
      <div style="position:absolute; top:0; left:50%; transform:translateX(-50%);">
        ${triggerBtn("flip-trigger", "Pinned to top edge")}
        <tulpar-tooltip
          for="flip-trigger"
          placement="top"
          text="Asked for top — flipped to bottom for fit"
          open
        ></tulpar-tooltip>
      </div>
    </div>
  `,
};

/**
 * **Arrow on / off** — `arrow` (default on) draws a chip pointer that tracks the
 * anchor through flip/shift and suppresses gracefully when shifted off-anchor.
 */
export const Arrow: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex; gap:96px; padding:64px;">
      <div style="display:flex; justify-content:center;">
        ${triggerBtn("arrow-on", "Arrow on")}
        <tulpar-tooltip for="arrow-on" placement="top" text="Default — with arrow" open></tulpar-tooltip>
      </div>
      <div style="display:flex; justify-content:center;">
        ${triggerBtn("arrow-off", "Arrow off")}
        <tulpar-tooltip
          for="arrow-off"
          placement="top"
          text="arrow=false"
          .arrow=${false}
          open
        ></tulpar-tooltip>
      </div>
    </div>
  `,
};

/**
 * **Triggers** — the directive (and the `for`-id core form) attaches to *any*
 * element, not just buttons. Icon-only buttons are the canonical use case: the
 * tooltip supplies the accessible name's supplement. Provide `aria-label` for
 * the control itself; the tooltip wires `aria-describedby` on top.
 */
export const Triggers: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex; gap:48px; align-items:center; padding:48px 64px;">
      <span style="display:inline-flex;">
        ${triggerBtn("tg-text", "Text button")}
        <tulpar-tooltip for="tg-text" text="A plain labelled button" open></tulpar-tooltip>
      </span>

      <span style="display:inline-flex;">
        <button
          id="tg-icon"
          aria-label="Settings"
          style="font:inherit; width:40px; height:40px; display:grid; place-items:center; border-radius:8px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-raised,#fff); cursor:pointer;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <tulpar-tooltip for="tg-icon" text="Settings" open></tulpar-tooltip>
      </span>

      <span style="display:inline-flex;">
        <span
          id="tg-span"
          tabindex="0"
          role="button"
          style="font:inherit; text-decoration:underline dotted; cursor:help;"
          >Non-button element</span
        >
        <tulpar-tooltip for="tg-span" text="The trigger can be any focusable element" open></tulpar-tooltip>
      </span>
    </div>
  `,
};

/**
 * **Delay group / skip-delay** — a faux formatting toolbar. The first tooltip
 * waits ~400ms to open; moving the pointer between siblings skips the delay
 * (shared timer controller, default on). Hover across the row to feel it.
 */
export const DelayGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const tools: Array<[string, string, string]> = [
      ["dg-b", "B", "Bold"],
      ["dg-i", "I", "Italic"],
      ["dg-u", "U", "Underline"],
      ["dg-l", "↗", "Insert link"],
    ];
    return html`
      <div style="padding:48px 64px;">
        ${sectionLabel("Hover across the toolbar — first open waits, siblings skip the delay")}
        <div
          style="display:inline-flex; gap:4px; padding:4px; border-radius:10px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-surface,#f6f8f8);"
        >
          ${tools.map(
            ([id, glyph, label]) => html`
              <button
                id=${id}
                aria-label=${label}
                style="font:inherit; font-weight:600; width:36px; height:36px; border-radius:7px; border:none; background:transparent; cursor:pointer;"
              >
                ${glyph}
              </button>
              <tulpar-tooltip for=${id} text=${label}></tulpar-tooltip>
            `,
          )}
        </div>
      </div>
    `;
  },
};

/**
 * **Hoverable (WCAG 1.4.13)** — the tooltip stays open while the pointer travels
 * onto it across the `offset` gap (an invisible hover-bridge spans the gap). Esc
 * dismisses without moving focus; blur dismisses. Hover the trigger, then move
 * onto the chip — it does not close.
 */
export const Hoverable: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:80px 64px;">
      ${sectionLabel("Hover the trigger, then move the pointer onto the chip — it stays open")}
      <div style="display:flex; justify-content:center;">
        ${triggerBtn("hover-trigger", "Hover, then reach the chip")}
        <tulpar-tooltip
          for="hover-trigger"
          placement="bottom"
          text="Reachable across the gap · Esc to dismiss"
        ></tulpar-tooltip>
      </div>
    </div>
  `,
};

/**
 * **Disabled-trigger trap** — a real `disabled` button fires no pointer/focus
 * events, so a tooltip on it is invisible to everyone — yet "why is this
 * disabled?" is the top tooltip use case. Prefer `aria-disabled="true"`
 * (focusable, activation suppressed). A `[disabled]` trigger emits a dev-mode
 * warning.
 */
export const DisabledTrigger: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex; gap:48px; padding:48px 64px;">
      <div>
        ${sectionLabel("✓ aria-disabled — tooltip still reachable")}
        <span style="display:inline-flex;">
          <button
            id="dt-aria"
            aria-disabled="true"
            style="font:inherit; padding:8px 14px; border-radius:8px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-surface,#f6f8f8); color:var(--tulpar-color-text-disabled,#a8adb0); cursor:not-allowed;"
          >
            Delete
          </button>
          <tulpar-tooltip for="dt-aria" text="You don't have permission to delete" open></tulpar-tooltip>
        </span>
      </div>
      <div>
        ${sectionLabel("✗ [disabled] — dev-warns; tooltip unreachable")}
        <span style="display:inline-flex;">
          <button
            id="dt-real"
            disabled
            style="font:inherit; padding:8px 14px; border-radius:8px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-surface,#f6f8f8);"
          >
            Delete
          </button>
          <tulpar-tooltip for="dt-real" text="Never shows — the button eats no events"></tulpar-tooltip>
        </span>
      </div>
    </div>
  `,
};

/**
 * **Controlled open** — bind `open` to drive visibility from outside (Angular
 * signal + `openChange`, Vue `v-model:open`). The external buttons below call
 * the imperative `show()` / `hide()` / `toggle()` API on the element.
 */
export const ControlledOpen: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:64px;">
      ${sectionLabel("Drive the tooltip from external controls")}
      <div style="display:flex; gap:8px; align-items:center;">
        ${triggerBtn("ctl-anchor", "Anchored here")}
        <tulpar-tooltip id="ctl-tip" for="ctl-anchor" placement="right" text="Controlled tooltip"></tulpar-tooltip>
        <button
          @click=${() => document.getElementById("ctl-tip")?.dispatchEvent(new Event("noop")) ||
          (document.getElementById("ctl-tip") as OverlayEl | null)?.show()}
          style="font:inherit; padding:6px 12px; border-radius:7px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-raised,#fff); cursor:pointer;"
        >
          show()
        </button>
        <button
          @click=${() => (document.getElementById("ctl-tip") as OverlayEl | null)?.hide()}
          style="font:inherit; padding:6px 12px; border-radius:7px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-raised,#fff); cursor:pointer;"
        >
          hide()
        </button>
        <button
          @click=${() => (document.getElementById("ctl-tip") as OverlayEl | null)?.toggle()}
          style="font:inherit; padding:6px 12px; border-radius:7px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-raised,#fff); cursor:pointer;"
        >
          toggle()
        </button>
      </div>
    </div>
  `,
};

/**
 * **Reuse** — one declared `<tulpar-tooltip>` referenced from several triggers
 * via the framework `…Ref` input. In plain HTML each trigger gets its own
 * `for`-bound instance; the directive `…Ref` form is what de-dupes in apps.
 */
export const Reuse: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:48px 64px;">
      ${sectionLabel("tulparTooltipRef=\"id\" — one overlay, many triggers (shown here as per-trigger for)")}
      <div style="display:flex; gap:16px;">
        ${["r1", "r2", "r3"].map(
          (id) => html`
            <span style="display:inline-flex;">
              ${triggerBtn(id, `Row ${id.slice(1)}`)}
              <tulpar-tooltip for=${id} text="Shared copy across rows"></tulpar-tooltip>
            </span>
          `,
        )}
      </div>
    </div>
  `,
};

/**
 * **Dark mode** — the inverted chip flips: a light chip on dark theme. Toggle the
 * Storybook theme switcher; this story forces `.dark` locally so it reads in
 * either global mode.
 */
export const DarkMode: Story = {
  parameters: { controls: { disable: true }, backgrounds: { default: "dark" } },
  render: () => html`
    <div class="dark" style="background:var(--tulpar-color-bg-canvas,#13171a); padding:80px 64px; border-radius:12px;">
      ${triggerBtn("dk-trigger", "Dark trigger")}
      <tulpar-tooltip for="dk-trigger" placement="top" text="Inverted chip flips for dark" open></tulpar-tooltip>
    </div>
  `,
};

/**
 * **Forced colors / HCM** — under Windows High Contrast Mode the chip must not
 * vanish: a real `border` (not shadow alone) defines the surface and the arrow
 * stays visible. Enable an HCM emulation in DevTools (Rendering →
 * `forced-colors: active`) to verify — author colors are overridden by the OS.
 */
export const ForcedColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:80px 64px;">
      ${sectionLabel("Emulate forced-colors: active — the bordered chip + arrow survive")}
      ${triggerBtn("fc-trigger", "High-contrast trigger")}
      <tulpar-tooltip for="fc-trigger" placement="top" text="Bordered surface — survives HCM" open></tulpar-tooltip>
    </div>
  `,
};

/**
 * **Reduced motion** — under `prefers-reduced-motion: reduce` the scale/transform
 * enter is replaced by an instant/crossfade reveal (not merely shortened). Toggle
 * the OS / DevTools emulation to verify.
 */
export const ReducedMotion: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:80px 64px;">
      ${sectionLabel("Emulate prefers-reduced-motion: reduce — no transform, crossfade only")}
      ${triggerBtn("rm-trigger", "Hover me")}
      <tulpar-tooltip for="rm-trigger" placement="top" text="Crossfade under reduced-motion"></tulpar-tooltip>
    </div>
  `,
};
