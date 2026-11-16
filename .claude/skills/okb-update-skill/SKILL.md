---
name: okb-update-skill
description: >-
  Check the Opus Knowledge Base skills (okb-zensical, okb-new-draft,
  okb-revise-draft, okb-page-audit and their shared okb-shared references and
  scripts) against their real sources — Zensical docs/releases, zensical.toml,
  the repo's CSS/JS/overrides, live pages, and the More Buttons extension's KB
  editor — and propose updates for anything missing, wrong or stale. Use when
  the user runs /okb-update-skill or asks to update, refresh, sync or check the
  KB skills. Reports first and edits only what the user approves; "no update
  needed" is a valid outcome.
---

# Opus KB — update the KB skills

Find gaps between what the skills say and what is actually true now, propose
fixes with evidence, apply only what the user approves.

**If a skill genuinely doesn't need updating, say so plainly and stop.**
Don't invent changes to look useful, and don't reword sections that are
already correct.

## 1. Ask which skills

If the user didn't say, ask with `AskUserQuestion` (single-select):

- *All KB skills* (recommended)
- *okb-zensical* — Zensical reference
- *House-style rules* — `okb-shared` references + scripts, and the
  `okb-new-draft` / `okb-revise-draft` skills that apply them
- *okb-page-audit* — rubric and audit workflow

Skills live in `.claude/skills/okb-*/`. Note when each was last changed
(`stat -f '%Sm' -t '%F' <file>`) — changes to the sources *after* that date are
where gaps are most likely.

## 2. Check each skill against its sources

### okb-zensical

Sources, in this order:
1. **Installed version** — the pin in `requirements.txt` (and
   `.venv/bin/pip show zensical`). This is the version the KB actually builds with.
2. **What's enabled** — `zensical.toml`: `[project.markdown_extensions.*]`,
   `[project.theme] features`, plugins, `extra`.
3. **Upstream** — the Zensical docs (https://zensical.org/docs/) and release
   notes (GitHub releases for `zensical/zensical`, PyPI
   `https://pypi.org/pypi/zensical/json` for the latest version). Read pages
   with a fetch tool; search when a page is missing.

Sort every finding into exactly one bucket:
- **Wrong** — the skill states something untrue for the installed version
  (renamed option, changed CLI flag). → propose a fix.
- **Missing, usable** — supported by the installed version **and** enabled in
  `zensical.toml` (or a pure config/CLI feature), but not in the skill.
  → propose adding it.
- **Available, not enabled** — exists in Zensical but this KB doesn't have it
  turned on, or it needs a newer version than the pin. → **don't add it to the
  skill as usable syntax.** List it in the report as "available if you want
  it", with the version or setting it needs.

### House-style rules (okb-shared, okb-new-draft, okb-revise-draft)

The pages and the extension are the authority; `format.md`, `voice.md`,
`page-patterns.md`, `lint.py` and `captures.py` describe them.

Sources:
1. **The More Buttons extension** — `~/Desktop/stuff/more-buttons/more-buttons-unpacked/`
   (the working copy; check `manifest.json` version — it's newer than the
   newest zip in `more-buttons-zips/`). Its KB editor injects into
   `support.opus-safety.co.uk` and is what writes most page Markdown, so the
   Markdown it **emits** is the canonical shape. Look at: `components.js`,
   `componentContainers.js`, `kbPageEditor.js`, `kbPageRender.js`,
   `kbTypePicker.js`, `admonitions.js`, `labelPalette.js`, `labelPills.js`,
   `iconPills.js`, `grid.js`, `contentTabs.js`, `dataTables.js`, `videos.js`,
   `navLinks.js`, `mdButtons.js`, `audienceTags.js`, `captureInsertNew.js`,
   `captureDest.js`. Check its `README.md` and `tests/` for stated rules.
   Read-only — never edit the extension.
2. **The repo's runtime** — `docs/assets/stylesheets/*.css` (admonition types,
   `mb-label-*` colours, button classes, grid variants), `docs/assets/javascripts/*.js`
   (support widget, nav-links, anchors), `overrides/`, and `zensical.toml`
   (`mb_created_tags`, `mb_audiences`, admonition icons, nav groups).
3. **Live pages** — `docs/pages/*.md`. A pattern used on 2+ live pages that the
   skill doesn't describe is a gap; a pattern the skill prescribes that no live
   page uses any more is stale. `git log --since=<skill date> --stat -- docs/`
   shows what's changed recently.

Typical gaps: a new component or admonition type the extension can insert; a
new label colour; changed UUID placement; a renamed JS API (e.g. the support
widget moving from `window.groove` to `window.supportWidget`); a new audience
or tag; example pages in `page-patterns.md` that were renamed or deleted;
`lint.py` rules that contradict the current convention.

Verify every claim before proposing it — grep the pages, read the extension
code. A finding without a file:line or URL doesn't go in the report.

### okb-page-audit

Check `references/rubric.md` and the workflow still match the shared
references and scripts: metric inputs reference real `page_facts.py` /
`links.py` fields, the nav sections listed match `nav` in `zensical.toml`, the
headless-Chrome recipe still works.

## 3. Report before editing

Per skill, either **"No update needed"** with one line on what you checked, or
a numbered list of proposed changes:

```
okb-shared/references/format.md
 1. [Missing] `!!! checklist` admonition type — extension can insert it
    (more-buttons/scripts/admonitions.js:42), styled in admonitions.css:118,
    used on 3 live pages. → add to "Admonition types" with its shape.
 2. [Wrong] ...
Available, not enabled (Zensical): ...
```

Then ask which to apply: all / pick by number / none.

## 4. Apply what's approved

- Edit the skill files only (`.claude/skills/okb-*/`). Never edit pages,
  `zensical.toml`, or the extension as part of this skill.
- Put shared rules in `okb-shared/` — never copy a rule into several skills.
- If you change a script, rerun it on a couple of live pages and run
  `lint.py --all` (`python3 .claude/skills/okb-shared/scripts/lint.py --all`)
  before and after, to confirm the change adds no new false errors.
- Report what changed, file by file.
