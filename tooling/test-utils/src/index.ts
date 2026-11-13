// Browser-side entry. The server-side WTR plugin lives at `@tulpar-ui/test-utils/plugin`
// so test pages never load Node-only code.
export {
  expectA11yNode,
  ariaSnapshot,
  parseFirstAriaNode,
  type A11yExpectation,
  type A11yNode,
  type A11yState,
} from "./a11y.ts";
export {
  ENGINE_KNOWN_FAILURES,
  itUnlessEngine,
  currentEngine,
  type Engine,
  type EngineKnownFailure,
} from "./engine-known-failures.ts";
