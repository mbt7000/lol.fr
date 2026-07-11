#!/usr/bin/env python3
"""skill_lint — quality gate for SKILL.md files in this library.

Checks every skills/<name>/SKILL.md (or the paths given) against the house
format. Errors fail CI; warnings are advisory.

Usage:
    python3 tools/skill_lint.py                 # lint the whole library
    python3 tools/skill_lint.py skills/foo      # lint specific skills
"""

from __future__ import annotations

import pathlib
import re
import sys

TRIGGER_RE = re.compile(r"\bUse (when|for|before|after|during)\b", re.IGNORECASE)
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
MAX_DESCRIPTION = 1024
MAX_BODY_LINES = 200
MIN_BODY_LINES = 15


def parse_frontmatter(text: str) -> tuple[dict[str, str], str] | None:
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---\n", 4)
    if end == -1:
        return None
    fields: dict[str, str] = {}
    key = None
    for line in text[4:end].splitlines():
        m = re.match(r"^(\w[\w-]*):\s*(.*)$", line)
        if m:
            key = m.group(1)
            fields[key] = m.group(2).strip()
        elif key and line.startswith((" ", "\t")):
            fields[key] += " " + line.strip()
    return fields, text[end + 5 :]


def lint_skill(path: pathlib.Path) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    text = path.read_text(encoding="utf-8")

    parsed = parse_frontmatter(text)
    if parsed is None:
        return ["missing or malformed YAML frontmatter (--- ... ---)"], []
    fields, body = parsed

    name = fields.get("name", "")
    desc = fields.get("description", "")

    if not name:
        errors.append("frontmatter missing 'name'")
    elif not NAME_RE.match(name):
        errors.append(f"name '{name}' is not kebab-case")
    elif name != path.parent.name:
        errors.append(f"name '{name}' != directory '{path.parent.name}'")

    if not desc:
        errors.append("frontmatter missing 'description'")
    else:
        if len(desc) > MAX_DESCRIPTION:
            errors.append(f"description is {len(desc)} chars (max {MAX_DESCRIPTION})")
        if not TRIGGER_RE.search(desc):
            errors.append("description lacks a usage trigger ('Use when/for/before ...') — auto-invocation depends on it")

    body_lines = [l for l in body.splitlines() if l.strip()]
    if len(body_lines) < MIN_BODY_LINES:
        errors.append(f"body has {len(body_lines)} non-empty lines (min {MIN_BODY_LINES}) — a skill this thin is a description, not a procedure")
    if len(body_lines) > MAX_BODY_LINES:
        warnings.append(f"body has {len(body_lines)} non-empty lines (soft max {MAX_BODY_LINES}) — long skills tax every invocation; consider splitting")

    if not re.search(r"^#\s+", body, re.MULTILINE):
        errors.append("body has no top-level heading")

    lower = body.lower()
    if not re.search(r"\bstop condition|\brules\b|\bhard cap|maximum\b|\bnever\b", lower):
        warnings.append("no visible stop conditions or rules — every loop must terminate")
    if "fallback" not in lower and "sequential" not in lower:
        warnings.append("no fallback for missing subagent tools — skills should degrade gracefully")

    for secret_pat, label in [
        (r"(?i)(api[_-]?key|secret|token)\s*[:=]\s*['\"][A-Za-z0-9_\-]{16,}", "possible hardcoded credential"),
        (r"https?://[a-z0-9.-]*\.internal\b", "internal hostname"),
    ]:
        if re.search(secret_pat, body):
            errors.append(label)

    return errors, warnings


def main(argv: list[str]) -> int:
    root = pathlib.Path(__file__).resolve().parent.parent
    if argv:
        targets = []
        for a in argv:
            p = pathlib.Path(a)
            targets.append(p / "SKILL.md" if p.is_dir() else p)
    else:
        targets = sorted((root / "skills").glob("*/SKILL.md"))

    if not targets:
        print("no SKILL.md files found", file=sys.stderr)
        return 1

    total_errors = 0
    for path in targets:
        errors, warnings = lint_skill(path)
        rel = path.relative_to(root) if path.is_relative_to(root) else path
        for e in errors:
            print(f"ERROR   {rel}: {e}")
        for w in warnings:
            print(f"warning {rel}: {w}")
        total_errors += len(errors)

    print(f"\n{len(targets)} skills checked, {total_errors} errors")
    return 1 if total_errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
