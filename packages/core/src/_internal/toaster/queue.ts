/**
 * Pure toaster queue — framework-free data structure that manages toast records
 * per location with per-location stacking, overflow queuing, and grouping.
 *
 * NO timers, NO DOM, NO stacking math, NO rendering — those live in Tasks
 * 2.2/2.3/2.4 (timer-controller, stacking math, portal/region element).
 *
 * Design notes:
 * - Each location maintains a `visible` list (newest-first, capped at maxVisible)
 *   and a FIFO `queued` list for overflow. New records are prepended to `visible`
 *   when there is capacity; when `visible` is full they are appended to `queued`.
 * - On dismiss the first item from `queued` is promoted to the back of `visible`
 *   (preserving newest-first ordering within the visible slice).
 * - Grouping: when `groupKey` is supplied and a record with that key already
 *   exists in the same location (visible or queued), its `count` is incremented
 *   and it is moved to the front of `visible`. No second record is added; the
 *   existing id is returned.
 * - `update` shallow-merges into `data`; the queue never interprets visual opts.
 */

export type Location =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastRecord {
  /** Unique identifier. Caller-supplied or auto-generated. */
  id: string;
  /** The six-position location for this toast. */
  location: Location;
  /**
   * Grouping key. When set and a record with the same key exists in the same
   * location, the existing record is incremented (count++) and refreshed to
   * the front of visible rather than a new record being added.
   */
  groupKey?: string;
  /** Number of times this record has been enqueued (starts at 1; groups count). */
  count: number;
  /**
   * Opaque per-toast options forwarded from the toast service. The queue never
   * reads visual fields (tone, title, …) — those belong to the render layer.
   */
  data: unknown;
}

export interface ToasterQueueOptions {
  /** Maximum visible records per location. Queues beyond this. Default: 3. */
  maxVisible?: number;
}

export interface EnqueueInput {
  /** Target location for this toast. */
  location: Location;
  /** Opaque data forwarded to the render layer. */
  data: unknown;
  /**
   * Optional caller-supplied id. When provided it overrides the auto-generated
   * id, enabling update/dedupe via the same id across calls.
   */
  id?: string;
  /**
   * Optional grouping key. When a record with the same key exists in the same
   * location, its `count` is incremented and it is moved to the front of visible
   * instead of adding a new record.
   */
  groupKey?: string;
}

interface LocationBucket {
  /** Newest-first. Length ≤ maxVisible. */
  visible: ToastRecord[];
  /** FIFO overflow. Oldest at index 0. Promoted on dismiss. */
  queued: ToastRecord[];
}

export class ToasterQueue {
  private readonly _maxVisible: number;
  private readonly _locations: Map<Location, LocationBucket> = new Map();
  /** Fast record lookup across all locations. */
  private readonly _byId: Map<string, ToastRecord> = new Map();
  /** Per-instance counter — two ToasterQueue instances never share counter state. */
  private _counter = 0;

  constructor(options: ToasterQueueOptions = {}) {
    this._maxVisible = options.maxVisible ?? 3;
  }

  // ─── private helpers ──────────────────────────────────────────────────────

  private _generateId(): string {
    this._counter = (this._counter + 1) % Number.MAX_SAFE_INTEGER;
    return `toast-${Date.now().toString(36)}-${this._counter}`;
  }

  private _bucket(location: Location): LocationBucket {
    let bucket = this._locations.get(location);
    if (!bucket) {
      bucket = { visible: [], queued: [] };
      this._locations.set(location, bucket);
    }
    return bucket;
  }

  // ─── public API ───────────────────────────────────────────────────────────

  /**
   * Add a new toast record for the given location, or — when `groupKey` matches
   * an existing record in that location — increment its count and refresh it to
   * the front of the visible list.
   *
   * When the visible slot is full the new record is appended to the overflow
   * queue; it will be promoted on the next `dismiss` in the same location.
   *
   * @returns The id of the record (existing id on a grouped merge, new id otherwise).
   */
  enqueue(input: EnqueueInput): string {
    const { location, data, groupKey } = input;
    const bucket = this._bucket(location);

    // Grouping: look for an existing record with the same key (visible or queued).
    if (groupKey !== undefined) {
      const existing =
        bucket.visible.find((r) => r.groupKey === groupKey) ??
        bucket.queued.find((r) => r.groupKey === groupKey);

      if (existing) {
        existing.count++;
        // Refresh to front of visible: pull from wherever it currently lives.
        const visIdx = bucket.visible.indexOf(existing);
        if (visIdx !== -1) {
          bucket.visible.splice(visIdx, 1);
        } else {
          const qIdx = bucket.queued.indexOf(existing);
          if (qIdx !== -1) bucket.queued.splice(qIdx, 1);
        }
        bucket.visible.unshift(existing);
        // If promoting from queued pushed visible over the cap, send the last
        // visible item back to the front of the queue.
        if (bucket.visible.length > this._maxVisible) {
          const overflow = bucket.visible.pop()!;
          bucket.queued.unshift(overflow);
        }
        return existing.id;
      }
    }

    // New record.
    const id = input.id ?? this._generateId();
    const record: ToastRecord = { id, location, groupKey, count: 1, data };
    this._byId.set(id, record);

    if (bucket.visible.length < this._maxVisible) {
      // Capacity available: prepend (newest-first).
      bucket.visible.unshift(record);
    } else {
      // Overflow: append to FIFO queue.
      bucket.queued.push(record);
    }

    return id;
  }

  /**
   * Shallow-merge `partialData` into the record's `data` field.
   * No-op when the id is not found.
   *
   * Note: `data` is assumed to be a plain object; if it isn't, the spread
   * produces a new plain object containing only `partialData` properties
   * (i.e., the shallow merge is effectively a no-op for the original value).
   */
  update(id: string, partialData: Record<string, unknown>): void {
    const record = this._byId.get(id);
    if (!record) return;
    record.data = { ...(record.data as Record<string, unknown>), ...partialData };
  }

  /**
   * Remove the record identified by `id`. If the dismissed record was visible
   * and there are overflow records queued for the same location, the oldest
   * queued record is promoted to the back of the visible list.
   *
   * No-op when the id is not found.
   */
  dismiss(id: string): void {
    const record = this._byId.get(id);
    if (!record) return;
    const bucket = this._bucket(record.location);

    const visIdx = bucket.visible.indexOf(record);
    if (visIdx !== -1) {
      bucket.visible.splice(visIdx, 1);
      // Promote the oldest queued item into the visible slot.
      if (bucket.queued.length > 0) {
        const promoted = bucket.queued.shift()!;
        bucket.visible.push(promoted);
      }
    } else {
      const qIdx = bucket.queued.indexOf(record);
      if (qIdx !== -1) bucket.queued.splice(qIdx, 1);
    }

    this._byId.delete(id);
  }

  /**
   * Remove all records in `location`, or every record across all locations when
   * `location` is omitted.
   */
  dismissAll(location?: Location): void {
    if (location !== undefined) {
      const bucket = this._bucket(location);
      for (const r of bucket.visible) this._byId.delete(r.id);
      for (const r of bucket.queued) this._byId.delete(r.id);
      bucket.visible.length = 0;
      bucket.queued.length = 0;
    } else {
      this._byId.clear();
      for (const bucket of this._locations.values()) {
        bucket.visible.length = 0;
        bucket.queued.length = 0;
      }
    }
  }

  // ─── query getters ────────────────────────────────────────────────────────

  /**
   * Returns the visible records for `location` (newest-first, at most maxVisible).
   * These are the records that should be rendered on screen.
   */
  visible(location: Location): ToastRecord[] {
    return [...this._bucket(location).visible];
  }

  /**
   * Returns all records (visible + queued) for `location`, or across every
   * location that has been enqueued into when `location` is omitted (not
   * literally all six location slots — locations that have never received a
   * record are absent from the internal map and therefore skipped).
   *
   * Within a location: visible records (newest-first) followed by queued records
   * (oldest-first — FIFO order).
   */
  all(location?: Location): ToastRecord[] {
    if (location !== undefined) {
      const { visible, queued } = this._bucket(location);
      return [...visible, ...queued];
    }
    const result: ToastRecord[] = [];
    for (const bucket of this._locations.values()) {
      result.push(...bucket.visible, ...bucket.queued);
    }
    return result;
  }

  /**
   * Look up a single record by id. Returns `undefined` when not found.
   */
  get(id: string): ToastRecord | undefined {
    return this._byId.get(id);
  }
}
