import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "./tulpar-avatar";
import type { TulparAvatar } from "./tulpar-avatar";
import { avatarStyles } from "./tulpar-avatar.styles";

function img(el: TulparAvatar): HTMLImageElement | null {
  return el.shadowRoot!.querySelector("img");
}
function initials(el: TulparAvatar): HTMLElement | null {
  return el.shadowRoot!.querySelector(".initials");
}
function icon(el: TulparAvatar): HTMLElement | null {
  return el.shadowRoot!.querySelector(".icon");
}

describe("public type exports", () => {
  it("re-exports TulparAvatar from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparAvatar).to.exist;
  });
  it("re-exports TulparAvatar from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparAvatar).to.exist;
  });
});

describe("<tulpar-avatar>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-avatar")).to.exist;
  });

  it("defaults to rounded-square / md", async () => {
    const el = await fixture<TulparAvatar>(html`<tulpar-avatar name="Jane Doe"></tulpar-avatar>`);
    expect(el.shape).to.equal("rounded-square");
    expect(el.size).to.equal("md");
    expect(el.getAttribute("size")).to.equal("md");
  });

  describe("image", () => {
    it("renders an <img> with src, lazy loading + width/height", async () => {
      // A tiny valid PNG data URI so the image actually loads (no error path).
      const src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar src=${src} name="Jane Doe"></tulpar-avatar>`,
      );
      await el.updateComplete;
      const i = img(el);
      expect(i).to.exist;
      expect(i!.getAttribute("loading")).to.equal("lazy");
      expect(i!.getAttribute("src")).to.equal(src);
      // intrinsic width/height HTML attributes reserve layout (md = 32px)
      expect(i!.getAttribute("width")).to.equal("32");
      expect(i!.getAttribute("height")).to.equal("32");
      // image is laid out at the host box size (md = 32px)
      expect(getComputedStyle(i!).objectFit).to.equal("cover");
      // image avatar exposes its name via alt, NOT role=img on the host
      expect(i!.getAttribute("alt")).to.equal("Jane Doe");
      expect(el.hasAttribute("role")).to.be.false;
    });

    it("intrinsic width/height track the size tier (lg = 40px)", async () => {
      const src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar size="lg" src=${src} name="Jane Doe"></tulpar-avatar>`,
      );
      await el.updateComplete;
      const i = img(el)!;
      expect(i.getAttribute("width")).to.equal("40");
      expect(i.getAttribute("height")).to.equal("40");
    });

    it("alt falls back to name; explicit alt wins", async () => {
      const src = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
      const a = await fixture<TulparAvatar>(
        html`<tulpar-avatar src=${src} name="Jane Doe" alt="Profile photo"></tulpar-avatar>`,
      );
      await a.updateComplete;
      expect(img(a)!.getAttribute("alt")).to.equal("Profile photo");
    });

    it("falls back to initials when the image errors", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar src="/does-not-exist.png" name="Jane Doe"></tulpar-avatar>`,
      );
      const i = img(el)!;
      // wait for the natural load failure to dispatch error
      await oneEvent(i, "error");
      await el.updateComplete;
      expect(img(el)).to.equal(null);
      expect(initials(el)).to.exist;
      expect(initials(el)!.textContent!.trim()).to.equal("JD");
    });
  });

  describe("initials", () => {
    it("derives 2 initials from 'Jane Doe' at md", async () => {
      const el = await fixture<TulparAvatar>(html`<tulpar-avatar name="Jane Doe"></tulpar-avatar>`);
      await el.updateComplete;
      expect(initials(el)!.textContent!.trim()).to.equal("JD");
    });

    it("derives 1 initial at sm", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar size="sm" name="Jane Doe"></tulpar-avatar>`,
      );
      await el.updateComplete;
      expect(initials(el)!.textContent!.trim()).to.equal("J");
    });

    it("uses 2 letters of a single-word name at md", async () => {
      const el = await fixture<TulparAvatar>(html`<tulpar-avatar name="Ada"></tulpar-avatar>`);
      await el.updateComplete;
      expect(initials(el)!.textContent!.trim()).to.equal("AD");
    });

    it("manual `initials` override wins over name", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar name="Jane Doe" initials="QA"></tulpar-avatar>`,
      );
      await el.updateComplete;
      expect(initials(el)!.textContent!.trim()).to.equal("QA");
    });

    it("uppercases locale-aware", async () => {
      const el = await fixture<TulparAvatar>(html`<tulpar-avatar name="émile"></tulpar-avatar>`);
      await el.updateComplete;
      expect(initials(el)!.textContent!.trim()).to.equal("ÉM");
    });
  });

  describe("icon fallback", () => {
    it("renders the generic user icon when no src/name/initials", async () => {
      const el = await fixture<TulparAvatar>(html`<tulpar-avatar></tulpar-avatar>`);
      await el.updateComplete;
      expect(img(el)).to.equal(null);
      expect(initials(el)).to.equal(null);
      expect(icon(el)).to.exist;
      expect(icon(el)!.querySelector("svg")).to.exist;
    });
  });

  describe("accessibility", () => {
    it("initials fallback gets role=img + aria-label of the name", async () => {
      const el = await fixture<TulparAvatar>(html`<tulpar-avatar name="Jane Doe"></tulpar-avatar>`);
      await el.updateComplete;
      expect(el.getAttribute("role")).to.equal("img");
      expect(el.getAttribute("aria-label")).to.equal("Jane Doe");
    });

    it("icon fallback with no name has no role / aria-label", async () => {
      const el = await fixture<TulparAvatar>(html`<tulpar-avatar></tulpar-avatar>`);
      await el.updateComplete;
      expect(el.hasAttribute("role")).to.be.false;
      expect(el.hasAttribute("aria-label")).to.be.false;
    });
  });

  describe("color override", () => {
    it("raw CSS color applies as the initials background (computed)", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar name="Jane Doe" color="#0d9488"></tulpar-avatar>`,
      );
      await el.updateComplete;
      // raw color resolves to a real computed bg (brand families resolve to a
      // bare primitive var with no literal fallback → transparent in WTR, so we
      // assert the raw-color case for a computed value).
      expect(getComputedStyle(el).backgroundColor).to.equal("rgb(13, 148, 136)");
    });

    it("known brand family sets the family primitive var inline", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar name="Jane Doe" color="ilay"></tulpar-avatar>`,
      );
      await el.updateComplete;
      expect(el.style.getPropertyValue("--tulpar-avatar-bg-l").trim()).to.equal(
        "var(--tulpar-primitive-color-ilay-600)",
      );
      expect(el.style.getPropertyValue("--tulpar-avatar-bg-d").trim()).to.equal(
        "var(--tulpar-primitive-color-ilay-500)",
      );
    });

    it("deterministic family var is set for a name with no color override", async () => {
      const el = await fixture<TulparAvatar>(html`<tulpar-avatar name="Jane Doe"></tulpar-avatar>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue("--tulpar-avatar-bg-l").trim()).to.contain(
        "--tulpar-primitive-color-",
      );
    });

    it("clears color vars when an image is shown", async () => {
      const src = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar src=${src} name="Jane Doe" color="ilay"></tulpar-avatar>`,
      );
      await el.updateComplete;
      expect(el.style.getPropertyValue("--tulpar-avatar-bg-l").trim()).to.equal("");
    });
  });

  describe("default slot (custom content overrides the cascade)", () => {
    it("renders slotted content and hides the initials/icon cascade", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar name="Jane Doe"><span class="custom">★</span></tulpar-avatar>`,
      );
      await el.updateComplete;
      // slotted content present → cascade suppressed
      expect(img(el)).to.equal(null);
      expect(initials(el)).to.equal(null);
      expect(icon(el)).to.equal(null);
      // the default <slot> is present and the slotted node is assigned to it
      const slot = el.shadowRoot!.querySelector("slot") as HTMLSlotElement;
      expect(slot).to.exist;
      const assigned = slot.assignedNodes({ flatten: true }).filter((n) => n instanceof Element);
      expect(assigned.length).to.equal(1);
      expect((assigned[0] as Element).textContent).to.equal("★");
      // host carries the data-attr that drives the CSS visibility swap
      expect(el.hasAttribute("data-slot-content")).to.equal(true);
    });

    it("slotted content overrides even an image src", async () => {
      const src = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar src=${src} name="Jane Doe"><span>icon</span></tulpar-avatar>`,
      );
      await el.updateComplete;
      expect(img(el)).to.equal(null);
    });

    it("whitespace-only slot content does NOT count (cascade still runs)", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar name="Jane Doe">   </tulpar-avatar>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("data-slot-content")).to.equal(false);
      // initials cascade still works
      expect(initials(el)).to.exist;
      expect(initials(el)!.textContent!.trim()).to.equal("JD");
    });

    it("clears role + aria-label when custom slot content is shown", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar name="Jane Doe"><span>icon</span></tulpar-avatar>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("role")).to.equal(false);
      expect(el.hasAttribute("aria-label")).to.equal(false);
    });

    it("the <slot> is always present even with no slotted content (cascade unaffected)", async () => {
      const el = await fixture<TulparAvatar>(html`<tulpar-avatar name="Jane Doe"></tulpar-avatar>`);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector("slot")).to.exist;
      expect(el.hasAttribute("data-slot-content")).to.equal(false);
      // existing initials cascade unaffected
      expect(initials(el)!.textContent!.trim()).to.equal("JD");
    });
  });

  describe("shape / size", () => {
    it("shape reflects to an attribute", async () => {
      const el = await fixture<TulparAvatar>(
        html`<tulpar-avatar shape="circle" name="Jane Doe"></tulpar-avatar>`,
      );
      expect(el.getAttribute("shape")).to.equal("circle");
      // circle = 50%; the computed longhand reports the authored percentage.
      expect(getComputedStyle(el).borderTopLeftRadius).to.equal("50%");
    });

    it("rounded-square md radius is 6px; xl is 10px", async () => {
      const md = await fixture<TulparAvatar>(html`<tulpar-avatar name="X"></tulpar-avatar>`);
      expect(getComputedStyle(md).borderTopLeftRadius).to.equal("6px");
      const xl = await fixture<TulparAvatar>(
        html`<tulpar-avatar size="xl" name="X"></tulpar-avatar>`,
      );
      expect(getComputedStyle(xl).borderTopLeftRadius).to.equal("10px");
    });

    it("md box is 32px; xl box is 48px", async () => {
      const md = await fixture<TulparAvatar>(html`<tulpar-avatar name="X"></tulpar-avatar>`);
      expect(getComputedStyle(md).width).to.equal("32px");
      expect(getComputedStyle(md).height).to.equal("32px");
      const xl = await fixture<TulparAvatar>(
        html`<tulpar-avatar size="xl" name="X"></tulpar-avatar>`,
      );
      expect(getComputedStyle(xl).width).to.equal("48px");
    });
  });

  describe("styles", () => {
    it("uses a serif monogram font + forced-colors block", () => {
      expect(avatarStyles.cssText).to.include("Source Serif 4");
      expect(avatarStyles.cssText).to.include("serif");
      expect(avatarStyles.cssText).to.include("forced-colors");
    });
  });
});
