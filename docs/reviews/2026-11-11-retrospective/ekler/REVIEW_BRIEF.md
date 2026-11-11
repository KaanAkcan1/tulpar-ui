# Tulpar UI — Retrospective Review Brief (shared by all review agents)

## What this is
A retrospective review of EVERYTHING built so far in Tulpar UI (v0.1 → v0.15): code, decisions, specs, plans,
docs, tests, playgrounds, Storybook, infra, release. The owner (Kaan) will decide which branches to merge based on
the final report. The goal is to find everything missing, broken, wrong or weak, and propose the MOST CORRECT,
industry-standard solution for each — not patches.

## Repo state (do not change it)
- Repo: `C:\Source\Kaan\tulpar-ui`. Current branch: `review/retro-2026-11-11` (local only) = main + feat/v0.15-select-completion
  + chore/skills-and-housekeeping + chore/node-26-lts merged. This is the "post-merge" state under review.
- `pnpm build` is already done on this branch. All tests already ran green (tokens 197, core 1371, shell 103,
  angular 202, vue 244). Lint is green.
- Node 26.3 local; `.nvmrc` now 26.13.0 (LTS).

## HARD RULES
1. READ-ONLY. Do NOT edit, create or delete any file inside the repo. Do NOT run git commands that change state
   (no checkout/switch/stash/commit/reset/merge). `git log`, `git show`, `git diff`, `git blame` are fine.
2. Do NOT run `pnpm install`, `pnpm build`, `pnpm format`, or any repo-wide test unless your section explicitly allows it.
   Other agents work in the same directory at the same time.
3. Write your output ONLY to your assigned file under
   `C:\Users\KAAN~1.AKC\AppData\Local\Temp\claude\c--Source-Kaan-tulpar-ui\b970f3d3-5fd6-42d8-b52f-a4deae3d71f0\scratchpad\review\`.
   Screenshots also go under that `review\` folder (subfolder `shots\`).
4. Do not ask questions. Work autonomously to the end. If something blocks you, record it as a finding with
   severity "Info" and continue.
5. Verify before you claim. Each finding needs evidence (file:line, command output, screenshot, spec quote). Mark
   confidence `Verified` (you reproduced/confirmed it) or `Plausible` (strong reading, not reproduced). No guesses
   presented as facts.
6. "En doğru çözüm" rule (owner's rule): never propose a band-aid. Propose the correct, current industry solution
   (standard, RFC, WAI-ARIA APG, framework's built-in way, what mature design systems do). If you also mention a
   cheaper interim fix, label it explicitly "Interim". If an existing decision/code is wrong, say so plainly:
   "This was done as X; the correct approach is Y because Z." Do NOT copy an existing wrong pattern for consistency.
7. Respect binding project decisions unless they are genuinely wrong — then argue it with evidence:
   `CLAUDE.md`, `docs/roadmap.md`, `docs/architecture/internal-layering.md`, specs in `docs/superpowers/specs/`,
   plans in `docs/superpowers/plans/`. Out-of-scope lists are binding: a missing out-of-scope feature is NOT a finding.
   Do not propose pulling future-wave components forward.
8. Design skills (invoke via the Skill tool when your section touches visual/UX/a11y): `impeccable`,
   `frontend-design:frontend-design`, `fronend-design`, `ui-ux-pro-max:ui-ux-pro-max`, `minimalist-ui`,
   `redesign-existing-projects`, `design-references`, `awesome-design-md`, `awesome-claude-design`,
   `web-design-guidelines`, `design-taste-frontend`, `genjutsu` (motion only). Caveats: `design-taste-frontend` and
   `minimalist-ui` target marketing pages — use only their anti-slop, spacing, typography and a11y rules; never their
   palette/font prescriptions. Tulpar keeps its own 3-layer token system and mythology palette. `design-references`
   is evidence only: benchmark ≥3 real systems, never copy a brand look.
9. Map of the code: `C:\Source\Kaan\tulpar-ui\graphify-out\GRAPH_REPORT.md` (and graph.json). Use it to orient; it is
   AST-only (no semantic edges). Graphify hints already noted: Vue wrappers reference `FieldSize`/`SelectionSize`
   defined in `core/src/_internal/…` (possible `_internal` boundary leak — verify how they are imported);
   `packages/tokens/package.json` pins `vitest@^1.3.0` + `vite@^5.1.0` while others use catalog (vitest 3 / vite 8).

## Known findings already logged (do not re-report; you may add evidence or correct them)
- K1 v0.15: search `<input role=combobox>` is rendered INSIDE `role=listbox` (tulpar-select.ts ~853-862) — invalid ARIA (Verified).
- K2 v0.15 (Plausible, from code review — please verify if in your area): data-mode empty/no-match status row computed from
  previous render; `_filterResult` not recomputed on slot changes while a query is active; reopen seeds active option
  from stale filter; Home/End in search input move options instead of caret; diacritic FOLD map lacks uppercase accented
  Latin (É, Ñ…); `options`→`null` transition leaves slotted options without ids.
- K3 CLAUDE.md status block is stale (says "v0.6 in progress").
- K4 npm still at 0.6.0; 9 changesets pending since v0.7; a `changeset-release/main` remote branch exists.
- K5 Full `pnpm test` intermittently fails with Vitest "UNKNOWN: unknown error, open …\Temp\…\web\<hash>" unhandled
  errors (vitest cache write on Windows); single-package reruns pass.
- K6 deploy.yml hardcoded Node 22.22.3 (FIXED on chore/node-26-lts).
- K7 `@angular/build@22` has unmet peer `vitest@^4.0.8` (found 3.2.6).
- K8 Dark-mode select match highlight (`<mark>`, 14% alpha green) is weak on the active row.

## Output format (Markdown, one file per agent)
Start with a 5–10 line "Area summary" (state of the area, overall verdict: Solid / Needs work / Weak).
Then a findings table, then one section per finding:

```
### <AREA-ID>-<n>: <short title>
- Severity: Blocker | Major | Minor | Nit | Info
- Merge-blocking for current branches: Yes | No
- Confidence: Verified | Plausible
- Where: path/to/file.ts:123 (and others)
- Problem: what is wrong, concretely (inputs → wrong output, or the violated rule).
- Evidence: quote/command/screenshot path.
- Why it matters: user/a11y/maintenance/commercial impact.
- Correct solution: the industry-standard fix, with the reference (APG URL, spec, framework doc, ≥1 real design system).
- Interim (optional): cheaper stop-gap, explicitly labelled.
- Effort: S | M | L
```
Severity guide: Blocker = broken behavior/a11y failure/data loss/release-breaking; Major = wrong design/arch decision
or significant bug with workaround; Minor = small bug/inconsistency; Nit = polish; Info = observation/process note.
Also list "Things done well" (short, max 8 bullets) — so the owner knows what to keep.
End with "Open questions for the owner" (only decisions that are genuinely his).
Write in English (the lead agent translates). Be thorough but do not pad: no finding without evidence.
