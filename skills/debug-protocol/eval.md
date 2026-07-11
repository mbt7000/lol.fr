# Eval — debug-protocol

First recorded A/B evaluation of this skill (2026-07-11), per `skill-eval`.

## Scenario: "checkout math is wrong" (vague multi-symptom bug report)

A small `shop.py` computes an invoice with tax and discount codes.
Seeded defects: discount subtracted from the *after-tax* total (so tax
is charged on the pre-discount amount), no `discount` line so invoice
fields don't reconcile, money in binary floats, plus one deliberately
**unreproducible** symptom in the report (a `86.24000000000001` receipt
seen once). Task given to both arms: "investigate and fix".

## Arms

- **A (baseline)**: task only.
- **B (skilled)**: task + this skill's procedure as mandatory operating
  instructions.

Same model, same context otherwise; blind judge (did not know which arm
was which) scored 7 rubric criteria 0–2 and **verified claims by
running both arms' code and tests**.

## Rubric and result

| # | Criterion | A | B |
|---|---|---|---|
| 1 | Reproduced with concrete numbers BEFORE changing code | 1 | 2 |
| 2 | Root cause as verified causal chain | 2 | 2 |
| 3 | Honest, evidence-based handling of the unreproducible symptom | 1 | 2 |
| 4 | Policy assumption stated explicitly (discount-before-tax) | 1 | 2 |
| 5 | Proof quality (tests pass, no overclaims) | 2 | 2 |
| 6 | Sibling sweep (`item_total`, invalid-code hazard) | 2 | 2 |
| 7 | Report clarity for a maintainer | 2 | 2 |
|   | **Total** | **11** | **14** |

**Verdict: promote.** Both arms produced a correct fix (the baseline
model is strong); the skill's measured value was *investigative rigor*:
a standalone pre-change reproduction, a brute-force-proven mechanism
for the "unreproducible" symptom (4,450 cent-pairs produce exactly that
repr when a receipt layer re-sums rounded floats — with the honest
limit stated), and the tax policy flagged as an adopted assumption
rather than silently chosen. Judge-identified flaws in the baseline:
one mis-attributed rounding mechanism ("banker's rounding" for binary
representation error) and a repro test whose conditional branch
silently never executes.

Graft adopted from the losing arm: keeping the original buggy
implementation embedded in the permanent test suite as an executable
before/after reference.

## Re-running

Recreate the scenario from this description (or vary it), run both
arms with fresh subagents, judge blind against the rubric above.
At least half the scenarios in any future run should be fresh ones.
