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

## Subpath exports

| Subpath                        | Element registered      |
| ------------------------------ | ----------------------- |
| `@tulpar-ui/core/button`       | `<tulpar-button>`       |
| `@tulpar-ui/core/button-group` | `<tulpar-button-group>` |
| `@tulpar-ui/core/text-input`   | `<tulpar-text-input>`   |
| `@tulpar-ui/core/number-input` | `<tulpar-number-input>` |
| `@tulpar-ui/core/textarea`     | `<tulpar-textarea>`     |

Full docs: https://github.com/KaanAkcan1/tulpar-ui#readme
