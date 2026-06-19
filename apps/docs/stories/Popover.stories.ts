import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/popover";
import "@tulpar-ui/core/tooltip";

/** Imperative handle for the overlay element (Storybook has no typed element ref). */
type OverlayEl = HTMLElement & { show(): void; hide(): void; toggle(): void; reposition(): void };

/**
 * `<tulpar-popover>` — a **non-modal** dialog-pattern overlay for rich /
 * interactive content. Click-triggered; content lives as the overlay's default
 * children (a `<form>`, a list, a menu of links). On open, focus moves to the
 * popover (first focusable or the container); Tab flows naturally (**no trap**);
 * light-dismiss on outside click; Esc closes and **returns focus to the
 * trigger**. There is no scroll-lock and no inert background — those belong to a
 * future `<tulpar-dialog>`, not this component.
 *
 * Labelled via a child heading (`aria-labelledby`) or the `label` prop; the
 * trigger gets `aria-haspopup="dialog"`. Carries a `tone`. Composition is by
 * `for`-id (apps use the reference form `tulparPopoverRef="id"` since rich markup
 * can't live in a directive string).
 */
const meta: Meta = {
  title: "Overlay/Popover",
  component: "tulpar-popover",
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
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger"],
    },
    label: { control: "text" },
    offset: { control: "number" },
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

const field = (label: string, type = "text") => html`
  <label style="display:block; font-size:0.85rem;">
    <span style="display:block; margin-bottom:4px; color:var(--tulpar-color-text-secondary,#74777a);">${label}</span>
    <input
      type=${type}
      style="font:inherit; width:100%; box-sizing:border-box; padding:7px 10px; border-radius:7px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-canvas,#fff);"
    />
  </label>
`;

const toneIconPaths: Record<string, string> = {
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  warning: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  danger: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  neutral: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
};
const toneIcon = (tone: string) => html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  style="flex:none;"
  .innerHTML=${toneIconPaths[tone]}
></svg>`;

/**
 * **Playground** — controls map to real attributes. Click the trigger to open;
 * Esc / outside-click dismisses and returns focus. Toggle `open` to pin while
 * tweaking `placement` / `tone`.
 */
export const Default: Story = {
  args: { placement: "bottom-start", tone: "neutral", arrow: false, flip: true, label: "Account" },
  render: (args) => html`
    <div style="padding:48px;">
      ${triggerBtn("pg-pop", "Account")}
      <tulpar-popover
        for="pg-pop"
        placement=${args["placement"]}
        tone=${args["tone"]}
        label=${args["label"]}
        .offset=${args["offset"] ?? 8}
        ?flip=${args["flip"]}
        ?arrow=${args["arrow"]}
        ?open=${args["open"]}
      >
        <div style="min-width:240px; display:flex; flex-direction:column; gap:12px;">
          <h3 style="margin:0; font-size:0.95rem;">Account</h3>
          ${field("Display name")}
          ${field("Email", "email")}
        </div>
      </tulpar-popover>
    </div>
  `,
};

/**
 * **Form in popover** — focus moves to the first input on open, Tab flows
 * through the form (no trap), Save/Cancel close it, and Esc / outside-click
 * dismiss while returning focus to the trigger. The canonical popover use case.
 */
export const FormInPopover: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:48px;">
      ${triggerBtn("form-pop", "Edit profile")}
      <tulpar-popover for="form-pop" placement="bottom-start" label="Edit profile">
        <form
          style="min-width:280px; display:flex; flex-direction:column; gap:12px;"
          @submit=${(e: Event) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).closest("tulpar-popover") &&
              (document.getElementById("form-pop")?.dispatchEvent(new Event("noop")),
              (document.querySelector("tulpar-popover[for='form-pop']") as OverlayEl | null)?.hide());
          }}
        >
          <h3 style="margin:0; font-size:0.95rem;">Edit profile</h3>
          ${field("Full name")}
          ${field("Email", "email")}
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:4px;">
            <button
              type="button"
              @click=${() => (document.querySelector("tulpar-popover[for='form-pop']") as OverlayEl | null)?.hide()}
              style="font:inherit; padding:7px 12px; border-radius:7px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:transparent; cursor:pointer;"
            >
              Cancel
            </button>
            <button
              type="submit"
              style="font:inherit; padding:7px 12px; border-radius:7px; border:none; background:var(--tulpar-color-brand-default,#2563eb); color:#fff; cursor:pointer;"
            >
              Save
            </button>
          </div>
        </form>
      </tulpar-popover>
    </div>
  `,
};

/**
 * **Tones + status icon** — the five intents as info/confirmation surfaces, each
 * with its matching status icon (color is never the sole carrier). Conventional
 * hues: info=blue, success=green, warning=amber, danger=red.
 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const tones: Array<[string, string, string]> = [
      ["info", "Heads up", "We refreshed your dashboard layout."],
      ["success", "All set", "Your subscription is now active."],
      ["warning", "Check this", "Your trial ends in 3 days."],
      ["danger", "Careful", "This will remove 12 members from the team."],
    ];
    return html`
      <div style="display:flex; gap:32px; flex-wrap:wrap; padding:48px;">
        ${tones.map(
          ([tone, title, copy]) => html`
            <div>
              ${sectionLabel(tone)}
              ${triggerBtn(`tone-${tone}`, title)}
              <tulpar-popover for=${`tone-${tone}`} tone=${tone} placement="bottom-start" label=${title} open>
                <div style="min-width:220px; display:flex; gap:10px; align-items:flex-start;">
                  ${toneIcon(tone)}
                  <div>
                    <strong style="display:block; margin-bottom:2px;">${title}</strong>
                    <span style="font-size:0.85rem;">${copy}</span>
                  </div>
                </div>
              </tulpar-popover>
            </div>
          `,
        )}
      </div>
    `;
  },
};

/**
 * **Placements** — `placement` × `auto`. Each popover is pinned open so the
 * resolved `data-placement` is visible.
 */
export const Placements: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const placements = ["bottom-start", "bottom-end", "top-start", "right-start", "left-start", "auto"];
    return html`
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:120px 64px; padding:120px 64px;">
        ${placements.map(
          (p) => html`
            <div style="display:flex; justify-content:center;">
              ${triggerBtn(`pl-${p}`, p)}
              <tulpar-popover for=${`pl-${p}`} placement=${p} label=${p} open>
                <div style="min-width:160px; font-size:0.85rem;">Resolved: <code>${p}</code></div>
              </tulpar-popover>
            </div>
          `,
        )}
      </div>
    `;
  },
};

/**
 * **Flip at edge** — a trigger pinned to the bottom edge requests
 * `placement="bottom"`; with no room below, the engine flips it above. The
 * popover repositions on scroll/resize.
 */
export const FlipAtEdge: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="position:relative; height:280px;">
      <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%);">
        ${triggerBtn("flip-pop", "Pinned to bottom edge")}
        <tulpar-popover for="flip-pop" placement="bottom-start" label="Flipped" open>
          <div style="min-width:200px; font-size:0.85rem;">Asked for bottom — flipped above for fit.</div>
        </tulpar-popover>
      </div>
    </div>
  `,
};

/**
 * **Long / scrolling content** — a long internal list shows `max-height` +
 * internal scroll while the popover stays anchored to the trigger. Content that
 * resizes (async load) re-measures via `reposition()` so it never overflows the
 * viewport.
 */
export const LongContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:48px;">
      ${triggerBtn("long-pop", "Assign reviewer")}
      <tulpar-popover for="long-pop" placement="bottom-start" label="Assign reviewer" open>
        <div style="min-width:240px;">
          <h3 style="margin:0 0 8px; font-size:0.9rem;">Assign reviewer</h3>
          <div style="max-height:200px; overflow:auto; display:flex; flex-direction:column;">
            ${Array.from({ length: 24 }).map(
              (_, i) => html`
                <button
                  style="font:inherit; text-align:left; padding:7px 8px; border:none; background:transparent; border-radius:6px; cursor:pointer;"
                >
                  Teammate ${i + 1}
                </button>
              `,
            )}
          </div>
        </div>
      </tulpar-popover>
    </div>
  `,
};

/**
 * **Controlled open** — open from a separate toolbar button. The popover is
 * referenced by id (`tulparPopoverRef="…"` / core `for="…"`); `open` binds via
 * Angular signal `openChange` / Vue `v-model:open`. The buttons call the
 * imperative `show()` / `hide()` / `toggle()` API.
 */
export const ControlledOpen: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:48px;">
      ${sectionLabel("Open from an external control")}
      <div style="display:flex; gap:8px; align-items:center;">
        ${triggerBtn("ctl-pop-anchor", "Anchored here")}
        <tulpar-popover id="ctl-pop" for="ctl-pop-anchor" placement="bottom-start" label="Notifications">
          <div style="min-width:200px; font-size:0.85rem;">3 new notifications.</div>
        </tulpar-popover>
        <button
          @click=${() => (document.getElementById("ctl-pop") as OverlayEl | null)?.show()}
          style="font:inherit; padding:6px 12px; border-radius:7px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-raised,#fff); cursor:pointer;"
        >
          show()
        </button>
        <button
          @click=${() => (document.getElementById("ctl-pop") as OverlayEl | null)?.toggle()}
          style="font:inherit; padding:6px 12px; border-radius:7px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-raised,#fff); cursor:pointer;"
        >
          toggle()
        </button>
      </div>
    </div>
  `,
};

/**
 * **Nested overlay** — a tooltip on a control **inside** an open popover is
 * allowed (tooltip-inside-popover). The reverse (a popover inside a tooltip) is
 * **not** — tooltips hold no interactive content. Esc closes the **top-most**
 * overlay only; outside-click does not collapse the whole stack.
 */
export const NestedOverlay: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:48px;">
      ${triggerBtn("nest-pop", "Filters")}
      <tulpar-popover for="nest-pop" placement="bottom-start" label="Filters" open>
        <div style="min-width:220px; display:flex; flex-direction:column; gap:10px;">
          <h3 style="margin:0; font-size:0.9rem;">Filters</h3>
          ${field("Search")}
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.85rem;">Match mode</span>
            <button
              id="nest-info"
              aria-label="About match mode"
              style="font:inherit; width:22px; height:22px; display:inline-grid; place-items:center; border-radius:50%; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:transparent; cursor:pointer;"
            >
              ?
            </button>
            <tulpar-tooltip for="nest-info" placement="right" text="Tooltip inside a popover is allowed"></tulpar-tooltip>
          </div>
        </div>
      </tulpar-popover>
    </div>
  `,
};

/**
 * **Disabled trigger** — like the tooltip, prefer `aria-disabled="true"`
 * (focusable, activation suppressed) over a real `disabled` button so the
 * popover stays reachable; a `[disabled]` trigger emits a dev-mode warning.
 */
export const DisabledTrigger: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex; gap:48px; padding:48px;">
      <div>
        ${sectionLabel("✓ aria-disabled")}
        <button
          id="dis-aria"
          aria-disabled="true"
          style="font:inherit; padding:8px 14px; border-radius:8px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-surface,#f6f8f8); color:var(--tulpar-color-text-disabled,#a8adb0); cursor:not-allowed;"
        >
          Share
        </button>
        <tulpar-popover for="dis-aria" placement="bottom-start" label="Share">
          <div style="min-width:180px; font-size:0.85rem;">Still reachable via aria-disabled.</div>
        </tulpar-popover>
      </div>
      <div>
        ${sectionLabel("✗ [disabled] — dev-warns")}
        <button
          id="dis-real"
          disabled
          style="font:inherit; padding:8px 14px; border-radius:8px; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-surface,#f6f8f8);"
        >
          Share
        </button>
        <tulpar-popover for="dis-real" placement="bottom-start" label="Share">
          <div style="min-width:180px;">Never opens.</div>
        </tulpar-popover>
      </div>
    </div>
  `,
};

/**
 * **Dark mode** — neutral and toned surfaces auto-flip light↔dark; the overlay
 * inherits `.dark` / `data-brand` context even when promoted to the top layer.
 */
export const DarkMode: Story = {
  parameters: { controls: { disable: true }, backgrounds: { default: "dark" } },
  render: () => html`
    <div class="dark" style="background:var(--tulpar-color-bg-canvas,#13171a); padding:48px; border-radius:12px; display:flex; gap:24px;">
      ${triggerBtn("dk-pop", "Account")}
      <tulpar-popover for="dk-pop" placement="bottom-start" label="Account" open>
        <div style="min-width:220px; display:flex; flex-direction:column; gap:12px;">
          <h3 style="margin:0; font-size:0.9rem;">Account</h3>
          ${field("Display name")}
        </div>
      </tulpar-popover>
      <div style="margin-left:200px;">
        ${triggerBtn("dk-pop-danger", "Delete")}
        <tulpar-popover for="dk-pop-danger" tone="danger" placement="bottom-start" label="Delete" open>
          <div style="min-width:200px; display:flex; gap:10px;">
            ${toneIcon("danger")}<span style="font-size:0.85rem;">This cannot be undone.</span>
          </div>
        </tulpar-popover>
      </div>
    </div>
  `,
};

/**
 * **Forced colors / HCM** — the `tone` tint drops out under forced-colors; the
 * bordered surface and status icon keep the popover legible. Emulate
 * `forced-colors: active` to verify.
 */
export const ForcedColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:48px;">
      ${sectionLabel("Emulate forced-colors: active — bordered surface survives, tone drops")}
      ${triggerBtn("fc-pop", "Warning")}
      <tulpar-popover for="fc-pop" tone="warning" placement="bottom-start" label="Warning" open>
        <div style="min-width:220px; display:flex; gap:10px;">
          ${toneIcon("warning")}<span style="font-size:0.85rem;">Border + icon survive HCM.</span>
        </div>
      </tulpar-popover>
    </div>
  `,
};

/**
 * **Reduced motion** — under `prefers-reduced-motion: reduce` the popover
 * crossfades rather than scaling from the trigger origin. Emulate to verify.
 */
export const ReducedMotion: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:48px;">
      ${sectionLabel("Emulate prefers-reduced-motion: reduce — crossfade only")}
      ${triggerBtn("rm-pop", "Open")}
      <tulpar-popover for="rm-pop" placement="bottom-start" label="Reduced motion">
        <div style="min-width:200px; font-size:0.85rem;">Crossfade, no transform.</div>
      </tulpar-popover>
    </div>
  `,
};
