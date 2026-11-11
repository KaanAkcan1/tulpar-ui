// Fails (exit 1) if a built package is not fit to publish:
// - any packages/*/dist/**/*.js contains an inlined lit-html copy (a bundled
//   lit-html registers `litHtmlVersions`; two copies break directives);
// - a core/shell dist chunk registers an element but its name is not covered
//   by `sideEffects` (`./dist/tulpar-*.js`), so a consumer bundle would drop it;
// - the Angular FESM is full-compiled (`ɵɵdefineComponent`) instead of
//   partial-compiled (`ɵɵngDeclareComponent`), which npm consumers' linkers need.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const FORBIDDEN = ["litHtmlVersions"];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith(".js")) yield p;
  }
}

const offenders = [];
let distCount = 0;
const pkgsDir = join(root, "packages");
for (const pkg of readdirSync(pkgsDir)) {
  const dist = join(pkgsDir, pkg, "dist");
  if (!existsSync(dist)) continue;
  distCount++;
  for (const file of walk(dist)) {
    const text = readFileSync(file, "utf8");
    for (const token of FORBIDDEN) {
      if (text.includes(token)) offenders.push(`${relative(root, file)}  (${token})`);
    }
  }
}

if (distCount === 0) {
  console.error("check:dist FAILED: no dist found - run pnpm build first");
  process.exit(1);
}

const ngOffenders = [];
const fesm = join(pkgsDir, "angular", "dist", "fesm2022");
if (existsSync(fesm)) {
  const files = readdirSync(fesm).filter((n) => n.endsWith(".mjs"));
  if (files.length === 0) ngOffenders.push(`${relative(root, fesm)}  (no .mjs files)`);
  for (const name of files) {
    const file = join(fesm, name);
    const text = readFileSync(file, "utf8");
    if (text.includes("ɵɵdefineComponent")) {
      ngOffenders.push(`${relative(root, file)}  (full compilation: ɵɵdefineComponent)`);
    }
    if (!text.includes("ɵɵngDeclareComponent")) {
      ngOffenders.push(`${relative(root, file)}  (not partial: no ɵɵngDeclareComponent)`);
    }
  }
}

const sideEffectOffenders = [];
for (const pkg of ["core", "shell"]) {
  const dist = join(pkgsDir, pkg, "dist");
  if (!existsSync(dist)) continue;
  for (const name of readdirSync(dist)) {
    if (!name.endsWith(".js") || name === "index.js" || name.startsWith("tulpar-")) continue;
    if (readFileSync(join(dist, name), "utf8").includes("customElements.define")) {
      sideEffectOffenders.push(relative(root, join(dist, name)));
    }
  }
}

if (offenders.length > 0) {
  console.error(`check:dist FAILED: ${offenders.length} file(s) contain inlined lit-html:`);
  for (const o of offenders) console.error(`  ${o}`);
}
if (ngOffenders.length > 0) {
  console.error(`check:dist FAILED: Angular FESM is not partial-compiled:`);
  for (const o of ngOffenders) console.error(`  ${o}`);
}
if (sideEffectOffenders.length > 0) {
  console.error("check:dist FAILED: element chunks outside sideEffects (./dist/tulpar-*.js):");
  for (const o of sideEffectOffenders) console.error(`  ${o}`);
}
if (offenders.length + ngOffenders.length + sideEffectOffenders.length > 0) process.exit(1);
console.log(
  "check:dist OK: no inlined lit-html; Angular FESM is partial-compiled; element chunks match sideEffects",
);
