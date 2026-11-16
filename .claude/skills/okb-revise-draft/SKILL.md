---
name: okb-revise-draft
description: >-
  Revise an EXISTING Opus Knowledge Base page — live or draft — to improve its
  structure, wording (UK English), organisation and visual neatness, writing
  the result to the page's DRAFT in docs/drafts/ (never the live page). Use
  when the user says "revise / tidy up / improve / rework / clean up / reorganise
  the <X> page or draft", gives a support.opus-safety.co.uk/pages/... or
  /drafts/... URL to improve, or accepts an okb-page-audit hand-off. For a page
  that doesn't exist yet use okb-new-draft.
---

# Opus KB — revise a page into its draft

You take a page that already exists and make it clearer, better ordered and
neater, **without changing what it says is true**. The result always lands in
`docs/drafts/<slug>.md`.

> **Never edit `docs/pages/`.** Not to fix a typo, not "while you're there".
> Live pages change only when the user promotes a draft themselves
> (`okb-new-draft` → *Promoting a draft*, and only on explicit request).

Shared rules — read before revising, they are the standard you revise *to*:

- `.claude/skills/okb-shared/references/format.md` — every component's exact shape
- `.claude/skills/okb-shared/references/voice.md` — UK spelling, tone, terms, headings
- `.claude/skills/okb-shared/references/page-patterns.md` — page shapes, ordering rules

Tools (`python3 .claude/skills/okb-shared/scripts/<x>`): `page_facts.py`
(readability, outline, components, US spellings, capture ages), `links.py`
(every link/button checked), `captures.py` (find capture pairs), `uuids.py`
(fresh UUID spans), `lint.py` (house-format checks). Build/config questions →
`okb-zensical`.

## 1. Pin down the target — ask if anything's missing

You need **which page** and **which version to start from**.

Resolve what the user gave:

| Given | Means |
| :--- | :--- |
| `https://support.opus-safety.co.uk/drafts/<slug>/` | `docs/drafts/<slug>.md` |
| `https://support.opus-safety.co.uk/pages/<slug>/` | `docs/pages/<slug>.md` (live) |
| "the subscriptions draft" | `docs/drafts/subscriptions.md` |
| "the subscriptions page" / "subscriptions" | ambiguous if both exist — see below |

Match loose names against filenames **and** H1s (`grep -l '^# ' docs/{pages,drafts}/*.md`).
If several match, or none, ask — list the candidates.

Then pick the starting version. Use `AskUserQuestion` whenever it isn't clear:

- **Only a live page exists** → copy it to `docs/drafts/<slug>.md` and revise
  the copy (see step 3). No need to ask.
- **Only a draft exists** → revise the draft. No need to ask.
- **Both exist and the user said which** ("the live page", a `/pages/` URL vs
  "the draft", a `/drafts/` URL) → follow that. But if they said *live* and a
  draft already exists, the draft may hold unpublished work: **ask** before
  replacing it — "revise the existing draft" vs "start again from the live page
  (discards the draft's changes)". Summarise how the two differ
  (`diff <(…pages…) <(…drafts…)` → a line or two) so they can choose.
- **Both exist and it's unclear** → ask which to start from, with that same
  summary.

**The brief.** The user may say what they want improved ("the steps are too
long", "make it look less cluttered"). If they do, that's the priority — still
fix obvious problems elsewhere, but don't rewrite parts that are fine. If they
give no brief, do a full revision across every area in step 4. Don't ask for a
brief; its absence just means "make it better overall".

## 2. Read before you touch anything

1. The page itself, all of it.
2. `page_facts.py <page>` and `links.py <page>` — the measurable problems.
3. `lint.py <page>` — existing format errors.
4. The page's pattern in `page-patterns.md`, and one or two of the live
   examples named there. The neighbours are the authority on house style.
5. If revising a draft of a live page: the live version too, so you know what's
   already changed.

## 3. Set up the draft (only when starting from the live page)

1. `cp docs/pages/<slug>.md docs/drafts/<slug>.md` — **copy, never move**.
2. Add `search:\n  exclude: true` to its frontmatter.
3. Register it in `draft_nav` in `zensical.toml`, in the group mirroring its
   position in `nav` (create the group if needed).
4. Keep every UUID exactly as on the live page. A draft revision sharing its
   live page's UUIDs is expected — that's how blocks are tracked across
   versions, and `lint.py` allows it for a `drafts/x.md` ↔ `pages/x.md` pair.

## 4. Revise

Work through these, in this order (structure first — no point polishing a
sentence you're about to move):

**Structure** — does the page follow its pattern's shape and the ordering
rules in `page-patterns.md`? Prerequisites and access level before step 1;
warnings before the step they apply to; one job per page (a buried procedure
in a concept page → `??? outline "How to …"`); headings that describe their
section; no skipped heading levels; long runs of 10+ steps split into phases.

**Wording** — `voice.md`: UK spelling (`page_facts.py` lists candidates;
bold UI labels stay verbatim), imperative second person, one action per step,
short sentences (`page_facts.py` lists the longest — split anything over ~25
words), consistent verbs (click / select / enter), consistent terms, no
filler ("simply", "please note"), sentence-case headings.

**Visual neatness** — the right component for the job (`format.md`):
- walls of prose → steps, a list, a table, or an admonition
- a sentence that "needs highlighting" → `!!! warning` / `!!! note`, never `==…==`
- named statuses/levels → `mb-label` pills, one colour per value, consistent
  with other pages; access levels use the fixed pills
- consistent capture sizing by role (50px chips, 400 forms, 900 heroes)
- comparisons → a table; value→meaning pairs → a definition list
- don't over-decorate: grids, video and buttons belong on overview pages

**Links** — fix what `links.py` flags: broken targets, `http://`, relative
`.md` links from drafts (use absolute `support.opus-safety.co.uk/pages/<slug>/`
URLs), support links using anything but `window.supportWidget`, link text
that doesn't describe its destination ("click here").

**Captures** — for steps without an image, run `captures.py` for a fitting
pair and add it if one genuinely matches (same rules as `okb-new-draft`:
never invent a path, a `…/new/` capture is not an edit-screen capture).

### Rules that hold throughout

- **Substance is untouchable.** Recommendations, thresholds, limits, field and
  button labels, status values, warnings, who-can-do-what: carry them across
  exactly. Rewording a sentence is fine; changing what it claims is not.
- **Never invent facts** to fill a gap. If something looks wrong, out of date,
  or contradicts another page, **flag it** in your report — you can't see the
  current app.
- **UUIDs follow their block.** A block you keep (even moved or reworded) keeps
  its UUID. A block you split keeps its UUID on the first part; new parts get
  fresh ones from `uuids.py`. A block you delete takes its UUID with it. Never
  give an old UUID to a different block. Placement rules: `format.md` → UUID spans.
- **Big structural changes — propose first.** If you'd split the page in two,
  change its pattern (e.g. concept page → procedure), or delete a section,
  describe the new outline and get a yes before writing it. Everything else,
  just do.

## 5. Verify

```bash
python3 .claude/skills/okb-shared/scripts/lint.py docs/drafts/<slug>.md
python3 .claude/skills/okb-shared/scripts/links.py docs/drafts/<slug>.md
.venv/bin/zensical build
```

Zero lint errors, no new build warnings, no BROKEN links you introduced. Also
`git diff --stat docs/pages/` must be empty — if it isn't, you broke the one
rule; revert that file.

## 6. Report back

Keep it short:

- the draft's URL: `https://support.opus-safety.co.uk/drafts/<slug>/`
- what changed, grouped (Structure / Wording / Visual / Links / Captures),
  a few bullets each — the meaningful changes, not every comma
- **flags**: anything that looked inaccurate or contradictory, left as-is
- steps still missing a screenshot
- what you ran to verify, and the result
