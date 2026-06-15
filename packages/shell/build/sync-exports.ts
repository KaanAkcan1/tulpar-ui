import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, "../package.json");
const srcDir = resolve(__dirname, "../src");

type ExportEntry = { types: string; import: string };
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

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const next = JSON.stringify(exportsMap);
const current = JSON.stringify(pkg.exports);

if (process.argv.includes("--check")) {
  if (next !== current) {
    // NOTE: when copying this script to another package, update the filter name below
    console.error("exports drift: run `pnpm --filter @tulpar-ui/shell run sync-exports`");
    process.exit(1);
  }
  console.log("exports in sync");
} else {
  pkg.exports = exportsMap;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("exports updated");
}
