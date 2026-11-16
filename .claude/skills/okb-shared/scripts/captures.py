#!/usr/bin/env python3
"""Search the capture library for a light/dark screenshot pair.

Finding the right existing capture is the highest-value, most error-prone part of
writing a page: the tree holds hundreds of files, and inventing a path that looks
plausible produces a silently broken image (the site build does NOT check image
paths). Search here first; only if nothing fits does the step go image-less.

Usage:
    python3 captures.py switch manage mode       # all terms must match
    python3 captures.py contractor --area admin  # restrict to an app area
    python3 captures.py save --any               # ANY term matches
    python3 captures.py --area todos --list      # list an area's pairs

Matching is on the path, case- and separator-insensitive, so "manage mode",
"manage-mode" and "ManageMode" all hit the same files.

Only **complete pairs** (a -light-mode and a -dark-mode file) are reported as
usable; anything unpaired is listed separately under INCOMPLETE, because this
format requires both halves. Output includes the ready-to-paste Markdown.
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
CAPS = os.path.join(ROOT, "docs", "assets", "media", "occ-captures")

SIZES = [
    ('{ style="height: 30px" loading=lazy }', "status icon in a table cell"),
    ('{ style="height: 50px" loading=lazy }', "small chip / button"),
    ('{ width="200" loading=lazy }', "list or table thumbnail"),
    ('{ width="400" loading=lazy }', "form / dialog"),
    ('{ width="900" loading=lazy }', "hero / full-bleed"),
]


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", s.lower())


def walk():
    if not os.path.isdir(CAPS):
        sys.exit("capture tree not found at %s" % CAPS)
    for dirpath, _, files in os.walk(CAPS):
        for fn in files:
            if fn.startswith("."):
                continue
            full = os.path.join(dirpath, fn)
            yield os.path.relpath(full, CAPS).replace(os.sep, "/")


def pair_key(rel):
    """('admin/x/new-light-mode.png') -> ('admin/x/new.png', 'light') or None."""
    m = re.match(r"^(.*)-(light|dark)-mode(\.[a-z0-9]+)$", rel, re.I)
    if not m:
        return None
    return (m.group(1) + m.group(3), m.group(2).lower())


def main():
    argv = sys.argv[1:]
    terms = [a for a in argv if not a.startswith("--")]
    area = None
    if "--area" in argv:
        i = argv.index("--area")
        if i + 1 < len(argv):
            area = argv[i + 1].strip("/").lower()
            if area in terms:
                terms.remove(area)
    any_mode = "--any" in argv
    list_mode = "--list" in argv

    if not terms and not list_mode:
        sys.exit(__doc__)

    pairs, singles = {}, []
    for rel in walk():
        if area and not norm(rel).startswith(norm(area).strip()):
            if not rel.lower().startswith(area + "/"):
                continue
        pk = pair_key(rel)
        if pk is None:
            singles.append(rel)
            continue
        base, mode = pk
        pairs.setdefault(base, {})[mode] = rel

    def hit(base):
        if not terms:
            return True
        hay = norm(base)
        tests = [norm(t).strip() in hay for t in terms]
        return any(tests) if any_mode else all(tests)

    complete, incomplete = [], []
    for base, got in sorted(pairs.items()):
        if not hit(base):
            continue
        (complete if len(got) == 2 else incomplete).append((base, got))

    print("== MATCHES (%d complete pairs) ==" % len(complete))
    if not complete:
        print("(none — leave the step image-less and list it for the user;")
        print(" do NOT invent a path or substitute a similar-looking screen)")
    for base, got in complete:
        print("\n" + base)
        print('  ![](../assets/media/occ-captures/%s#only-light)<SIZE>' % got["light"])
        print('  ![](../assets/media/occ-captures/%s#only-dark)<SIZE>' % got["dark"])

    if incomplete:
        print("\n== INCOMPLETE (unusable — only one half exists) ==")
        for base, got in incomplete:
            print("  %s  [has: %s]" % (base, ", ".join(sorted(got))))

    if complete:
        print("\n== <SIZE> — pick by role ==")
        for attrs, role in SIZES:
            print("  %-42s %s" % (attrs, role))
        print("\nPaste both lines together, no blank line between them, with a")
        print("UUID span on the line immediately above the first.")


if __name__ == "__main__":
    main()
