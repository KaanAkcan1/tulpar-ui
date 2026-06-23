/**
 * Buffered type-to-jump matcher for a listbox/menu. The substitute for free-text
 * filtering in a select-only combobox. Caller feeds typed chars + a monotonic
 * `now` (ms) and the current active index; returns the index to move to, or -1
 * to keep the current active option. `now` is injected for deterministic tests.
 */
export class Typeahead {
  private buffer = "";
  private last = -Infinity;
  constructor(private readonly windowMs = 500) {}

  reset(): void {
    this.buffer = "";
    this.last = -Infinity;
  }

  /**
   * @param char single typed character
   * @param labels option labels (in display order)
   * @param now monotonic timestamp (ms)
   * @param active current active index
   * @returns target index, or -1 for no match
   */
  type(char: string, labels: readonly string[], now: number, active: number): number {
    if (now - this.last > this.windowMs) this.buffer = "";
    this.last = now;
    const c = char.toLocaleLowerCase();
    const isSingleLetterCycle =
      this.buffer === "" || (this.buffer.length === 1 && this.buffer === c);

    if (isSingleLetterCycle) {
      // Same-letter cycling: start search just AFTER the current active.
      this.buffer = c;
      const n = labels.length;
      for (let step = 1; step <= n; step++) {
        const i = (active + step + n) % n;
        if (labels[i].toLocaleLowerCase().startsWith(c)) return i;
      }
      return -1;
    }

    this.buffer += c;
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].toLocaleLowerCase().startsWith(this.buffer)) return i;
    }
    return -1;
  }
}
