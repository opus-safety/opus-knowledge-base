#!/usr/bin/env python3
"""Measurable facts about a KB page, for auditing and revising.

    python3 page_facts.py docs/pages/mfa.md [more.md ...]
    python3 page_facts.py --json docs/pages/mfa.md

Prints, per page:
  - last commit date of the page
  - readability: prose word count, sentence count, average words/sentence,
    Flesch reading ease (60+ is plain English), the longest sentences
  - outline: the heading tree
  - components: steps, admonitions by type, tabs, capture pairs, pills,
    tables, grids, steps with no image
  - US-spelling candidates found in prose (code, URLs, attributes and bold UI
    labels excluded — the app's own labels are quoted verbatim)
  - freshness: each capture's last commit date, and System Updates entries
    dated after it (match them to the page's topic by hand — a later update
    to the same area means the screenshot may be stale)

Facts, not verdicts: the scores are judged by the auditor using the rubric.
"""
import datetime as dt
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
SYSUPD = os.path.join(ROOT, "docs", "pages", "system-updates.md")

US_WORDS = re.compile(r"\b(\w*?(?:iz(?:e|es|ed|ing|ation|ations))|color\w*|behavior\w*|favor\w*|"
                      r"honor\w*|center(?:s|ed)?|license(?:s)?\b(?=\s+(?:is|was|for|to))|"
                      r"catalog\b|program(?:me)?s?\b(?=\s+of)|canceled|labeled|traveled|enrollment|"
                      r"gray|judgment|analyze\w*|organiz\w*|prioritiz\w*|customiz\w*|"
                      r"recogniz\w*|summariz\w*|authoriz\w*)\b", re.I)
SU_ENTRY = re.compile(r'^\?\?\?\+?\s+([\w-]+)\s+"(.*?)<span class="meta">\s*(\d+)(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})\s*</span>"')
MONTHS = {m: i for i, m in enumerate(["january", "february", "march", "april", "may", "june", "july",
                                      "august", "september", "october", "november", "december"], 1)}


def git_date(path):
    try:
        out = subprocess.run(["git", "-C", ROOT, "log", "-1", "--format=%cs", "--", path],
                             capture_output=True, text=True, timeout=20).stdout.strip()
        return out or None
    except Exception:
        return None


def system_updates():
    out = []
    try:
        for ln in open(SYSUPD, encoding="utf-8"):
            m = SU_ENTRY.match(ln.strip())
            if m and m.group(4).lower() in MONTHS:
                d = dt.date(int(m.group(5)), MONTHS[m.group(4).lower()], int(m.group(3)))
                out.append((d.isoformat(), m.group(1), re.sub(r"<[^>]+>", "", m.group(2)).strip()))
    except OSError:
        pass
    return out


def prose_lines(text):
    """Lines of reader-visible prose with markup stripped."""
    body = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.S)
    in_fence, out = False, []
    for ln in body.splitlines():
        s = ln.strip()
        if s.startswith(("```", "~~~")):
            in_fence = not in_fence
            continue
        if in_fence or not s or s.startswith(("#", "![", "<span data-uuid", "<div", "</div", "<style",
                                              "<video", "<source", "|", "=== ", ":---")):
            continue
        s = re.sub(r"^(!!!|\?\?\?\+?)\s+[\w-]+\s*", "", s)            # admonition opener
        s = s.strip('"')
        s = re.sub(r"\{[^}]*\}", "", s)                                 # attr lists
        s = re.sub(r"<[^>]+>", "", s)                                   # html
        s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)                  # links → text
        s = re.sub(r":[a-z0-9-]+:", "", s)                              # icons
        s = re.sub(r"^[-*]\s+|^\d+\.\s+", "", s)                        # list bullets
        s = re.sub(r"[*_`^=]", "", s).strip()
        if s:
            out.append(s)
    return out


def syllables(word):
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w:
        return 0
    groups = re.findall(r"[aeiouy]+", w)
    n = len(groups) - (1 if w.endswith("e") and not w.endswith(("le", "ee")) and len(groups) > 1 else 0)
    return max(1, n)


def readability(lines):
    # A line with no terminal punctuation (title, list item, label) is its own unit.
    text = " ".join(l if re.search(r"[.!?:;]$", l) else l + "." for l in lines)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?:;])\s+|\s+-\s+", text) if len(s.split()) >= 3]
    words = re.findall(r"[A-Za-z][A-Za-z'-]*", text)
    if not sentences or not words:
        return dict(words=len(words), sentences=len(sentences), avg_words=0, flesch=None, longest=[])
    syl = sum(syllables(w) for w in words)
    wps = len(words) / len(sentences)
    flesch = round(206.835 - 1.015 * wps - 84.6 * (syl / len(words)), 1)
    longest = sorted(sentences, key=lambda s: -len(s.split()))[:3]
    return dict(words=len(words), sentences=len(sentences), avg_words=round(wps, 1), flesch=flesch,
                longest=["(%d words) %s" % (len(s.split()), s[:200]) for s in longest])


def components(text):
    lines = text.splitlines()
    adm = {}
    for ln in lines:
        m = re.match(r"^\s*(?:!!!|\?\?\?\+?)\s+([\w-]+)", ln)
        if m:
            adm[m.group(1)] = adm.get(m.group(1), 0) + 1
    # steps without an image inside them
    steps_no_img, cur, has_img = 0, None, False
    for ln in lines + ["!!! end"]:
        m = re.match(r"^(\s*)(?:!!!|\?\?\?\+?)\s+([\w-]+)", ln)
        if m or (cur is not None and ln.strip() and not ln.startswith(cur + " ")):
            if cur is not None and not has_img:
                steps_no_img += 1
            cur, has_img = None, False
            if m and m.group(2) == "step":
                cur, has_img = m.group(1), False
        elif cur is not None and "#only-light" in ln:
            has_img = True
    return dict(
        steps=adm.get("step", 0),
        steps_without_image=steps_no_img,
        admonitions={k: v for k, v in sorted(adm.items()) if k != "step"},
        tabs=sum(1 for ln in lines if re.match(r"^\s*=== ", ln)),
        capture_pairs=sum(1 for ln in lines if "#only-light" in ln),
        videos=text.count("<video"),
        pills=len(re.findall(r'class="mb-label', text)),
        tables=sum(1 for ln in lines if re.match(r"^\s*\|\s*:?-{3}", ln)),
        grids=len(re.findall(r'class="grid', text)),
        buttons=len(re.findall(r"\.md-button", text)),
        mermaid=text.count("```mermaid"),
        highlight_marks=len(re.findall(r"==[^=\n]+==", text)),
    )


def outline(text):
    body = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.S)
    out, in_fence = [], False
    for ln in body.splitlines():
        if ln.lstrip().startswith(("```", "~~~")):
            in_fence = not in_fence
        if not in_fence:
            m = re.match(r"^(#{1,6})\s+(.*)", ln)
            if m:
                out.append("  " * (len(m.group(1)) - 1) + m.group(1) + " " + m.group(2).strip())
    return out


def us_spellings(text):
    body = re.sub(r"```.*?```", "", text, flags=re.S)
    body = re.sub(r"\*\*[^*]+\*\*", "", body)          # bold UI labels are verbatim
    body = re.sub(r"`[^`]*`|\([^)]*\)|\{[^}]*\}|<[^>]+>", "", body)
    found = {}
    for m in US_WORDS.finditer(body):
        w = m.group(1)
        if re.search(r"(?i)^(size|sized|sizes|sizing|seize\w*|prize\w*|capsize\w*)$", w):
            continue
        found[w.lower()] = found.get(w.lower(), 0) + 1
    return found


def freshness(page, text, updates):
    caps = sorted(set(re.findall(r"\]\(([^)\s]+?)#only-light", text)))
    rows = []
    for c in caps:
        p = os.path.normpath(os.path.join(os.path.dirname(page), c))
        d = git_date(p) if os.path.exists(p) else None
        later = [u for u in updates if d and u[0] > d]
        rows.append(dict(capture=os.path.relpath(p, ROOT), captured=d or "MISSING",
                         updates_since=len(later)))
    dated = [r["captured"] for r in rows if r["captured"] != "MISSING"]
    oldest = min(dated) if dated else None
    since = [dict(date=u[0], kind=u[1], title=u[2]) for u in updates if oldest and u[0] > oldest]
    return rows, since


def facts(page, updates):
    text = open(page, encoding="utf-8").read()
    caps, since = freshness(page, text, updates)
    return dict(page=os.path.relpath(page, ROOT), last_edited=git_date(page),
                readability=readability(prose_lines(text)), outline=outline(text),
                components=components(text), us_spellings=us_spellings(text),
                captures=caps, system_updates_since_oldest_capture=since)


def show(f):
    r = f["readability"]
    print("=" * 78)
    print(f["page"], "  (last edited %s)" % f["last_edited"])
    print("-- readability: %d words, %d sentences, %.1f words/sentence, Flesch %s"
          % (r["words"], r["sentences"], r["avg_words"], r["flesch"]))
    for s in r["longest"]:
        print("   longest:", s)
    print("-- outline:")
    for h in f["outline"]:
        print("   " + h)
    print("-- components:", json.dumps(f["components"]))
    if f["us_spellings"]:
        print("-- US spelling candidates:", ", ".join("%s×%d" % kv for kv in f["us_spellings"].items()))
    print("-- captures (last committed / System Updates since):")
    for c in f["captures"]:
        print("   %-10s %2d  %s" % (c["captured"], c["updates_since"], c["capture"]))
    if f["system_updates_since_oldest_capture"]:
        print("-- System Updates after the oldest capture (match to this page's topic):")
        for u in f["system_updates_since_oldest_capture"]:
            print("   %s  %-16s %s" % (u["date"], u["kind"], u["title"]))


def main(argv):
    as_json = "--json" in argv
    pages = [os.path.abspath(a) for a in argv if not a.startswith("--")]
    if not pages:
        print(__doc__)
        return 2
    updates = system_updates()
    out = [facts(p, updates) for p in pages]
    if as_json:
        print(json.dumps(out, indent=1))
    else:
        for f in out:
            show(f)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
