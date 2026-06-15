# @tulpar-ui/shell

Application shell (sidebar / topbar / nav) Web Components for Tulpar UI,
with Angular and Vue wrappers.

## Install

```bash
pnpm add @tulpar-ui/shell @tulpar-ui/tokens
```

## Usage

```ts
import "@tulpar-ui/tokens/css/tulpar.css"; // once, app entry
import "@tulpar-ui/shell";
```

```html
<tulpar-shell sidenav-mode="static">
  <tulpar-topbar slot="topbar" show-menu-button>…</tulpar-topbar>
  <tulpar-sidenav slot="sidenav">…</tulpar-sidenav>
  <main>content</main>
  <footer slot="footer">…</footer>
</tulpar-shell>
```

## Components

| Element           | Description                          |
| ----------------- | ------------------------------------ |
| `tulpar-shell`    | CSS Grid layout host (sidenav modes) |
| `tulpar-topbar`   | Top app bar with menu button         |
| `tulpar-sidenav`  | Side navigation container            |
| `tulpar-nav-item` | Navigation entry                     |

Also exports the `persistShellState` util for opt-in localStorage
persistence of shell open/collapsed state.

## Framework wrappers

Angular (`@tulpar-ui/angular`) ships `<tulpar-shell-ng>` etc. and Vue
(`@tulpar-ui/vue`) ships `<TulparShell>` etc., both with router bridges
and persistence.

Angular boolean inputs use bracket binding, e.g.
`[showMenuButton]="true"` — not a bare attribute. Vue uses the bare
`show-menu-button` form.

Full docs: https://github.com/KaanAkcan1/tulpar-ui#readme
