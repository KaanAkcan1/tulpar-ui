<p align="center">
  <a href="https://github.com/KaanAkcan1/tulpar-ui">
    <img src="https://raw.githubusercontent.com/KaanAkcan1/tulpar-ui/main/assets/brand/svg/tulpar-ui-icon.svg" width="56" alt="Tulpar UI" />
  </a>
</p>

# @tulpar-ui/core

Lit-based Web Components for Tulpar UI — the source of truth for
behavior and rendering. Framework wrappers: `@tulpar-ui/angular`,
`@tulpar-ui/vue`.

## Install

```bash
pnpm add @tulpar-ui/core @tulpar-ui/tokens
```

## Usage

```ts
import "@tulpar-ui/tokens/css/tulpar.css"; // once, app entry
import "@tulpar-ui/core/button";
```

```html
<tulpar-button severity="primary">Save</tulpar-button>
```

### Input family

```ts
import "@tulpar-ui/core/text-input";
import "@tulpar-ui/core/number-input";
import "@tulpar-ui/core/textarea";
```

```html
<tulpar-text-input label="Name" placeholder="Enter name"></tulpar-text-input>
<tulpar-number-input label="Age"></tulpar-number-input>
<tulpar-textarea label="Bio"></tulpar-textarea>
```

### Overlay family

```ts
import "@tulpar-ui/core/tooltip";
import "@tulpar-ui/core/toggletip";
import "@tulpar-ui/core/popover";
```

**Composition is by id, never by wrapping.** The overlay and its trigger
are separate nodes; the overlay references the trigger with `for="id"`
(the `<label for>` model) and self-wires listeners + ARIA onto it. Nothing
is ever placed _inside_ the overlay except its own content.

```html
<!-- tooltip: brief text, hover/focus, no tone -->
<button id="saveBtn">Save</button>
<tulpar-tooltip for="saveBtn" text="Saves the current draft"></tulpar-tooltip>

<!-- toggletip: click, touch-safe, brief content, carries a tone -->
<button id="infoBtn" aria-label="More information">ⓘ</button>
<tulpar-toggletip for="infoBtn" tone="info" text="Optional billing field"></tulpar-toggletip>

<!-- popover: click, rich/interactive content lives inside, carries a tone -->
<button id="acctBtn">Account</button>
<tulpar-popover for="acctBtn" placement="bottom-start" label="Account">
  <form><!-- inputs, Save / Cancel --></form>
</tulpar-popover>
```

In apps, prefer the framework directive on the trigger — it drives the same
core overlay without you hand-managing ids:

```html
<!-- Angular -->
<button tulparTooltip="Saves the current draft">Save</button>
<!-- Vue -->
<button v-tulpar-tooltip="'Saves the current draft'">Save</button>
```

**Which one?**

- **Tooltip** — brief, supplementary text (≤~80 chars) on hover/focus. Not
  interactive, never load-bearing info; it is touch-dead and **degrades to a
  toggletip on touch**. Has no `tone` (the inverted chip is its identity).
- **Toggletip** — the touch-safe, click-triggered counterpart: a real button
  opens a brief bubble announced via a live region. Use for "ⓘ" info affordances.
- **Popover** — non-modal dialog for rich / interactive content (forms, menus,
  lists). Focus moves in on open, Tab flows naturally (no trap), light-dismiss.

**`tone`** (toggletip + popover only) = `neutral | info | success | warning |
danger`, mapped to conventional status hues (info = blue, success = green,
warning = amber, danger = red). A toned overlay **should** carry the matching
status icon — color is never the sole carrier (WCAG 1.4.1). `tone` is
visual-only and is a no-op under forced colors.

## Subpath exports

| Subpath                        | Element registered      |
| ------------------------------ | ----------------------- |
| `@tulpar-ui/core/button`       | `<tulpar-button>`       |
| `@tulpar-ui/core/button-group` | `<tulpar-button-group>` |
| `@tulpar-ui/core/text-input`   | `<tulpar-text-input>`   |
| `@tulpar-ui/core/number-input` | `<tulpar-number-input>` |
| `@tulpar-ui/core/textarea`     | `<tulpar-textarea>`     |
| `@tulpar-ui/core/tooltip`      | `<tulpar-tooltip>`      |
| `@tulpar-ui/core/toggletip`    | `<tulpar-toggletip>`    |
| `@tulpar-ui/core/popover`      | `<tulpar-popover>`      |

Full docs: https://github.com/KaanAkcan1/tulpar-ui#readme
