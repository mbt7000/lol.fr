# Architecture — Why These Patterns Work

This document explains the design theory behind the skills in this library:
how frontier multi-agent orchestration ("Fable-style") gets better answers
than a single long-context pass, and the failure modes each pattern exists
to prevent.

## 1. The problem with one big pass

A single agent answering a hard question in one pass has three structural
weaknesses:

1. **Anchoring** — its first framing of the problem contaminates everything
   after. If the first hypothesis is wrong, all subsequent "evidence"
   gets read through it.
2. **Context dilution** — by the time it has read 40 files or 30 sources,
   the early material is compressed and fuzzy; contradictions between
   source 3 and source 27 go unnoticed.
3. **Self-grading** — the same mind that produced a claim checks it. It
   re-runs the reasoning that produced the error and reproduces the error.

Every pattern in this library is a structural fix for one or more of these.

## 2. The four-phase backbone

```
DECOMPOSE ──► FAN-OUT ──► VERIFY ──► SYNTHESIZE
 (inline)    (parallel)   (parallel)   (inline)
```

### Decompose (fixes anchoring)

Slicing happens *before* any evidence is gathered, so the plan can't be
anchored by early findings. The key output is not the slice list but the
**output shape contract** per slice — parallel results are only mergeable
if their shapes were fixed in advance.

### Fan-out (fixes context dilution)

Each worker holds only its slice, at full resolution. Ten workers reading
four files each beat one agent reading forty: nothing is fuzzy.

The non-negotiable rule is **blindness**: workers must not see each
other's output during a round. Two independent agents making the same
mistake is unlikely; two agents where the second read the first's answer
making the same mistake is nearly guaranteed. Independence is what makes
agreement between workers *evidence* rather than *echo*.

### Verify (fixes self-grading)

Verification is done by *fresh* agents whose prompt inverts the goal:
refute, don't confirm. This matters because of asymmetric effort — an
agent asked "is this right?" pattern-matches to yes; an agent asked
"prove this wrong" actually re-derives the evidence. The tally rule is
asymmetric too: one refutation **with reproducible evidence** beats any
number of lazy confirmations.

Verifier **lens diversity** (reproduction / alternative explanation /
boundary conditions) matters more than verifier count: three identical
skeptics share blind spots; three different lenses don't.

### Synthesize (must be inline)

Synthesis is never delegated, for two reasons: the synthesizer needs the
*conversation's* full intent (which workers never had), and conflicts
between survivors are judgment calls the top-level agent is accountable
for. Delegating synthesis re-introduces self-grading one level up.

## 3. Stop conditions are part of the architecture

Unbounded loops are the classic multi-agent failure. Every skill here
carries hard stop conditions:

- **Saturation** (`loop-until-dry`): stop after K consecutive rounds with
  zero new findings — the only sound stop for unknown-size discovery.
- **Round caps**: two decompose rounds, eight discovery rounds, one judge
  round. Caps convert "runs forever" into "reports honestly with limits
  stated".
- **Scope collapse**: if verification kills most of a round, the problem
  is the question, not the workers — stop and re-scope.

A report must always say *which* stop condition ended the run. "Saturated"
and "hit the cap" are different epistemic claims.

## 4. Bookkeeping rules that prevent silent failure

- **Dedup against everything ever seen, not against the accepted list.**
  Otherwise verification-rejected findings resurface each round and the
  loop never converges.
- **Policy is written once, centrally.** In `swarm-migrate` the transform
  spec is authored inline before workers run; workers apply or
  skip-and-report, never improvise. Centralized policy + distributed labor
  is what keeps 200 parallel edits consistent.
- **No silent truncation.** Anything skipped, capped, sampled, or left
  unverified is named in the final report.

## 5. Mapping to Claude Code primitives

| Concept | Native mechanism |
|---|---|
| Fan-out | Multiple `Agent` tool calls issued in one message run concurrently |
| Deterministic multi-stage orchestration | `Workflow` tool: `parallel()`, `pipeline()`, per-agent JSON schemas |
| Worker isolation for parallel file edits | `isolation: worktree` on agent spawn |
| Structured worker output | `schema` option — validation retries malformed output |
| Saturation loops | plain loop state (`seen` / `accepted` / `dry`) kept inline |

And the graceful-degradation ladder every skill follows:

1. `Workflow` available → scripted orchestration.
2. Only `Agent` available → batched subagent spawns per phase.
3. Neither → the same phases run sequentially in one context, with the
   passes kept explicitly separate (generation fully finished before
   judging; refutation as a labeled distinct pass). The *structure*
   survives even when the parallelism doesn't — and the structure is most
   of the benefit.

## 6. When NOT to orchestrate

Parallel orchestration has real costs (tokens, wall-clock setup, merge
overhead). Skip it when:

- the task is a single-fact lookup or a < 30-line diff;
- the slices would all depend on one unknown (resolve it first);
- the user asked for a quick take, not an audit.

The skills encode these bail-outs — `parallel-review` reviews trivial
diffs inline, `orchestrate` resolves blocking unknowns before slicing.
Knowing when to stay sequential is part of the pattern.
