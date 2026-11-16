---
name: okb-page-audit
description: >-
  Audit Opus Knowledge Base pages and score them out of 10 on Readability,
  Visual style, Structure, Linking, Freshness, House style, Accessibility and
  Completeness (any subset). Use when the user runs /okb-page-audit, or asks to
  audit, score, grade, review, health-check or "check the links on" one KB
  page, a group of pages, or the whole site. Audits LIVE pages unless drafts
  are explicitly asked for. Read-only: never edits pages; offers to hand the
  worst pages to okb-revise-draft.
---

# Opus KB — page audit

Score pages against `references/rubric.md`, with evidence, and report. **This
skill never edits anything.** Fixes go through `okb-revise-draft` (offered at
the end).

Shared standard: `.claude/skills/okb-shared/references/{format,voice,page-patterns}.md`.
Tools: `python3 .claude/skills/okb-shared/scripts/<x>` — `page_facts.py`,
`links.py`, `lint.py`.

## 1. Ask what to audit

Usually run with no prompt. Ask for whatever the user didn't say, in **one**
`AskUserQuestion` call:

1. **Scope** (single-select): *A single page* · *A group of pages* · *All live
   pages* · *Drafts*.
2. **Content metrics** (multi-select): Readability · Structure · Completeness ·
   Freshness
3. **Presentation & technical metrics** (multi-select): Visual style · Linking ·
   Accessibility · House style

Say in the question text that picking everything in 2 and 3 gives a full
audit. If they pick nothing in either, ask again — a metric is required.

Then, if needed, a follow-up:
- *A single page* → which one (accept a name, slug or URL; resolve like
  `okb-revise-draft` step 1).
- *A group* → offer the live nav sections (read `nav` in `zensical.toml`:
  Getting started, My account, Tasks, Employees, Assets, Requirements,
  Reporting, Contractors, RAMS, Other, System) or an audience tag
  (`Using OCC` / `Managing OCC` / `Administering OCC`), or a free-text list.
- *Drafts* → all drafts, or specific ones.

**Scope rules**
- Live = `docs/pages/*.md` registered in `nav` or `unlisted_nav`. Drafts only
  when asked.
- `system-updates.md`, `system-status.md` and `index.md` are special-purpose:
  for *All live pages*, audit them for **Linking only** and say so.

## 2. Gather facts (scripts first, judgement second)

```bash
S=.claude/skills/okb-shared/scripts
python3 $S/page_facts.py <pages…>      # readability, outline, components, capture ages
python3 $S/links.py <pages…>           # or --all / --drafts
python3 $S/lint.py <pages…>
```

Run only what the chosen metrics need (Linking → `links.py`; Readability/
Structure/Freshness/Completeness → `page_facts.py`; House style → `lint.py`).

Then read each page in full, and its pattern's live example in
`page-patterns.md`.

**Visual style** — for ≤ 3 pages, render and look in both themes:

```bash
.venv/bin/zensical build
(cd site && python3 -m http.server 8123 >/dev/null 2>&1 &)
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --virtual-time-budget=8000 --window-size=1400,3000 \
  --screenshot="$SCRATCH/<slug>-light.png" http://localhost:8123/pages/<slug>/
# dark: copy site/pages/<slug>/index.html to a sibling dir at the same depth,
# set data-md-color-scheme="slate" on <body>, screenshot that; delete after.
lsof -ti:8123 -sTCP:LISTEN | xargs kill
```

Use the session scratchpad for screenshots. For more than 3 pages, judge from
source and screenshot only pages whose source suggests a problem.

**Many pages** (more than ~6): split the scoring across parallel subagents,
a handful of pages each, giving each the rubric path, the metric list and the
script outputs for its pages. Merge their results; spot-check one page per
agent for consistent scoring.

## 3. Score

For each page × selected metric: a score out of 10, a one-line reason, and
the evidence. Follow `references/rubric.md` exactly — the deductions there
keep scores comparable between runs. Then the overall (mean of selected
metrics, one decimal). Freshness is **advisory**: present it as "worth
checking", never as "this page is wrong".

Do **not** report as problems: a draft's bare sibling `.md` links (EXPECTED
in `links.py`), or deliberately inverted light/dark capture pairs.

## 4. Report

**1–3 pages → a table in the terminal:**

```
| Page | Readability | Structure | Linking | Overall |
| :--- | ---: | ---: | ---: | ---: |
| Adding a contractor | 7 | 8 | 10 | 8.3 |
```

then, per page, the top 3 fixes (most valuable first), each with its
evidence, and any CHECK links to look at by hand.

**More than 3 pages → an artifact report.** Load the `artifact-design` skill
first, then build one HTML page:
- header: scope, metrics, date, page count, average overall
- a sortable table: page × metric scores, colour-banded
  (≤4 poor, 5–7 fair, 8–10 good), worst overall first
- per page, a collapsible section: scores with one-line reasons, top fixes
  with evidence, links needing attention
- a **Linking** section listing every BROKEN/WARN link across the site
- site-wide patterns (e.g. "14 pages use 'click on'", "Manage mode redesign
  post-dates captures on 9 pages")

Publish it with the `Artifact` tool (icon `chart`), and give the link plus a
3-line summary in the terminal.

## 5. Offer the hand-off

End with one line offering `okb-revise-draft` on the lowest scorers, naming
them: "Want me to revise the 3 lowest — *X*, *Y*, *Z* — into drafts?" If they
accept, run `okb-revise-draft` per page, passing that page's top fixes as the
brief. One page at a time, reporting each.
