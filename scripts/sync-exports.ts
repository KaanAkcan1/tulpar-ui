/**
 * Regenerates the `exports` map of a package from each src subdirectory index.ts.
 * Usage: tsx ../../scripts/sync-exports.ts <packageDir> [--check]
 * Writes only when the serialized result differs. `--check` exits 1 on drift.
 */
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const check = args.includes("--check");
const dirArg = args.find((a) => !a.startsWith("--"));
if (!dirArg) {
  console.error("usage: sync-exports.ts <packageDir> [--check]");
  process.exit(2);
}

const pkgDir = resolve(process.cwd(), dirArg);
const pkgPath = resolve(pkgDir, "package.json");
const srcDir = resolve(pkgDir, "src");

type ExportEntry = { types: string; import: string } | string;
const exportsMap: Record<string, ExportEntry> = {
  ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
};
for (const d of readdirSync(srcDir, { withFileTypes: true })) {
  // directories starting with _ are package-private (e.g. _internal) and not exported
  if (!d.isDirectory() || d.name.startsWith("_")) continue;
  if (!existsSync(resolve(srcDir, d.name, "index.ts"))) continue;
  exportsMap[`./${d.name}`] = {
    types: `./dist/${d.name}/index.d.ts`,
    import: `./dist/${d.name}/index.js`,
  };
}
// Tools (bundler plugins, CEM consumers) read the manifest through `exports`.
exportsMap["./package.json"] = "./package.json";

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const drift = JSON.stringify(exportsMap) !== JSON.stringify(pkg.exports);

if (check) {
  if (drift) {
    console.error(`exports drift: run \`pnpm --filter ${pkg.name} run sync-exports\``);
    process.exit(1);
  }
  console.log("exports in sync");
} else {
  pkg.exports = exportsMap;
  const serialized = JSON.stringify(pkg, null, 2) + "\n";
  if (serialized !== readFileSync(pkgPath, "utf8")) {
    writeFileSync(pkgPath, serialized);
    console.log("exports updated");
  } else {
    console.log("exports already up to date");
  }
}
