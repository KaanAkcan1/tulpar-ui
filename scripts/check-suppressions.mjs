// New code may not add ESLint suppressions: per rule, the total count in the working
// tree's eslint-suppressions.json must not exceed the count in the base branch's file.
//
// Base file lookup: `SUPPRESSIONS_BASE_REF` (CI push: the previous tip), else `origin/main`, else the merge-base with it. If neither has the file
// (first introduction of suppressions, as on the first phase-1 PR), there is no baseline
// and the check passes. A missing base is NOT treated as "all counts zero".
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const FILE = "eslint-suppressions.json";
// On `push`, CI passes the previous tip (`github.event.before`) so a push to main compares
// against what main held before it (origin/main would equal HEAD and always pass). A new
// branch push reports an all-zero `before`: fall back to origin/main. Unset or empty
// (pull_request, local runs) also means origin/main.
const requestedRef = process.env.SUPPRESSIONS_BASE_REF;
const BASE_REF =
  requestedRef && !/^0+$/.test(requestedRef) ? requestedRef : "origin/main";

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

function refResolves(ref) {
  try {
    git("rev-parse", "--verify", "--quiet", ref);
    return true;
  } catch {
    return false;
  }
}

function readBase() {
  const refs = [BASE_REF];
  try {
    refs.push(git("merge-base", "HEAD", BASE_REF).trim());
  } catch {
    // base ref unknown (shallow clone etc.) — fall through
  }
  for (const ref of refs) {
    try {
      return JSON.parse(git("show", `${ref}:${FILE}`));
    } catch {
      // not present at this ref
    }
  }
  return null;
}

function totals(json) {
  const out = {};
  for (const rules of Object.values(json))
    for (const [rule, { count }] of Object.entries(rules)) out[rule] = (out[rule] ?? 0) + count;
  return out;
}

const base = readBase();
if (!base) {
  // In CI a missing base ref means a shallow checkout (set `fetch-depth: 0`); passing
  // would let new suppressions through unnoticed, so fail closed.
  if (process.env.CI === "true" && !refResolves(BASE_REF)) {
    console.error(
      `check:suppressions: cannot resolve ${BASE_REF} in CI (shallow checkout?). Use fetch-depth: 0.`,
    );
    process.exit(1);
  }
  console.log(
    `check:suppressions: no ${FILE} on ${BASE_REF}/merge-base — first introduction, pass.`,
  );
  process.exit(0);
}
const current = existsSync(FILE) ? totals(JSON.parse(readFileSync(FILE, "utf8"))) : {};
const baseline = totals(base);

let failed = false;
for (const [rule, count] of Object.entries(current)) {
  const before = baseline[rule] ?? 0;
  if (count > before) {
    console.error(`check:suppressions: ${rule} grew from ${before} to ${count}`);
    failed = true;
  }
}
if (failed) {
  console.error("New code may not add lint suppressions. Fix the violations instead.");
  process.exit(1);
}
console.log("check:suppressions: OK (no rule gained suppressions).");
