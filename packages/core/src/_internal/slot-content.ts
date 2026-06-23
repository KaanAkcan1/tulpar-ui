/**
 * Slot-content detection helpers shared by the display/status atoms (tag, chip,
 * badge, spinner, avatar) to decide whether a slot has REAL author content and
 * therefore should win over the equivalent convenience prop (`label`, initials,
 * icon, …).
 *
 * The critical subtlety: only ELEMENT nodes and NON-whitespace TEXT nodes count.
 * Comment nodes (nodeType 8) must be ignored — Vue's compiler leaves a `<!---->`
 * placeholder in the light DOM for an empty `<slot/>` outlet. If a comment were
 * counted as content, the prop fallback would be suppressed and nothing would
 * render (Angular's empty `<ng-content>` leaves nothing behind, so the bug only
 * surfaced under Vue). Whitespace-only text nodes are also ignored.
 */

/** A node counts as content only if it is an element or non-whitespace text. */
export function isMeaningfulNode(n: Node): boolean {
  return (
    n.nodeType === Node.ELEMENT_NODE ||
    (n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0)
  );
}

/** True when `nodes` contains at least one meaningful (element/text) node. */
export function hasMeaningfulContent(nodes: readonly Node[]): boolean {
  return nodes.some(isMeaningfulNode);
}
