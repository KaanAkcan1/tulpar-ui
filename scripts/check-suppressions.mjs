// New code may not add ESLint suppressions: per rule, the total count in the working
// tree's eslint-suppressions.json must not exceed the count in the base branch's file.
//
// Base file lookup: `origin/main`, else the merge-base with it. If neither has the file
// (first introduction of suppressions, as on the first phase-1 PR), there is no baseline
// and the check passes. A missing base is NOT treated as "all counts zero".
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const FILE = "eslint-suppressions.json";
const BASE_REF = process.env.SUPPRESSIONS_BASE_REF ?? "origin/main";

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

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
