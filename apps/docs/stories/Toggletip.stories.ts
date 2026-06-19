import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/toggletip";

/**
 * `<tulpar-toggletip>` — the touch-safe, click-triggered counterpart to the
 * tooltip. A real focusable button opens a brief bubble; the content is
 * announced via an `aria-live="polite"` region (the region exists in the DOM
 * before text is injected so screen readers don't miss the first announcement).
 * Focus does **not** move into the bubble; Enter/Space toggles; Esc closes and
 * returns focus to the trigger.
 *
 * Use a toggletip (not a tooltip) when the content must survive touch, or when
 * the trigger is an info "ⓘ" affordance. It carries a `tone` — see the tone
 * showcase. Composition is by `for`-id (apps use `tulparToggletip="…"`).
 */
const meta: Meta = {
  title: "Overlay/Toggletip",
  component: "tulpar-toggletip",
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
    text: { control: "text" },
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

/** A round info "ⓘ" trigger button — the canonical toggletip affordance. */
const infoTrigger = (id: string, label = "More information") => html`
  <button
    id=${id}
    aria-label=${label}
    style="font:inherit; width:24px; height:24px; display:inline-grid; place-items:center; border-radius:50%; border:1px solid var(--tulpar-color-border-default,#d9e0df); background:var(--tulpar-color-bg-raised,#fff); cursor:pointer; color:var(--tulpar-color-text-secondary,#74777a);"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  </button>
`;

/** Status icons reinforce tone (WCAG 1.4.1 — color is never the sole carrier). */
const toneIcon = (tone: string) => {
  const paths: Record<string, string> = {
    neutral: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    warning: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    danger: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  };
  return html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="flex:none; margin-top:1px;"
    .innerHTML=${paths[tone]}
  ></svg>`;
};

/**
 * **Playground** — every control maps to a real attribute. Click the trigger to
 * toggle; toggle `open` to pin it. `tone` tints the bubble (see Tones).
 */
export const Default: Story = {
  args: { text: "Drafts auto-save every 30 seconds.", placement: "bottom", tone: "neutral", arrow: true },
  render: (args) => html`
    <div style="padding:64px; display:flex; align-items:center; gap:8px;">
      <span style="font:inherit;">Auto-save</span>
      ${infoTrigger("pg-tt")}
      <tulpar-toggletip
        for="pg-tt"
        text=${args["text"]}
        placement=${args["placement"]}
        tone=${args["tone"]}
        .offset=${args["offset"] ?? 8}
        ?flip=${args["flip"]}
        ?arrow=${args["arrow"]}
        ?open=${args["open"]}
      ></tulpar-toggletip>
    </div>
  `,
};

/**
 * **Tones + status icon** — `neutral | info | success | warning | danger`, each
 * paired with its conventional status hue (info=blue/`gok`, success=green/
 * `otuken`, warning=amber/`ulgen`, danger=red/`al`). Every toned bubble carries
 * its matching status **icon** — color is never the sole carrier (WCAG 1.4.1).
 * `tone` is visual-only: it never changes `role`, `aria-live`, or focus.
 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const tones: Array<[string, string]> = [
      ["neutral", "Drafts auto-save every 30 seconds."],
      ["info", "This field is optional and only used for billing."],
      ["success", "Your changes were saved successfully."],
      ["warning", "This action affects all members of the workspace."],
      ["danger", "Deleting is permanent and cannot be undone."],
    ];
    return html`
      <div style="display:flex; gap:48px 56px; flex-wrap:wrap; padding:48px 64px;">
        ${tones.map(
          ([tone, copy]) => html`
            <div>
              ${sectionLabel(tone)}
              <div style="display:inline-flex; align-items:center; gap:8px;">
                <span style="font:inherit;">Field label</span>
                ${infoTrigger(`tone-${tone}`, `About this field (${tone})`)}
                <tulpar-toggletip for=${`tone-${tone}`} tone=${tone} placement="bottom" open>
                  <span style="display:inline-flex; gap:8px; align-items:flex-start;">
                    ${toneIcon(tone)}
                    <span>${copy}</span>
                  </span>
                </tulpar-toggletip>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  },
};

/**
 * **Placements + arrow** — same 12-placement grid + `auto` as the tooltip. Arrow
 * is on by default and tracks the resolved side after flip/shift.
 */
export const Placements: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const placements = [
      "top-start", "top-center", "top-end",
      "bottom-start", "bottom-center", "bottom-end",
      "left-center", "right-center", "auto",
    ];
    return html`
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:72px 48px; padding:80px 64px;">
        ${placements.map(
          (p) => html`
            <div style="display:flex; align-items:center; gap:8px; justify-content:center;">
              ${infoTrigger(`pl-${p}`)}
              <tulpar-toggletip for=${`pl-${p}`} placement=${p} text=${p} open></tulpar-toggletip>
            </div>
          `,
        )}
      </div>
    `;
  },
};

/**
 * **Content** — brief text via the `text` convenience prop, or short markup as
 * default children (children win when both are present). Still non-form: a
 * toggletip holds disclosure content, not interactive controls — that's a
 * popover.
 */
export const Content: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex; gap:64px; padding:48px 64px;">
      <div>
        ${sectionLabel("text prop")}
        <div style="display:inline-flex; align-items:center; gap:8px;">
          <span>Plain</span>${infoTrigger("ct-text")}
          <tulpar-toggletip for="ct-text" text="A single brief sentence of help." placement="bottom" open></tulpar-toggletip>
        </div>
      </div>
      <div>
        ${sectionLabel("markup children")}
        <div style="display:inline-flex; align-items:center; gap:8px;">
          <span>Definition</span>${infoTrigger("ct-markup")}
          <tulpar-toggletip for="ct-markup" placement="bottom" open>
            <strong>SLA</strong> — the guaranteed uptime in your plan,
            measured monthly.
          </tulpar-toggletip>
        </div>
      </div>
    </div>
  `,
};

/**
 * **Keyboard** — Tab to the trigger (visible focus ring), Enter/Space toggles,
 * Esc closes and returns focus to the trigger. Focus never enters the bubble.
 */
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:64px;">
      ${sectionLabel("Tab → trigger · Enter/Space toggles · Esc closes + returns focus")}
      <div style="display:inline-flex; align-items:center; gap:8px;">
        <span>Keyboard model</span>
        ${infoTrigger("kb-tt")}
        <tulpar-toggletip for="kb-tt" placement="bottom" text="Closed with Esc returns focus to the ⓘ button."></tulpar-toggletip>
      </div>
    </div>
  `,
};

/**
 * **Dark mode** — toned surfaces auto-flip light↔dark (e.g. `50/100` fills
 * become `900/950`, text inverts) while preserving the same-family extreme-vs-
 * extreme contrast headroom.
 */
export const DarkMode: Story = {
  parameters: { controls: { disable: true }, backgrounds: { default: "dark" } },
  render: () => {
    const tones = ["info", "success", "warning", "danger"];
    return html`
      <div class="dark" style="background:var(--tulpar-color-bg-canvas,#13171a); padding:64px; border-radius:12px; display:flex; gap:40px; flex-wrap:wrap;">
        ${tones.map(
          (tone) => html`
            <div style="display:inline-flex; align-items:center; gap:8px;">
              ${infoTrigger(`dk-${tone}`)}
              <tulpar-toggletip for=${`dk-${tone}`} tone=${tone} placement="bottom" open>
                <span style="display:inline-flex; gap:8px; align-items:flex-start;">
                  ${toneIcon(tone)}<span>${tone} tone, dark</span>
                </span>
              </tulpar-toggletip>
            </div>
          `,
        )}
      </div>
    `;
  },
};

/**
 * **Forced colors / HCM** — under forced-colors the `tone` tint intentionally
 * drops out (author colors are overridden); the bordered surface, the arrow, and
 * the status icon keep the bubble legible. Emulate `forced-colors: active` to
 * verify.
 */
export const ForcedColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:64px;">
      ${sectionLabel("Emulate forced-colors: active — tone drops, border + icon survive")}
      <div style="display:inline-flex; align-items:center; gap:8px;">
        <span>HCM</span>
        ${infoTrigger("fc-tt")}
        <tulpar-toggletip for="fc-tt" tone="warning" placement="bottom" open>
          <span style="display:inline-flex; gap:8px; align-items:flex-start;">
            ${toneIcon("warning")}<span>Bordered + icon survive forced colors</span>
          </span>
        </tulpar-toggletip>
      </div>
    </div>
  `,
};

/**
 * **Reduced motion** — under `prefers-reduced-motion: reduce` the bubble
 * crossfades in instead of scaling from the trigger. Emulate to verify.
 */
export const ReducedMotion: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:64px;">
      ${sectionLabel("Emulate prefers-reduced-motion: reduce — crossfade, no transform")}
      <div style="display:inline-flex; align-items:center; gap:8px;">
        <span>Click me</span>
        ${infoTrigger("rm-tt")}
        <tulpar-toggletip for="rm-tt" placement="bottom" text="Crossfade under reduced-motion."></tulpar-toggletip>
      </div>
    </div>
  `,
};
