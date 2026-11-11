// Fails (exit 1) if a built package is not fit to publish:
// - a published package has no dist (nothing may pass silently: run pnpm build);
// - any packages/*/dist/**/*.js contains an inlined lit-html copy (a bundled
//   lit-html registers `litHtmlVersions`; two copies break directives);
// - a core/shell dist file registers an element (`customElements.define`) but
//   no glob in that package's `sideEffects` covers it, so a consumer's bundler
//   would drop the registration;
// - the Angular FESM is full-compiled (`ɵɵdefineComponent`) instead of
//   partial-compiled (`ɵɵngDeclareComponent`), which npm consumers' linkers need.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import picomatch from "picomatch";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkgsDir = join(root, "packages");
const FORBIDDEN = ["litHtmlVersions"];
// Every published package; each must have a dist before this check means anything.
const REQUIRED = ["tokens", "core", "shell", "angular", "vue"];
// Packages whose dist registers custom elements.
const ELEMENT_PACKAGES = ["core", "shell"];

function* walk(dir, ext) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p, ext);
    else if (p.endsWith(ext)) yield p;
  }
}

/** Package-relative POSIX path without a leading "./" (e.g. "dist/a/b.js"). */
const pkgPath = (pkgDir, file) => relative(pkgDir, file).split("\\").join("/");

/**
 * Matcher for a package.json `sideEffects` value, with bundler semantics:
 * `false` covers nothing, `true`/missing covers everything, an array is a list
 * of globs relative to the package root (a glob without "/" matches a basename).
 */
function sideEffectsMatcher(sideEffects) {
  if (sideEffects === false) return () => false;
  if (!Array.isArray(sideEffects)) return () => true;
  const matchers = sideEffects.map((glob) => {
    const g = glob.replace(/^\.\//, "");
    return picomatch(g, { dot: true, basename: !g.includes("/") });
  });
  return (path) => matchers.some((m) => m(path));
}

const missing = [];
const litOffenders = [];
const sideEffectOffenders = [];
const ngOffenders = [];

for (const pkg of REQUIRED) {
  if (!existsSync(join(pkgsDir, pkg, "dist"))) missing.push(pkg);
}

for (const pkg of readdirSync(pkgsDir)) {
  const pkgDir = join(pkgsDir, pkg);
  const dist = join(pkgDir, "dist");
  if (!existsSync(dist)) continue;

  const isElementPkg = ELEMENT_PACKAGES.includes(pkg);
  const covered = isElementPkg
    ? sideEffectsMatcher(JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).sideEffects)
    : null;

  for (const file of walk(dist, ".js")) {
    const text = readFileSync(file, "utf8");
    for (const token of FORBIDDEN) {
      if (text.includes(token)) litOffenders.push(`${relative(root, file)}  (${token})`);
    }
    if (isElementPkg && text.includes("customElements.define") && !covered(pkgPath(pkgDir, file))) {
      sideEffectOffenders.push(relative(root, file));
    }
  }
}

const fesm = join(pkgsDir, "angular", "dist", "fesm2022");
if (existsSync(join(pkgsDir, "angular", "dist"))) {
  const files = existsSync(fesm) ? [...walk(fesm, ".mjs")] : [];
  if (files.length === 0) ngOffenders.push(`${relative(root, fesm)}  (no .mjs files)`);
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (text.includes("ɵɵdefineComponent")) {
      ngOffenders.push(`${relative(root, file)}  (full compilation: ɵɵdefineComponent)`);
    }
    if (!text.includes("ɵɵngDeclareComponent")) {
      ngOffenders.push(`${relative(root, file)}  (not partial: no ɵɵngDeclareComponent)`);
    }
  }
}

for (const pkg of missing) {
  console.error(`check:dist FAILED: missing ${pkg}/dist — run pnpm build first`);
}
if (litOffenders.length > 0) {
  console.error(`check:dist FAILED: ${litOffenders.length} file(s) contain inlined lit-html:`);
  for (const o of litOffenders) console.error(`  ${o}`);
}
if (sideEffectOffenders.length > 0) {
  console.error("check:dist FAILED: element registrations not covered by package.json sideEffects:");
  for (const o of sideEffectOffenders) console.error(`  ${o}`);
}
if (ngOffenders.length > 0) {
  console.error("check:dist FAILED: Angular FESM is not partial-compiled:");
  for (const o of ngOffenders) console.error(`  ${o}`);
}
const failures =
  missing.length + litOffenders.length + sideEffectOffenders.length + ngOffenders.length;
if (failures > 0) process.exit(1);
console.log(
  "check:dist OK: every dist present; no inlined lit-html; element registrations covered by sideEffects; Angular FESM is partial-compiled",
);
