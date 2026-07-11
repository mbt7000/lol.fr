---
name: claude-tuner
description: Compile a personal Claude configuration from evidence — audit the repo and the user's real habits, then generate a tailored CLAUDE.md, a skill loadout, permission allowlist, and hook suggestions that make every future session sharper. Use when the user wants to "set up my Claude", onboard Claude to a project properly, or tune a sloppy existing setup.
---

# Claude Tuner

Output: a tuned, evidence-based configuration — `CLAUDE.md`, a skill
loadout, and settings suggestions — compiled from how this project and
this user actually work. "Developing your own Claude" is configuration
engineering, and configuration should be compiled from evidence, not
written from vibes.

## Phase 1 — Audit the evidence

1. **The project**: languages and frameworks (from lockfiles/manifests,
   not guesses); how to build, test, lint, run (from CI config and
   scripts — CI is the executable truth); directory conventions; the
   golden paths (the 3 commands developers actually run all day).
2. **The user's habits**: recurring corrections and preferences visible
   in the conversation and local session history — formatting choices,
   commit style, "always/never" rules they've stated, tools they reach
   for. (Same sources and privacy rules as `skill-forge`.)
3. **The existing setup**: current CLAUDE.md (what's stale? what does it
   say that the code contradicts?), installed skills, settings.json
   permissions, hooks. Diff claimed conventions against 5 real files —
   **the code outranks the docs** when they disagree.

## Phase 2 — Compile CLAUDE.md (the contract, not an essay)

Structure, in priority order (Claude reads this every session — every
wasted line is a tax on every future turn):

1. **Commands**: build/test/lint/run, exactly as CI runs them.
2. **Hard rules**: the always/never list mined from corrections — each
   one line, imperative, checkable ("migrations ship with a rollback
   script", "never edit generated/ files").
3. **Architecture in 10 lines**: the map a new engineer needs on day one
   (see `legacy-explore` for how to derive it).
4. **Conventions with examples**: one good file to imitate per layer
   beats three paragraphs of description.

Everything else — history, philosophy, edge-case lore — goes to linked
docs or the vault, not CLAUDE.md. Target: under ~60 lines. Verify each
claim before writing it; a wrong CLAUDE.md is obeyed wrongly forever.

## Phase 3 — Assemble the loadout

- **Skills**: from this library and the user's own, pick the 5–10 that
  match the project's actual work (a data repo gets `data-analysis`; a
  service repo gets `incident-response`, `ci-doctor`). Fewer, relevant
  skills beat installing all of them — descriptions compete for
  auto-invocation.
- **Gaps**: recurring patterns with no matching skill → hand them to
  `skill-forge` as candidates.
- **Permissions**: propose an allowlist for the commands the audit saw
  used repeatedly and safely (test runners, linters, package scripts) so
  sessions prompt less; never auto-allow anything destructive or
  outward-facing (push, deploy, delete) without the user's explicit nod.
- **Hooks**: only where the audit found a "we always forget X" — e.g.
  format-on-edit, or a pre-stop check that tests ran. Suggest, don't
  install silently; hooks that surprise users get ripped out along with
  trust.

## Phase 4 — Verify the tune

Dry-run the configuration: start from the compiled CLAUDE.md and run one
representative task (a small real fix from the backlog). Watch where
Claude still stumbles or asks — each stumble is a missing line in the
contract or a wrong skill in the loadout. Fix, then deliver:

- the compiled files (CLAUDE.md, settings suggestions as a diff, skill
  install commands);
- a one-paragraph "what changed and why" per file;
- a re-tune reminder: the tuner is worth re-running quarterly or after
  major stack changes — pair with `knowledge-loop`'s cadence.

## Rules

- Evidence-first: nothing enters CLAUDE.md that the audit didn't
  witness or the user didn't state.
- Respect the existing setup: improve in place, preserve what works,
  and show every change as a diff the user approves — this is *their*
  Claude, not yours.
