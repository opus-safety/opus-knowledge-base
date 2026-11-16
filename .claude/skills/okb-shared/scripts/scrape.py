#!/usr/bin/env python3
"""Pull the readable content out of a source URL, for rewriting into a KB page.

Use when the user supplies a URL as the source for a page (an existing help
article, a vendor doc, a release note) instead of typing the steps out.

Prefer this over a summarising fetch tool: those paraphrase and silently drop
list items and images. This prints the page's own words, so you can see exactly
what the source says before rewriting it into house voice.

Output is three sections:

    == TITLE ==     the <title> / og:title
    == TEXT ==      readable body text, one block per line, in document order
    == IMAGES ==    every image URL in document order, with its alt text

Usage:
    python3 scrape.py <url>
    python3 scrape.py <url> --raw out.html   # also save the raw HTML
    python3 scrape.py <url> --all            # don't trim boilerplate/nav

Notes:
- Text comes from the main-content landmark when the page marks one (<main>,
  role="main", <article>), else the whole body. Leading site nav is then cut by
  anchoring on the page's own og:description; if that anchor isn't found nothing
  is trimmed, so you may see a nav tree before the real content. That is
  deliberate — leftover nav is obvious when you read it, silently dropped steps
  are not. `--all` skips the trim entirely.
- Read the TEXT through before writing. Check the last line looks like the end of
  the article, not a cookie banner or a truncation.
- Pages that render entirely client-side may yield little or nothing. If TEXT
  comes back near-empty, say so rather than inventing content.
"""
import html
import re
import sys
import urllib.request

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36")

BLOCK = r"p|div|li|h[1-6]|tr|td|section|article|header|footer|blockquote|pre|figcaption"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        raw = r.read()
    for enc in ("utf-8", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", "replace")


def title_of(doc):
    for pat in (r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)',
                r"<title[^>]*>(.*?)</title>"):
        m = re.search(pat, doc, re.I | re.S)
        if m:
            return html.unescape(m.group(1)).strip()
    return "(no title)"


def images_of(doc):
    out, seen = [], set()
    for m in re.finditer(r"<img\b[^>]*>", doc, re.I):
        tag = m.group(0)
        src = re.search(r'\bsrc=["\']([^"\']+)', tag, re.I)
        if not src:
            continue
        u = html.unescape(src.group(1)).strip()
        if not u or u.startswith("data:") or u in seen:
            continue
        seen.add(u)
        alt = re.search(r'\balt=["\']([^"\']*)', tag, re.I)
        out.append((u, html.unescape(alt.group(1)).strip() if alt else ""))
    return out


def main_region(doc):
    """Return the main-content subtree if the page marks one, else the body."""
    for pat in (r'<main\b[^>]*>(.*?)</main>',
                r'<[a-z]+\b[^>]*\brole=["\']main["\'][^>]*>(.*)',
                r'<article\b[^>]*>(.*?)</article>',
                r'<body\b[^>]*>(.*?)</body>'):
        m = re.search(pat, doc, re.I | re.S)
        if m and len(m.group(1)) > 500:
            return m.group(1)
    return doc


def to_lines(frag):
    frag = re.sub(r"(?is)<(script|style|noscript|svg|template)[^>]*>.*?</\1>", " ", frag)
    frag = re.sub(r"(?is)<!--.*?-->", " ", frag)
    frag = re.sub(r"(?i)<br[^>]*>", "\n", frag)
    frag = re.sub(r"(?i)</(%s)>" % BLOCK, "\n", frag)
    frag = re.sub(r"<[^>]+>", " ", frag)
    text = html.unescape(frag)
    text = text.replace(" ", " ")
    lines = []
    for ln in text.split("\n"):
        ln = re.sub(r"[ \t​]+", " ", ln).strip()
        if len(ln) > 2:
            lines.append(ln)
    return lines


def description_of(doc):
    for pat in (r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)',
                r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)'):
        m = re.search(pat, doc, re.I | re.S)
        if m:
            return html.unescape(m.group(1)).strip()
    return ""


def trim_nav(lines, doc):
    """Drop leading site chrome by anchoring on the page's own description.

    The first line of real content almost always matches the start of the page's
    og:description, so find that line and cut everything before it. Deliberately
    NOT a length/density heuristic: those cut into the body whenever a page has
    short lines of its own ("Step 1", "Step 2"), losing content silently. If no
    anchor is found, nothing is trimmed — leading nav is obvious when read,
    missing steps are not.
    """
    desc = description_of(doc)
    if not desc or len(lines) < 15:
        return lines
    probe = re.sub(r"\s+", " ", desc)[:40].strip()
    if len(probe) < 15:
        return lines
    for i, ln in enumerate(lines):
        if probe.lower() in re.sub(r"\s+", " ", ln).lower():
            return lines[i:] if len(lines) - i >= 3 else lines
    return lines


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    url = args[0]
    doc = fetch(url)

    if "--raw" in sys.argv:
        i = sys.argv.index("--raw")
        if i + 1 < len(sys.argv):
            with open(sys.argv[i + 1], "w", encoding="utf-8") as fh:
                fh.write(doc)

    lines = to_lines(main_region(doc))
    if "--all" not in sys.argv:
        lines = trim_nav(lines, doc)

    print("== TITLE ==")
    print(title_of(doc))
    print()
    print("== TEXT ==")
    print("\n".join(lines) if lines else "(no readable text — page may render client-side)")
    print()
    print("== IMAGES ==")
    imgs = images_of(doc)
    if not imgs:
        print("(none)")
    for u, alt in imgs:
        print("%s%s" % (u, ("  [alt: %s]" % alt) if alt else ""))


if __name__ == "__main__":
    main()
