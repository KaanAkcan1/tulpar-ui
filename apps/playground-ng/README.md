<p align="center">
  <a href="https://github.com/KaanAkcan1/tulpar-ui">
    <img src="https://raw.githubusercontent.com/KaanAkcan1/tulpar-ui/main/assets/brand/svg/tulpar-ui-icon.svg" width="56" alt="Tulpar UI" />
  </a>
</p>

# Tulpar UI — Angular Playground

Live demo app for the `@tulpar-ui/angular` signal-based wrappers. Dogfoods the
app shell (`tulpar-shell-ng`, `tulpar-topbar-ng`, `tulpar-sidenav-ng`) and the
Button / input family inside a real Angular host.

**Live:** https://tulpar-ui-ng.pages.dev

## Run locally

From the repo root (recommended — full watch loop, rebuilds packages on change):

```bash
pnpm dev:ng        # tokens + core + angular wrappers + this app → localhost:4310
```

Or run just this app against the last built `dist`:

```bash
pnpm --filter playground-ng start   # localhost:4310
```

See the root [README](../../README.md) and [CLAUDE.md](../../CLAUDE.md) for the
full workspace setup.
