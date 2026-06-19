import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/toast";
import { message } from "@tulpar-ui/core/toast";

/**
 * `message.*()` — The lightweight ephemeral notification channel.
 *
 * ## Message vs Toast vs Dialog
 * | | Message | Toast | Dialog (future) |
 * |---|---|---|---|
 * | Weight | Lightest | Medium | Heavy / blocking |
 * | Placement | Top-center | Corner (configurable) | Centered, modal |
 * | Content | Single line | Title + description + actions | Arbitrary; focus-trapped |
 * | Actions | None | Optional | Required ("OK" / "Cancel") |
 * | Auto-dismiss | 3s (default) | 5s (default); configurable | Never — user must act |
 * | Stacking | Grouped (×N) | Sonner-style collapse | Single |
 * | ARIA | `role="status"` polite | status / alert by tone | alertdialog |
 *
 * **Rule of thumb:** If it needs an action, upgrade to Toast. If it needs a
 * guarantee of attention or is irreversible, upgrade to Dialog.
 *
 * ## API
 * ```ts
 * import { message } from "@tulpar-ui/core/toast";
 * message("Link copied");
 * message.success("Saved");
 * message.warning("Quota almost full");
 * message.danger("Connection lost");
 * message.info("Syncing…", { duration: 5000, group: false });
 * ```
 *
 * ## Grouping
 * Duplicate calls with the same tone + text are merged into a `×N` badge by
 * default (`group:true`). Set `group:false` to stack each call independently.
 *
 * ## ARIA
 * Message always uses `role="status"` (`aria-live="polite"`). It is never
 * focusable and never steals focus. No keyboard navigation is needed — a
 * Message with keyboard requirements should be a Toast.
 */
const meta: Meta = {
  title: "Feedback/Message",
  component: "tulpar-toast",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
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

const fireBtn = (label: string, handler: () => void) => html`
  <button
    @click=${handler}
    style="font:inherit; padding:8px 16px; border-radius:8px; cursor:pointer;
           border:1px solid var(--tulpar-color-border-default,#d9e0df);
           background:var(--tulpar-color-bg-raised,#fff);"
  >
    ${label}
  </button>
`;

// ─── 1. Tones ────────────────────────────────────────────────────────────────

/**
 * **Tones** — all four message tones. Each fires a top-center pill with the
 * tone's built-in icon. Messages are always `role="status"` regardless of tone
 * (no `assertive` — if a danger needs assertive announcement, use a Toast).
 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("Fire each tone — appears top-center")}
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${fireBtn("Info", () => message.info("Sync in progress…"))}
        ${fireBtn("Success", () => message.success("Link copied to clipboard"))}
        ${fireBtn("Warning", () => message.warning("Storage 95% full"))}
        ${fireBtn("Danger", () => message.danger("Connection lost"))}
        ${fireBtn("Dismiss all", () => message.dismiss())}
      </div>
      <p
        style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        All tones use <code>role="status"</code> (polite). Messages never
        steal focus and carry no close button or actions.
      </p>

      ${sectionLabel("Declarative reference — static tonal pills (a11y inspector)")}
      <div style="display:flex; flex-direction:column; gap:8px; max-width:400px;">
        <tulpar-toast
          tone="info"
          heading="Sync in progress…"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
        <tulpar-toast
          tone="success"
          heading="Link copied to clipboard"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
        <tulpar-toast
          tone="warning"
          heading="Storage 95% full"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
        <tulpar-toast
          tone="danger"
          heading="Connection lost"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
      </div>
    </div>
  `,
};

// ─── 2. Grouping ─────────────────────────────────────────────────────────────

/**
 * **Grouping** — duplicate calls with the same tone + text are merged into a
 * `×N` count badge (default: `group:true`). This prevents a flurry of
 * identical messages from flooding the notification area.
 *
 * Set `group:false` to stack each call independently — useful when each
 * message represents a distinct event even if the text is the same.
 */
export const Grouping: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px;">
      <div>
        ${sectionLabel("group:true (default) — rapid fire merges into ×N")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("Click 3× to group", () =>
            message.success("File exported", { group: true, duration: 8000 }),
          )}
          ${fireBtn("Dismiss", () => message.dismiss())}
        </div>
      </div>

      <div>
        ${sectionLabel("group:false — each call is a separate message")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("Click 3× — no grouping", () =>
            message.info("Notification received", { group: false, duration: 8000 }),
          )}
          ${fireBtn("Dismiss all", () => message.dismiss())}
        </div>
      </div>

      <p
        style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Grouping key is <code>tone + text</code>. Different tone or different
        text always creates a new message even when grouping is enabled.
      </p>
    </div>
  `,
};

// ─── 3. Duration ─────────────────────────────────────────────────────────────

/**
 * **Duration** — the default is 3000ms (shorter than Toast's 5000ms). Override
 * per call via `duration`. A Message cannot be made truly persistent
 * (`timer:false`) — if you need persistent feedback, use a Toast.
 */
export const Duration: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("Custom durations")}
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${fireBtn("1.5s (very short)", () =>
          message.info("Copied!", { duration: 1500 }),
        )}
        ${fireBtn("3s (default)", () =>
          message.success("File saved", { duration: 3000 }),
        )}
        ${fireBtn("8s (extended)", () =>
          message.warning("Large export in progress — may take a moment", {
            duration: 8000,
          }),
        )}
        ${fireBtn("Dismiss", () => message.dismiss())}
      </div>
    </div>
  `,
};

// ─── 4. Icons ────────────────────────────────────────────────────────────────

/**
 * **Icons** — same icon API as Toast: built-in default, name, raw SVG, emoji,
 * or `icon:false` for no icon. The `slot="icon"` form is only available on
 * the declarative `<tulpar-toast>` element (not the imperative service).
 */
export const Icons: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("Icon variants — top-center pill")}
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${fireBtn("Default icon", () =>
          message.success("Default built-in icon"),
        )}
        ${fireBtn("Emoji icon", () =>
          message.success("All systems go", { icon: "🚀", duration: 6000 }),
        )}
        ${fireBtn("No icon", () =>
          message.info("Text-only message", { icon: false, duration: 6000 }),
        )}
        ${fireBtn("Custom SVG", () =>
          message.info("Custom SVG icon", {
            icon: "<svg viewBox='0 0 24 24' fill='none' aria-hidden='true' focusable='false'><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2'/><path d='M12 8h.01M12 12v4' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>",
            duration: 6000,
          }),
        )}
        ${fireBtn("Dismiss", () => message.dismiss())}
      </div>
    </div>
  `,
};

// ─── 5. TopCenter (location) ─────────────────────────────────────────────────

/**
 * **Location** — Message defaults to `top-center`. It can be placed at any
 * of the six locations via the `location` option, but `top-center` is the
 * intended convention. Placing messages at a corner (the Toast convention)
 * reduces the visual distinction between the two channels.
 */
export const Location: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
      ${sectionLabel("Default: top-center")}
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${fireBtn("Top-center (default)", () =>
          message.success("Top-center — the conventional Message location"),
        )}
        ${fireBtn("Top-right (Toast territory)", () =>
          message.info("Top-right — use sparingly; this is Toast's corner", {
            location: "top-right",
          }),
        )}
        ${fireBtn("Bottom-center", () =>
          message.warning("Bottom-center — avoid; overlaps mobile chrome", {
            location: "bottom-center",
          }),
        )}
        ${fireBtn("Dismiss all", () => message.dismiss())}
      </div>
      <p
        style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Stick to <code>top-center</code> for the consistent Message convention.
        Corner placement blurs the Message vs Toast distinction in your product.
      </p>
    </div>
  `,
};

// ─── 6. DarkMode ─────────────────────────────────────────────────────────────

/**
 * **DarkMode** — Messages adapt to dark mode using the same feedback token
 * set as Toast (deep tinted surface, lightened on-surface text, 1px border).
 * Toggle the Storybook "Theme" selector in the toolbar; this story also
 * forces `.dark` locally for the static reference section.
 */
export const DarkMode: Story = {
  parameters: {
    controls: { disable: true },
    backgrounds: { default: "dark" },
  },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px;">
      <div>
        ${sectionLabel("Imperative — fire messages in current Storybook theme")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("Success", () => message.success("Dark mode — success"))}
          ${fireBtn("Danger", () => message.danger("Dark mode — danger"))}
          ${fireBtn("Dismiss", () => message.dismiss())}
        </div>
      </div>

      <div
        class="dark"
        style="background:var(--tulpar-color-bg-canvas,#13171a); padding:24px; border-radius:12px;
               display:flex; flex-direction:column; gap:8px; max-width:420px;"
      >
        ${sectionLabel("Static reference — dark surface")}
        <tulpar-toast
          tone="success"
          heading="Success — dark mode"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
        <tulpar-toast
          tone="warning"
          heading="Warning — dark mode"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
        <tulpar-toast
          tone="danger"
          heading="Danger — dark mode"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
      </div>
    </div>
  `,
};

// ─── 7. A11y ─────────────────────────────────────────────────────────────────

/**
 * **A11y** — Message always uses `role="status"` / `aria-live="polite"`.
 * It is never focusable; it carries no close button or action; it never
 * steals focus. The a11y addon inspects the static declarative elements below.
 *
 * If you find yourself wanting keyboard access to the content — it needs
 * an action — it is a Toast, not a Message.
 */
export const A11y: Story = {
  name: "A11y — role=status, no focus steal",
  parameters: { controls: { disable: true }, a11y: { test: "error" } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px; max-width:420px;">
      ${sectionLabel("All tones — a11y addon inspection")}
      <div style="display:flex; flex-direction:column; gap:8px;">
        <tulpar-toast
          tone="info"
          heading="Info message — role=status, polite"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
        <tulpar-toast
          tone="success"
          heading="Success message — role=status, polite"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
        <tulpar-toast
          tone="warning"
          heading="Warning message — role=status, polite"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
        <tulpar-toast
          tone="danger"
          heading="Danger message — still role=status (use Toast for role=alert)"
          ?closable=${false}
          ?timer=${false}
        ></tulpar-toast>
      </div>
      <p
        style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Messages are always polite. They are not focusable by the user and
        carry no interactive children. Screen readers announce them when idle.
      </p>
    </div>
  `,
};

// ─── 8. RealWorldComposition ─────────────────────────────────────────────────

/**
 * **RealWorldComposition** — realistic usage patterns in a product context.
 * A clipboard copy, a background-sync status, and a quota warning. All three
 * illustrate the correct "when to use Message" decision (redundant, ephemeral,
 * no action needed).
 */
export const RealWorldComposition: Story = {
  name: "Real-world composition",
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px; max-width:520px;">
      ${sectionLabel("Correct Message use-cases")}
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${fireBtn("Copy link (success, 2s)", () =>
          message.success("Link copied", { duration: 2000 }),
        )}
        ${fireBtn("Background sync (info, 4s)", () =>
          message.info("Changes synced", { duration: 4000 }),
        )}
        ${fireBtn("Quota warning (warning, 6s)", () =>
          message.warning("Storage 95% full — upgrade to continue", { duration: 6000 }),
        )}
        ${fireBtn("Click link-copy 5× to group", () => {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => message.success("Link copied", { duration: 8000 }), i * 100);
          }
        })}
        ${fireBtn("Dismiss all", () => message.dismiss())}
      </div>
      <p
        style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        "Storage 95% full" — a warning here is fine if the same info is
        visible on the storage settings page (the WCAG 2.2.1 non-critical
        clause). If the user must act immediately, add an action → Toast.
      </p>
    </div>
  `,
};
