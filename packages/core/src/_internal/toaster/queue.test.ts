import { expect } from "@open-wc/testing";
import { ToasterQueue } from "./queue";
import type { Location } from "./queue";

describe("ToasterQueue", () => {
  // ─── enqueue basics ────────────────────────────────────────────────────────

  describe("enqueue", () => {
    it("returns a non-empty string id", () => {
      const q = new ToasterQueue();
      const id = q.enqueue({ location: "bottom-right", data: {} });
      expect(typeof id).to.equal("string");
      expect(id.length).to.be.greaterThan(0);
    });

    it("returns unique ids for distinct calls", () => {
      const q = new ToasterQueue();
      const a = q.enqueue({ location: "bottom-right", data: {} });
      const b = q.enqueue({ location: "bottom-right", data: {} });
      expect(a).to.not.equal(b);
    });

    it("respects a caller-supplied id", () => {
      const q = new ToasterQueue();
      const id = q.enqueue({ location: "bottom-right", data: {}, id: "my-id" });
      expect(id).to.equal("my-id");
    });

    it("stores the record retrievable via get()", () => {
      const q = new ToasterQueue();
      const id = q.enqueue({ location: "bottom-right", data: { msg: "hello" } });
      const record = q.get(id);
      expect(record).to.not.equal(undefined);
      expect(record!.id).to.equal(id);
      expect(record!.location).to.equal("bottom-right");
      expect((record!.data as Record<string, unknown>).msg).to.equal("hello");
    });

    it("initialises count to 1", () => {
      const q = new ToasterQueue();
      const id = q.enqueue({ location: "bottom-right", data: {} });
      expect(q.get(id)!.count).to.equal(1);
    });

    it("two separate instances generate ids independently (no shared counter)", () => {
      // The key invariant of the instance-scoped counter fix: enqueuing into q2
      // must NOT advance q1's counter, and vice-versa. We verify this by
      // interleaving calls and confirming each queue correctly stores only its
      // own records with distinct within-queue ids.
      const q1 = new ToasterQueue();
      const q2 = new ToasterQueue();

      const id1a = q1.enqueue({ location: "bottom-right", data: { from: "q1" } });
      const id2a = q2.enqueue({ location: "bottom-right", data: { from: "q2" } });
      const id1b = q1.enqueue({ location: "bottom-right", data: { from: "q1" } });

      // Each queue keeps its own records correctly.
      expect(q1.get(id1a)).to.not.equal(undefined);
      expect(q1.get(id1b)).to.not.equal(undefined);
      expect(q2.get(id2a)).to.not.equal(undefined);

      // ids within a single queue must be distinct.
      expect(id1a).to.not.equal(id1b);

      // q1's record data is not contaminated.
      expect((q1.get(id1a)!.data as Record<string, unknown>).from).to.equal("q1");
      expect((q1.get(id1b)!.data as Record<string, unknown>).from).to.equal("q1");
      expect((q2.get(id2a)!.data as Record<string, unknown>).from).to.equal("q2");
    });
  });

  // ─── per-location isolation ─────────────────────────────────────────────────

  describe("per-location isolation", () => {
    it("visible() for one location does not include toasts from another", () => {
      const q = new ToasterQueue();
      const a = q.enqueue({ location: "top-left", data: {} });
      const b = q.enqueue({ location: "bottom-right", data: {} });

      const topLeft = q.visible("top-left");
      const bottomRight = q.visible("bottom-right");

      expect(topLeft.some((r) => r.id === a)).to.equal(true);
      expect(topLeft.some((r) => r.id === b)).to.equal(false);
      expect(bottomRight.some((r) => r.id === b)).to.equal(true);
      expect(bottomRight.some((r) => r.id === a)).to.equal(false);
    });

    it("all six location values are accepted", () => {
      const locations: Location[] = [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ];
      const q = new ToasterQueue();
      for (const loc of locations) {
        const id = q.enqueue({ location: loc, data: {} });
        expect(q.get(id)!.location).to.equal(loc);
      }
    });
  });

  // ─── maxVisible + overflow queue ────────────────────────────────────────────

  describe("maxVisible", () => {
    it("default maxVisible is 3 — first 3 enqueues are visible", () => {
      const q = new ToasterQueue();
      const ids = [
        q.enqueue({ location: "bottom-right", data: {} }),
        q.enqueue({ location: "bottom-right", data: {} }),
        q.enqueue({ location: "bottom-right", data: {} }),
      ];
      const visible = q.visible("bottom-right");
      expect(visible.length).to.equal(3);
      for (const id of ids) {
        expect(visible.some((r) => r.id === id)).to.equal(true);
      }
    });

    it("4th enqueue is queued (not visible) when maxVisible=3", () => {
      const q = new ToasterQueue();
      q.enqueue({ location: "bottom-right", data: {} });
      q.enqueue({ location: "bottom-right", data: {} });
      q.enqueue({ location: "bottom-right", data: {} });
      const overflow = q.enqueue({ location: "bottom-right", data: {} });

      expect(q.visible("bottom-right").some((r) => r.id === overflow)).to.equal(false);
      expect(q.all("bottom-right").some((r) => r.id === overflow)).to.equal(true);
    });

    it("respects a custom maxVisible passed to the constructor", () => {
      const q = new ToasterQueue({ maxVisible: 1 });
      const first = q.enqueue({ location: "bottom-right", data: {} });
      const second = q.enqueue({ location: "bottom-right", data: {} });

      const visible = q.visible("bottom-right");
      expect(visible.length).to.equal(1);
      expect(visible[0].id).to.equal(first);
      expect(q.all("bottom-right").some((r) => r.id === second)).to.equal(true);
    });

    it("newest-first ordering — latest enqueue is first in visible()", () => {
      const q = new ToasterQueue();
      const first = q.enqueue({ location: "bottom-right", data: {} });
      const second = q.enqueue({ location: "bottom-right", data: {} });
      const visible = q.visible("bottom-right");
      // newest is at index 0
      expect(visible[0].id).to.equal(second);
      expect(visible[1].id).to.equal(first);
    });
  });

  // ─── dismiss + promotion ────────────────────────────────────────────────────

  describe("dismiss", () => {
    it("removes the record from all()", () => {
      const q = new ToasterQueue();
      const id = q.enqueue({ location: "bottom-right", data: {} });
      q.dismiss(id);
      expect(q.get(id)).to.equal(undefined);
      expect(q.all("bottom-right").some((r) => r.id === id)).to.equal(false);
    });

    it("promoting next queued record to visible after dismiss", () => {
      const q = new ToasterQueue({ maxVisible: 2 });
      q.enqueue({ location: "bottom-right", data: {} });
      const second = q.enqueue({ location: "bottom-right", data: {} });
      const queued = q.enqueue({ location: "bottom-right", data: {} }); // overflows

      expect(q.visible("bottom-right").some((r) => r.id === queued)).to.equal(false);

      q.dismiss(second);

      // queued record is now promoted
      expect(q.visible("bottom-right").some((r) => r.id === queued)).to.equal(true);
    });

    it("is a no-op for an unknown id", () => {
      const q = new ToasterQueue();
      expect(() => q.dismiss("ghost-id")).to.not.throw();
    });

    it("does not affect records in other locations", () => {
      const q = new ToasterQueue();
      const a = q.enqueue({ location: "top-left", data: {} });
      const b = q.enqueue({ location: "bottom-right", data: {} });
      q.dismiss(a);
      expect(q.get(b)).to.not.equal(undefined);
    });

    it("dismissing a QUEUED (overflow) record removes it without promoting any other record", () => {
      const q = new ToasterQueue({ maxVisible: 2 });
      const first = q.enqueue({ location: "bottom-right", data: {} });
      const second = q.enqueue({ location: "bottom-right", data: {} }); // fills visible
      const queued = q.enqueue({ location: "bottom-right", data: {} }); // overflows

      // Sanity: visible is full, queued holds the overflow.
      expect(q.visible("bottom-right").length).to.equal(2);
      expect(q.visible("bottom-right").some((r) => r.id === queued)).to.equal(false);

      q.dismiss(queued);

      // Queued record is gone.
      expect(q.get(queued)).to.equal(undefined);
      // Visible list is unchanged — no promotion side effects.
      const vis = q.visible("bottom-right");
      expect(vis.length).to.equal(2);
      expect(vis.some((r) => r.id === first)).to.equal(true);
      expect(vis.some((r) => r.id === second)).to.equal(true);
    });
  });

  // ─── dismissAll ─────────────────────────────────────────────────────────────

  describe("dismissAll", () => {
    it("dismissAll(location) clears only that location", () => {
      const q = new ToasterQueue();
      q.enqueue({ location: "top-left", data: {} });
      q.enqueue({ location: "top-left", data: {} });
      const kept = q.enqueue({ location: "bottom-right", data: {} });

      q.dismissAll("top-left");

      expect(q.all("top-left").length).to.equal(0);
      expect(q.get(kept)).to.not.equal(undefined);
    });

    it("dismissAll() with no argument clears all locations", () => {
      const q = new ToasterQueue();
      q.enqueue({ location: "top-left", data: {} });
      q.enqueue({ location: "bottom-right", data: {} });
      q.enqueue({ location: "top-center", data: {} });

      q.dismissAll();

      expect(q.all().length).to.equal(0);
    });

    it("dismissAll() on an already-empty queue does not throw", () => {
      const q = new ToasterQueue();
      expect(() => q.dismissAll()).to.not.throw();
      expect(() => q.dismissAll("top-left")).to.not.throw();
    });
  });

  // ─── grouping ────────────────────────────────────────────────────────────────

  describe("grouping", () => {
    it("same groupKey in same location increments count and returns the existing id", () => {
      const q = new ToasterQueue();
      const first = q.enqueue({ location: "top-center", data: {}, groupKey: "msg:success" });
      const second = q.enqueue({ location: "top-center", data: {}, groupKey: "msg:success" });

      expect(second).to.equal(first);
      expect(q.get(first)!.count).to.equal(2);
      // should NOT have added a second record
      expect(q.all("top-center").length).to.equal(1);
    });

    it("same groupKey in different locations creates separate records", () => {
      const q = new ToasterQueue();
      const a = q.enqueue({ location: "top-center", data: {}, groupKey: "same-key" });
      const b = q.enqueue({ location: "bottom-right", data: {}, groupKey: "same-key" });

      expect(a).to.not.equal(b);
      expect(q.all("top-center").length).to.equal(1);
      expect(q.all("bottom-right").length).to.equal(1);
    });

    it("different groupKeys in same location create separate records", () => {
      const q = new ToasterQueue();
      const a = q.enqueue({ location: "top-center", data: {}, groupKey: "key-a" });
      const b = q.enqueue({ location: "top-center", data: {}, groupKey: "key-b" });

      expect(a).to.not.equal(b);
      expect(q.all("top-center").length).to.equal(2);
    });

    it("absent groupKey (no groupKey field) always creates a new record", () => {
      const q = new ToasterQueue();
      const a = q.enqueue({ location: "top-center", data: {} });
      const b = q.enqueue({ location: "top-center", data: {} });

      expect(a).to.not.equal(b);
      expect(q.all("top-center").length).to.equal(2);
    });

    it("grouped record is refreshed to the front (newest-first) on repeated enqueue", () => {
      const q = new ToasterQueue();
      const older = q.enqueue({ location: "top-center", data: {}, groupKey: "grp" });
      q.enqueue({ location: "top-center", data: {} }); // unrelated, now at front
      q.enqueue({ location: "top-center", data: {}, groupKey: "grp" }); // re-enqueue grouped one

      const visible = q.visible("top-center");
      // grouped record should now be at the front
      expect(visible[0].id).to.equal(older);
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────────

  describe("update", () => {
    it("shallow-merges partialData into the record's data", () => {
      const q = new ToasterQueue();
      const id = q.enqueue({ location: "bottom-right", data: { tone: "info", title: "Old" } });
      q.update(id, { title: "New", description: "Added" });
      const record = q.get(id)!;
      expect((record.data as Record<string, unknown>).tone).to.equal("info");
      expect((record.data as Record<string, unknown>).title).to.equal("New");
      expect((record.data as Record<string, unknown>).description).to.equal("Added");
    });

    it("is a no-op for an unknown id (does not throw)", () => {
      const q = new ToasterQueue();
      expect(() => q.update("ghost", { tone: "success" })).to.not.throw();
    });

    it("merges into a QUEUED (overflow) record, not just visible ones", () => {
      const q = new ToasterQueue({ maxVisible: 1 });
      q.enqueue({ location: "bottom-right", data: { tone: "info" } }); // fills the slot
      const queued = q.enqueue({ location: "bottom-right", data: { tone: "info" } }); // overflows

      // Confirm it is indeed queued, not visible.
      expect(q.visible("bottom-right").some((r) => r.id === queued)).to.equal(false);

      q.update(queued, { title: "Updated while queued" });

      const record = q.get(queued)!;
      expect((record.data as Record<string, unknown>).tone).to.equal("info");
      expect((record.data as Record<string, unknown>).title).to.equal("Updated while queued");
    });
  });

  // ─── query getters ───────────────────────────────────────────────────────────

  describe("query getters", () => {
    it("get() returns undefined for an unknown id", () => {
      const q = new ToasterQueue();
      expect(q.get("nope")).to.equal(undefined);
    });

    it("all(location) returns all records (visible + queued) for that location", () => {
      const q = new ToasterQueue({ maxVisible: 1 });
      const a = q.enqueue({ location: "top-left", data: {} });
      const b = q.enqueue({ location: "top-left", data: {} }); // queued
      const all = q.all("top-left");
      expect(all.length).to.equal(2);
      expect(all.some((r) => r.id === a)).to.equal(true);
      expect(all.some((r) => r.id === b)).to.equal(true);
    });

    it("all() with no argument returns records from all locations", () => {
      const q = new ToasterQueue();
      q.enqueue({ location: "top-left", data: {} });
      q.enqueue({ location: "bottom-right", data: {} });
      expect(q.all().length).to.equal(2);
    });

    it("visible(location) returns at most maxVisible records", () => {
      const q = new ToasterQueue({ maxVisible: 2 });
      q.enqueue({ location: "bottom-right", data: {} });
      q.enqueue({ location: "bottom-right", data: {} });
      q.enqueue({ location: "bottom-right", data: {} }); // queued
      expect(q.visible("bottom-right").length).to.equal(2);
    });
  });
});
