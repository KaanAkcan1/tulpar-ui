---
"@tulpar-ui/core": patch
---

Fix: `link` variant button rendered as an invisible-text dark pill on hover/active.

The default-solid hover/active rules used an unscoped `:host .btn:hover`
descendant selector, which matched every variant. For outlined/tonal/ghost
the leak was masked by their own `--_btn-bg` overrides, but the link
variant only set `--_btn-fg` on hover, so the leaked brand color
resolved into BOTH `--_btn-bg` and `--_btn-fg` — same color, invisible
label, dark pill sized to the (now hidden) text by `padding: 0; height: auto`.

Scoped the rules to `:host(:not([variant]))` + `:host([variant="solid"])`,
mirroring the base block, so no other variant inherits a solid hover bg.
