// Browser side. Accessibility-tree assertions for Web Test Runner tests.
//
// `expectA11yNode` asserts what assistive technology actually gets — the
// computed role, accessible name and states — not attribute strings. It asks
// the server-side `aria-snapshot` command (see aria-snapshot-plugin.ts) for
// Playwright's ARIA snapshot of the target, which crosses shadow boundaries.
import { executeServerCommand } from "@web/test-runner-commands";
import { expect } from "@open-wc/testing";

/**
 * States `expectA11yNode` can assert.
 *
 * `required` is not exposed by Playwright's aria snapshot (1.65); asserting it
 * throws — check via ElementInternals in 1.4.
 */
export type A11yState = "checked" | "expanded" | "invalid" | "required" | "disabled" | "selected";

export interface A11yExpectation {
  role: string;
  name?: string | RegExp;
  states?: Partial<Record<A11yState, boolean | "mixed">>;
}

/** One node of an ARIA snapshot: `- role "name" [flag] [flag=value]`. */
export interface A11yNode {
  role: string;
  name: string;
  /** Flags as printed by Playwright; a bare flag (`[checked]`) has the value `true`. */
  flags: Record<string, string | true>;
}

const PROBE_ATTR = "data-a11y-probe";
let probeCounter = 0;

/**
 * States that Playwright's ARIA snapshot (1.65) does not print. Asserting them
 * here would silently pass, so the helper refuses instead.
 */
const UNSUPPORTED_STATES: ReadonlySet<A11yState> = new Set(["required"]);

/**
 * Roles for which Playwright computes each state. Copied from playwright-core
 * 1.65 (`kAriaCheckedRoles`, `kAriaExpandedRoles`, `kAriaSelectedRoles`,
 * `kAriaInvalidRoles`, `kAriaDisabledRoles` in lib/coreBundle.js); the snapshot
 * builder reads a state only `if (kAria<State>Roles.includes(role))`.
 *
 * Why the helper needs this: the snapshot never prints an explicit false value.
 * Verified in the 1.65 renderer — it emits `[checked]`, `[checked=mixed]`,
 * `[disabled]`, `[expanded]`, `[invalid]`, `[invalid=grammar|spelling]`,
 * `[selected]` and nothing for false (no `[checked=false]`, no
 * `[expanded=false]`). So an absent flag means "false" only on a role that can
 * carry the state. On any other role the state is never computed, and
 * `{ expanded: false }` on a `note` would pass without observing anything.
 * The helper therefore throws when a state is asserted on a role outside its list.
 *
 * Note: invalid and disabled are role-limited too (a `note` or `heading` never
 * gets `[invalid]` or `[disabled]` in the snapshot), so they are not "any role".
 */
const STATE_ROLES: Readonly<Record<Exclude<A11yState, "required">, ReadonlySet<string>>> = {
  checked: new Set([
    "checkbox",
    "menuitemcheckbox",
    "option",
    "radio",
    "switch",
    "menuitemradio",
    "treeitem",
  ]),
  expanded: new Set([
    "application",
    "button",
    "checkbox",
    "combobox",
    "gridcell",
    "link",
    "listbox",
    "menuitem",
    "row",
    "rowheader",
    "tab",
    "treeitem",
    "columnheader",
    "menuitemcheckbox",
    "menuitemradio",
    "switch",
  ]),
  selected: new Set(["gridcell", "option", "row", "tab", "rowheader", "columnheader", "treeitem"]),
  invalid: new Set([
    "application",
    "checkbox",
    "columnheader",
    "combobox",
    "gridcell",
    "listbox",
    "radiogroup",
    "rowheader",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "textbox",
    "tree",
  ]),
  disabled: new Set([
    "application",
    "button",
    "composite",
    "gridcell",
    "group",
    "input",
    "link",
    "menuitem",
    "scrollbar",
    "separator",
    "tab",
    "checkbox",
    "columnheader",
    "combobox",
    "grid",
    "listbox",
    "menu",
    "menubar",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "radiogroup",
    "row",
    "rowheader",
    "searchbox",
    "select",
    "slider",
    "spinbutton",
    "switch",
    "tablist",
    "textbox",
    "toolbar",
    "tree",
    "treegrid",
    "treeitem",
  ]),
};

/** Reads a YAML key: plain, or single-quoted with `''` as the escaped quote. */
function readKey(entry: string): string {
  if (!entry.startsWith("'")) {
    const sep = entry.indexOf(": ");
    const key = sep === -1 ? entry : entry.slice(0, sep);
    return key.endsWith(":") ? key.slice(0, -1) : key;
  }
  let key = "";
  for (let i = 1; i < entry.length; i++) {
    if (entry[i] === "'") {
      if (entry[i + 1] === "'") {
        key += "'";
        i++;
        continue;
      }
      break;
    }
    key += entry[i];
  }
  return key;
}

function parseKey(key: string): A11yNode | null {
  const roleMatch = /^([a-z][a-z-]*)/.exec(key);
  if (!roleMatch) return null;
  const role = roleMatch[1]!;
  let rest = key.slice(role.length);
  let name = "";
  const nameMatch = /^ ("(?:[^"\\]|\\.)*")/.exec(rest);
  if (nameMatch) {
    name = JSON.parse(nameMatch[1]!) as string;
    rest = rest.slice(nameMatch[0].length);
  }
  const flags: Record<string, string | true> = {};
  for (const m of rest.matchAll(/\[([a-z-]+)(?:=([^\]]*))?\]/g)) {
    flags[m[1]!] = m[2] ?? true;
  }
  return { role, name, flags };
}

/**
 * Parses the first element node of a Playwright ARIA snapshot. Static `text`
 * nodes are skipped: they carry no role, name or state.
 */
export function parseFirstAriaNode(snapshot: string): A11yNode | null {
  for (const line of snapshot.split(/\r?\n/)) {
    const m = /^\s*- (.*)$/.exec(line);
    if (!m) continue;
    const node = parseKey(readKey(m[1]!));
    if (node && node.role !== "text") return node;
  }
  return null;
}

/** Returns Playwright's ARIA snapshot (YAML) of `target`. */
export async function ariaSnapshot(target: Element): Promise<string> {
  const probe = `p${++probeCounter}-${Math.random().toString(36).slice(2, 8)}`;
  target.setAttribute(PROBE_ATTR, probe);
  try {
    return await executeServerCommand<string, { selector: string }>("aria-snapshot", {
      selector: `[${PROBE_ATTR}="${probe}"]`,
    });
  } finally {
    target.removeAttribute(PROBE_ATTR);
  }
}

export async function expectA11yNode(target: Element, expected: A11yExpectation): Promise<void> {
  const snapshot = await ariaSnapshot(target);
  const node = parseFirstAriaNode(snapshot);
  expect(node, `no accessible node in ARIA snapshot:\n${snapshot}`).to.not.equal(null);
  const { role, name, flags } = node!;
  const where = `\nARIA snapshot:\n${snapshot}`;

  expect(role, `role${where}`).to.equal(expected.role);

  if (expected.name instanceof RegExp) {
    expect(name, `accessible name${where}`).to.match(expected.name);
  } else if (expected.name !== undefined) {
    expect(name, `accessible name${where}`).to.equal(expected.name);
  }

  for (const [state, want] of Object.entries(expected.states ?? {}) as [
    A11yState,
    boolean | "mixed",
  ][]) {
    if (UNSUPPORTED_STATES.has(state)) {
      throw new Error(
        `expectA11yNode: "${state}" is not exposed by Playwright's ARIA snapshot; ` +
          `it cannot be asserted from the accessibility tree with this helper.`,
      );
    }
    const roles = STATE_ROLES[state as Exclude<A11yState, "required">];
    if (!roles.has(role)) {
      throw new Error(
        `expectA11yNode: role "${role}" does not support the "${state}" state; ` +
          `the ARIA snapshot never computes it for this role, so the assertion ` +
          `could not observe anything.${where}`,
      );
    }
    // Playwright prints a state only when it is set: `[checked]`, `[checked=mixed]`.
    // On a supported role an absent flag is the "false" value of that state.
    const actual = flags[state] ?? false;
    expect(actual, `state "${state}"${where}`).to.equal(want);
  }
}
