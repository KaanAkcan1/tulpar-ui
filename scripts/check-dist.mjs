// Fails (exit 1) if any built package contains an inlined lit-html copy.
// A bundled lit-html registers `litHtmlVersions`; two copies break directives.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const FORBIDDEN = ["litHtmlVersions"];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith(".js")) yield p;
  }
}

const offenders = [];
const pkgsDir = join(root, "packages");
for (const pkg of readdirSync(pkgsDir)) {
  const dist = join(pkgsDir, pkg, "dist");
  if (!existsSync(dist)) continue;
  for (const file of walk(dist)) {
    const text = readFileSync(file, "utf8");
    for (const token of FORBIDDEN) {
      if (text.includes(token)) offenders.push(`${relative(root, file)}  (${token})`);
    }
  }
}

if (offenders.length > 0) {
  console.error(`check:dist FAILED: ${offenders.length} file(s) contain inlined lit-html:`);
  for (const o of offenders) console.error(`  ${o}`);
  process.exit(1);
}
console.log("check:dist OK: no inlined lit-html in packages/*/dist");
