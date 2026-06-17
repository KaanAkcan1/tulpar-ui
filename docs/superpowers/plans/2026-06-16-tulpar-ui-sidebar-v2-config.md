# Tulpar UI — Sidebar v2 (Self-Contained Config) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `tulpar-sidenav` a self-contained, prop-driven sidebar (built-in toggle/brand, data-driven menu icons, built-in utility row + account block with events), add a shell `sidenav-layout` mode + floating reopen button, fix three rail bugs, update wrappers, and rewrite the playgrounds to the clean API — decomposed cleanly so no file becomes a god-component.

**Architecture:** `tulpar-sidenav.ts` stays the orchestrator (state, items, slots, events, keyboard, state-sync); its regions are extracted into pure render-function modules under `sidenav/parts/` with composed `css[]` styles; shared bits (brand-mark SVG, initials) live in package-private `src/_internal/`. No new public elements. The shell owns layout grid, the floating reopen button, theme flipping, and reflects collapse/open state onto the slotted sidenav. Angular (signals) + Vue wrappers expose the API and add icon-as-component.

**Tech Stack:** Lit 3, TS 5.4 strict, pnpm 9, `@web/test-runner`+`@open-wc/testing` (core), Vitest (wrappers), Angular 22 signals, Vue 3.4, Storybook 8.

**Spec:** [`docs/superpowers/specs/2026-06-16-tulpar-ui-sidebar-v2-config-design.md`](../specs/2026-06-16-tulpar-ui-sidebar-v2-config-design.md)

**Binding constraints (read first):**
- NEVER edit a primitive color value (`packages/tokens/src/primitive/color.ts`). Re-bind shell tokens to existing primitives / add tokens resolving to existing primitives or `rgba()` of one. **Zero invented hex.** Component CSS uses `var(--tulpar-shell-…, fallback)` only (ESLint enforces on `*.styles.ts`); fallbacks mirror resolved primitives.
- Inlined default **wordmark** SVG uses `fill="currentColor"` (themes via `--tulpar-shell-sidenav-fg`). The inlined **brand mark** keeps brand greens (logo artwork; `#00c57a`/`#00a468`/`#0b7e52` are existing primitives green.500/600/700, and `#07291f` is green.950 — all existing primitives, not invented).
- Angular wrappers are **signals-only** (no RxJS).
- Slots override the matching built-in region when provided.

**Branch:** `feat/v0.8-shell-sidebar-redesign` (no worktree). Commit frequently. Core test command: `pnpm --filter @tulpar-ui/shell test`.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `packages/shell/src/_internal/brand-mark.ts` | inline brand-mark SVG (shared: sidenav toggle default + shell floating button) | Create |
| `packages/shell/src/_internal/brand-wordmark.ts` | inline default wordmark SVG (currentColor) | Create |
| `packages/shell/src/_internal/initials.ts` | `initials("Kaan Akcan") → "KA"` pure fn | Create |
| `packages/shell/src/_internal/*.test.ts` | initials test | Create |
| `packages/shell/src/nav-item/tulpar-nav-item.ts` | add `icon` (SVG string) via `unsafeSVG` | Modify |
| `packages/shell/src/sidenav/tulpar-sidenav.ts` | orchestrator: state, items, slots, events, keyboard, aria state-sync | Modify |
| `packages/shell/src/sidenav/tulpar-sidenav.styles.ts` | base styles; compose part styles via `css[]` | Modify |
| `packages/shell/src/sidenav/parts/header.ts` + `header.styles.ts` | `renderHeader(host)`: toggle + brand | Create |
| `packages/shell/src/sidenav/parts/utility.ts` + `utility.styles.ts` | `renderUtility(host)`: theme + config | Create |
| `packages/shell/src/sidenav/parts/account.ts` + `account.styles.ts` | `renderAccount(host)`: avatar + name/role + settings/logout | Create |
| `packages/shell/src/sidenav/tulpar-sidenav.test.ts` | new behaviors | Modify |
| `packages/shell/src/nav-item/tulpar-nav-item.styles.ts` | rail flyout escape (B3) | Modify |
| `packages/shell/src/shell/tulpar-shell.ts` | `sidenavLayout`, floating reopen, `tulpar-theme-toggle`, reflect `data-collapsed`/`data-sidenav-open` | Modify |
| `packages/shell/src/shell/tulpar-shell.styles.ts` | over-topbar grid, floating button styles | Modify |
| `packages/shell/src/shell/tulpar-shell.test.ts` | new behaviors | Modify |
| `packages/angular/src/**` | sidenav inputs/outputs + icon-as-component | Modify |
| `packages/vue/src/**` | sidenav props/emits + icon-as-component | Modify |
| `apps/playground-ng/src/app/app.ts`, `apps/playground-vue/src/App.vue` | rewrite to clean API | Modify |
| `.changeset/*.md` | bump @tulpar-ui/* minor | Create/Modify |

> The sidenav "parts" are **pure functions** returning `TemplateResult`, taking the sidenav host (for props/state/handlers). They are NOT custom elements. Styles compose via `static styles = [baseStyles, headerStyles, utilityStyles, accountStyles]`.

---

## Pre-flight

- [ ] **Step 0:** `pnpm --filter @tulpar-ui/shell test` → green baseline (should be, post-v0.8). If red, stop and report.

---

## Chunk 1: `_internal` shared helpers + nav-item icon-in-data

### Task 1.1: initials helper (TDD)

**Files:** Create `packages/shell/src/_internal/initials.ts`, `packages/shell/src/_internal/initials.test.ts`

- [ ] **Step 1: Failing test** (`initials.test.ts`):
```ts
import { expect } from "@open-wc/testing";
import { initials } from "./initials";

describe("initials()", () => {
  it("takes first letters of first two words, uppercased", () => {
    expect(initials("Kaan Akcan")).to.equal("KA");
  });
  it("single word → first letter", () => {
    expect(initials("Kaan")).to.equal("K");
  });
  it("empty/undefined → empty string", () => {
    expect(initials("")).to.equal("");
    expect(initials(undefined)).to.equal("");
  });
  it("trims and ignores extra spaces", () => {
    expect(initials("  Kaan   Veli Akcan ")).to.equal("KV");
  });
});
```
- [ ] **Step 2:** Run `pnpm --filter @tulpar-ui/shell test` → FAIL (module missing).
- [ ] **Step 3:** Implement `initials.ts`:
```ts
/** Derive up to two uppercase initials from a display name. Pure, package-private. */
export function initials(name: string | undefined): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}
```
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit**
```bash
git add packages/shell/src/_internal/initials.ts packages/shell/src/_internal/initials.test.ts
git commit -m "feat(shell): add package-private initials() helper"
```

### Task 1.2: shared brand-mark + wordmark SVG modules

**Files:** Create `packages/shell/src/_internal/brand-mark.ts`, `brand-wordmark.ts`

- [ ] **Step 1:** Create `brand-mark.ts` (the three ascending strokes; greens are existing primitives):
```ts
import { svg } from "lit";
/** Tulpar brand mark — logo artwork. Greens are primitives green.500/600/700. */
export const brandMark = svg`<svg viewBox="0 0 256 256" width="24" height="24" aria-hidden="true">
  <line x1="74" y1="110" x2="212" y2="64" stroke="#00c57a" stroke-width="30" stroke-linecap="round"/>
  <line x1="62" y1="156" x2="176" y2="118" stroke="#00a468" stroke-width="30" stroke-linecap="round"/>
  <line x1="50" y1="202" x2="140" y2="172" stroke="#0b7e52" stroke-width="30" stroke-linecap="round"/>
</svg>`;
```
- [ ] **Step 2:** Create `brand-wordmark.ts` — default wordmark using `fill="currentColor"` so it themes. Use a lightweight text-based lockup (the display serif) rather than inlining the full custom letterform path, to keep the WC lean:
```ts
import { html } from "lit";
/** Default brand lockup text. Uses currentColor (inherits sidenav fg) so it themes. */
export const brandWordmark = html`<span
  style="font-family: var(--tulpar-font-family-display, Georgia, serif); font-weight:600; font-size:1rem; letter-spacing:-0.01em; color: currentColor;"
  >Tulpar UI</span
>`;
```
> Rationale: the custom wordmark SVG is dark-ink and theme-locked; a `currentColor` text lockup themes correctly and is lighter. Consumers override via `slot="brand"` for their own logo.
- [ ] **Step 3:** No test needed (static templates). Commit:
```bash
git add packages/shell/src/_internal/brand-mark.ts packages/shell/src/_internal/brand-wordmark.ts
git commit -m "feat(shell): add shared brand-mark + themed default wordmark"
```

### Task 1.3: nav-item `icon` (SVG string) via unsafeSVG (TDD)

**Files:** Modify `packages/shell/src/nav-item/tulpar-nav-item.ts`, `tulpar-nav-item.test.ts`

- [ ] **Step 1: Failing test:**
```ts
  it("renders an inline SVG icon from the icon string prop", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/x" label="X" icon='<svg class="probe"></svg>'></tulpar-nav-item>`,
    );
    expect(el.shadowRoot!.querySelector("svg.probe")).to.exist;
  });
```
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. Add import `import { unsafeSVG } from "lit/directives/unsafe-svg.js";`. Add property `@property({ type: String }) icon?: string;` (also add `icon?: string` to `TulparNavItemData` — note it already may have other fields). In `_renderInner()`, render the icon BEFORE the `icon-class`/`slot="icon"` (icon string wins when provided):
```ts
      ${this.icon
        ? html`<span class="icon-slot" aria-hidden="true">${unsafeSVG(this.icon)}</span>`
        : nothing}
      ${this.iconClass ? html`<i class=${this.iconClass} aria-hidden="true"></i>` : nothing}
      <slot name="icon"></slot>
```
> Security: `icon` is author-controlled markup, not user input — document in a code comment.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit**
```bash
git add packages/shell/src/nav-item/tulpar-nav-item.ts packages/shell/src/nav-item/tulpar-nav-item.test.ts
git commit -m "feat(shell): nav-item icon string prop (data-driven icons via unsafeSVG)"
```

---

## Chunk 2: sidenav internal decomposition (refactor, behavior-preserving)

### Task 2.1: extract parts as render functions + compose styles

**Files:** Create `parts/header.ts`, `parts/header.styles.ts`, `parts/utility.ts`, `parts/utility.styles.ts`, `parts/account.ts`, `parts/account.styles.ts`; Modify `tulpar-sidenav.ts`, `tulpar-sidenav.styles.ts`

> This task is a pure refactor: move the CURRENT header/utility/footer markup into render-fn modules and split styles, with NO behavior change. Tests must stay green throughout.

- [ ] **Step 1:** Run `pnpm --filter @tulpar-ui/shell test` → record current PASS count (baseline).
- [ ] **Step 2:** Create the three part modules as functions returning the CURRENT markup. Initial signatures (host typed as `TulparSidenav`):
```ts
// parts/header.ts
import { html } from "lit";
import type { TulparSidenav } from "../tulpar-sidenav";
export function renderHeader(host: TulparSidenav) {
  return html`<div class="header"><slot name="header"></slot><slot name="header-actions"></slot></div>`;
}
```
Mirror for `renderUtility` (current `.utility` with `utility-start`/`utility-end` slots) and `renderAccount` (current `.footer` with `footer` slot). Move the corresponding CSS rules into `header.styles.ts` / `utility.styles.ts` / `account.styles.ts` as exported `css` blocks.
> **Preserve the `header-actions` slot** in `renderHeader` through this refactor (the current sidenav header has both `header` and `header-actions` — do not drop it). Chunk 3 builds the built-in toggle/brand path on top; `header-actions` remains available.
- [ ] **Step 3:** In `tulpar-sidenav.styles.ts`, keep host/nav/search/scroll rules; remove the moved rules. In `tulpar-sidenav.ts`, set `static styles = [sidenavStyles, headerStyles, utilityStyles, accountStyles]` and call the render fns in `render()` in the same positions.
- [ ] **Step 4:** Run tests → SAME PASS count (no behavior change). Fix until green.
- [ ] **Step 5: Commit**
```bash
git add packages/shell/src/sidenav/
git commit -m "refactor(shell): extract sidenav header/utility/account into part render modules"
```

---

## Chunk 3: sidenav header — built-in toggle + brand + aria state-sync

### Task 3.1: built-in toggle button + brand defaults + slot precedence (TDD)

**Files:** Modify `parts/header.ts`, `parts/header.styles.ts`, `tulpar-sidenav.ts`, test

- [ ] **Step 1: Failing tests:**
```ts
  it("renders a built-in toggle button that emits tulpar-menu-toggle", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    const btn = el.shadowRoot!.querySelector(".sidenav-toggle") as HTMLButtonElement;
    expect(btn).to.exist;
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "tulpar-menu-toggle");
    expect(ev).to.exist;
  });
  it("toggle button reflects aria-expanded from data-collapsed (initial)", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav data-collapsed></tulpar-sidenav>`);
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")!.getAttribute("aria-expanded")).to.equal("false");
  });
  it("toggle aria-expanded updates live when data-collapsed mutates (exercises the MutationObserver)", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")!.getAttribute("aria-expanded")).to.equal("true");
    el.toggleAttribute("data-collapsed", true); // shell sets this at runtime
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")!.getAttribute("aria-expanded")).to.equal("false");
  });
  it("does not render built-in toggle/brand when slot=header is provided", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav><div slot="header">custom</div></tulpar-sidenav>`);
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")).to.be.null;
  });
```
(import `oneEvent` from `@open-wc/testing`.)
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement `renderHeader`. Detect a header-slot override via an assigned-nodes check (a `@state() _hasHeaderSlot` updated on slotchange), and render either the custom slot OR the built-in:
```ts
import { html, nothing } from "lit";
import { brandMark } from "../../_internal/brand-mark";
import { brandWordmark } from "../../_internal/brand-wordmark";
import type { TulparSidenav } from "../tulpar-sidenav";

export function renderHeader(host: TulparSidenav) {
  if (host.hasHeaderSlot) {
    return html`<div class="header"><slot name="header"></slot></div>`;
  }
  const expanded = !host.hasAttribute("data-collapsed");
  return html`
    <div class="header">
      <button
        class="sidenav-toggle"
        type="button"
        aria-label=${host.toggleLabel}
        aria-expanded=${String(expanded)}
        @click=${() =>
          host.dispatchEvent(
            new CustomEvent("tulpar-menu-toggle", { bubbles: true, composed: true }),
          )}
      >
        <slot name="toggle-icon">${brandMark}</slot>
      </button>
      <span class="brand"><slot name="brand">${brandWordmark}</slot></span>
    </div>
  `;
}
```
Add to `tulpar-sidenav.ts`: `@property({ attribute: "toggle-label" }) toggleLabel = "Toggle navigation";` and `@state() hasHeaderSlot = false;` (updated via a `@slotchange` probe).
**REQUIRED (not optional):** Lit does NOT re-render on arbitrary host-attribute mutations, and the shell sets `data-collapsed`/`data-sidenav-open`/`data-rail` on the sidenav at runtime via `toggleAttribute`. Add a `MutationObserver` on `this` in `connectedCallback` with `attributeFilter: ["data-collapsed","data-sidenav-open","data-rail"]` whose callback calls `this.requestUpdate()` AND `this._reflectRail()` (Task 6.1). Disconnect it in `disconnectedCallback`. Without this, `aria-expanded` and rail reflection won't update on live toggles (the live-toggle test above catches it).
- [ ] **Step 4:** Header styles: toggle button (40px, hover wash), brand text. Run → PASS.
- [ ] **Step 5: Commit**
```bash
git add packages/shell/src/sidenav/ packages/shell/src/_internal/
git commit -m "feat(shell): built-in sidenav toggle + brand with slot override + aria-expanded"
```

### Task 3.2: rail header collapse (B1) (TDD)

- [ ] **Step 1: Failing test:** in rail (`data-rail`), the brand text is hidden, the toggle remains:
```ts
  it("rail collapses header to the toggle button only (B1)", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav data-rail></tulpar-sidenav>`);
    const brand = el.shadowRoot!.querySelector(".brand") as HTMLElement;
    expect(getComputedStyle(brand).display).to.equal("none");
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")).to.exist;
  });
```
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** `header.styles.ts`: `:host([data-rail]) .brand { display: none; }` and center the toggle in rail.
- [ ] **Step 4:** Run → PASS. **Step 5:** Commit `fix(shell): rail header shows only the toggle (B1)`.

---

## Chunk 4: sidenav utility row (theme + config) + B2

### Task 4.1: utility props, theme toggle, config (TDD)

**Files:** Modify `parts/utility.ts`, `utility.styles.ts`, `tulpar-sidenav.ts`, test

- [ ] **Step 1: Failing tests:**
```ts
  it("renders mode-selection by default and emits tulpar-theme-toggle", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    const btn = el.shadowRoot!.querySelector(".util-theme") as HTMLButtonElement;
    expect(btn).to.exist;
    setTimeout(() => btn.click());
    expect(await oneEvent(el, "tulpar-theme-toggle")).to.exist;
  });
  it("hides mode-selection when showModeSelection is false", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    el.showModeSelection = false; await el.updateComplete; // boolean prop set in JS (presence-as-true makes the attr form unreliable)
    expect(el.shadowRoot!.querySelector(".util-theme")).to.be.null;
  });
  it("renders config button with config-text when show-config", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    el.showConfig = true; el.configText = "Tweak"; await el.updateComplete;
    const c = el.shadowRoot!.querySelector(".util-config") as HTMLButtonElement;
    expect(c.textContent).to.contain("Tweak");
    setTimeout(() => c.click());
    expect(await oneEvent(el, "tulpar-config-click")).to.exist;
  });
```
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Add props to `tulpar-sidenav.ts`:
```ts
  @property({ type: Boolean, attribute: "show-mode-selection" }) showModeSelection = true;
  @property({ type: Boolean, attribute: "show-config" }) showConfig = false;
  @property({ attribute: "config-text" }) configText = "Configure";
  @property({ attribute: "theme-label" }) themeLabel = "Toggle color theme";
  @property({ attribute: "config-label" }) configLabel = "Open configurator";
```
Implement `renderUtility(host)`: render a `.utility` only if `showModeSelection || showConfig` (and no utility slot override). Theme button `.util-theme` (emits `tulpar-theme-toggle`), config button `.util-config` (emits `tulpar-config-click`). Theme icon = moon/sun swapped by `.dark` ancestor (two SVGs, CSS shows one). Keep `utility-start`/`utility-end` slot overrides (if slotted content present, render that instead of built-in cell).
- [ ] **Step 4:** Run → PASS. **Step 5:** Commit `feat(shell): built-in sidenav utility row (theme toggle + config)`.

### Task 4.2: rail utility icon-only (B2)

- [ ] **Step 1: Failing test:** rail hides the theme label text, config cell hidden:
```ts
  it("rail makes theme toggle icon-only and hides config (B2)", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav data-rail></tulpar-sidenav>`);
    el.showConfig = true; await el.updateComplete;
    const label = el.shadowRoot!.querySelector(".util-theme .util-text") as HTMLElement;
    expect(getComputedStyle(label).display).to.equal("none");
    expect(getComputedStyle(el.shadowRoot!.querySelector(".util-config") as HTMLElement).display).to.equal("none");
  });
```
- [ ] **Step 2:** Run → FAIL. **Step 3:** `utility.styles.ts`: `:host([data-rail]) .util-text{display:none}` and `:host([data-rail]) .util-config{display:none}`; center the theme icon; grid → single column in rail. **Step 4:** PASS. **Step 5:** Commit `fix(shell): rail utility is theme-icon-only (B2)`.

---

## Chunk 5: sidenav account block

### Task 5.1: account props, avatar/initials/image, settings/logout (TDD)

**Files:** Modify `parts/account.ts`, `account.styles.ts`, `tulpar-sidenav.ts`, test

- [ ] **Step 1: Failing tests:**
```ts
  it("shows account block by default with initials from user-name", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav user-name="Kaan Akcan" user-role="Owner"></tulpar-sidenav>`);
    expect(el.shadowRoot!.querySelector(".account")).to.exist;
    expect(el.shadowRoot!.querySelector(".account-avatar")!.textContent!.trim()).to.equal("KA");
    expect(el.shadowRoot!.querySelector(".account-name")!.textContent).to.contain("Kaan Akcan");
    expect(el.shadowRoot!.querySelector(".account-role")!.textContent).to.contain("Owner");
  });
  it("uses profile image when provided", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav user-name="Kaan" profile-image="/a.png"></tulpar-sidenav>`);
    expect(el.shadowRoot!.querySelector("img.account-avatar-img")).to.exist;
  });
  it("hides the whole block when show-account-block=false", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav user-name="Kaan"></tulpar-sidenav>`);
    el.showAccountBlock = false; await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".account")).to.be.null;
  });
  it("logout shows by default and emits tulpar-logout; settings opt-in emits tulpar-settings-click", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav user-name="Kaan"></tulpar-sidenav>`);
    el.showSettings = true; await el.updateComplete;
    const logout = el.shadowRoot!.querySelector(".account-logout") as HTMLButtonElement;
    setTimeout(() => logout.click());
    expect(await oneEvent(el, "tulpar-logout")).to.exist;
    const settings = el.shadowRoot!.querySelector(".account-settings") as HTMLButtonElement;
    setTimeout(() => settings.click());
    expect(await oneEvent(el, "tulpar-settings-click")).to.exist;
  });
```
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Add props:
```ts
  @property({ type: Boolean, attribute: "show-account-block" }) showAccountBlock = true;
  @property({ attribute: "user-name" }) userName?: string;
  @property({ attribute: "user-role" }) userRole?: string;
  @property({ attribute: "profile-image" }) profileImage?: string;
  @property({ type: Boolean, attribute: "show-settings" }) showSettings = false;
  @property({ type: Boolean, attribute: "show-logout" }) showLogout = true;
  @property({ attribute: "settings-label" }) settingsLabel = "Settings";
  @property({ attribute: "logout-label" }) logoutLabel = "Log out";
```
Implement `renderAccount(host)` using `initials(host.userName)`; render `.account` only if `showAccountBlock` and no footer-slot override. Avatar = `<img class="account-avatar-img">` if `profileImage` else `<span class="account-avatar">${initials}</span>`. Name line only if `userName`; role line only if `userRole`. Right side: settings (`.account-settings`, if `showSettings`, default gear icon via `slot="settings-icon"` fallback) + logout (`.account-logout`, if `showLogout`, default log-out icon via `slot="logout-icon"`). Buttons emit `tulpar-settings-click` / `tulpar-logout`. Keep `slot="footer"` as full override.
- [ ] **Step 4:** Run → PASS. **Step 5:** Commit `feat(shell): built-in sidenav account block (avatar/initials/image + settings/logout events)`.

### Task 5.2: rail account = avatar only

- [ ] **Step 1: Failing test:** rail hides name/role/settings/logout, keeps avatar centered. **Step 2:** FAIL. **Step 3:** `account.styles.ts`: `:host([data-rail]) .account-meta, :host([data-rail]) .account-actions { display:none }`. **Step 4:** PASS. **Step 5:** Commit `fix(shell): rail account block shows avatar only`.

---

## Chunk 6: rail flyout escape (B3)

### Task 6.1: flyout escapes overflow-x:clip via fixed positioning

**Files:** Modify `packages/shell/src/nav-item/tulpar-nav-item.ts`, `tulpar-nav-item.styles.ts`, test

- [ ] **Step 1: Failing test** (rail flyout becomes visible / not clipped). Practical assertion: when rail + hovered/focused, the flyout element is `position: fixed` (escaping the clip):
```ts
  it("rail flyout uses fixed positioning to escape the clipped nav (B3)", async () => {
    const el = await fixture<TulparNavItem>(html`<tulpar-nav-item href="/x" label="Longish label"></tulpar-nav-item>`);
    el.setAttribute("data-rail", ""); // simulate rail context on the item
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector("a")!;
    a.dispatchEvent(new Event("pointerenter"));
    await el.updateComplete;
    const fly = el.shadowRoot!.querySelector(".flyout") as HTMLElement;
    expect(getComputedStyle(fly).position).to.equal("fixed");
  });
```
> **COMMITTED MECHANISM (resolves the rail-context fork):** stop using `:host-context([data-rail])`. Instead the **sidenav reflects `data-rail` onto each slotted `tulpar-nav-item` (and `tulpar-nav-section`)** via JS, so both CSS and the flyout JS key on `:host([data-rail])` — which the B3 test reproduces by setting `data-rail` on the item directly. This matches production exactly and removes the Chromium-only `:host-context` dependency.

- [ ] **Step 1a (sidenav side):** In `tulpar-sidenav.ts`, add a method `_reflectRail()` that sets/removes the `data-rail` attribute on every slotted `tulpar-nav-item` and `tulpar-nav-section` based on the sidenav's own `data-rail`. Call it in `updated()` (when `data-rail` changes — observe via the same MutationObserver used in Task 3.1) and on `slotchange`. Migrate the existing `:host-context([data-rail])` rules in `tulpar-nav-item.styles.ts` and `tulpar-nav-section.styles.ts` to `:host([data-rail])`. Add/keep a test that a slotted item gets `data-rail` when the sidenav is railed.
- [ ] **Step 2:** Run → FAIL (flyout not yet fixed-positioned).
- [ ] **Step 3:** In `tulpar-nav-item.ts`: on `pointerenter`/`focusin` of the anchor **when `this.hasAttribute("data-rail")`**, compute the item's `getBoundingClientRect()` and set the flyout's fixed `top`/`left` (respecting `position` left/right — read a reflected `data-sidenav-position` or default left); CSS `:host([data-rail]) .flyout { position: fixed; z-index: var(--tulpar-shell-z-aside, 300); }`. Hide/reposition on `pointerleave`/`focusout`/scroll/resize. Keep the existing tooltip content and `overflow-x: clip` on the nav (scrollbar fix stays).
- [ ] **Step 4:** Run → PASS. Also verify existing nav-item tests still pass.
- [ ] **Step 5: Commit** `fix(shell): rail flyout escapes clipped nav via fixed positioning (B3)`.

---

## Chunk 7: shell — layout, floating reopen, theme handling, state reflection

### Task 7.1: reflect data-collapsed / data-sidenav-open onto slotted sidenav

**Files:** Modify `packages/shell/src/shell/tulpar-shell.ts`, test

- [ ] **Step 1: Failing test:** when collapsed/open changes, the slotted sidenav gets `data-collapsed` / `data-sidenav-open`:
```ts
  it("reflects collapsed/open state onto the slotted sidenav", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell sidenav-mode="static"><div slot="sidenav"></div></tulpar-shell>`);
    el.sidenavCollapsed = true; await el.updateComplete;
    expect(el.querySelector('[slot="sidenav"]')!.hasAttribute("data-collapsed")).to.be.true;
  });
```
- [ ] **Step 2:** FAIL. **Step 3:** Extend the existing `_updateRailAttr` pattern: add `_updateStateAttrs()` reflecting `data-collapsed` (= `sidenavCollapsed && mode==='static'`) and `data-sidenav-open` (= `sidenavOpen`) onto the slotted sidenav; call it in `updated()` for `sidenavCollapsed`/`sidenavOpen`/`sidenavMode`. **Step 4:** PASS. **Step 5:** Commit `feat(shell): reflect collapsed/open state onto slotted sidenav`.

### Task 7.2: shell handles tulpar-theme-toggle

- [ ] **Step 1: Failing test:** dispatching `tulpar-theme-toggle` flips `dark`:
```ts
  it("flips dark when a tulpar-theme-toggle bubbles up", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell></tulpar-shell>`);
    const before = el.dark;
    el.dispatchEvent(new CustomEvent("tulpar-theme-toggle", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.dark).to.equal(!before);
  });
```
- [ ] **Step 2:** FAIL. **Step 3:** Add listener for `tulpar-theme-toggle` in connected/disconnectedCallback → `this.dark = !this.dark` (reuses existing `updated()` view-transition path). **Step 4:** PASS. **Step 5:** Commit `feat(shell): handle tulpar-theme-toggle (flip dark)`.

### Task 7.3: sidenav-layout under/over-topbar

**Files:** Modify `tulpar-shell.ts`, `tulpar-shell.styles.ts`, test

- [ ] **Step 1: Failing test:** `sidenav-layout="over-topbar"` changes grid areas so sidenav precedes topbar:
```ts
  it("over-topbar layout spans the sidenav full height", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell sidenav-layout="over-topbar"></tulpar-shell>`);
    expect(el.getAttribute("sidenav-layout")).to.equal("over-topbar");
    const areas = getComputedStyle(el).gridTemplateAreas;
    expect(areas.indexOf("sidenav")).to.be.lessThan(areas.indexOf("topbar"));
  });
```
- [ ] **Step 2:** FAIL. **Step 3:** Add `@property({ reflect:true, attribute:"sidenav-layout" }) sidenavLayout: "under-topbar" | "over-topbar" = "under-topbar";`. CSS `:host([sidenav-layout="over-topbar"]) { grid-template-areas: "sidenav topbar" "sidenav content" "sidenav footer"; grid-template-columns: var(--_sidenav-col,…) 1fr; }` (and footer spans content column — adjust areas: `"sidenav footer"` keeps footer beside sidenav; if full-width footer desired under-topbar only, keep current). Combine with `data-sidenav-position="right"` mirror. **Step 4:** PASS. **Step 5:** Commit `feat(shell): sidenav-layout under/over-topbar`.

### Task 7.4: floating reopen button (B4)

**Files:** Modify `tulpar-shell.ts`, `tulpar-shell.styles.ts`, test

- [ ] **Step 1: Failing tests:** floating button renders when (static collapsed) OR (overlay/mobile closed), NOT in rail/visible; clicking emits `tulpar-menu-toggle`:
```ts
  it("shows a floating reopen button when static+collapsed and emits toggle", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell sidenav-mode="static"></tulpar-shell>`);
    el.sidenavCollapsed = true; await el.updateComplete;
    const fab = el.shadowRoot!.querySelector(".sidenav-fab") as HTMLButtonElement;
    expect(fab).to.exist;
    setTimeout(() => fab.click());
    expect(await oneEvent(el, "tulpar-menu-toggle")).to.exist;
  });
  it("no floating button in rail mode", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell sidenav-mode="rail"></tulpar-shell>`);
    el.sidenavCollapsed = true; await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".sidenav-fab")).to.be.null;
  });
```
- [ ] **Step 2:** FAIL. **Step 3:** In `render()`, compute `showFab = (mode==='static' && sidenavCollapsed) || ((isMobile||mode==='overlay') && !sidenavOpen)`; when true render a `<button class="sidenav-fab" @click=${this._onMenuToggle}>` with the shared `brandMark` (import from `_internal/brand-mark`), `aria-label="Open navigation"`. CSS: `position:absolute; top:.5rem; left:.5rem; z-index:<above aside>; ` with a slide/fade-in `@media (prefers-reduced-motion:no-preference)`; high z-index. **Step 4:** PASS. **Step 5:** Commit `feat(shell): floating reopen button when sidenav hidden (B4)`.

---

## Chunk 8: wrappers (Angular + Vue)

### Task 8.1: Angular — new inputs/outputs + icon-as-component

**Files:** Modify `packages/angular/src/**`, smoke tests

- [ ] **Step 1: Failing smoke test** asserting the sidenav wrapper exposes the new signal inputs (`showModeSelection`, `showConfig`, `configText`, `showAccountBlock`, `userName`, `userRole`, `profileImage`, `showSettings`, `showLogout`, label inputs) and outputs (`config`, `settings`, `logout`); and that an item with `icon` as a `Type` renders a component into `slot="icon"`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement with `input()`/`output()` (signals, no RxJS). Forward inputs as attributes; subscribe to the element's `tulpar-config-click`/`tulpar-settings-click`/`tulpar-logout` and re-emit via `output()`. For data-driven icons: extend the wrapper's item rendering so `icon: Type<unknown>` renders via `NgComponentOutlet` into a `<span slot="icon">`; `icon: string` passes to the element `icon` attribute. **Step 4:** PASS. **Step 5:** Commit `feat(angular): sidenav v2 inputs/outputs + icon-as-component`.

### Task 8.2: Vue — new props/emits + icon-as-component

**Files:** Modify `packages/vue/src/**`, smoke tests

- [ ] **Step 1: Failing smoke test** (props + emits + icon component → slot="icon"). **Step 2:** FAIL. **Step 3:** Implement: props mirroring the element; map element events to Vue `emits` (`config`,`settings`,`logout`); item `icon: string | Component` → `<component :is>` into `slot="icon"` or string attr. **Step 4:** PASS. **Step 5:** Commit `feat(vue): sidenav v2 props/emits + icon-as-component`.

### Task 8.3: build/test/lint gate

- [ ] `pnpm build && pnpm lint` clean; `pnpm --filter @tulpar-ui/{tokens,core,shell,angular,vue} test` green. Fix regressions. Commit if any fixes.

---

## Chunk 9: playgrounds — clean API rewrite

### Task 9.1: Angular playground to clean API

**Files:** Modify `apps/playground-ng/src/app/app.ts`

- [ ] **Step 1:** Replace the hand-built brand header, slotted-SVG menu, hand-built utility row + user block with: built-in brand defaults (or one `brand` override), a single `menu` array carrying `icon` lucide components, and the new props (`showModeSelection`, `showConfig`, `configText`, `showAccountBlock`, `userName`, `userRole`, `showSettings`, `showLogout`), wiring `(config)`/`(logout)`. Remove the now-unneeded theme button (shell handles `tulpar-theme-toggle`). Add `sidenavLayout` control to the aside.
- [ ] **Step 2: Verify** `pnpm --filter playground-ng build` + `pnpm --filter playground-ng test` pass; the file is markedly shorter. **Step 3:** Commit `refactor(playground-ng): use self-contained sidenav API`.

### Task 9.2: Vue playground to clean API

**Files:** Modify `apps/playground-vue/src/App.vue`

- [ ] **Step 1:** Mirror 9.1 in Vue (lucide-vue-next components in `menu`, new props, `@config`/`@logout`, `sidenav-layout` in aside). **Step 2:** `pnpm --filter playground-vue build` passes; file shorter. **Step 3:** Commit `refactor(playground-vue): use self-contained sidenav API`.

---

## Chunk 10: changeset + final gate

- [ ] **Step 1:** **Extend the existing `.changeset/v0-8-shell-sidebar-redesign.md` summary** (this work is on the same unmerged branch/PR) to also cover the self-contained sidenav API — do NOT add a second changeset re-bumping the same packages (avoids a confusing double-entry changelog). The package bump levels stay minor. Commit.
- [ ] **Step 2:** Final: `pnpm build && pnpm lint && pnpm format:check` green; package tests + `playground-ng` test green; `pnpm --filter docs build-storybook` ok (update the Shell story if the new API changed usage). Commit any fixes.
- [ ] **Step 3:** Manual pass: both playgrounds (light/dark, under/over, static/rail/overlay, left/right), floating button, rail flyout/header/utility/account, theme toggle, logout/config events.

---

## Notes for the implementer
- Parts are pure render fns; keep state/handlers on the orchestrator. Compose styles via `static styles = [...]`.
- Verify every fallback hex against `packages/tokens/src/primitive/color.ts`; default wordmark uses `currentColor`; brand mark greens are primitives.
- `_internal` is importable across folders within `@tulpar-ui/shell` only.
- Slot override precedence: a provided region slot (`header`/`utility-start`/`utility-end`/`footer`) replaces that built-in region.
- Commit after each passing step; wrapper tests are smoke-only.
