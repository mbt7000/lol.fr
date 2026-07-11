---
name: adversarial-verify
description: Verify a claim, finding, or diff by spawning N independent skeptics that each try to REFUTE it; majority-refute kills it. Use before shipping a risky conclusion, merging a nontrivial change, or reporting a surprising finding.
---

# Adversarial Verify

Input (arguments): one or more claims, findings, or a description of a
change to verify. Output: a verdict per item — `CONFIRMED`, `REFUTED`, or
`UNVERIFIABLE` — with evidence.

The single rule that makes this work: **verifiers try to destroy the claim,
never to support it.** A confirmation from a verifier that was hunting for
a kill is worth something; a confirmation from a verifier asked "is this
right?" is worth nothing.

## Procedure

1. **Atomize.** Split the input into individually falsifiable items. "The
   cache layer is broken and slow" is two items.

2. **Spawn skeptics** — 3 per item (5 for high-stakes items), all in one
   batch, each with a *different lens* so failure modes don't overlap:
   - **Reproduction lens**: re-derive the evidence from scratch — rerun the
     command, reread the source, recompute the number.
   - **Alternative-explanation lens**: assume the observation is real but
     the interpretation is wrong; find another cause that fits.
   - **Boundary lens**: find inputs/conditions where the claim fails
     (edge cases, versions, platforms, timeframes).
   - (High stakes, add) **Incentive lens**: who benefits if this claim is
     believed; check for cherry-picking. **Staleness lens**: is it still
     true today.

   Every skeptic prompt ends with: *"Your job is to refute this. If you
   cannot gather evidence either way, answer `unverifiable` — do not
   default to confirmed."*

3. **Tally.** Per item:
   - any skeptic refutes **with reproducible evidence** → `REFUTED`
     (one solid kill beats two lazy passes);
   - majority confirm with evidence and no solid kill → `CONFIRMED`;
   - otherwise → `UNVERIFIABLE`.

4. **Report** a table: item, verdict, strongest evidence line, dissent if
   any. Never silently drop an `UNVERIFIABLE` — that is how false claims
   re-enter through the back door.

## For code changes specifically

Skeptics must *execute*, not read: run the test suite, run the changed code
path with hostile inputs, check the behavior the change claims to fix
actually reproduces before the change and disappears after it.

## Fallback (no subagent tools)

Run the lenses yourself as separate, labeled passes — finish the
reproduction pass completely before starting the alternative-explanation
pass, so the passes stay independent in substance.
