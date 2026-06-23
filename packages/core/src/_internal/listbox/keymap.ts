/**
 * Pure key → action mapping for a single-select listbox (Select now;
 * Combobox/MultiSelect/Menu can extend or reuse later). DOM-free and side-effect
 * free so the keyboard CONTRACT is unit-testable in isolation; the host element
 * interprets the returned {@link KeyAction} (it owns focus, active-index math,
 * typeahead buffering, and the actual commit/close/revert side effects).
 *
 * Virtual-focus model: DOM focus never leaves the trigger. Arrow/Home/End/Page
 * keys only move the ACTIVE index (tracked via `aria-activedescendant`); they
 * never move real focus. No-wrap movement is the host's concern (active-index).
 */

/** Keyboard modifier snapshot the resolver needs. */
export interface KeyModifiers {
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

/** The current listbox state plus the modifiers for this keystroke. */
export interface KeyState extends KeyModifiers {
  /** Whether the listbox is currently open. */
  open: boolean;
}

/** The kind of action the host should perform for a keystroke. */
export type KeyActionType =
  | "open" // open the listbox (closed-state arrow/enter/space)
  | "open-typeahead" // open the listbox, then run typeahead for the typed char
  | "close" // close, keeping the current selection (Alt+ArrowUp)
  | "commit" // commit the active option, then close (Enter/Space/Tab)
  | "revert" // restore value-before-open, then close (Escape)
  | "move-next" // active → next enabled
  | "move-prev" // active → previous enabled
  | "first" // active → first enabled
  | "last" // active → last enabled
  | "page-down" // active → +visibleRows enabled
  | "page-up" // active → -visibleRows enabled
  | "typeahead" // run typeahead for the typed char
  | "none"; // unhandled — let the event pass through

export interface KeyAction {
  type: KeyActionType;
  /** Whether the host should call `preventDefault()` for this keystroke. */
  preventDefault: boolean;
}

const NONE: KeyAction = { type: "none", preventDefault: false };

/** True for a single printable character with no command modifier held. */
function isTypeaheadChar(key: string, m: KeyModifiers): boolean {
  return key.length === 1 && !m.ctrlKey && !m.metaKey && !m.altKey;
}

/**
 * Resolve a keydown to a {@link KeyAction}. `key` is the `KeyboardEvent.key`.
 * Tab intentionally does NOT preventDefault (focus must move naturally); every
 * other handled key does.
 */
export function resolveKeyAction(key: string, state: KeyState): KeyAction {
  if (!state.open) {
    switch (key) {
      case "Enter":
      case " ":
      case "ArrowDown":
      case "ArrowUp":
        return { type: "open", preventDefault: true };
    }
    if (isTypeaheadChar(key, state)) return { type: "open-typeahead", preventDefault: false };
    return NONE;
  }

  // OPEN
  switch (key) {
    case "ArrowDown":
      return { type: "move-next", preventDefault: true };
    case "ArrowUp":
      // Alt+ArrowUp closes keeping selection; plain ArrowUp moves.
      return state.altKey
        ? { type: "close", preventDefault: true }
        : { type: "move-prev", preventDefault: true };
    case "Home":
      return { type: "first", preventDefault: true };
    case "End":
      return { type: "last", preventDefault: true };
    case "PageDown":
      return { type: "page-down", preventDefault: true };
    case "PageUp":
      return { type: "page-up", preventDefault: true };
    case "Enter":
    case " ":
      return { type: "commit", preventDefault: true };
    case "Tab":
      // Commit the active option but let focus move naturally (no preventDefault).
      return { type: "commit", preventDefault: false };
    case "Escape":
      return { type: "revert", preventDefault: true };
  }

  if (isTypeaheadChar(key, state)) return { type: "typeahead", preventDefault: false };
  return NONE;
}
