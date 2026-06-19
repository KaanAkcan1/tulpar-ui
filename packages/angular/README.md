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

### Overlay family

Overlays attach to a trigger via a **directive on the trigger** — nothing
wraps the trigger. The directive drives a core overlay (`for` = the host
element), so "a tooltip on a button" never inverts into "a button inside a
tooltip".

```ts
import {
  TulparTooltipDirective,
  TulparToggletipDirective,
  TulparPopoverDirective,
} from "@tulpar-ui/angular";
```

```html
<!-- inline: the directive carries the config -->
<button tulparTooltip="Kaydet" tooltipPlacement="top">Save</button>
<button tulparToggletip="Optional billing field" toggletipTone="info" aria-label="Info">ⓘ</button>

<!-- reference-by-id: declare a rich overlay once, reference it from triggers -->
<tulpar-popover-ng id="acctMenu" placement="bottom-start" label="Account">
  <form><!-- inputs, Save / Cancel --></form>
</tulpar-popover-ng>
<button tulparPopoverRef="acctMenu">Account</button>
```

`open` is a signal input with an `openChange` output. `tone`
(`neutral | info | success | warning | danger`) applies to toggletip and
popover (conventional status hues: info = blue, success = green, warning =
amber, danger = red); pair it with the matching status icon — color is never
the sole carrier. Tooltips have no tone and **degrade to a toggletip on
touch**, so never put load-bearing info in one.

## Requirements

- Angular 22+
- Signals-based component inputs (`input()`, `output()`) — no `@Input`/`@Output`

Full docs: https://github.com/KaanAkcan1/tulpar-ui#readme
