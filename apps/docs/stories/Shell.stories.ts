import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { TulparNavItemData } from "@tulpar-ui/shell";
import "@tulpar-ui/shell";

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
      color: #2563eb;
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
        style="border:1px solid var(--tulpar-color-border-default,#e7e5e4); border-radius:8px; padding:1rem; background:var(--tulpar-color-bg-raised,#fff);"
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
      style="height: 480px; border:1px solid var(--tulpar-color-border-default,#e7e5e4); border-radius:10px; overflow:hidden;"
    >
      <tulpar-topbar slot="topbar" show-menu-button>
        <strong slot="start" style="font-size:1.05rem;">Tulpar</strong>
        <button
          slot="end"
          style="border:1px solid var(--tulpar-color-border-default,#e7e5e4); background:transparent; color:inherit; border-radius:6px; padding:0.35rem 0.75rem; cursor:pointer;"
        >
          Action
        </button>
      </tulpar-topbar>
      <tulpar-sidenav slot="sidenav" .items=${demoItems}></tulpar-sidenav>
      ${contentBlock}
      <footer
        slot="footer"
        style="padding:0.5rem 1rem; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#78716c);"
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
      style="height: 480px; border:1px solid var(--tulpar-color-border-default,#e7e5e4); border-radius:10px; overflow:hidden;"
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
        style="padding:0.5rem 1rem; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#78716c);"
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
      style="height: 480px; border:1px solid var(--tulpar-color-border-default,#e7e5e4); border-radius:10px; overflow:hidden;"
    >
      <tulpar-topbar slot="topbar" show-menu-button>
        <strong slot="start" style="font-size:1.05rem;">Tulpar</strong>
        <button
          slot="end"
          style="border:1px solid var(--tulpar-color-border-default,#e7e5e4); background:transparent; color:inherit; border-radius:6px; padding:0.35rem 0.75rem; cursor:pointer;"
        >
          Toggle panel
        </button>
      </tulpar-topbar>
      <tulpar-sidenav slot="sidenav" .items=${demoItems}></tulpar-sidenav>
      ${contentBlock}
      <aside
        slot="aside"
        style="padding:1rem; width:240px; border-left:1px solid var(--tulpar-color-border-default,#e7e5e4); height:100%; box-sizing:border-box;"
      >
        <h2 style="margin:0 0 0.75rem; font-size:1rem;">Configurator</h2>
        <p style="margin:0; font-size:0.85rem; line-height:1.6; color:var(--tulpar-color-text-secondary,#78716c);">
          Placeholder panel mounted in the <code>aside</code> slot. Real apps drop
          a settings form or inspector here.
        </p>
      </aside>
      <footer
        slot="footer"
        style="padding:0.5rem 1rem; font-size:0.85rem; color:var(--tulpar-color-text-secondary,#78716c);"
      >
        Tulpar UI · v0.6
      </footer>
    </tulpar-shell>
  `,
};
