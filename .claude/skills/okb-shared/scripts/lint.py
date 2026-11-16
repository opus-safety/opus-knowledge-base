#!/usr/bin/env python3
"""Check a KB page for the mistakes the site build does NOT catch.

`zensical build` validates internal page links, but it does **not** check image
paths, UUID uniqueness, or light/dark pairing — so an invented capture path, a
copy-pasted UUID, or a half-missing image pair ships silently. Run this on any
page you write or edit, and fix everything it reports before handing back.

Usage:
    python3 lint.py docs/drafts/my-page.md      # one page
    python3 lint.py --all                       # every page + draft

Exit status is 1 if any ERROR was reported (warnings alone exit 0).

`system-status.md` and `system-updates.md` are generated/special-purpose pages
that legitimately break the heading-span and audience-tag rules — expect warnings
from them under --all, and don't "fix" them.

Checks, in order of how badly they bite:
  ERROR   referenced image file does not exist
  ERROR   #only-light / #only-dark pair incomplete
  ERROR   duplicate data-uuid (within the page, or shared with another page)
  ERROR   malformed data-uuid (not a v4-shaped UUID)
  ERROR   legacy hand-written "suitable for" block present
  ERROR   page is not registered in any nav list in zensical.toml
  WARN    H1 or a heading has no UUID span on the line below it
  WARN    draft without `search: exclude: true`
  WARN    no audience tag, or a tag missing from mb_created_tags
  WARN    more than one H1
  WARN    list or table on the line right after a UUID span — the missing blank
          line makes Markdown render it as run-on paragraph text, not a list
  WARN    `==highlight==` used — not house style, emphasise with bold/pill instead
  WARN    a support-sounding link points at the sales /contact page, not the support widget
  WARN    a support link uses the legacy window.groove API, not window.supportWidget
  WARN    an access-level pill uses a colour other than the fixed house one
"""
import glob
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
TOML = os.path.join(ROOT, "zensical.toml")

UUID_RE = re.compile(
    r'<span[^>]*\bdata-uuid="([^"]*)"', re.I)
UUID_OK = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.I)
IMG_RE = re.compile(r"!\[[^\]]*\]\(([^)\s]+)")
AUDIENCES = ("Using OCC", "Managing OCC", "Administering OCC")

# A list item (or table row) directly under a standalone UUID span, with no
# blank line between: Markdown parses it as a continuation of the span's
# paragraph, so it renders as run-on text with literal "- " characters instead
# of a list. Only standalone span lines count — table rows carrying an inline
# span in a cell (the status-icon table pattern) are legitimately followed by
# the next row.
STANDALONE_SPAN_RE = re.compile(r'^\s*<span[^>]*\bdata-uuid=[^>]*>\s*</span>\s*$')
LIST_AFTER_SPAN_RE = re.compile(r"^\s*(?:[-*+]|\d+\.)\s+\S|^\s*\|")
# `==marked==` — pymdownx.mark is enabled but no published page uses it.
MARK_RE = re.compile(r"(?<![=\w])==(?!=)([^=\n]{1,200}?)==(?![=\w])")
# The sales site. Fine as a CTA button on an overview page; wrong for a
# "get in touch about this feature" link, which must open the support widget.
SALES_URL = "opus-safety.co.uk/contact"
SALES_OK = re.compile(r"\.md-button")     # a CTA button is the legitimate use
# Access-level pills are fixed across the KB (see references/format.md).
LEVEL_COLOUR = {"user": "blue", "manager": "purple", "administrator": "pink"}
LEVEL_RE = re.compile(
    r'<span class="mb-label mb-label-([a-z]+)">\s*(?::lucide-[a-z-]+:)?\s*'
    r"(User|Manager|Administrator)s?\s*</span>")

errors, warns = [], []


def same_page_pair(a, b):
    """True for drafts/x.md vs pages/x.md — a draft revision of a published page.

    Those legitimately share UUIDs: the spans track the same blocks through the
    draft-to-published lifecycle, so matching UUIDs there are correct, not a
    copy-paste mistake.
    """
    return (os.path.basename(a) == os.path.basename(b)
            and {os.path.basename(os.path.dirname(a)),
                 os.path.basename(os.path.dirname(b))} == {"drafts", "pages"})


def err(f, ln, msg):
    errors.append("ERROR %s:%s  %s" % (f, ln, msg))


def warn(f, ln, msg):
    warns.append("WARN  %s:%s  %s" % (f, ln, msg))


def frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    return m.group(1) if m else ""


def check(path, all_uuids, toml_text):
    rel = os.path.relpath(path, ROOT)
    text = open(path, encoding="utf-8").read()
    lines = text.split("\n")
    fm = frontmatter(text)
    d = os.path.dirname(path)

    # --- images exist -----------------------------------------------------
    for i, ln in enumerate(lines, 1):
        for m in IMG_RE.finditer(ln):
            p = m.group(1).split("#")[0]
            if p.startswith(("http://", "https://", "data:")):
                continue
            if not os.path.exists(os.path.normpath(os.path.join(d, p))):
                err(rel, i, "image not found: %s" % p)

    # --- light/dark pairing ----------------------------------------------
    for i, ln in enumerate(lines, 1):
        nl, nd = ln.count("#only-light"), ln.count("#only-dark")
        if nl and nd:
            continue                      # inline pair on one line (table cell)
        if nl or nd:
            have = "#only-light" if nl else "#only-dark"
            want = "#only-dark" if nl else "#only-light"
            nbr = " ".join(lines[max(0, i - 3):i + 2])
            if want not in nbr:
                err(rel, i, "%s with no matching %s nearby" % (have, want))

    # --- uuids ------------------------------------------------------------
    seen = {}
    for i, ln in enumerate(lines, 1):
        for m in UUID_RE.finditer(ln):
            u = m.group(1).strip().lower()
            if not UUID_OK.match(u):
                err(rel, i, "malformed data-uuid: %r" % m.group(1))
                continue
            if u in seen:
                err(rel, i, "duplicate data-uuid (also line %d)" % seen[u])
            else:
                seen[u] = i
            other = all_uuids.get(u)
            if other and other[0] != rel and not same_page_pair(rel, other[0]):
                err(rel, i, "data-uuid also used in %s:%d" % other)
            all_uuids.setdefault(u, (rel, i))

    # --- blank line between a span and a following list/table -------------
    for i, ln in enumerate(lines, 1):
        if not STANDALONE_SPAN_RE.match(ln):
            continue
        nxt = lines[i] if i < len(lines) else ""
        if LIST_AFTER_SPAN_RE.match(nxt):
            warn(rel, i, "list/table directly after a UUID span — add a blank "
                         "line after the span, or the items render as run-on "
                         "paragraph text instead of a list")

    # --- headings carry a span -------------------------------------------
    h1 = 0
    for i, ln in enumerate(lines, 1):
        if not re.match(r"^#{1,3} \S", ln):
            continue
        if ln.startswith("# "):
            h1 += 1
        nxt = lines[i] if i < len(lines) else ""
        if "data-uuid" not in nxt:
            warn(rel, i, "heading has no UUID span on the next line: %s"
                 % ln.strip()[:50])
    if h1 == 0:
        warn(rel, 1, "no H1 found")
    elif h1 > 1:
        warn(rel, 1, "%d H1 headings — pages have exactly one" % h1)

    # --- legacy block -----------------------------------------------------
    for i, ln in enumerate(lines, 1):
        if "data-mb-suitable-for" in ln or "This guide is suitable for:" in ln:
            err(rel, i, "legacy 'suitable for' block — the audience line is "
                        "generated from the tag; delete this")

    # --- frontmatter ------------------------------------------------------
    is_draft = os.sep + "drafts" + os.sep in path
    if is_draft and not re.search(r"^search:\s*$\s*^\s+exclude:\s*true",
                                  fm, re.M):
        warn(rel, 1, "draft without `search: exclude: true`")
    tags = re.findall(r"^\s*-\s*(.+?)\s*$", fm, re.M)
    if not any(t in AUDIENCES for t in tags):
        warn(rel, 1, "no audience tag (%s) — no 'Written for' line will render"
             % " / ".join(AUDIENCES))
    for t in tags:
        if t and t not in ("toc", "navigation", "path", "written-for", "footer"):
            if ('name = "%s"' % t) not in toml_text:
                warn(rel, 1, "tag %r not in mb_created_tags" % t)

    # --- house emphasis ---------------------------------------------------
    for i, ln in enumerate(lines, 1):
        if ln.lstrip().startswith(("```", "    ```")):
            continue
        for m in MARK_RE.finditer(ln):
            warn(rel, i, "`==%s==` — highlight is not house style; use **bold**, "
                 "a label pill, or its own admonition"
                 % m.group(1).strip()[:40])

    # --- support links open the support widget, not the sales page --------------------
    for i, ln in enumerate(lines, 1):
        if SALES_URL in ln and not SALES_OK.search(ln):
            warn(rel, i, "links to the sales /contact page — a support "
                         '"get in touch" should open the support widget: '
                         '<a href="#" onclick="event.preventDefault(); '
                         'window.supportWidget.open();">…</a>')
        if "window.groove" in ln:
            warn(rel, i, "legacy window.groove.widget call — use "
                         "window.supportWidget.open()/toggle()/close()")

    # --- access-level pill colours ----------------------------------------
    for i, ln in enumerate(lines, 1):
        for m in LEVEL_RE.finditer(ln):
            colour, level = m.group(1), m.group(2).lower()
            want = LEVEL_COLOUR[level]
            if colour != want:
                warn(rel, i, "%s pill is mb-label-%s; the house colour is "
                             "mb-label-%s (with :lucide-%s:)"
                     % (m.group(2), colour, want,
                        {"user": "user", "manager": "user-shield",
                         "administrator": "user-cog"}[level]))

    # --- registered in a nav ---------------------------------------------
    slug = os.path.relpath(path, os.path.join(ROOT, "docs")).replace(os.sep, "/")
    if '"%s"' % slug not in toml_text:
        err(rel, 1, "not registered in nav / draft_nav / unlisted_nav")


def main():
    argv = sys.argv[1:]
    if "--all" in argv:
        targets = sorted(glob.glob(os.path.join(ROOT, "docs", "pages", "*.md")) +
                         glob.glob(os.path.join(ROOT, "docs", "drafts", "*.md")))
    else:
        targets = [os.path.abspath(a) for a in argv if not a.startswith("--")]
    if not targets:
        sys.exit(__doc__)

    toml_text = open(TOML, encoding="utf-8").read() if os.path.exists(TOML) else ""

    # Pre-index UUIDs across the whole repo so cross-page reuse is caught even
    # when linting a single file.
    all_uuids = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "docs", "**", "*.md"),
                              recursive=True)):
        r = os.path.relpath(f, ROOT)
        if os.path.abspath(f) in [os.path.abspath(t) for t in targets]:
            continue
        for i, ln in enumerate(open(f, encoding="utf-8").read().split("\n"), 1):
            for m in UUID_RE.finditer(ln):
                all_uuids.setdefault(m.group(1).strip().lower(), (r, i))

    for t in targets:
        if not os.path.exists(t):
            err(os.path.relpath(t, ROOT), 0, "file not found")
            continue
        check(t, all_uuids, toml_text)

    for line in errors:
        print(line)
    for line in warns:
        print(line)
    print("\n%d error(s), %d warning(s) across %d file(s)"
          % (len(errors), len(warns), len(targets)))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
