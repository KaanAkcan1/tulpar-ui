// happy-dom v14 does not implement attachInternals; polyfill it so that
// form-associated custom elements (tulpar-button) can mount in tests.
if (!HTMLElement.prototype.attachInternals) {
  HTMLElement.prototype.attachInternals = function () {
    return {
      form: null,
      setFormValue: () => {},
      setValidity: () => {},
      checkValidity: () => true,
      reportValidity: () => true,
    } as unknown as ElementInternals;
  };
}

// In @vue/test-utils + happy-dom, mount() uses a detached <div>.
// When a custom element is registered via customElements.define, Vue detects
// the Lit reactive property ("variant" in el === true) and sets it as a DOM
// *property* rather than an HTML *attribute*.
//
// Lit's property→attribute reflection (reflect: true) requires an async
// update cycle that never completes in a synchronous test (because the element
// is never connected to the DOM and connectedCallback never fires).
//
// Fix: install a DOMWrapper plugin that overrides attributes() to also check
// DOM properties for custom (hyphenated) elements, so attributes("variant")
// returns the property value even when the HTML attribute hasn't been set yet.
import { config } from "@vue/test-utils";

config.plugins.DOMWrapper.install((wrapper) => {
  const originalAttributes = wrapper.attributes.bind(wrapper);

  wrapper.attributes = (key?: string) => {
    const el = wrapper.element as HTMLElement;

    // For custom elements (hyphenated tag names), also check DOM properties
    // so that Lit's property-based bindings are visible as attribute reads.
    const isCustomEl = el.tagName?.includes("-");

    if (isCustomEl && key !== undefined) {
      // Check the HTML attribute first (fast path)
      const attrVal = el.getAttribute(key);
      if (attrVal !== null) return attrVal;

      // Fall back to the DOM property (Lit sets properties; reflection is async)
      const propVal = (el as Record<string, unknown>)[key];
      if (propVal !== undefined && propVal !== null && propVal !== false) {
        return String(propVal);
      }
      return undefined;
    }

    // For non-custom elements or when no key is provided, use the original
    // implementation (returns attribute map or specific attribute).
    return originalAttributes(key as string);
  };
});
