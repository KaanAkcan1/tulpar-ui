import tseslint from "typescript-eslint";
import lit from "eslint-plugin-lit";
import wc from "eslint-plugin-wc";
import vue from "eslint-plugin-vue";
import angular from "angular-eslint";
import prettier from "eslint-config-prettier/flat";

const PRIMITIVE_MESSAGE =
  "Component code must use semantic tokens (var(--tulpar-...)), never primitives (--tulpar-primitive-...). Bind primitives in the brand layer instead.";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/storybook-static/**",
      "**/.web-test-runner/**",
      "**/.angular/**",
      "**/.vite/**",
      "**/out-tsc/**",
      "**/coverage/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    // chai-style assertions (`expect(x).to.be.true`) are expression statements.
    files: ["**/*.test.ts"],
    rules: { "@typescript-eslint/no-unused-expressions": "off" },
  },
  {
    files: ["packages/*/src/**/*.ts", "apps/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@tulpar-ui/*/_internal*", "@tulpar-ui/*/dist/_internal*"],
              message: "_internal is package-private. See docs/architecture/internal-layering.md",
            },
            {
              group: [
                "**/packages/*/src/_internal/**",
                "../../*/src/_internal/**",
                "../../../*/src/_internal/**",
                "@tulpar-ui/*/src/_internal/**",
              ],
              message:
                "No package may import another package's _internal. See docs/architecture/internal-layering.md",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/{core,shell}/src/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "TemplateElement[value.raw=/--tulpar-primitive-/]",
          message: PRIMITIVE_MESSAGE,
        },
        { selector: "Literal[value=/--tulpar-primitive-/]", message: PRIMITIVE_MESSAGE },
      ],
    },
  },
  // Web Components (Lit): lit + wc recommended
  {
    files: ["packages/{core,shell}/src/**/*.ts"],
    extends: [lit.configs["flat/recommended"], wc.configs["flat/recommended"]],
  },
  // Vue SFCs
  {
    files: ["**/*.vue"],
    extends: [vue.configs["flat/recommended"]],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      // Vue 3 still uses the native `slot="..."` attribute to target the named slots of
      // custom elements (see CLAUDE.md "Vue wrapper slot forwarding"). The rule is Vue 2
      // era; its autofix would break slot projection.
      "vue/no-deprecated-slot-attribute": "off",
      // Recommended ships these as warnings; warnings cannot be bulk-suppressed, so make them errors.
      "vue/require-default-prop": "error",
      "vue/no-template-shadow": "error",
    },
  },
  // Formatting is Prettier's job: switch off every stylistic rule that conflicts with it
  // (the vue/recommended formatting rules would otherwise fight `pnpm format`).
  { files: ["**/*.vue"], extends: [prettier] },
  // Angular: TS + templates
  {
    files: ["packages/angular/**/*.ts", "apps/playground-ng/**/*.ts"],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
  },
  {
    files: ["packages/angular/**/*.html", "apps/playground-ng/**/*.html"],
    extends: [angular.configs.templateRecommended],
  },
);
