---
name: skill-forge
description: Mine the user's actual work — session history, git log, repeated corrections and command sequences — and forge new custom SKILL.md files from the recurring patterns, so their Claude grows its own skill library. Use when the user wants Claude to learn their workflow, automate a recurring pattern, or generate personal/team skills.
---

# Skill Forge

Output: one or more new SKILL.md files, custom-forged from how *this*
user actually works — plus the evidence for why each deserves to exist.
A skill library that only contains other people's skills is a textbook;
the forge is what makes it a **personal** system.

## Phase 1 — Mine the evidence (never invent patterns)

A skill is forged from observed repetition, not from imagination. Sweep
whichever sources exist, in this order of signal strength:

1. **Corrections**: places the user redirected Claude — "no, do it this
   way", "always X before Y", "we never use Z here" — in the current
   conversation and, locally, in recent session transcripts
   (`~/.claude/projects/<project>/*.jsonl`, newest first; skip if absent
   or unreadable). Each correction is a rule the user already paid for.
2. **Repeated sequences**: the same multi-step dance done 3+ times —
   in shell history within transcripts, in `git log` (the same shape of
   commit recurring: version bumps, changelog updates, release rituals,
   fixture regeneration), in CI scripts people run by hand.
3. **Project conventions with no home**: rules enforced in review
   comments or CLAUDE.md prose that need procedure, not prose ("all
   migrations need a rollback script" — that's a skill with steps).
4. Ask the user for their top recurring chore only if mining produced
   nothing — mining first, interview second.

## Phase 2 — Qualify (most patterns do NOT deserve a skill)

Forge only patterns that pass all three gates:

- **Recurrence**: seen 3+ times, or explicitly stated as a standing rule.
- **Procedure-shaped**: has steps, decisions, and a verifiable done-state.
  A preference ("prefer tabs") is not a skill — route it to CLAUDE.md
  (project-scoped, via `claude-tuner`) or to `companion-profile`
  (person-scoped) instead.
- **Failure history**: doing it wrong has actually cost something
  (a revert, a correction, a broken release). Skills exist to prevent
  paid-for mistakes from being paid twice.

Report the patterns that were found but rejected, with which gate they
failed — the user may overrule.

## Phase 3 — Forge (house format, always)

Write each skill in this library's house format:

- Frontmatter `name` (kebab-case, matches directory) and `description`
  that starts with what it does and ends with a "Use when …" trigger —
  the description is what makes auto-invocation work.
- Body: input/output contract up top → phases with the *decision rules*
  (not just steps — a skill that says "check the logs" without saying
  what to look for teaches nothing) → explicit stop conditions →
  a fallback for when tools are missing.
- Bake in the mined evidence: real command lines, real file paths, the
  user's actual conventions — genericness is what the forge exists to
  avoid. But **never** bake in secrets, tokens, or private hostnames;
  parameterize them.

## Phase 4 — Prove, install, track

1. Run `skill-eval` on each forged skill (A/B against the pattern's
   real scenario) before recommending installation. An untested skill is
   a hypothesis.
2. Install to `.claude/skills/<name>/SKILL.md` (project) or
   `~/.claude/skills/` (personal) per the user's choice. Personal
   patterns mined from private transcripts default to **local**; suggest
   publishing to the shared library only for skills with nothing
   private in them.
3. Track in `work/skills-dev.md` (see `work-hub`): state = drafted →
   tested-in-anger → published, with the evidence log.

## Rules

- Never forge from a single occurrence — that's automation of an
  anecdote.
- Validate the result with `tools/skill_lint.py` if this library is
  present.
- Re-run the forge periodically (pairs well with `knowledge-loop`):
  each run also checks *existing* forged skills against new evidence —
  a skill the user keeps overriding gets revised or retired.
