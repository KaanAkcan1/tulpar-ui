import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@tulpar-ui/core/toast";
import { toast } from "@tulpar-ui/core/toast";

/**
 * `<tulpar-toast>` + `toast.*()` — The Tulpar UI transient-feedback family.
 *
 * ## Two usage modes
 *
 * **Imperative (primary — use this in apps):**
 * ```ts
 * import { toast } from "@tulpar-ui/core/toast";
 * toast.success("Saved");
 * toast.danger("Upload failed", { actions: [{ label: "Retry", onClick: retry }] });
 * toast.promise(save(), { loading: "Saving…", success: "Saved!", error: "Failed" });
 * ```
 *
 * **Declarative (rich content / Storybook a11y inspection):**
 * ```html
 * <tulpar-toast heading="Changes saved" tone="success" open></tulpar-toast>
 * ```
 *
 * ## When to use Toast vs Message vs Dialog
 * - **Toast** — corner notification, up to 360px, optional actions, configurable lifetime.
 *   Use for non-critical, redundant confirmations and actionable (Undo / Retry) patterns.
 * - **Message** — top-center pill, single line, no actions, groups duplicates.
 *   Use for the lightest possible ephemeral confirmation ("Link copied").
 * - **Dialog** — (future) blocking modal; scroll-lock; focus-trap.
 *   Use for irreversible, critical decisions that must not be missed.
 *
 * ## WCAG 2.2.1 stance
 * Auto-dismiss is conformant only when the same information is accessible elsewhere.
 * **Errors, warnings with consequences, and toasts with actions should be persistent**
 * (`timer:false` / `duration:0`). A close button is always present by default.
 *
 * ## Keyboard
 * - **F6** — jump focus to the toast region from anywhere in the page.
 * - **Esc** — dismiss the focused toast; focus moves to the next toast, then is
 *   restored to the element that held it before the F6 jump.
 * - **Tab / Shift+Tab** — navigate between action buttons and the close button.
 *
 * ## Tone → ARIA
 * - `info` / `success` / `warning` → `role="status"` (`aria-live="polite"`).
 * - `danger` → `role="alert"` (`aria-live="assertive"`).
 * - Actionable toast (has `action`) → `role="alertdialog"` inside a labelled region.
 *   Toast with actions **never steals focus** on appear — use F6 to reach it.
 */
const meta: Meta = {
  title: "Feedback/Toast",
  component: "tulpar-toast",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger", "custom"],
    },
    heading: { control: "text" },
    description: { control: "text" },
    closable: { control: "boolean" },
    timer: { control: "boolean" },
    duration: { control: "number" },
    "timer-style": {
      control: "select",
      options: ["track", "soft"],
    },
    "high-contrast": { control: "boolean" },
    icon: { control: "text" },
    color: { control: "text" },
    bg: { control: "color" },
    accent: { control: "color" },
    text: { control: "color" },
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

// ─── 1. Default (Playground) ─────────────────────────────────────────────────

/**
 * **Playground** — every declared control maps to an observed attribute on
 * `<tulpar-toast>`. This renders the element declaratively so the a11y addon
 * can inspect the ARIA structure. For the imperative API, use the
 * **Tones** or **ContentForms** stories.
 */
export const Default: Story = {
  args: {
    heading: "Changes saved",
    tone: "info",
    description: "Your edits have been committed to the draft.",
    closable: true,
    timer: true,
    duration: 5000,
    "timer-style": "track",
  },
  render: (args) => html`
    <div style="padding:40px; display:flex; justify-content:center;">
      <tulpar-toast
        tone=${args["tone"] ?? "info"}
        heading=${args["heading"] ?? ""}
        description=${args["description"] ?? ""}
        ?closable=${args["closable"] ?? true}
        ?timer=${args["timer"] ?? true}
        .duration=${args["duration"] ?? 5000}
        timer-style=${args["timer-style"] ?? "track"}
        ?high-contrast=${args["high-contrast"]}
        icon=${args["icon"] ?? ""}
        color=${args["color"] ?? ""}
        bg=${args["bg"] ?? ""}
        accent=${args["accent"] ?? ""}
        text=${args["text"] ?? ""}
      ></tulpar-toast>
    </div>
  `,
};

// ─── 2. Tones ────────────────────────────────────────────────────────────────

/**
 * **Tones** — all five built-in tone variants. Each maps to a semantic
 * feedback token set (tinted surface, on-surface text, accent border, icon).
 * `danger high-contrast` is the optional Carbon-style escalation for genuinely
 * urgent failures: saturated surface + white text.
 *
 * These are rendered **declaratively** so the a11y addon can inspect
 * `role="status"` / `role="alert"` on each card.
 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:12px; max-width:400px;">
      ${sectionLabel("All tones (static declarative form)")}
      <tulpar-toast
        tone="info"
        heading="Info"
        description="An informational update with no urgency."
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="success"
        heading="Success"
        description="The operation completed without errors."
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="warning"
        heading="Warning"
        description="Review this before proceeding."
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="danger"
        heading="Danger"
        description="Something went wrong. Check the details."
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="danger"
        ?high-contrast=${true}
        heading="Danger — high contrast"
        description="Saturated surface escalation (opt-in via highContrast)."
        ?timer=${false}
      ></tulpar-toast>
    </div>
  `,
};

// ─── 3. ContentForms (imperative) ────────────────────────────────────────────

/**
 * **ContentForms** — imperative trigger panel covering every content variant.
 * Click a button to fire the corresponding toast at `bottom-right`. Hover any
 * live toast to pause its countdown; Esc (while focused) dismisses it; F6
 * jumps keyboard focus to the toast region.
 *
 * Variants:
 * - Title-only
 * - Title + description (prop form)
 * - Title + description (slot form — rendered on the declarative element below)
 * - Single action (Undo)
 * - Two actions (Undo + View)
 * - Long text (overflow / wrapping)
 * - `closable:false` (no × button — use for mandatory-read banners)
 */
export const ContentForms: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px;">
      <div>
        ${sectionLabel("Imperative trigger buttons")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("Title only", () =>
            toast.success("Project saved"),
          )}
          ${fireBtn("Title + description", () =>
            toast.info("Draft committed", {
              description: "Your edits have been saved to the draft. No further action needed.",
            }),
          )}
          ${fireBtn("Single action", () =>
            toast.success("Row deleted", {
              actions: [{ label: "Undo", onClick: () => toast.info("Restored") }],
              timer: false,
            }),
          )}
          ${fireBtn("Two actions", () =>
            toast.warning("Unsaved changes", {
              description: "You have edits that haven't been committed.",
              actions: [
                { label: "Discard", onClick: () => toast.info("Changes discarded") },
                { label: "Save now", onClick: () => toast.success("Saved") },
              ],
              timer: false,
            }),
          )}
          ${fireBtn("Long text", () =>
            toast.info("This is a toast with a very long title that should wrap gracefully across multiple lines", {
              description:
                "And this description is also intentionally long to verify that the 360px card wraps and reflows its typography without overflow or truncation issues.",
            }),
          )}
          ${fireBtn("closable:false", () =>
            toast.danger("Critical failure — read this", {
              description: "This toast cannot be dismissed manually.",
              closable: false,
              timer: false,
            }),
          )}
        </div>
      </div>

      <div>
        ${sectionLabel("Slot form — title + description via named slots (declarative)")}
        <tulpar-toast tone="success" ?timer=${false}>
          <span slot="title">Project <strong>archived</strong></span>
          <span slot="description">
            Moved to <em>archive/2026</em>. Restore any time from Settings → Archives.
          </span>
        </tulpar-toast>
      </div>
    </div>
  `,
};

// ─── 4. Icons ────────────────────────────────────────────────────────────────

/**
 * **Icons** — all icon input forms. Tulpar ships only the four built-in
 * tone icons; consumers bring their own via the `icon` prop or `slot="icon"`.
 *
 * Prop forms (declarative element):
 * 1. **Default** — built-in tone icon (nothing supplied).
 * 2. **`icon` = built-in name** — `icon="success"` overrides the tone default.
 * 3. **`icon` = raw SVG string** — inline SVG; injected via innerHTML.
 * 4. **`icon` = emoji** — text fallback path.
 * 5. **`icon=""` / `iconProp=false`** — no icon.
 *
 * Slot form:
 * 6. **`slot="icon"`** — arbitrary element; wins over all prop forms.
 */
export const Icons: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:12px; max-width:420px;">
      ${sectionLabel("1 · Default built-in icon (tone='warning')")}
      <tulpar-toast
        tone="warning"
        heading="Built-in warning icon"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("2 · Built-in name override: icon='success'")}
      <tulpar-toast
        tone="info"
        heading="Success icon on an info toast"
        icon="success"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("3 · Raw SVG string")}
      <tulpar-toast
        tone="info"
        heading="Custom raw SVG icon"
        icon="<svg viewBox='0 0 24 24' fill='none' aria-hidden='true' focusable='false'><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2'/><path d='M12 8h.01M12 12v4' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M8 12h8' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("4 · Emoji")}
      <tulpar-toast
        tone="success"
        heading="Deployed to production"
        icon="🚀"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("5 · No icon (icon='')")}
      <tulpar-toast
        tone="info"
        heading="No icon — text-only"
        icon=""
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("6 · slot=\"icon\" — arbitrary element")}
      <tulpar-toast tone="info" heading="Slotted Lucide icon" ?timer=${false}>
        <span slot="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            style="width:18px;height:18px;"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
      </tulpar-toast>
    </div>
  `,
};

// ─── 5. CustomTone ───────────────────────────────────────────────────────────

/**
 * **CustomTone** — `tone="custom"` with the `color` prop or CSS-variable part
 * overrides. The custom tone is **visual-only** — it never changes ARIA role
 * or live-region semantics. Three input forms:
 *
 * 1. **Brand family name** (`'ilay'`, `'umay'`, `'gok'`) — resolved through
 *    the family's mode-aware scale; contrast guaranteed by the token system.
 * 2. **Raw CSS color** (`#0d9488`, `rgb(...)`) — surface/accent derived;
 *    contrast is the author's responsibility.
 * 3. **Part overrides** — `bg` / `accent` / `text` props (or the
 *    `--tulpar-toast-bg` / `--tulpar-toast-accent` / `--tulpar-toast-text`
 *    CSS custom properties) layered on top of any resolved tone.
 */
export const CustomTone: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:12px; max-width:420px;">
      ${sectionLabel("Brand family: color='ilay'")}
      <tulpar-toast
        tone="custom"
        color="ilay"
        heading="Ilay brand family"
        description="Mode-aware — scales contrast in light and dark."
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("Brand family: color='umay'")}
      <tulpar-toast
        tone="custom"
        color="umay"
        heading="Umay brand family"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("Brand family: color='gok'")}
      <tulpar-toast
        tone="custom"
        color="gok"
        heading="Gök brand family"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("Raw hex: color='#0d9488'")}
      <tulpar-toast
        tone="custom"
        color="#0d9488"
        heading="Raw teal hex"
        description="Author is responsible for contrast on this path."
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("Part override: bg + accent + text props")}
      <tulpar-toast
        tone="custom"
        heading="Part overrides via props"
        description="bg / accent / text props override individual surfaces."
        bg="#1e1b4b"
        accent="#818cf8"
        text="#e0e7ff"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("Part override via CSS custom properties (inline style)")}
      <tulpar-toast
        tone="custom"
        heading="Part overrides via CSS vars"
        ?timer=${false}
        style="--tulpar-toast-bg:#fdf2f8; --tulpar-toast-accent:#ec4899; --tulpar-toast-text:#831843;"
      ></tulpar-toast>
    </div>
  `,
};

// ─── 6. TimerStyles ──────────────────────────────────────────────────────────

/**
 * **TimerStyles** — the perimeter countdown ring that depletes around the card
 * border. Two visual modes and the persistent (no ring) variant.
 *
 * - **`track`** (default): a faint static full-perimeter track under a
 *   depleting fill (~1.5px, ~0.7 opacity).
 * - **`soft`**: depleting fill only, no track (~1.5px, ~0.6 opacity).
 * - **`timer:false`**: persistent — no ring, no auto-dismiss.
 *
 * The ring pauses on hover and on keyboard focus (WCAG 2.2.1).
 * Under `prefers-reduced-motion` the ring does not animate (static border).
 *
 * These are imperative triggers so you see the live countdown animation.
 * The duration is extended to 12 000ms so you have time to compare.
 */
export const TimerStyles: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px; max-width:520px;">
      <div>
        ${sectionLabel("Imperative — fire each style (12s duration)")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("Fire: track (default)", () =>
            toast.info("Track ring", {
              description: "Hover or focus to pause the countdown.",
              timerStyle: "track",
              duration: 12000,
            }),
          )}
          ${fireBtn("Fire: soft", () =>
            toast.info("Soft ring", {
              description: "Depleting fill only — no track underlay.",
              timerStyle: "soft",
              duration: 12000,
            }),
          )}
          ${fireBtn("Fire: persistent (timer:false)", () =>
            toast.warning("Persistent — no ring", {
              description: "No auto-dismiss; only × or Esc closes this.",
              timer: false,
            }),
          )}
          ${fireBtn("Fire: custom duration 3s", () =>
            toast.success("Short toast (3s)", { duration: 3000 }),
          )}
        </div>
      </div>

      <div>
        ${sectionLabel("Static reference — declarative, timer frozen at initial state")}
        <div style="display:flex; flex-direction:column; gap:12px;">
          <tulpar-toast
            tone="info"
            heading="track style"
            timer-style="track"
            ?timer=${true}
            .duration=${12000}
          ></tulpar-toast>
          <tulpar-toast
            tone="info"
            heading="soft style"
            timer-style="soft"
            ?timer=${true}
            .duration=${12000}
          ></tulpar-toast>
          <tulpar-toast
            tone="warning"
            heading="Persistent (timer=false)"
            ?timer=${false}
          ></tulpar-toast>
        </div>
      </div>
    </div>
  `,
};

// ─── 7. Stacking ─────────────────────────────────────────────────────────────

/**
 * **Stacking** — the Sonner-model collapsed stack. Up to 3 toasts are visible
 * (scaled + lifted behind the newest); additional toasts queue. Hovering or
 * focusing any card in the stack **expands** it vertically and pauses all
 * timers. The `expand` mode always shows the full list.
 *
 * Fire multiple toasts rapidly to see the collapse + queue.
 */
export const Stacking: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px;">
      <div>
        ${sectionLabel("Collapsed stack (default — hover to expand)")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("Fire 3 (fills stack)", () => {
            toast.info("First toast", { duration: 15000 });
            toast.success("Second toast", { duration: 15000 });
            toast.warning("Third toast", { duration: 15000 });
          })}
          ${fireBtn("Fire 6 (3 visible + 3 queued)", () => {
            ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"].forEach((name, i) =>
              setTimeout(() => toast.info(`Toast ${name}`, { duration: 20000 }), i * 50),
            );
          })}
          ${fireBtn("Dismiss all", () => toast.dismiss())}
        </div>
      </div>

      <div>
        ${sectionLabel("Always-expanded (setDefaults expand:true)")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("Fire 3 (expanded)", () => {
            toast.setDefaults({ expand: true });
            toast.success("Expanded — alpha", { duration: 15000 });
            toast.info("Expanded — beta", { duration: 15000 });
            toast.warning("Expanded — gamma", { duration: 15000 });
          })}
          ${fireBtn("Reset to collapsed", () => {
            toast.setDefaults({ expand: false });
            toast.dismiss();
          })}
        </div>
      </div>
    </div>
  `,
};

// ─── 8. Locations ────────────────────────────────────────────────────────────

/**
 * **Locations** — all six positions via per-call `location` override. The
 * toaster global default is `bottom-right`; Message is always `top-center`.
 * Each button fires a toast at the named position.
 */
export const Locations: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const locations = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ] as const;
    return html`
      <div style="padding:32px;">
        ${sectionLabel("Fire at each of the six positions")}
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; max-width:480px;">
          ${locations.map(
            (loc) => html`
              ${fireBtn(loc, () =>
                toast.info(`Toast at ${loc}`, {
                  location: loc,
                  description: `location: '${loc}'`,
                  timer: false,
                }),
              )}
            `,
          )}
        </div>
        <div style="margin-top:12px;">
          ${fireBtn("Dismiss all", () => toast.dismiss())}
        </div>
      </div>
    `;
  },
};

// ─── 9. Promise ──────────────────────────────────────────────────────────────

/**
 * **Promise** — `toast.promise()` shows a loading toast (spinner icon,
 * persistent, not closable) then updates it to `success` or `danger` on
 * settle. The resolved value can be injected into the success message.
 *
 * The original promise is returned unchanged (no rejection swallow).
 */
export const Promise: Story = {
  name: "Promise (loading → success/error)",
  parameters: { controls: { disable: true } },
  render: () => {
    const fakeUpload = (fail: boolean) =>
      new window.Promise<{ count: number }>((resolve, reject) =>
        setTimeout(() => {
          if (fail) reject(new Error("Network error"));
          else resolve({ count: 3 });
        }, 2500),
      );

    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
        ${sectionLabel("toast.promise() — 2.5s simulated async")}
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${fireBtn("Promise → success", () => {
            toast.promise(fakeUpload(false), {
              loading: "Uploading files…",
              success: (r) => `${r.count} files uploaded`,
              error: "Upload failed",
            });
          })}
          ${fireBtn("Promise → error", () => {
            toast
              .promise(fakeUpload(true), {
                loading: "Uploading files…",
                success: "Uploaded",
                error: (err) => `Upload failed: ${(err as Error).message}`,
              })
              .catch(() => {
                /* rejection surfaced to caller — handled in demo */
              });
          })}
        </div>
        <p
          style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);"
        >
          The loading toast shows a spinner and is not closable; on settle it
          transitions to success or danger. Errors are persistent so they are
          not missed.
        </p>
      </div>
    `;
  },
};

// ─── 10. UpdateAndDismiss ─────────────────────────────────────────────────────

/**
 * **UpdateAndDismiss** — `toast.update(id, opts)` mutates a live toast
 * in-place without remounting it. `toast.dismiss(id)` removes a specific
 * toast; `toast.dismiss()` removes all.
 */
export const UpdateAndDismiss: Story = {
  name: "Update & Dismiss",
  parameters: { controls: { disable: true } },
  render: () => {
    let currentId: string | null = null;
    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
        ${sectionLabel("toast.update() in place")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("1. Fire info toast", () => {
            currentId = toast.info("Processing…", {
              description: "Step 1 of 3",
              timer: false,
            });
          })}
          ${fireBtn("2. Update → warning", () => {
            if (currentId) {
              toast.update(currentId, {
                tone: "warning",
                title: "Step 2 of 3",
                description: "Almost there — applying changes.",
              });
            }
          })}
          ${fireBtn("3. Update → success", () => {
            if (currentId) {
              toast.update(currentId, {
                tone: "success",
                title: "Done",
                description: "All 3 steps completed.",
                timer: true,
                duration: 4000,
              });
            }
          })}
          ${fireBtn("Dismiss by id", () => {
            if (currentId) toast.dismiss(currentId);
          })}
          ${fireBtn("Dismiss all", () => toast.dismiss())}
        </div>
      </div>
    `;
  },
};

// ─── 11. DismissCallback ─────────────────────────────────────────────────────

/**
 * **DismissCallback** — `onDismiss` fires with the dismiss reason
 * (`'timeout' | 'user' | 'action' | 'swipe' | 'programmatic'`).
 * The reason is logged to the panel below; open the browser console for the
 * full object. `onAutoClose` fires specifically on timeout expiry.
 */
export const DismissCallback: Story = {
  name: "Dismiss Callback",
  parameters: { controls: { disable: true } },
  render: () => {
    const logEl = () =>
      document.getElementById("dismiss-log") as HTMLParagraphElement | null;
    const log = (msg: string) => {
      const el = logEl();
      if (el) el.textContent = msg;
    };

    return html`
      <div style="padding:32px; display:flex; flex-direction:column; gap:16px;">
        ${sectionLabel("onDismiss reason readout")}
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${fireBtn("Fire toast with callback (4s)", () => {
            toast.info("Dismiss me any way you like", {
              description: "×, Esc, action, or wait 4s",
              duration: 4000,
              actions: [{ label: "Action", onClick: () => {} }],
              onAutoClose: () => log("onAutoClose fired (timeout)"),
              onDismiss: (reason) => log(`onDismiss reason: '${reason}'`),
            });
          })}
        </div>
        <p
          id="dismiss-log"
          style="margin:0; font-size:13px; font-weight:600;
                 color:var(--tulpar-color-text-primary,#1a2020);
                 min-height:20px;"
        >
          Reason will appear here after dismiss.
        </p>
      </div>
    `;
  },
};

// ─── 12. A11y ────────────────────────────────────────────────────────────────

/**
 * **A11y** — ARIA landmarks and keyboard behaviour. Toasts are rendered
 * declaratively so the a11y addon can inspect the role/live-region hierarchy.
 *
 * - `info` / `success` / `warning` → `role="status"` (polite).
 * - `danger` → `role="alert"` (assertive).
 * - Actionable toast (has `action`) → `role="alertdialog"` inside a labelled
 *   region landmark. Use F6 to jump focus; Tab reaches actions; Esc dismisses.
 * - Toasts **never steal focus** on appearance.
 *
 * **Manual SR pass required** (spec §14): verify with NVDA+Chrome and
 * VoiceOver+Safari that dismissing the focused toast announces the next one.
 * Automated tests cover DOM/ARIA attributes; AT announcement requires manual
 * verification.
 */
export const A11y: Story = {
  name: "A11y — ARIA roles, keyboard, focus",
  parameters: { controls: { disable: true }, a11y: { test: "error" } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px; max-width:420px;">
      ${sectionLabel("role=status (polite) — info / success / warning")}
      <tulpar-toast
        tone="info"
        heading="Info toast — role=status, polite"
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="success"
        heading="Success — role=status, polite"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("role=alert (assertive) — danger")}
      <tulpar-toast
        tone="danger"
        heading="Danger — role=alert, assertive"
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("Actionable → role=alertdialog inside labelled region")}
      <tulpar-toast
        tone="warning"
        heading="Unsaved changes"
        description="Use F6 to jump focus here; Tab reaches the action button; Esc dismisses."
        ?timer=${false}
      ></tulpar-toast>

      ${sectionLabel("F6 / Esc / Swipe (interactive — use keyboard)")}
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${fireBtn("Fire actionable toast (F6 to reach it)", () =>
          toast.warning("Unsaved changes", {
            description: "F6 → focus enters region; Tab → action; Esc → dismiss.",
            actions: [{ label: "Save", onClick: () => toast.success("Saved") }],
            timer: false,
          }),
        )}
      </div>
      <p
        style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Swipe-to-dismiss is a pointer/touch horizontal swipe past the threshold.
        Disabled under <code>prefers-reduced-motion</code>.
      </p>
    </div>
  `,
};

// ─── 13. DarkMode ────────────────────────────────────────────────────────────

/**
 * **DarkMode** — all four tones on a dark background. Toggle the Storybook
 * theme switcher (toolbar "Theme" select); this story also forces `.dark`
 * locally so it reads correctly in either global mode.
 *
 * In dark mode each tone uses a deep tinted surface (family 900/950) +
 * lightened on-surface text (family 100/200) + a 1px mid-tone border for
 * separation (shadows read weakly on dark backgrounds).
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
             display:flex; flex-direction:column; gap:12px; max-width:420px;"
    >
      ${sectionLabel("Dark mode — all tones")}
      <tulpar-toast
        tone="info"
        heading="Info — dark"
        description="Deep tinted surface + lightened text."
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="success"
        heading="Success — dark"
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="warning"
        heading="Warning — dark"
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="danger"
        heading="Danger — dark"
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="danger"
        ?high-contrast=${true}
        heading="Danger HC — dark"
        ?timer=${false}
      ></tulpar-toast>
    </div>
  `,
};

// ─── 14. ForcedColors ────────────────────────────────────────────────────────

/**
 * **ForcedColors / HCM** — under Windows High Contrast Mode every toast must
 * remain legible. Each card carries a `1px solid CanvasText` border so it
 * survives shadow/background stripping; tone is conveyed by border + text,
 * not icon color alone.
 *
 * To verify: DevTools → Rendering → Emulate CSS media → `forced-colors: active`.
 * Author-defined colours are replaced by OS system colours; the text and border
 * must still clearly delineate each card.
 */
export const ForcedColors: Story = {
  name: "Forced Colors / HCM",
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:12px; max-width:420px;">
      ${sectionLabel("Emulate forced-colors: active in DevTools Rendering panel")}
      <p style="margin:0 0 8px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        DevTools → Rendering → CSS media features → force <code>forced-colors: active</code>.
        Each card must remain visible with its 1px CanvasText border.
      </p>
      <tulpar-toast
        tone="info"
        heading="Info — HCM border visible"
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="success"
        heading="Success — HCM border visible"
        ?timer=${false}
      ></tulpar-toast>
      <tulpar-toast
        tone="danger"
        heading="Danger — HCM border visible"
        ?timer=${false}
      ></tulpar-toast>
    </div>
  `,
};

// ─── 15. ReducedMotion ───────────────────────────────────────────────────────

/**
 * **ReducedMotion** — under `prefers-reduced-motion: reduce` the enter/exit
 * scale+transform is replaced by an ≤100ms opacity crossfade. The timer ring
 * does not animate (static border). Swipe-to-dismiss is disabled.
 *
 * To verify: DevTools → Rendering → Emulate CSS media → `prefers-reduced-motion: reduce`.
 */
export const ReducedMotion: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:16px; max-width:420px;">
      ${sectionLabel("Emulate prefers-reduced-motion: reduce in DevTools")}
      <p style="margin:0 0 8px; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);">
        DevTools → Rendering → CSS media features → force
        <code>prefers-reduced-motion: reduce</code>.
        Fire a toast then observe: no scale/translate enter, crossfade only;
        timer ring is a static border (no animation).
      </p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${fireBtn("Fire toast (observe motion)", () =>
          toast.info("Reduced-motion toast", {
            description: "Crossfade only — no scale/translate.",
            duration: 8000,
          }),
        )}
      </div>

      ${sectionLabel("Static reference (declarative, timer frozen)")}
      <tulpar-toast
        tone="info"
        heading="Static — observe ring under reduced-motion"
        ?timer=${true}
        .duration=${10000}
      ></tulpar-toast>
    </div>
  `,
};

// ─── 16. RealWorldComposition ────────────────────────────────────────────────

/**
 * **RealWorldComposition** — a product scenario panel: upload, delete, and
 * permission-error patterns. Shows all three "weight levels" in one view:
 * a redundant success (auto-dismiss), an actionable danger (persistent +
 * Retry), and a promise toast.
 */
export const RealWorldComposition: Story = {
  name: "Real-world composition",
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="padding:32px; display:flex; flex-direction:column; gap:24px; max-width:520px;">
      ${sectionLabel("Scenario buttons")}
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${fireBtn("✓ Save draft (success, 4s)", () =>
          toast.success("Draft saved", { duration: 4000 }),
        )}
        ${fireBtn("✗ Permission denied (danger, persistent)", () =>
          toast.danger("Permission denied", {
            description: "You don't have access to this resource. Contact your admin.",
            actions: [{ label: "Request access", onClick: () => toast.info("Request sent") }],
            timer: false,
          }),
        )}
        ${fireBtn("↺ Undo delete (actionable, persistent)", () =>
          toast.warning("Row deleted", {
            actions: [{ label: "Undo", onClick: () => toast.success("Row restored") }],
            timer: false,
          }),
        )}
        ${fireBtn("⟳ Upload files (promise, 3s)", () => {
          toast.promise(
            new window.Promise<{ count: number }>((res) =>
              setTimeout(() => res({ count: 5 }), 3000),
            ),
            {
              loading: "Uploading 5 files…",
              success: (r) => `${r.count} files uploaded`,
              error: "Upload failed",
            },
          );
        })}
        ${fireBtn("Dismiss all", () => toast.dismiss())}
      </div>
      <p
        style="margin:0; font-size:12px; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Redundant confirmations (save, copy) → success, 4–5s auto-dismiss.
        Errors, permissions, actionable feedback → persistent so users don't
        miss them (WCAG 2.2.1).
      </p>
    </div>
  `,
};
