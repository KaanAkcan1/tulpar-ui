import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/storybook-static/**",
      "**/.web-test-runner/**",
      "**/.angular/**",
      "**/.vite/**",
      "**/out-tsc/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
    },
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
              message:
                "_internal is package-private. See docs/architecture/internal-layering.md",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/*/src/**/*.styles.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "TemplateElement[value.raw=/--tulpar-primitive-/]",
          message:
            "Component styles must use semantic tokens (var(--tulpar-...)), never primitives (--tulpar-primitive-...). Bind primitives in the brand layer instead.",
        },
      ],
    },
  },
];
