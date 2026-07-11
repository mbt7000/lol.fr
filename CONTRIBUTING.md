# Contributing

Contributions welcome — skills, tools, translations, and eval sets.
المساهمات مرحّب بها — مهارات، أدوات، ترجمات، ومجموعات تقييم.

## Adding a skill

1. Create `skills/<kebab-case-name>/SKILL.md` with YAML frontmatter:
   `name` (must match the directory) and `description` (what it does +
   a "Use when …" trigger — auto-invocation depends on it).
2. Follow the house format: input/output contract → phases with decision
   rules → explicit stop conditions → graceful fallback when subagent
   tools are missing.
3. Encode a *structural* pattern (how work is arranged and verified),
   with real decision rules — not just a prompt style.
4. Lint locally: `python3 tools/skill_lint.py skills/<name>` — CI runs
   the same check on every PR and errors block merge.
5. Strongly encouraged: an eval set at `skills/<name>/eval.md`
   (scenarios + rubrics, see the `skill-eval` skill) proving the skill
   beats baseline.

## Ground rules

- No secrets, tokens, or private hostnames in skills — parameterize.
- Skills mined from private sessions (see `skill-forge`) must be
  scrubbed of anything personal before publishing.
- English body text; translations of READMEs and skills are welcome as
  parallel files (e.g. `README.ar.md` pattern).
- MIT licensed — by contributing you agree your contribution is too.
