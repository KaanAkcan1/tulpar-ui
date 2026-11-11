---
name: Tulpar UI
description: Framework-agnostic design system — Theme 1 "Tulpar" (incumbent look of the playgrounds and Storybook)
colors:
  courier-jade: "#00c57a"
  courier-jade-deep: "#00a468"
  courier-jade-mist: "#deffea"
  night-jade: "#21d98d"
  frost-white: "#ffffff"
  morning-frost: "#f0f7f5"
  morning-frost-muted: "#e9f1ef"
  frost-border: "#d9e0df"
  frost-border-strong: "#c8d0ce"
  felt-black: "#15110b"
  felt-charcoal: "#27231d"
  stone-gray: "#74777a"
  night-steppe: "#202c43"
  night-steppe-raised: "#243553"
  night-steppe-muted: "#283d64"
  indigo-dusk: "#393b8b"
  sky-ink: "#1c6eb3"
  ember-red: "#b22128"
  pine-green: "#256b52"
  ochre: "#935f17"
  plum: "#602ea3"
  saffron: "#d7a40f"
  slate: "#4f5153"
typography:
  display:
    fontFamily: "Source Serif 4, Source Serif Pro, Georgia, serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.1
  headline:
    fontFamily: "Source Serif 4, Source Serif Pro, Georgia, serif"
    fontSize: "26px"
    fontWeight: 600
  body:
    fontFamily: "Source Sans 3, Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  body-lg:
    fontFamily: "Source Sans 3, Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Source Sans 3, Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.2
  mono:
    fontFamily: "JetBrains Mono, Fira Code, ui-monospace, SFMono-Regular, monospace"
    fontSize: "12px"
    fontWeight: 400
rounded:
  sm: "2px"
  md: "4px"
  input: "6px"
  button: "7px"
  nav-item: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
components:
  button-primary:
    backgroundColor: "{colors.courier-jade}"
    textColor: "{colors.felt-black}"
    rounded: "{rounded.button}"
    height: "40px"
    padding: "0 16px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.courier-jade-deep}"
    textColor: "{colors.felt-black}"
  button-secondary:
    backgroundColor: "{colors.indigo-dusk}"
    textColor: "{colors.morning-frost}"
    rounded: "{rounded.button}"
    height: "40px"
    padding: "0 16px"
  button-danger:
    backgroundColor: "{colors.ember-red}"
    textColor: "{colors.morning-frost}"
    rounded: "{rounded.button}"
    height: "40px"
    padding: "0 16px"
  input:
    backgroundColor: "{colors.frost-white}"
    textColor: "{colors.felt-black}"
    rounded: "{rounded.input}"
    height: "36px"
    padding: "6px 12px"
    typography: "{typography.body}"
  nav-item:
    textColor: "{colors.felt-charcoal}"
    rounded: "{rounded.nav-item}"
    height: "40px"
  nav-item-active:
    backgroundColor: "{colors.courier-jade-mist}"
    textColor: "{colors.felt-black}"
  tag-soft:
    backgroundColor: "{colors.courier-jade-mist}"
    textColor: "{colors.felt-black}"
    rounded: "{rounded.full}"
---

<!-- Source of truth for values: packages/tokens (CSS custom properties `--tulpar-*`). This file records Theme 1 "Tulpar" as implemented on 2026-11-11. Theme 2 "Tuğrul" (Connect-style page structure) will get its own section when phase 2 designs it. Known defects referenced below are from docs/reviews/2026-11-11-retrospective/. -->

# Design System: Tulpar UI

## Overview

**Creative North Star: "The Steppe Courier"**

Tulpar is the courier of the steppe: fast, dependable, and the same message no matter where it rides. The system carries one behaviour into every framework and every consuming product, so its look stays quiet and exact rather than loud. A screen built with Tulpar should feel calm and precise even when it is dense with forms, tables and navigation, because the people using it are working, not browsing.

Character comes from the Turkic-mythology palette and a single confident accent, Courier Jade, used sparingly on actions and current state. Surfaces are flat and separated by tone, not by shadow; elevation is reserved for things that open on top of the page. Every value is a token, so another brand or the Tuğrul page structure can change it without forking components.

**Key Characteristics:**

- Calm and precise components: thin strokes, moderate corners, restrained states.
- One accent (Courier Jade) for action and current state; intent colours only where they carry meaning.
- Flat surfaces with tonal layering; shadows only on overlays.
- Serif display headings over a humanist sans UI.
- Both light ("Morning Frost") and dark ("Night Steppe") modes designed together.

## Colors

A cool, frost-tinted neutral field with one bright jade accent and a full set of muted intent colours from the mythology palette.

### Primary

- **Courier Jade** (#00c57a): the brand fill — primary buttons, active navigation, selected states, progress. Text on it is Felt Black.
- **Courier Jade Deep** (#00a468): hover/pressed fill of Courier Jade.
- **Courier Jade Mist** (#deffea): soft brand tint for selected rows, active nav backgrounds and soft tags.
- **Night Jade** (#21d98d): the brand fill in dark mode.

### Secondary

- **Indigo Dusk** (#393b8b): secondary actions and the secondary button severity.

### Neutral

- **Frost White** (#ffffff): base surface for cards, inputs and overlays in light mode.
- **Morning Frost** (#f0f7f5): page background and subtle surface; also the light text on dark fills.
- **Morning Frost Muted** (#e9f1ef): muted surface for hover and grouped areas.
- **Frost Border** (#d9e0df) / **Frost Border Strong** (#c8d0ce): dividers and control outlines.
- **Felt Black** (#15110b): primary text — a warm near-black, never pure black.
- **Felt Charcoal** (#27231d): secondary text.
- **Stone Gray** (#74777a): muted text, placeholders, metadata.
- **Night Steppe** (#202c43), **Night Steppe Raised** (#243553), **Night Steppe Muted** (#283d64): dark-mode surface, elevated and muted surfaces (deep navy from the `mergen` family).
- **Slate** (#4f5153): the neutral intent.

### Intent colours

**Sky Ink** (#1c6eb3) info and links · **Pine Green** (#256b52) success · **Ochre** (#935f17) warning · **Ember Red** (#b22128) danger · **Plum** (#602ea3) help · **Saffron** (#d7a40f) premium · **Felt Black** contrast. Each intent has default, hover, on-colour and subtle steps as tokens.

### Named Rules

**The One Jade Rule.** Courier Jade marks action and current state only. It is never decoration and never body text.

**The Grass-Is-Not-Ink Rule.** Do not use Courier Jade as a text colour on light surfaces: it reaches only about 3.2:1 against white (retro TOK-4/AX-12). Text needs ≥ 4.5:1; a darker jade text role is planned for phase 1.

**The Meaning-Only Intent Rule.** Intent colours (danger, warn, success, info, help, premium) appear only where the state is real, and always together with text or an icon, never colour alone.

## Typography

**Display Font:** Source Serif 4 (with Source Serif Pro, Georgia)
**Body Font:** Source Sans 3 (with Source Sans Pro, system UI sans)
**Label/Mono Font:** JetBrains Mono (with Fira Code, ui-monospace) for code and technical values

**Character:** A literate serif for page and section headings sits on a plain, highly legible humanist sans that does all the work in controls and data.

### Hierarchy

- **Display** (600, 34px, 1.1): page titles (showcase page headers).
- **Headline** (600, 26px): section headings.
- **Body** (400, 14px, 1.55): controls, table cells, form text — the default UI size.
- **Body large** (400, 15–16px, 1.55–1.6): page lede and reading text; large controls use 16px.
- **Label** (500, 12px): helper text, captions, badges, compact labels.
- **Mono** (400, 12px): code samples and technical values.

### Named Rules

**The Serif-For-Titles Rule.** Source Serif 4 is for headings only; every control, label and data value uses Source Sans 3.

## Layout

The app shell is a sidebar plus topbar frame: topbar 64px (4rem), sidebar 280px (17.5rem) expanded and 72px (4.5rem) as a rail, content capped at 1280px (80rem). Below 992px the shell switches to its mobile layout (`mobile-breakpoint` defaults to `(max-width: 991px)`), and the sidebar becomes an off-canvas drawer.

Spacing follows a 4px base scale (4, 8, 12, 16, 20, 24, 32, 40, 48px). Controls come in a size scale shared by buttons (24–72px tall) and inputs (24–52px tall); the medium control is the default (button 40px, input 36px). Density is moderate today; a compact density token set is a planned phase-1 addition (grid cell editors, Tuğrul).

## Elevation & Depth

Surfaces are flat. Depth comes from tone: page in Morning Frost, content in Frost White, grouped or hovered areas in Morning Frost Muted; in dark mode the Night Steppe steps play the same roles. Shadows appear only on layers that open above the page (popover, tooltip, toast, select listbox, sidebar flyout).

### Shadow Vocabulary

- **Small** (`box-shadow: 0 1px 3px rgba(10, 37, 64, 0.06), 0 2px 6px rgba(10, 37, 64, 0.04)`): small overlays and raised controls.
- **Medium** (`box-shadow: 0 1px 3px rgba(10, 37, 64, 0.08), 0 8px 24px rgba(10, 37, 64, 0.06)`): popovers, listboxes, toasts.
- **Flyout** (`box-shadow: 0 4px 6px -2px rgba(10, 37, 64, 0.10), 0 12px 28px -6px rgba(10, 37, 64, 0.14)`): sidebar rail flyouts.

### Named Rules

**The Flat Steppe Rule.** Surfaces are flat at rest. A shadow means "this is floating above the page"; cards, panels and inputs never carry one.

**The Tinted Shadow Rule.** Shadow colour derives from the surface it sits on. The current navy tint (`rgba(10, 37, 64, …)`) is a leftover from the retired palette (retro TOK-19) and will be re-derived.

## Shapes

Moderate, size-aware corners: radius grows with control size (buttons 5px at xs to 12px at 3xl, 7px at the default md), inputs use 6px, navigation items 8px. Pills (9999px) are reserved for tags, badges, chips and switch tracks; circles for avatars and spinners. Borders are 1px.

**The Proportional Corner Rule.** Larger controls get larger radii; a corner never exceeds a third of the control's height, except for deliberate pills.

## Components

### Buttons

Calm, solid and exact; the press state is a colour shift, not a bounce.

- **Shape:** gently rounded (7px at the default size; 5–12px across sizes).
- **Primary:** Courier Jade fill, Felt Black text, 40px tall, 16px side padding.
- **Hover / Focus:** fill shifts to Courier Jade Deep over 150ms; keyboard focus shows a ring (`--tulpar-color-focus-ring`). Known gap: the ring is 1.88:1 against white, below the 3:1 minimum (retro TOK-2) — an opaque ring is planned for phase 1.
- **Other severities:** secondary (Indigo Dusk), info, success, warn, help, danger, contrast, premium; variants solid, outlined, tonal, ghost, link.

### Inputs / Fields

- **Style:** Frost White field, 1px Frost Border outline, 6px corners, 36px tall at the default size.
- **Focus:** soft focus ring around the field.
- **Error / Disabled:** Ember Red message and outline for errors; muted surface and text when disabled.

### Chips, Tags and Badges

- **Style:** pill shapes in a soft tonal fill by default, with outline and solid alternatives; tone from the conventional vocabulary (neutral, info, success, warning, danger, custom).

### Navigation

- **Style:** sidebar items 40px tall (36px compact), 8px corners, Felt Charcoal text; the current page uses the Courier Jade Mist background and an `aria-current` marker. In rail mode items collapse to icons with flyouts.

### Overlays

- **Style:** Frost White (Night Steppe Raised in dark) surfaces with the Medium shadow; tooltips, toggletips, popovers and the select listbox share one positioning engine and open in the browser's top layer.

## Do's and Don'ts

### Do:

- **Do** take every value from a `--tulpar-*` token; component CSS uses semantic tokens only.
- **Do** keep Courier Jade for actions and current state, with Felt Black text on it.
- **Do** separate surfaces by tone (Frost White on Morning Frost; Night Steppe steps in dark mode).
- **Do** design light and dark together; check both before calling a component done.
- **Do** pair every intent colour with text or an icon.

### Don't:

- **Don't** use Courier Jade as a text colour on light surfaces (≈3.2:1).
- **Don't** put shadows on cards, panels or inputs; shadows are for overlays only.
- **Don't** use pure black (#000000) or pure white text on white; text is Felt Black, inverse text is Morning Frost.
- **Don't** use the serif display face inside controls or data.
- **Don't** hard-code colours or pixel values in component styles; another brand or the Tuğrul page structure must be able to change them.
