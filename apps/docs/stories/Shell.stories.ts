import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";
import type { TulparNavItemData } from "@tulpar-ui/shell";
import "@tulpar-ui/shell";

// ─── Brand mark (inline SVG so the story needs no asset pipeline) ──────────────
const brandMark = svg`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" fill="currentColor" opacity="0.18" />
  <path d="m12 6-6 3.3v5.4L12 18l6-3.3V9.3L12 6Z" fill="currentColor" />
</svg>`;

// ─── Outline icon set for the sectioned menu ──────────────────────────────────
const icon = (inner: unknown) =>
  html`<svg
    slot="icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${inner}
  </svg>`;

const iGrid = svg`<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>`;
const iUsers = svg`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`;
const iChart = svg`<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`;
const iBox = svg`<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`;
const iBell = svg`<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`;
const iSettings = svg`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>`;
const iHelp = svg`<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`;

// ─── Demo menu data ───────────────────────────────────────────────────────────
// Nested group ("Human Resources"), a badge ("3" on Leave), and `iconClass`.
// Tulpar ships no icon font, so `iconClass` points at a story-local class that
// renders a small colored dot (see the <style> block injected by `iconStyles`).
const demoItems: TulparNavItemData[] = [
  { label: "Dashboard", href: "/", iconClass: "demo-icon demo-icon--blue" },
  {
    label: "Human Resources",
    iconClass: "demo-icon demo-icon--violet",
    items: [
      { label: "Staff", href: "/hr/staff" },
      { label: "Leave", href: "/hr/leave", badge: "3" },
    ],
  },
  { label: "Reports", href: "/reports", iconClass: "demo-icon demo-icon--amber" },
  { label: "Settings", href: "/settings", iconClass: "demo-icon demo-icon--slate" },
];

// Icon-dot styles. Injected once per story render — `iconClass` renders an
// <i class="..."> inside the nav item, so these classes pierce the light DOM
// (the <i> lives in the host's light DOM, styled by a global <style>).
const iconStyles = html`
  <style>
    .demo-icon {
      display: inline-block;
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 999px;
      background: currentColor;
    }
    .demo-icon--blue {
      color: #00c57a;
    }
    .demo-icon--violet {
      color: #7c3aed;
    }
    .demo-icon--amber {
      color: #d97706;
    }
    .demo-icon--slate {
      color: #64748b;
    }
  </style>
`;

const contentBlock = html`
  <h1 style="margin:0 0 0.75rem; font-size:1.5rem;">Dashboard</h1>
  <p style="margin:0 0 1rem; max-width:48ch; line-height:1.6;">
    This is the main content region of <code>tulpar-shell</code>. Resize the docs
    frame below the mobile breakpoint to see the sidenav collapse into an overlay
    with a backdrop. Use the controls panel to switch sidenav mode, content
    padding and content width.
  </p>
  <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:0.75rem;">
    ${[1, 2, 3, 4].map(
      (n) => html`<div
        style="border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:8px; padding:1rem; background:var(--tulpar-color-bg-raised,#fff);"
      >
        Card ${n}
      </div>`,
    )}
  </div>
`;

const meta: Meta = {
  title: "Shell/TulparShell",
  component: "tulpar-shell",
  tags: ["autodocs"],
  argTypes: {
    "sidenav-mode": {
      control: "select",
      options: ["static", "overlay", "rail"],
    },
    "content-padding": {
      control: "select",
      options: ["none", "compact", "comfortable"],
    },
    "content-width": {
      control: "select",
      options: ["fluid", "fixed"],
    },
    "aside-open": { control: "boolean" },
  },
  args: {
    "sidenav-mode": "static",
    "content-padding": "comfortable",
    "content-width": "fluid",
    "aside-open": false,
  },
  render: (args) => html`
    ${iconStyles}
    <tulpar-shell
      sidenav-mode=${args["sidenav-mode"]}
      content-padding=${args["content-padding"]}
      content-width=${args["content-width"]}
      ?aside-open=${args["aside-open"]}
      style="height: 480px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:10px; overflow:hidden;"
    >
      <tulpar-topbar slot="topbar" show-menu-button>
        <strong slot="start" style="font-size:1.05rem;">Tulpar</strong>
        <button
          slot="end"
          style="border:1px solid var(--tulpar-color-border-default,#d9e0df); background:transparent; color:inherit; border-radius:6px; padding:0.35rem 0.75rem; cursor:pointer;"
        >
          Action
        </button>
      </tulpar-topbar>
      <tulpar-sidenav slot="sidenav" .items=${demoItems}></tulpar-sidenav>
      ${contentBlock}
      <footer
        slot="footer"
        style="padding:0.5rem 1rem; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Tulpar UI · v0.6
      </footer>
    </tulpar-shell>
  `,
};
export default meta;

type Story = StoryObj;

// ─── 1. Static ────────────────────────────────────────────────────────────────
// Default desktop layout: sidenav is always visible alongside the content.
export const Static: Story = {};

// ─── 2. Overlay ───────────────────────────────────────────────────────────────
// Sidenav is hidden until the menu button is toggled, then floats over the
// content with a backdrop. Click the hamburger in the topbar to open it.
export const Overlay: Story = {
  args: { "sidenav-mode": "overlay" },
};

// ─── 3. Rail ──────────────────────────────────────────────────────────────────
// Compact icon-only rail; labels/badges surface as flyout tooltips on hover.
export const Rail: Story = {
  args: { "sidenav-mode": "rail" },
};

// ─── 4. SlottedNavItems ───────────────────────────────────────────────────────
// Same shell, but the sidenav is populated with explicit <tulpar-nav-item>
// elements (light-DOM composition) instead of the `.items` JSON property.
// Shows nesting (Human Resources → Staff / Leave) and a badge.
export const SlottedNavItems: Story = {
  render: (args) => html`
    ${iconStyles}
    <tulpar-shell
      sidenav-mode=${args["sidenav-mode"]}
      content-padding=${args["content-padding"]}
      content-width=${args["content-width"]}
      style="height: 480px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:10px; overflow:hidden;"
    >
      <tulpar-topbar slot="topbar" show-menu-button>
        <strong slot="start" style="font-size:1.05rem;">Tulpar</strong>
      </tulpar-topbar>
      <tulpar-sidenav slot="sidenav">
        <tulpar-nav-item href="/" label="Dashboard" icon-class="demo-icon demo-icon--blue"></tulpar-nav-item>
        <tulpar-nav-item label="Human Resources" icon-class="demo-icon demo-icon--violet">
          <tulpar-nav-item href="/hr/staff" label="Staff"></tulpar-nav-item>
          <tulpar-nav-item href="/hr/leave" label="Leave" badge="3"></tulpar-nav-item>
        </tulpar-nav-item>
        <tulpar-nav-item href="/settings" label="Settings" icon-class="demo-icon demo-icon--slate"></tulpar-nav-item>
      </tulpar-sidenav>
      ${contentBlock}
      <footer
        slot="footer"
        style="padding:0.5rem 1rem; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Tulpar UI · v0.6
      </footer>
    </tulpar-shell>
  `,
};

// ─── 5. WithAside ─────────────────────────────────────────────────────────────
// `aside-open` reveals a secondary panel (e.g. a configurator / inspector) on
// the trailing edge of the content area.
export const WithAside: Story = {
  args: { "aside-open": true },
  render: (args) => html`
    ${iconStyles}
    <tulpar-shell
      sidenav-mode=${args["sidenav-mode"]}
      content-padding=${args["content-padding"]}
      content-width=${args["content-width"]}
      ?aside-open=${args["aside-open"]}
      style="height: 480px; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:10px; overflow:hidden;"
    >
      <tulpar-topbar slot="topbar" show-menu-button>
        <strong slot="start" style="font-size:1.05rem;">Tulpar</strong>
        <button
          slot="end"
          style="border:1px solid var(--tulpar-color-border-default,#d9e0df); background:transparent; color:inherit; border-radius:6px; padding:0.35rem 0.75rem; cursor:pointer;"
        >
          Toggle panel
        </button>
      </tulpar-topbar>
      <tulpar-sidenav slot="sidenav" .items=${demoItems}></tulpar-sidenav>
      ${contentBlock}
      <aside
        slot="aside"
        style="padding:1rem; width:240px; border-left:1px solid var(--tulpar-color-border-default,#d9e0df); height:100%; box-sizing:border-box;"
      >
        <h2 style="margin:0 0 0.75rem; font-size:1rem;">Configurator</h2>
        <p style="margin:0; font-size:0.85rem; line-height:1.6; color:var(--tulpar-color-text-secondary,#74777a);">
          Placeholder panel mounted in the <code>aside</code> slot. Real apps drop
          a settings form or inspector here.
        </p>
      </aside>
      <footer
        slot="footer"
        style="padding:0.5rem 1rem; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Tulpar UI · v0.6
      </footer>
    </tulpar-shell>
  `,
};

// ─── Flagship app-shell sidebar (sections + lit-pill + utility row + footer) ───
// Reused by AppShell, AppShellRail, AppShellRight and AppShellDark below.
const sectionedSidenav = (position: "left" | "right" = "left") => html`
  <tulpar-sidenav slot="sidenav" position=${position} single-expand>
    <!-- Brand header -->
    <div slot="header" style="display:flex; align-items:center; gap:0.6rem; font-weight:700; letter-spacing:-0.01em;">
      <span style="color:var(--tulpar-color-brand-default,#00c57a); display:inline-flex;">${brandMark}</span>
      <span style="font-size:1.05rem;">Tulpar</span>
    </div>
    <button
      slot="header-actions"
      aria-label="Collapse sidebar"
      style="border:none; background:transparent; color:inherit; cursor:pointer; opacity:0.6; padding:0.25rem; border-radius:6px;"
    >
      «
    </button>

    <!-- Quick search -->
    <input
      slot="search"
      type="search"
      placeholder="Search…  ⌘K"
      style="width:100%; box-sizing:border-box; padding:0.5rem 0.75rem; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:8px; background:var(--tulpar-color-bg-surface,#f6f8f8); color:inherit; font-size:0.85rem;"
    />

    <!-- Sectioned navigation with the lit-pill active state -->
    <tulpar-nav-section label="Overview">
      <tulpar-nav-item href="/" label="Dashboard" .active=${true} kbd="D">${icon(iGrid)}</tulpar-nav-item>
      <tulpar-nav-item href="/analytics" label="Analytics" count="12">${icon(iChart)}</tulpar-nav-item>
    </tulpar-nav-section>

    <tulpar-nav-section label="Manage">
      <tulpar-nav-item label="Team">
        ${icon(iUsers)}
        <tulpar-nav-item href="/team/members" label="Members"></tulpar-nav-item>
        <tulpar-nav-item href="/team/roles" label="Roles"></tulpar-nav-item>
        <tulpar-nav-item href="/team/invites" label="Invitations" badge="3"></tulpar-nav-item>
      </tulpar-nav-item>
      <tulpar-nav-item href="/inventory" label="Inventory" dot dot-label="Sync issue">${icon(iBox)}</tulpar-nav-item>
      <tulpar-nav-item href="/notifications" label="Notifications" count="5">${icon(iBell)}</tulpar-nav-item>
    </tulpar-nav-section>

    <tulpar-nav-section label="System">
      <tulpar-nav-item href="/settings" label="Settings">${icon(iSettings)}</tulpar-nav-item>
      <tulpar-nav-item href="https://example.com" target="_blank" label="Help center">${icon(iHelp)}</tulpar-nav-item>
    </tulpar-nav-section>

    <!-- Utility row: split start/end actions above the footer -->
    <button slot="utility-start" style="display:flex; align-items:center; gap:0.5rem; border:none; background:transparent; color:inherit; cursor:pointer; font-size:0.85rem; padding:0.4rem 0.5rem; border-radius:6px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
      Theme
    </button>
    <span slot="utility-end" style="font-size:0.7rem; font-weight:600; padding:0.2rem 0.5rem; border-radius:999px; background:var(--tulpar-color-brand-subtle,#dcfce8); color:var(--tulpar-color-brand-default,#00855a);">
      Pro
    </span>

    <!-- User footer -->
    <div slot="footer" style="display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.875rem; border-top:1px solid var(--tulpar-color-border-default,#d9e0df);">
      <span style="width:32px; height:32px; border-radius:999px; background:var(--tulpar-color-brand-default,#00c57a); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:600; font-size:0.85rem;">KA</span>
      <span style="display:flex; flex-direction:column; line-height:1.2; min-width:0;">
        <strong style="font-size:0.85rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Kaan Akcan</strong>
        <span style="font-size:0.75rem; color:var(--tulpar-color-text-secondary,#74777a); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">kaan@tulpar.dev</span>
      </span>
    </div>
  </tulpar-sidenav>
`;

const flagshipShell = (opts: {
  position?: "left" | "right";
  mode?: "static" | "overlay" | "rail";
  dark?: boolean;
}) => html`
  ${iconStyles}
  <div class=${opts.dark ? "dark" : ""} style="height:560px;">
    <tulpar-shell
      sidenav-mode=${opts.mode ?? "static"}
      content-padding="comfortable"
      content-width="fluid"
      style="height:100%; border:1px solid var(--tulpar-color-border-default,#d9e0df); border-radius:12px; overflow:hidden; ${opts.dark
        ? "background:var(--tulpar-color-bg-canvas,#0b1110); color:var(--tulpar-color-text-primary,#e7eceb);"
        : ""}"
    >
      <tulpar-topbar slot="topbar" show-menu-button>
        <strong slot="start" style="font-size:1.05rem; display:flex; align-items:center; gap:0.5rem;">
          <span style="color:var(--tulpar-color-brand-default,#00c57a); display:inline-flex;">${brandMark}</span>
          Console
        </strong>
        <button
          slot="end"
          aria-label="Notifications"
          style="border:1px solid var(--tulpar-color-border-default,#d9e0df); background:transparent; color:inherit; border-radius:8px; padding:0.4rem 0.55rem; cursor:pointer;"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
      </tulpar-topbar>
      ${sectionedSidenav(opts.position ?? "left")}
      ${contentBlock}
      <footer
        slot="footer"
        style="padding:0.5rem 1rem; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#74777a);"
      >
        Tulpar UI · v0.8 · App shell
      </footer>
    </tulpar-shell>
  </div>
`;

// ─── 6. AppShell (flagship) ────────────────────────────────────────────────────
// The complete redesigned sidebar: brand header + collapse action, quick search,
// three labelled `tulpar-nav-section` groups with outline icons, the lit-pill
// active state on "Dashboard", a nested single-expand group ("Team"), count and
// dot indicators, a split utility row (theme toggle + Pro badge) and a user
// footer. This is the reference composition for product app shells.
export const AppShell: Story = {
  parameters: { controls: { disable: true } },
  render: () => flagshipShell({}),
};

// ─── 7. AppShellRail ───────────────────────────────────────────────────────────
// Same sidebar in rail mode — collapses to an icon rail; labels/badges surface
// as flyout tooltips on hover. Verifies the rail overflow fix with sections.
export const AppShellRail: Story = {
  parameters: { controls: { disable: true } },
  render: () => flagshipShell({ mode: "rail" }),
};

// ─── 8. AppShellRight ──────────────────────────────────────────────────────────
// `position="right"` mirrors the sidenav edge shadow to the trailing side — for
// RTL-leaning layouts or inspector-first products.
export const AppShellRight: Story = {
  parameters: { controls: { disable: true } },
  render: () => flagshipShell({ position: "right" }),
};

// ─── 9. AppShellDark ───────────────────────────────────────────────────────────
// The flagship shell under the `.dark` class — the lit-pill active state, section
// labels and utility row all adapt to dark tokens.
export const AppShellDark: Story = {
  parameters: { controls: { disable: true }, backgrounds: { default: "dark" } },
  render: () => flagshipShell({ dark: true }),
};
