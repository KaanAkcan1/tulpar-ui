// Config used ONLY by lint-staged (`eslint -c eslint.fix-safe.config.js --fix`).
// It enables just the autofixes vetted as behaviour-neutral; every other rule is absent,
// so a staged run can never rewrite code semantics. The full `eslint.config.js` still
// runs in `pnpm lint` / CI and only reports.
//
// Vetted list:
//  - @typescript-eslint/consistent-type-imports: moves type-only imports to `import type`;
//    erased at compile time. Safe here: no emitDecoratorMetadata, no importsNotUsedAsValues.
//  - vue/attributes-order: reorders element attributes only. Safe: the repo has no
//    `v-bind="object"` whose precedence depends on order.
// The staged run passes `--pass-on-unpruned-suppressions`: this config enables only two rules, so
// every other entry in eslint-suppressions.json looks "unused" to it. Never use
// `--prune-suppressions` here; it would delete real suppressions. Prune with the full config.
//
// NOT included (fix can change semantics or is unvetted): @angular-eslint/template/eqeqeq
// (`==` -> `===` differs for null/undefined), lit/attribute-value-entities, prefer-const etc.
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
  { ignores: ["**/dist/**", "**/node_modules/**", "**/.angular/**", "**/storybook-static/**"] },
  { linterOptions: { reportUnusedDisableDirectives: "off" } },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tseslint.parser },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: { "@typescript-eslint/consistent-type-imports": "error" },
  },
  {
    files: ["**/*.vue"],
    languageOptions: { parser: vueParser, parserOptions: { parser: tseslint.parser } },
    plugins: { vue },
    rules: { "vue/attributes-order": "error" },
  },
];
