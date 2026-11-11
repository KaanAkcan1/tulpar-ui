// Guardrail probe: lints virtual files and asserts the expected rule IDs fire
// (or do not fire). Proves the lint config actually closes the known gaps.
import { ESLint } from "eslint";

const cases = [
  {
    name: "primitive token in a plain string literal (core)",
    filePath: "packages/core/src/__probe__/a.ts",
    code: 'export const c = "var(--tulpar-primitive-color-colpan-50)";',
    expect: "no-restricted-syntax",
  },
  {
    name: "relative cross-package _internal import",
    filePath: "packages/shell/src/__probe__/b.ts",
    code: 'import "../../../core/src/_internal/warn-dev";',
    expect: "no-restricted-imports",
  },
  {
    name: "package-specifier cross-package _internal import",
    filePath: "packages/shell/src/__probe__/c.ts",
    code: 'import "@tulpar-ui/core/src/_internal/warn-dev";',
    expect: "no-restricted-imports",
  },
  {
    name: "control: own-package _internal import stays legal",
    filePath: "packages/core/src/button/__probe__.ts",
    code: 'import "../_internal/warn-dev";',
    expect: null,
  },
];

const eslint = new ESLint();
let failed = 0;
for (const c of cases) {
  const [result] = await eslint.lintText(c.code, { filePath: c.filePath });
  const ids = result.messages.map((m) => m.ruleId);
  const ok = c.expect === null ? ids.length === 0 : ids.includes(c.expect);
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}  (reported: ${ids.join(", ") || "none"})`);
  if (!ok) failed++;
}
if (failed) {
  console.error(`lint:probe: ${failed} case(s) failed`);
  process.exit(1);
}
