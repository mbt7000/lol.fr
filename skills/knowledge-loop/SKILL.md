---
name: knowledge-loop
description: Run a recurring knowledge-development loop over a git-based second brain — capture what was learned, link it into the vault, distill notes that grew, and surface what's rotting. Use for "build me a second brain routine", periodic knowledge reviews, or keeping a team knowledge base alive.
---

# Knowledge Loop

Input (arguments): the vault/knowledge directory (default: `vault/` or the
repo root's markdown), and optionally a cadence. Output: one loop
iteration executed — new knowledge captured and linked, plus a short
delta report. Designed to run repeatedly (manually, via `/loop`, or a
scheduled routine): **knowledge systems die from lack of cadence, not
lack of tooling.**

## The loop — CODE (Capture → Organize → Distill → Express)

### 1. Capture (what happened since last run?)

Sweep the sources of new knowledge since the last loop commit:

- `git log` since the last loop tag/commit: what changed, what got fixed,
  what decisions do commit messages reveal?
- Session artifacts: postmortems, debugging conclusions, review findings,
  research reports produced since last run.
- The inbox note (`vault/Inbox.md`) where quick thoughts were dumped.

Each item becomes a candidate note: one idea per note, titled as a claim
("SQLite writes block reads under WAL only if…") not a topic ("SQLite").
Claims are linkable and falsifiable; topics are landfill.

### 2. Organize (link, don't file)

- Every new note gets: 2+ wikilinks into existing notes (if nothing to
  link to, that's a signal a MOC or a neighbor note is missing), tags
  from the vault's controlled vocabulary, and `source:` provenance.
- Update the affected MOC(s). A note reachable from no MOC is invisible.

### 3. Distill (compress what grew)

Pick the 1–3 notes that accumulated the most additions since last run
and rewrite them: conclusions to the top, dead ends demoted to a
"failed approaches" section (keep them — they prevent re-walking), and
split any note that now covers two claims.

### 4. Express (make it usable outside the vault)

Knowledge that never leaves the vault is hoarding, not learning. Each
loop, produce one artifact from the vault: update a README/runbook from
its notes, turn a recurring gotcha into a lint rule or a SKILL.md, post
the distilled note where the team will see it.

## Health checks (each run, cheap)

- **Orphans**: notes with zero inbound links — link or archive them.
- **Rot**: notes whose `source:` material changed (docs refreshed via
  graphify, code moved) — mark `stale: true` rather than silently wrong.
- **Inbox zero-ish**: inbox items older than 3 loops get promoted or
  deleted — an inbox that only grows is a graveyard.

## Close the loop

Commit with a conventional message (`knowledge: loop YYYY-MM-DD`) so the
next run can diff against it, and end with the delta report: notes
added/distilled/archived, the artifact expressed, and health-check
counts. If running under `/loop` or a schedule, this report is the
iteration's output; keep it under ten lines.

## Companions in the review chain

When the growth-layer skills are installed, this loop is step 2 of
`conductor`'s review chain (hub refresh → this loop → `growth-map` →
`learning-tracker` → `companion-profile`). Running unattended, do your
own steps only and list the companions' due work in the report —
recall reviews and consent batches need the human present.

## Rules

- Never let a loop iteration only *add* — every run distills or archives
  something, or the vault becomes write-only.
- Your own notes are never overwritten by regenerated doc notes
  (graphify convention: generated notes carry `fetched:` frontmatter;
  human notes don't).
