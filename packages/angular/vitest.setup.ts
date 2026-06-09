import "@angular/compiler";
import { provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

// happy-dom doesn't implement ElementInternals. The Tulpar core button is
// form-associated and calls `this.attachInternals()` in its constructor, so
// we shim a minimal stub. Real semantics aren't exercised in these wrapper
// tests — we only care about the wrapper bridging attrs + events.
if (typeof HTMLElement !== "undefined" && !HTMLElement.prototype.attachInternals) {
  HTMLElement.prototype.attachInternals = function attachInternals(this: HTMLElement) {
    return {
      form: null,
      labels: [],
      states: new Set<string>(),
      validity: {
        valid: true,
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valueMissing: false,
      },
      willValidate: true,
      validationMessage: "",
      setFormValue: () => undefined,
      setValidity: () => undefined,
      checkValidity: () => true,
      reportValidity: () => true,
      role: null,
      ariaLabel: null,
    } as unknown as ElementInternals;
  };
}

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  errorOnUnknownElements: false,
  errorOnUnknownProperties: false,
});

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
});

afterEach(() => {
  TestBed.resetTestingModule();
});
