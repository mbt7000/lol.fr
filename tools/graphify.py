#!/usr/bin/env python3
"""graphify — turn a documentation corpus into an Obsidian vault (a "second brain").

Point it at an `llms.txt` index (the emerging standard many doc sites expose,
e.g. https://code.claude.com/docs/llms.txt) or at a local directory of
markdown files. It downloads/collects the pages, rewrites cross-references as
[[wikilinks]] so Obsidian's graph view lights up, adds YAML frontmatter with
tags, and generates Maps of Content (MOCs) plus a Home note.

Usage:
    graphify.py obsidian https://code.claude.com/docs/llms.txt --vault ./vault
    graphify.py obsidian ./my-docs-folder --vault ./vault --limit 40
    graphify.py list https://code.claude.com/docs/llms.txt

Stdlib only. Proxy and CA bundles are honored via the standard environment
variables (HTTPS_PROXY, SSL_CERT_FILE).
"""

from __future__ import annotations

import argparse
import datetime as _dt
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

USER_AGENT = "graphify/1.0 (+https://github.com/mbt7000/lol.fr)"
ENTRY_RE = re.compile(r"^-\s*\[(?P<title>[^\]]+)\]\((?P<url>[^)\s]+)\)(?::\s*(?P<desc>.*))?$")
MD_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")


def log(msg: str) -> None:
    print(msg, file=sys.stderr)


def fetch(url: str, retries: int = 3) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except Exception as exc:  # noqa: BLE001 - report and retry any transport error
            if attempt == retries - 1:
                raise RuntimeError(f"failed to fetch {url}: {exc}") from exc
            time.sleep(2 ** attempt)
    raise AssertionError("unreachable")


class Page:
    def __init__(self, title: str, url: str, desc: str = "", body: str = ""):
        self.title = title.strip()
        self.url = url
        self.desc = (desc or "").strip()
        self.body = body
        self.section = derive_section(url)
        self.note_name = safe_filename(self.title)

    @property
    def url_key(self) -> str:
        """Canonical key for cross-reference matching: path without extension."""
        path = urllib.parse.urlsplit(self.url).path
        return re.sub(r"\.mdx?$", "", path).rstrip("/")


def derive_section(url: str) -> str:
    """Section = the meaningful path segment, e.g. .../en/agent-sdk/hooks.md -> 'Agent Sdk'."""
    parts = [p for p in urllib.parse.urlsplit(url).path.split("/") if p]
    # drop common prefixes and the filename itself
    parts = [p for p in parts[:-1] if p not in ("docs", "en", "latest")]
    if not parts:
        return "Core"
    return parts[-1].replace("-", " ").replace("_", " ").title()


def safe_filename(title: str) -> str:
    name = re.sub(r'[<>:"/\\|?*#^\[\]]', "", title).strip()
    name = re.sub(r"\s+", " ", name)
    return name[:120] or "Untitled"


def parse_llms_txt(text: str, base_url: str) -> list[Page]:
    pages = []
    for line in text.splitlines():
        m = ENTRY_RE.match(line.strip())
        if m:
            url = urllib.parse.urljoin(base_url, m.group("url"))
            pages.append(Page(m.group("title"), url, m.group("desc") or ""))
    return pages


def load_local_dir(root: pathlib.Path) -> list[Page]:
    pages = []
    root = root.resolve()
    for path in sorted(root.rglob("*.md")):
        body = path.read_text(encoding="utf-8", errors="replace")
        heading = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        title = heading.group(1).strip() if heading else path.stem.replace("-", " ").title()
        page = Page(title, path.as_uri(), body=body)
        page.section = (
            path.parent.relative_to(root).as_posix().replace("/", " / ").title()
            if path.parent != root
            else "Core"
        )
        pages.append(page)
    return pages


def dedupe_note_names(pages: list[Page]) -> None:
    seen: dict[str, int] = {}
    for page in pages:
        n = seen.get(page.note_name.lower(), 0)
        seen[page.note_name.lower()] = n + 1
        if n:
            page.note_name = f"{page.note_name} ({n + 1})"


def wikilinkify(body: str, by_url_key: dict[str, Page]) -> str:
    """Rewrite markdown links that point at pages in the corpus as [[wikilinks]]."""

    def repl(m: re.Match) -> str:
        text, target = m.group(1), m.group(2)
        if target.startswith("#") or "://" not in target and target.startswith("mailto:"):
            return m.group(0)
        key = re.sub(r"\.mdx?$", "", urllib.parse.urlsplit(target).path).rstrip("/")
        key = key.split("#")[0]
        # exact match first; fall back to basename so relative links
        # ("b.md", "../guides/b.md") in local corpora still resolve
        page = by_url_key.get(key) or by_url_key.get(key.rsplit("/", 1)[-1])
        if page is None:
            return m.group(0)
        if text.strip().lower() == page.note_name.lower():
            return f"[[{page.note_name}]]"
        return f"[[{page.note_name}|{text}]]"

    return MD_LINK_RE.sub(repl, body)


def frontmatter(page: Page, fetched: str) -> str:
    tag = re.sub(r"\s+", "-", page.section.lower())
    desc = page.desc.replace('"', "'")
    lines = [
        "---",
        f'title: "{page.note_name}"',
        f"source: {page.url}",
        f"section: {page.section}",
        f"tags: [docs, {tag}]",
        f"fetched: {fetched}",
    ]
    if desc:
        lines.append(f'description: "{desc}"')
    lines.append("---")
    return "\n".join(lines)


def build_vault(pages: list[Page], vault: pathlib.Path, corpus_name: str) -> None:
    fetched = _dt.date.today().isoformat()
    dedupe_note_names(pages)
    by_url_key: dict[str, Page] = {}
    for p in pages:
        by_url_key.setdefault(p.url_key.rsplit("/", 1)[-1], p)
    by_url_key.update({p.url_key: p for p in pages})
    sections: dict[str, list[Page]] = {}
    for page in pages:
        sections.setdefault(page.section, []).append(page)

    for page in pages:
        body = wikilinkify(page.body, by_url_key)
        # demote a duplicated H1 (the note title already carries it)
        body = re.sub(r"\A#\s+.+\n", "", body, count=1)
        note = frontmatter(page, fetched) + "\n\n" + body.strip() + "\n"
        out = vault / page.section / f"{page.note_name}.md"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(note, encoding="utf-8")

    for section, sec_pages in sorted(sections.items()):
        moc = [
            "---",
            f'title: "MOC — {section}"',
            "tags: [moc]",
            "---",
            "",
            f"# {section} — Map of Content",
            "",
        ]
        for page in sorted(sec_pages, key=lambda p: p.note_name.lower()):
            desc = f" — {page.desc}" if page.desc else ""
            moc.append(f"- [[{page.note_name}]]{desc}")
        (vault / section / f"MOC — {section}.md").write_text("\n".join(moc) + "\n", encoding="utf-8")

    home = [
        "---",
        'title: "Home"',
        "tags: [moc, home]",
        "---",
        "",
        f"# {corpus_name}",
        "",
        f"Generated by graphify on {fetched} — {len(pages)} notes in {len(sections)} sections.",
        "",
        "## Sections",
        "",
    ]
    for section in sorted(sections):
        home.append(f"- [[MOC — {section}]] ({len(sections[section])} notes)")
    home += [
        "",
        "## How to use this vault",
        "",
        "- Open the folder in Obsidian; the graph view shows the cross-reference structure.",
        "- Start from a MOC, follow wikilinks, and add your own notes alongside —",
        "  your notes linking into the docs is what turns this into a second brain.",
        "- Re-run graphify anytime to refresh; your own notes are never touched.",
    ]
    (vault / "Home.md").write_text("\n".join(home) + "\n", encoding="utf-8")


def collect(source: str, limit: int | None, include: str | None) -> tuple[list[Page], str]:
    src_path = pathlib.Path(source)
    if src_path.is_dir():
        pages = load_local_dir(src_path)
        corpus_name = src_path.name
    else:
        text = src_path.read_text(encoding="utf-8") if src_path.is_file() else fetch(source)
        pages = parse_llms_txt(text, base_url=source if "://" in source else "")
        heading = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
        corpus_name = heading.group(1).strip() if heading else "Documentation Vault"
    if include:
        rx = re.compile(include)
        pages = [p for p in pages if rx.search(p.url) or rx.search(p.title)]
    if limit:
        pages = pages[:limit]
    # fetch bodies for remote pages
    for i, page in enumerate(pages):
        if page.body:
            continue
        log(f"[{i + 1}/{len(pages)}] {page.title}")
        try:
            page.body = fetch(page.url)
        except RuntimeError as exc:
            log(f"  skipped: {exc}")
            page.body = f"> Fetch failed; source: {page.url}\n"
    return pages, corpus_name


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_list = sub.add_parser("list", help="list the pages an llms.txt index exposes")
    p_list.add_argument("source")

    p_obs = sub.add_parser("obsidian", help="build an Obsidian vault from the corpus")
    p_obs.add_argument("source", help="llms.txt URL/path, or a directory of .md files")
    p_obs.add_argument("--vault", required=True, help="output vault directory")
    p_obs.add_argument("--limit", type=int, help="max pages (useful for sampling)")
    p_obs.add_argument("--include", help="regex filter on page URL/title")

    args = ap.parse_args()

    if args.cmd == "list":
        text = fetch(args.source) if "://" in args.source else pathlib.Path(args.source).read_text()
        for page in parse_llms_txt(text, args.source):
            print(f"{page.section:24} {page.title}")
        return 0

    pages, corpus_name = collect(args.source, args.limit, args.include)
    if not pages:
        log("no pages found — is the source an llms.txt index or a folder of .md files?")
        return 1
    vault = pathlib.Path(args.vault)
    build_vault(pages, vault, corpus_name)
    log(f"vault ready: {vault}  ({len(pages)} notes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
