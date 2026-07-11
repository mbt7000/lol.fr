---
name: orchestrate
description: Master orchestration pattern for any large task — decompose into independent slices, fan out parallel subagents, adversarially verify results, synthesize one answer. Use when the user asks to tackle a big/complex task "thoroughly", "in parallel", or "like an advanced multi-agent system".
---

# Orchestrate

Run the task passed as arguments through the four-phase frontier pattern:
**Decompose → Fan-out → Verify → Synthesize**. Never skip a phase; the
structure is the value.

## Phase 1 — Decompose (inline, no agents)

Before spawning anything, produce a written slice plan:

1. Restate the goal in one sentence.
2. Split it into 3–8 **independent** slices. Two slices are independent only
   if neither needs the other's output. If everything depends on one unknown,
   resolve that unknown inline first, then re-slice.
3. For each slice write: objective, inputs it needs, and the exact shape of
   the output it must return (a list, a table, a diff, a verdict).

Do not proceed until every slice has a defined output shape — vague slices
produce unmergeable results.

## Phase 2 — Fan-out (parallel workers)

- Spawn one subagent per slice **in a single batch** so they run
  concurrently. If the `Workflow` tool is available and there are more than
  ~6 slices or multiple stages, prefer it with `pipeline()`.
- Each worker prompt must contain: full context it needs (workers cannot see
  the conversation), its single objective, the required output shape, and
  the instruction "return raw data, not prose for a human".
- Workers must be **blind to each other**. Never paste worker A's findings
  into worker B's prompt during the same round.
- If a worker fails or returns garbage, respawn it once with a sharper
  prompt; after a second failure, do that slice inline and note it.

## Phase 3 — Verify (adversarial)

For every load-bearing claim or change produced in Phase 2:

- Spawn a verifier whose prompt says to **refute** it, not to confirm it:
  "Try to prove this finding/change is wrong. Default to refuted if you
  cannot reproduce the evidence."
- Code changes: verifier runs the tests/build and exercises the change.
- Facts: verifier checks the primary source, not the summary.
- Kill anything refuted. If more than a third of results die, the decompose
  was flawed — go back to Phase 1 with what you learned.

Cheap results (mechanical lookups, direct quotes with sources) may skip
per-item verification, but say so explicitly in the final report.

## Phase 4 — Synthesize (inline)

Merge only surviving results yourself — never delegate synthesis:

1. Deduplicate and resolve conflicts; when two survivors disagree, prefer
   the one with reproducible evidence, and disclose the conflict.
2. Produce the single deliverable the user asked for (report, diff, plan).
3. Append a short coverage note: slices run, findings killed in
   verification, and anything not covered.

## Stop conditions

- Hard cap: two decompose rounds. If the second round still fails
  verification massively, report what is known and what is blocked.
- Never loop workers on the same slice more than twice.

## Fallback (no subagent tools)

Execute the same four phases sequentially in this context. Keep the phases
visibly separated in your output; write the verification pass as if a
different person were attacking the results.
