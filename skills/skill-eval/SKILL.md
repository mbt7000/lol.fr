---
name: skill-eval
description: Measure whether a skill actually improves Claude's output — generate realistic scenarios, run them with and without the skill (A/B), judge blind against a rubric, and issue a promote/revise/retire verdict. Use before adopting a new skill, after editing one, or to compare two competing skills.
---

# Skill Eval

Input (arguments): a SKILL.md path (or two, for a head-to-head).
Output: a scored verdict — **promote / revise (with the specific gaps) /
retire** — backed by blind A/B evidence, not by how good the skill reads.

The principle carried over from LLM engineering: **a skill without an
eval is a guess.** Skills are prompts; prompts regress silently; only
measurement catches it.

## Phase 1 — Build the scenario set

1. Derive 5–10 scenarios from the skill's own trigger ("Use when …"):
   realistic tasks that should invoke it. Include:
   - 2–3 core cases squarely in the skill's lane;
   - 1–2 boundary cases (partially in scope — does the skill overreach?);
   - 1 off-target case (should NOT trigger the skill's behavior — tests
     that the description doesn't cause false invocation);
   - 1 stress case (missing tools, huge input, ambiguous ask — exercises
     the skill's fallback and stop conditions).
2. For each scenario, write the rubric *before* running anything: 3–5
   checkable criteria for what a good response does (took the required
   phase order, stated stop condition, produced the output contract) and
   known failure modes to penalize.

## Phase 2 — Run A/B (blind, parallel where possible)

For each scenario, produce two responses with subagents:

- **Arm A (baseline)**: the scenario prompt alone.
- **Arm B (skilled)**: the scenario prompt with the skill's body
  prepended as operating instructions.

Both arms get identical context otherwise. Run all pairs in one parallel
batch. Without subagent tools, run the arms sequentially in cleanly
separated passes — never let one arm's output leak into the other's
context before both exist.

## Phase 3 — Judge blind

Spawn judges (or run a separate judging pass) that receive the two
responses per scenario **unlabeled and order-shuffled**, plus the rubric.
Judges score each response per criterion and pick a winner per scenario
with one sentence of justification. Judges never know which arm had the
skill — knowing contaminates the verdict.

## Phase 4 — Verdict

Tally across scenarios:

- **Promote**: skilled arm wins the core cases cleanly, doesn't overreach
  on the off-target case, and survives the stress case.
- **Revise**: mixed results — report the *specific* rubric criteria where
  the skilled arm lost or tied, and where in the SKILL.md the gap lives
  (a vague phase, a missing stop condition, an overbroad description).
  Fix and re-run only the failed scenarios.
- **Retire**: baseline matches or beats the skilled arm on core cases —
  the skill adds tokens, not value. Say so plainly; libraries rot by
  accumulating skills nobody dares delete.

Head-to-head mode (two skills): same procedure, arms = skill 1 vs
skill 2, plus a shared baseline to detect "both are worse than nothing".

## Report

Per scenario: winner + margin + one-line reason. Then the verdict, the
revision list if any, and the eval set itself — **commit the scenarios
and rubrics next to the skill** (`skills/<name>/eval.md`) so the next
edit re-runs the same measuring stick instead of inventing a new one.

## Rules

- Two rounds of revise-and-rerun maximum per sitting; a skill failing
  twice needs rethinking, not re-prompting.
- Never eval a skill on scenarios it was forged from (see `skill-forge`)
  alone — at least half the set must be fresh, or the eval memorizes.
