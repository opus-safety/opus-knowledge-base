---
name: okb-new-draft
description: >-
  Create a NEW Opus Knowledge Base draft page (Zensical/MkDocs-Material guide for
  Opus Compliance Cloud) from source material, in this repo's house style. Use
  whenever the user wants a page that doesn't exist yet — "write a guide for
  archiving a contractor", "draft a how-to for X", "add a new help article",
  "document this feature", "turn these notes / this pasted text / this URL into
  a KB doc", "migrate this guide". Writes to docs/drafts/ only, wires up
  existing light/dark captures where a solid match exists, and lists missing
  screenshots. For improving a page that already exists (live or draft) use
  okb-revise-draft instead. The format is unusual (hidden per-block UUID spans,
  `!!! step` admonitions, light/dark image pairs, `mb-label` pills) — never
  freehand it from memory.
---

# Opus Knowledge Base — new draft

This repo is a [Zensical](https://zensical.org) site (a Material-for-MkDocs
descendant). Pages are Markdown under `docs/`, but the house style uses several
non-obvious conventions. Reproduce them faithfully so a new page is
indistinguishable from the existing ones and survives the build.

For build commands, config, theming, and anything beyond page content, defer to
the **`okb-zensical`** skill — don't duplicate that here.

## Bundled tooling

Shared rules and tooling live in `.claude/skills/okb-shared/` (also used by
`okb-revise-draft` and `okb-page-audit` — edit them there, never fork a copy):

- `okb-shared/references/format.md` — full annotated component reference
- `okb-shared/references/voice.md` — UK spelling, tone, terminology
- `okb-shared/references/page-patterns.md` — page shapes and their best live examples

Helpers, all runnable with `python3 .claude/skills/okb-shared/scripts/<x>`:

| Script | Use |
| :--- | :--- |
| `captures.py <terms>` | Search the screenshot library for a light/dark pair. **Run before writing any image path.** |
| `uuids.py [n]` | Print `n` fresh UUID spans, ready to paste. |
| `lint.py <page>` | Check a page for what the build misses (images, UUIDs, pairing, registration). **Run before handing back.** |
| `scrape.py <url>` | Pull readable content + image list from a source URL. |
| `links.py <page>` | Check every link/button resolves (KB pages, anchors, app routes, external). |
| `page_facts.py <page>` | Readability, outline, components, US-spelling candidates, capture ages. |

## Where things live

- `docs/pages/*.md` — **published** guides (registered in `nav` in `zensical.toml`).
- `docs/drafts/*.md` — **work in progress**, not in the main `nav`.
- `docs/assets/media/occ-captures/...` — screenshots, organised by app area.
- `zensical.toml` — `nav` (live), `draft_nav` (WIP) and `unlisted_nav`
  (built and URL-reachable, but hidden from sidebar + search) register pages.

**Always write a new guide into `docs/drafts/`** (never straight into
`docs/pages/`) and register it in **`draft_nav`** — new pages start as drafts and
are only promoted to `pages/` + `nav` later, by the user, once reviewed. A page
does not appear in the sidebar until it's registered, so wire the draft into
`draft_nav` and tell the user it's a draft. Filenames are kebab-case and become
the URL slug, so name them the way they should read in a link (e.g.
`archiving-a-contractor.md`).

## The non-negotiable conventions

Study `okb-shared/references/format.md` before writing — it has the full annotated
breakdown with copy-pasteable snippets. The essentials:

1. **Frontmatter + title.** Every page opens with a `lucide` icon, an audience
   tag, and an H1:
   ```markdown
   ---
   icon: lucide/square-plus
   tags:
     - Managing OCC
   search:
     exclude: true
   ---

   # Adding a contractor
   <span data-uuid="GENERATE-A-FRESH-UUID" style="display:none"></span>
   ```
   - **`icon:`** — a `lucide/...` name that fits the topic (existing pages use
     `square-plus`, `user-plus`, `user-check`, `package-plus`, `key-round`,
     `file-plus`, `inbox`, `layout-dashboard`, `megaphone`, …).
   - **`tags:`** — exactly one *audience* tag: `Using OCC` (users and above),
     `Managing OCC` (managers and above) or `Administering OCC`, plus optional
     free tags (`Add-on`, `Overview`, `RAMS`, `System`). Tags must already be
     registered in `mb_created_tags` in `zensical.toml`.
   - **`search: exclude: true`** — required on every page in `docs/drafts/`, so a
     draft never shows up in site search. Drop it when the page is promoted.
   - There is **no `title:` key** — the H1 is the title.

   **Do not write a "Written for" / "This guide is suitable for" line.** The
   audience pill line under the H1 is generated at build time from the audience
   tag (`overrides/partials/content.html` + `mb_audiences`). Older revisions of
   these pages carried a hand-written `<span data-mb-suitable-for …>` block; it
   has been removed everywhere and re-adding one produces a duplicate line.

2. **Hidden UUID spans on every heading and component block.** This is the most
   distinctive rule and the easiest to get wrong. A hidden span is attached to
   the H1, **every `##`/`###` heading, and every component block** — each
   admonition (`!!! step`, `!!! outline`, `!!! info`, …), each image/capture
   group, each `<video>` group, each data table, each content-tab group (plus one
   per tab), each grid (plus one per cell), each button, and each nav-links
   block. Plain prose paragraphs do **not** get their own span; they belong to
   their heading's section.
   ```html
   <span data-uuid="..." style="display:none"></span>
   ```
   **Placement matters — match the extension exactly** (it round-trips these):
   - **Headings:** span on the line *directly under* the heading, then a blank
     line before the body.
   - **Admonitions (steps/outlines/info/…):** the span is the *first line inside*
     the block, followed by a blank line, then the content.
   - **Capture/image groups:** the span sits on the line *immediately before* the
     `![]()` lines (no blank line between span and images), with a blank line
     before the span.
   - **Data tables:** span, then a blank line, then the pipe table.
   - **Content tabs:** the group's span goes on the line *immediately before* the
     first `=== "Title"`; each tab then carries its own span as the first line of
     its (indented) body.

   **The blank line after a span is load-bearing, not cosmetic** — above all when
   a list or table follows. A `- ` list (or `|` table) on the line directly after
   a span gets parsed as a lazy continuation of the span's paragraph, so it
   renders as one run-on line of literal `- ` text instead of bullets. The build
   won't catch this; `lint.py` warns on it. Only captures/videos/buttons (per the
   rules above) put content directly against the span.

   These are tracking anchors used to sync content. Each must be a **fresh,
   unique UUIDv4** — never copy one from another block, another page, or the
   examples in this skill. Generate them all new with the bundled helper:
   ```bash
   python3 .claude/skills/okb-shared/scripts/uuids.py 40
   ```
   It prints ready-to-paste `<span ...></span>` lines. Estimate ~1 per heading +
   component (real pages run 20–100). When in doubt, generate extra.

3. **Procedure steps use `!!! step`.** Numbered how-to instructions are a run of
   `!!! step` admonitions (a custom type styled by `admonitions.css`), not a
   Markdown ordered list. The canonical shape of one step:
   ```markdown
   !!! step

       <span data-uuid="..." style="display:none"></span>
       From [My Dashboard](https://cloud.opus-safety.co.uk/dashboard), click on **Pick workspace**.

       <span data-uuid="..." style="display:none"></span>
       ![](../assets/media/occ-captures/dashboard/pick-workspace-light-mode.png#only-light){ style="height: 50px" loading=lazy }
       ![](../assets/media/occ-captures/dashboard/pick-workspace-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }
   ```
   Note the 4-space indentation inside the admonition, the **bold** for every
   clickable UI label/button, and real links for navigable destinations.

4. **Images come in light/dark pairs.** Whenever you include an image, emit
   *both* `![]()` lines — one with `#only-light` and one with `#only-dark` —
   pointing at `-light-mode` / `-dark-mode` files (never a lone single image).
   Size by role: `{ style="height: 30px" … }` status icon in a table cell ·
   `height: 50px` small chip/button · `width="200"` list thumbnail ·
   `width="400"` form or dialog · `width="900"` hero. Always `loading=lazy`.

   **Nearly all images live under `docs/assets/media/occ-captures/...`**, in a
   subtree mirroring the app's URL path — so `/admin/sites/<uuid>/contractors/new`
   maps to `occ-captures/admin/sites/uuid/contractors/new-*.png`, with `uuid`
   literal. App areas: `admin` (much the largest), `todos`, `sites`, `employees`,
   `other` (shared `.svg` status icons), `dashboard`, `users`, `contractors`,
   `projects`, `my`. (`docs/assets/media/other/` — the *sibling* of
   `occ-captures`, not `occ-captures/other/` — is legacy/animation assets; don't
   add to it.)

   **Search the capture library before writing any path** — use the bundled
   helper, which only reports complete pairs and prints paste-ready Markdown:
   ```bash
   python3 .claude/skills/okb-shared/scripts/captures.py switch manage mode
   python3 .claude/skills/okb-shared/scripts/captures.py save --area admin
   ```
   **If no appropriate capture exists, do not include any image for that step and
   do not invent a placeholder path — instead list those steps in your response**
   so the user knows which screenshots still need taking. Don't fabricate a
   generic or guessed image. **The site build does not validate image paths**, so
   an invented one fails silently and ships broken — `scripts/lint.py` is what
   catches it.

   **A `…/new/` capture is not a match for an edit-page step.** Even when the UI
   label is identical (e.g. a **Save asset** button), the edit/archive page is a
   different screen from the `…/new/` create page, so its captures live under a
   different path and must be taken separately. Don't reuse a `…/equipments/new/`
   image on an "edit"/"archive" step — leave that step image-less and list it for
   the user instead.

5. **There's more than steps.** The authoring extension emits a defined set of
   component blocks — and the skill covers all of them, not just procedures. Reach
   for the right one and follow its exact shape in `okb-shared/references/format.md`:
   - **Admonitions** — `step`, `outline` (form fields), `info`, `tip`, `warning`,
     `note`, `question`, … (`!!!` static, `???`/`???+` collapsible).
   - **Label pills** — `<span class="mb-label mb-label-red">Critical</span>`, the
     house treatment for a named status/severity/category/access level. Heavily
     used (200+ instances) in tables, lists, prose and admonition titles; 26
     colour slugs. Inline, so **no** UUID span of its own. Access levels have
     **fixed** pills — User is `mb-label-blue` + `:lucide-user:`, Manager is
     `mb-label-purple` + `:lucide-user-shield:`, Administrator is `mb-label-pink`
     + `:lucide-user-cog:` — reuse them, don't recolour.
   - **Inline icons** — `:lucide-name:` renders a Lucide icon anywhere inline:
     prose, list items, table cells, admonition titles, pills, button labels.
     Use them to *signify*, not decorate — naming an unlabelled control
     (`Click the :lucide-ellipsis: icon`), ticking a comparison table
     (`:lucide-check:`), or tagging an aside with the role it applies to.
   - **Captures** — light/dark image pairs (`#only-light`/`#only-dark`);
     `.svg` icon pairs live in `occ-captures/other/`.
   - **Video** — `<video>` light/dark pairs for short demo clips (animation loop
     or `controls` clip); files live in `docs/assets/media/videos/`.
   - **Content tabs** (`=== "…"`) for branching paths — often "Table" vs
     "Diagram" views of the same content.
   - **Mermaid diagrams** — ```` ```mermaid ```` fences (`config: layout: elk`,
     `flowchart TB`) on the concept pages, usually inside a tab.
   - **Data tables**, optionally wrapped in `<div class="nowrap-first" markdown>`
     to stop the first column wrapping; **definition lists** for short
     value→meaning pairs.
   - **Grids** (`<div class="grid" markdown>`) for side-by-side tiles /
     text-beside-screenshot layouts, with `card`/`spill`/`align-self` variants.
   - **Buttons** (`{ .md-button }`, `.custom-button-<slug>`) and inline
     `:lucide-icon:` shortcodes.
   - **Nav-links** (`<div class="mb-nav-links" …>`) for auto-generated child-link
     lists on overview pages — by nav branch (`data-nav-path`) or by tag
     (`data-nav-tag` + `data-nav-layout="grouped"|"flat"`). Always left empty.
   - **Page chrome** — `hide:` frontmatter (`toc`/`navigation`/`path`/
     `written-for`) and the `data-mb-hide-section-title` style marker, for
     overview/landing pages only.

   Most how-to guides are steps + captures + the odd admonition; the grid / video
   / nav-links / button set is mainly for **overview** pages (see
   `contractors-overview.md`). Don't force them into a plain procedure.

6. **Emphasis is bold — never `==highlight==`, and not `^^underline^^`.**
   `pymdownx.mark` is enabled, but `==…==` appears **zero times** across every
   published page, and a page dotted with it reads as foreign immediately. Use
   `**bold**` for anything that must land (limits, caveats, UI labels, key terms
   on first mention), `*italic*` for asides and quoted UI questions, a
   **label pill** for a named status/severity/access level, and `` `backticks` ``
   for literal values. **Never use `^^underline^^` for general emphasis or key
   terms** — the user has explicitly asked for bold or italic instead. The one
   sanctioned use of `^^…^^` is the `^^**Recommended for:**^^` lead-in that
   already appears on published pages. If a sentence seems to need highlighting,
   it usually wants to be its own `!!! warning` / `!!! note` instead. Full table
   in `okb-shared/references/format.md` → *Emphasis: what to reach for*.

7. **"Get in touch" means the support widget, not `/contact`.** Anything about
   using, fixing, configuring or enabling something in the product opens the
   in-page support widget:
   ```markdown
   <a href="#" onclick="event.preventDefault(); window.supportWidget.open();">get in touch</a>
   ```
   `https://www.opus-safety.co.uk/contact` is the **sales** page — reserve it for
   buying an add-on, pricing or a demo, where it appears as a `.md-button` CTA on
   an overview page. "Speak to us and we'll customise that checklist" or "contact
   us to have this enabled" is **support**, so it's the widget. Always call the
   vendor-neutral `window.supportWidget.*` shim — never a vendor API (legacy
   `window.groove.*` calls are wrong; `lint.py` flags them).

## Working from supplied source content

Source material arrives in one of three shapes. All three are normal; none needs
to be in any particular format.

1. **Rough notes typed in chat** — a bullet list of clicks, a description of the
   flow. The common case.
2. **Raw content pasted into chat** — a block of prose lifted from an existing
   article, an internal doc, an email, a transcript of someone talking through
   the flow. Paste it as-is; it does not need cleaning up first.
3. **A URL** to fetch it from (see below).

Whatever the shape, you generally also need **title, audience, and where it sits
in the nav** — those aren't reliably recoverable from the content itself. Ask for
any that are missing.

In every case, treat the source as **raw material for a page written in this
repo's format, never as something to transcribe** — the rewriting rules below
apply equally to pasted content and scraped content.

### If it's a URL

**Pull the content with the bundled scraper, not a summarising fetch tool:**

```bash
python3 .claude/skills/okb-shared/scripts/scrape.py "<url>"
```

Fetch tools that run a model over the page paraphrase it and silently drop list
items and images — you end up rewriting a summary of a summary. The scraper
prints the page's own words plus every image URL in document order, so you can
see exactly what the source says. Read the whole output before writing.

Two outputs mean *stop and ask*, not *improvise*:

- **Empty or near-empty** — the page renders client-side. Say so and ask for the
  content another way.
- **A short stub** whose text is essentially "this page has moved" / "see the new
  version here" — the source has already been migrated or redirected. Don't write
  a page from the title alone; report what the stub says, and check whether the
  page already exists in `docs/pages/` before doing anything else.

### Rewriting the source

**Rewrite fully into house voice — don't transcribe.** Source pages are usually
written to a different standard, and a faithful copy reads wrong here: hand-typed
"Step 1"/"Step 2" (this format auto-numbers), UI labels in 'single quotes'
instead of **bold**, `N.B.` instead of an admonition, form fields as a bold-dash
list instead of `!!! outline`, title-case headings, stray typos. Restructure into
the right components and rewrite the sentences for the tighter, imperative rhythm
of the neighbouring pages.

**But rewriting the prose never means changing the substance.** Carry these
across exactly, even when the phrasing around them changes completely:

- recommendations and their conditions ("we recommend `Critical` for…")
- thresholds, counts, timings, limits
- field names, button labels, menu paths, status and enum values
- warnings, restrictions, and anything about who can do what
- caveats about irreversibility or side effects

If the source is ambiguous, contradicts a published page, or describes UI that
looks out of date, **flag it rather than resolving it silently** — you can see the
old text but not the current app.

### Images

Source screenshots are **not** reusable: they're remote-hosted or pasted inline,
single-mode, and this format needs a local light/dark pair under `occ-captures/`.
So for each image in the source, follow the normal capture rules — find an
existing `occ-captures` pair for that screen and use it, otherwise leave the step
image-less and list it for the user. Never hotlink a source image, and never
reference a local path for one.

The value of the source's images is as evidence of **which steps had a
screenshot** — i.e. which ones probably need one taken. The scraper lists image
URLs in document order for exactly this; for pasted content, an image that the
user has visibly stripped out (a stray "[image]", a caption with nothing above
it) is the same signal.

### Links

Rewrite links that point at pages which already exist in this KB to their
published path (`https://support.opus-safety.co.uk/pages/<slug>/`). Where the
target hasn't been migrated yet, leave the original URL and list it in your
response so it can be swept later.

Source pages routinely end an answer with a bare "get in touch" or "contact us".
Those are **support** links: render them as the support-widget anchor, not as a
link to the sales `/contact` page (see convention 7 above).

## Building the page

1. **Read the two or three closest existing pages before writing a line.** The
   goal is a page indistinguishable from its neighbours, and the pages are the
   authority — this skill and `okb-shared/references/format.md` describe them, they don't
   replace them. Pick the nearest match by *shape*, not just topic, using
   `okb-shared/references/page-patterns.md` (procedure, form, branching,
   reference table, concept, overview, FAQ — each with its best live examples).

   **Don't use `system-updates.md`, `system-status.md`, or `index.md` as
   models** — they're special-purpose pages with edge cases (generated content,
   status-banner attributes, hero animation frontmatter) that make them poor
   templates.

   Then decide the topic, audience tag, and step sequence, and match the house
   voice in `okb-shared/references/voice.md`: second person, imperative, one
   action per step, UK English ("authorisation", "organisation"), **bold** for
   every clickable label, and the product named **Opus Compliance Cloud** in
   full on first mention.
2. Generate a batch of **fresh** UUID spans (`scripts/uuids.py`) — one per
   heading and component block; never reuse a UUID.
3. Write the draft into `docs/drafts/`, starting from `assets/template.md` or a
   copy of a similar published **guide** page (not `system-updates.md` /
   `system-status.md`).
4. Write steps in the `!!! step` pattern. For each step, look in
   `docs/assets/media/occ-captures/` for a fitting capture and reference it; if
   none fits, leave the step image-less and note it for the user (see Images).
   Add `??? info`/`!!! warning`/`!!! tip` for caveats; use `=== "Tab"` blocks for
   branching paths (e.g. new vs existing user). See `okb-shared/references/format.md` for
   the full menu of admonition types and inline formatting (`**bold**`,
   backtick values, `:lucide-icon:` shortcodes,
   `<span class="meta">(optional)</span>` — and why `==highlight==` and
   `^^underline^^`-for-emphasis are not used).
5. Register the draft in `draft_nav` in `zensical.toml` (not `nav` — new pages
   stay drafts until the user promotes them). **Link to other guides by absolute
   URL** (`https://support.opus-safety.co.uk/pages/<slug>/`) — a relative
   `other-page.md` link from `docs/drafts/` resolves against the wrong directory
   and breaks.
6. **Verify — both checks, every time.** They cover different failures and
   neither is optional:
   ```bash
   python3 .claude/skills/okb-shared/scripts/lint.py docs/drafts/<page>.md
   .venv/bin/zensical build
   ```
   - **`lint.py`** catches what the build cannot see: missing image files,
     half-missing light/dark pairs, duplicate or malformed UUIDs, a legacy
     "suitable for" block, an unregistered page, missing heading spans. Fix every
     ERROR; understand every WARN before dismissing it.
   - **`zensical build`** (~1s) validates internal page links and renders the
     site. Your page must add **no new warnings**. Two drafts and
     `system-updates.md` have pre-existing issues — don't mistake those for yours.

   Don't claim the page works until both are clean. Report what you ran.

## Promoting a draft

**This skill never edits `docs/pages/` on its own.** The user decides when a
draft goes live; do this only when they explicitly ask to promote/publish it. It's four
moves, and missing any one leaves the page half-published:

1. `git mv docs/drafts/<page>.md docs/pages/<page>.md`
2. Delete `search: exclude: true` from the frontmatter (drafts are hidden from
   search; published pages are not).
3. Move its entry from `draft_nav` to `nav` in `zensical.toml`, into the matching
   group.
4. Re-run `lint.py` and `zensical build` — the path changed, so relative image
   links and any nav registration are worth re-checking.

Keep the UUIDs exactly as they are: they track the same blocks across the move.

## Quality checklist before handing back

- [ ] Frontmatter has `icon:`, one audience tag in `tags:`, and (for a draft)
      `search: exclude: true`. No `title:` key; single H1 matching the topic.
- [ ] **No hand-written "Written for" / "suitable for" line** under the H1 — it's
      generated from the audience tag.
- [ ] A hidden `data-uuid` span sits on the H1, every heading, and every
      component block, placed per the extension's rules; all UUIDs freshly unique.
      Inline label pills do **not** get one.
- [ ] Steps use `!!! step` with 4-space indentation, not numbered lists, and are
      never hand-numbered.
- [ ] Every screenshot is an existing `occ-captures` pair with `#only-light` and
      `#only-dark`; steps with no fitting capture are image-less and listed for
      the user (no invented paths).
- [ ] UI labels/buttons are **bold**; named statuses/severities/categories use
      `mb-label` pills, with one colour per value used consistently across the page.
      Access-level pills use the fixed colour + `:lucide-*:` icon.
- [ ] **No `==highlight==` anywhere, and no `^^underline^^` for emphasis** —
      emphasis is bold/italic, a label pill, or a dedicated admonition
      (`^^…^^` appears only in the `^^**Recommended for:**^^` lead-in).
- [ ] Every "get in touch" / "contact us" opens the **support widget** (`window.supportWidget.open()`); the sales
      `/contact` URL appears only for genuine buying enquiries.
- [ ] The page reads like its nearest neighbour in `docs/pages/` — same section
      shape, same step granularity, same tone.
- [ ] If written from supplied source material (pasted or scraped): substance
      (recommendations, thresholds, labels, warnings) carried across exactly;
      prose rewritten into house voice; no hotlinked source images; links to
      unmigrated pages listed for the user.
- [ ] Page is in `docs/drafts/` and registered in `draft_nav`; links to other
      guides use the absolute `support.opus-safety.co.uk` URL, not a relative `.md`.
- [ ] `scripts/lint.py <page>` reports **zero errors**, and every warning is
      understood rather than ignored.
- [ ] `zensical build` adds **no new warnings** beyond the repo's pre-existing ones.
- [ ] Any not-yet-captured screenshots are listed for the user, by step.
