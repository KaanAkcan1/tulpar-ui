import { css } from "lit";

/**
 * Visual language for `<tulpar-option-group>` — the grouped section header
 * (Task 6.1).
 *
 * A non-interactive, uppercase, muted micro-label that STAYS VISIBLE while its
 * options scroll past — the standard menu-grouping affordance (Linear/Stripe
 * command menus). Sticky context preserves orientation in a long, grouped list
 * (`ux: whitespace-balance` + group context), and the surface background under
 * the header keeps options from bleeding through as they scroll beneath it.
 *
 * House idioms:
 * - Semantic tokens only via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - Logical properties throughout.
 */
export const optionGroupStyles = css`
  :host {
    display: block;
  }

  /* Spacing BETWEEN groups (not before the first one — the panel gutter covers
     that). A hairline-free gap reads cleaner than a divider at this density. */
  :host + :host {
    margin-block-start: 0.25rem;
  }

  .group-header {
    /* Sticky within the scrolling listbox so the group label stays pinned to the
       top of the viewport while its options scroll under it. The surface bg
       (auto-flipping in dark) prevents option text bleeding through. */
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
    background: var(--tulpar-overlay-surface-bg, #ffffff);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--tulpar-color-text-muted, #737373);
    /* A touch more top padding than bottom so the header breathes off the group
       above without crowding its own options. First-group top padding is trimmed
       below since the panel gutter already provides the lead-in. */
    padding-block: 0.5rem 0.25rem;
    padding-inline: 0.75rem;
  }

  /* The first group's header sits flush under the panel's top gutter — trim its
     extra top padding so it does not feel double-spaced. */
  :host:first-of-type .group-header {
    padding-block-start: 0.25rem;
  }

  @media (forced-colors: active) {
    .group-header {
      background: Canvas;
      color: CanvasText;
    }
  }
`;
