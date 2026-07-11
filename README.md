# Fable-Style Skills — Parallel Orchestration Skills for Claude Code

**العربية: [README.ar.md](README.ar.md)**

An open-source library of professional **Agent Skills** for Claude Code that
emulates the working style of frontier orchestration models (the
"Fable 5" approach): decompose a hard problem, fan out many parallel
agents, adversarially verify every claim, and synthesize one trusted answer.

> **Disclaimer**: This is a community project. It is **not** affiliated with
> or endorsed by Anthropic, and it does not contain or reproduce any model.
> It is a set of prompt-engineering patterns (skills) that teach *any*
> Claude Code session to work the way advanced multi-agent systems work.

## The core idea

Frontier agentic systems don't get their power from a single long answer.
They get it from **structure**:

```
                 ┌──────────────┐
                 │  DECOMPOSE   │  split the task into independent slices
                 └──────┬───────┘
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ agent A │     │ agent B │     │ agent C │   FAN-OUT: parallel workers,
   └────┬────┘     └────┬────┘     └────┬────┘   each blind to the others
        ▼               ▼               ▼
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ skeptic │     │ skeptic │     │ skeptic │   VERIFY: adversarial checkers
   └────┬────┘     └────┬────┘     └────┬────┘   try to REFUTE each finding
        └───────────────┼───────────────┘
                        ▼
                 ┌──────────────┐
                 │  SYNTHESIZE  │  merge only what survived verification
                 └──────────────┘
```

Four principles, encoded in every skill in this library:

1. **Decompose before you compute.** A task is only as parallel as its plan.
2. **Independence beats consensus.** Parallel workers must not see each
   other's output, or they converge on the same mistake.
3. **Verification is adversarial.** A finding survives only if a dedicated
   skeptic, prompted to *refute* it, fails to kill it.
4. **Loop until dry.** Discovery work (bugs, sources, edge cases) ends when
   *K* consecutive rounds find nothing new — never at an arbitrary count.

## Skills included

| Skill | What it does |
|---|---|
| [`orchestrate`](skills/orchestrate/SKILL.md) | The master pattern: decompose → fan-out → verify → synthesize, for any large task |
| [`deep-research`](skills/deep-research/SKILL.md) | Multi-angle parallel research sweep with adversarial fact-checking and a cited report |
| [`sci-research`](skills/sci-research/SKILL.md) | Scientific/physics research workflow: hypothesis, parallel literature sweep, methodology critique |
| [`adversarial-verify`](skills/adversarial-verify/SKILL.md) | N independent skeptics per claim; majority-refute kills it |
| [`judge-panel`](skills/judge-panel/SKILL.md) | Generate N solutions from different angles, score with independent judges, synthesize the winner |
| [`parallel-review`](skills/parallel-review/SKILL.md) | Code review fanned out by dimension (correctness, security, performance, tests), findings verified before reporting |
| [`loop-until-dry`](skills/loop-until-dry/SKILL.md) | Exhaustive discovery loop that stops only after K dry rounds |
| [`swarm-migrate`](skills/swarm-migrate/SKILL.md) | Large-scale refactors: discover all sites, transform in isolated parallel workers, verify each |

## Installation

Skills live in a `skills/<name>/SKILL.md` layout, compatible with Claude Code.

**Per-project** (recommended):

```bash
git clone https://github.com/mbt7000/lol.fr fable-skills
cp -r fable-skills/skills/* your-project/.claude/skills/
```

**Global** (available in every project):

```bash
cp -r fable-skills/skills/* ~/.claude/skills/
```

Or run the helper:

```bash
./install.sh            # installs into ./.claude/skills of the current repo
./install.sh --global   # installs into ~/.claude/skills
```

Then in any Claude Code session:

```
/orchestrate refactor the payment module for idempotency
/deep-research what are the leading approaches to room-temperature superconductivity?
/parallel-review
```

## How the skills achieve parallelism

Claude Code exposes two native mechanisms these skills build on:

- **The `Agent` tool** — spawn subagents; multiple calls issued together run
  concurrently. Skills instruct the model to batch independent spawns.
- **The `Workflow` tool** (where available) — a deterministic JavaScript
  orchestration script with `parallel()`, `pipeline()`, and per-agent
  structured output schemas. Skills include ready-made workflow templates.

Each SKILL.md degrades gracefully: if only the `Agent` tool exists, the skill
uses batched subagents; if neither exists, it runs the same phases
sequentially in one context — the *structure* (decompose/verify/synthesize)
is preserved either way.

## Repository layout

```
skills/                 the skills (copy these into .claude/skills/)
  orchestrate/SKILL.md
  deep-research/SKILL.md
  ...
docs/
  ARCHITECTURE.md       deep dive: why these patterns work
install.sh              installer
README.ar.md            Arabic documentation
LICENSE                 MIT
```

## Contributing

PRs welcome. A good skill submission:

1. Follows the `skills/<name>/SKILL.md` format with YAML frontmatter
   (`name`, `description`).
2. Encodes a *structural* pattern (how agents are arranged), not just a
   prompt style.
3. States its stop condition explicitly — every loop must terminate.
4. Degrades gracefully when subagent tools are unavailable.

## License

MIT — see [LICENSE](LICENSE).
