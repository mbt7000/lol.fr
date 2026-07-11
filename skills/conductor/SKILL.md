---
name: conductor
description: The library's front door — take any incoming task, classify it, route it through the right skill chain with clean handoffs, and verify the result before reporting. Use when the user gives a task without naming a skill, or asks "handle this properly".
---

# Conductor

Input (arguments): any task. Output: the task done via the right
procedure — or a crisp statement of what's blocking. The conductor is
what turns a *collection* of skills into a *system*: one entry point,
deliberate routing, chained execution.

## Phase 1 — Classify before touching anything

Read the task and place it (multiple labels allowed):

| Signal in the task | Route |
|---|---|
| something is broken, failing, wrong output | `debug-protocol` (prod down? `incident-response` first) |
| CI/pipeline red | `ci-doctor` |
| build a feature from a loose description | `spec-first` → implement → `test-architect` → `parallel-review` |
| "review this" / pre-merge | `parallel-review` (add `security-audit` if auth/money/input paths changed) |
| "make it faster" / resource cost | `perf-optimize` |
| restructure without behavior change | `refactor-safely` (many mechanical sites? `swarm-migrate`) |
| unfamiliar codebase involved | `legacy-explore` first, then re-classify |
| open question, "find out", compare options | `deep-research` / `sci-research` (scientific) / `judge-panel` (design choice) |
| "find ALL X" / exhaustiveness demanded | `loop-until-dry` |
| docs, README, runbook | `write-docs` |
| data/metrics question | `data-analysis` |
| LLM feature/prompt | `prompt-engineer` |
| API/interface to design | `api-design` |
| big multi-part task, "thoroughly" | `orchestrate` as the outer frame |

No match → do it directly with good judgment; then consider whether the
pattern deserves a `skill-forge` candidate.

## Phase 2 — Plan the chain (say it out loud)

1. State the route in one line before executing ("spec-first →
   implement → test-architect → parallel-review") so the user can
   redirect cheaply.
2. **Right-size it.** A typo fix does not get a five-skill chain — the
   conductor's judgment is knowing when procedure pays and when it's
   ceremony. Rule of thumb: chain length scales with blast radius, not
   with how interesting the task is.
3. Define each handoff's contract: what artifact skill A must produce
   for skill B (a spec, a site list, a verdict table). A chain without
   contracts is just vibes in sequence.

## Phase 3 — Execute with checkpoints

- Run each stage per its skill; at each handoff, check the contract
  artifact exists and is sane before proceeding — a chain that barrels
  through a failed stage multiplies the failure.
- Surprises that change the classification (the "feature" is actually a
  bug, the "small fix" touches a trap from the danger list) → stop,
  re-classify, restate the new route.
- Blocked on something only the user can decide → park it precisely
  (what's decided, what's needed, options with a recommendation) rather
  than guessing on scope.

## Phase 4 — Close

Verify the end state against the original ask (not against the last
stage's output — drift accumulates), then report: what was done, route
taken, evidence it works, anything parked. If a `work-hub` exists,
update it in the same pass.

## Rules

- Never run more than one *mutating* chain stage at a time; parallel is
  for reading and verifying (see `orchestrate` for the exception with
  isolated worktrees).
- Two re-classifications maximum — a task that keeps reclassifying is
  underspecified: route it to `spec-first`.
