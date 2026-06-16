<p align="center">
  <a href="https://github.com/KaanAkcan1/tulpar-ui">
    <img src="https://raw.githubusercontent.com/KaanAkcan1/tulpar-ui/main/assets/brand/svg/tulpar-ui-icon.svg" width="56" alt="Tulpar UI" />
  </a>
</p>

# Tulpar UI — Vue Playground

Live demo app for the `@tulpar-ui/vue` SFC wrappers. Dogfoods the app shell
(`TulparShell`, `TulparTopbar`, `TulparSidenav`) and the Button / input family
inside a real Vue 3 + Vite host.

**Live:** https://tulpar-ui-vue.pages.dev

## Run locally

From the repo root (recommended — full watch loop, rebuilds packages on change):

```bash
pnpm dev:vue       # tokens + core + vue wrappers + this app → localhost:5273
```

Or run just this app against the last built `dist`:

```bash
pnpm --filter playground-vue dev    # localhost:5273
```

> Vite must treat `tulpar-` elements as custom elements:
>
> ```ts
> vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("tulpar-") } } })
> ```

See the root [README](../../README.md) and [CLAUDE.md](../../CLAUDE.md) for the
full workspace setup.
