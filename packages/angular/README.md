<p align="center">
  <a href="https://github.com/KaanAkcan1/tulpar-ui">
    <img src="https://raw.githubusercontent.com/KaanAkcan1/tulpar-ui/main/assets/brand/svg/tulpar-ui-icon.svg" width="56" alt="Tulpar UI" />
  </a>
</p>

# @tulpar-ui/angular

Signal-based Angular wrappers for Tulpar UI Web Components.

The wrapper selector convention appends `-ng` to avoid recursion with
the underlying Web Component — e.g. `<tulpar-button-ng>` wraps
`<tulpar-button>`. Hosts use `display: contents` so they are invisible
to layout; size and spacing applied to `tulpar-button-ng` will not take
effect — target `<tulpar-button>` directly.

## Install

```bash
pnpm add @tulpar-ui/angular @tulpar-ui/tokens
```

Add the tokens CSS to the `styles` array in `angular.json`:

```json
"node_modules/@tulpar-ui/tokens/dist/css/tulpar.css"
```

## Usage

```ts
import { TulparButtonComponent } from "@tulpar-ui/angular";

@Component({
  imports: [TulparButtonComponent],
  template: `<tulpar-button-ng severity="primary">Save</tulpar-button-ng>`,
})
export class MyComponent {}
```

### Input family

```ts
import {
  TulparTextInputComponent,
  TulparNumberInputComponent,
  TulparTextareaComponent,
} from "@tulpar-ui/angular";
```

## Requirements

- Angular 22+
- Signals-based component inputs (`input()`, `output()`) — no `@Input`/`@Output`

Full docs: https://github.com/KaanAkcan1/tulpar-ui#readme
