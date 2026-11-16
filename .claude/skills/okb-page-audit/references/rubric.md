# Audit rubric — scores out of 10

Score each selected metric 0–10 against these anchors. Interpolate between
them. Every score needs **evidence** (a line number, a quoted sentence, a
`page_facts.py`/`links.py`/`lint.py` number) — a score with no evidence is a
guess. Score against the page's own **pattern** (`page-patterns.md`): a
reference table isn't marked down for having no steps.

Anchors: **10** exemplary — nothing worth changing · **8** good — minor
polish · **6** acceptable — clear problems, still usable · **4** poor — a
reader will struggle or be misled · **2** broken — fails its job · **0** n/a
only if the page is empty.

## Readability

Can the intended audience (tag: Using / Managing / Administering OCC) read it
quickly and act on it?

- Inputs: `page_facts.py` Flesch (60+ plain English; 50–60 fairly hard;
  <50 hard), average words/sentence (aim ≤ 18), longest sentences (> 25 words
  is a split candidate), jargon, US spellings, voice per `voice.md`.
- 10: Flesch 60+, short imperative sentences, UK spelling throughout, consistent terms.
- 6: Flesch ~50, several 30+ word sentences, mixed terminology or a few US spellings.
- 2: dense paragraphs, ambiguous instructions, inconsistent naming.

## Visual style

How it looks rendered, in **both** light and dark mode.

- Inputs: the source, plus headless-Chrome screenshots (see SKILL.md) when
  auditing ≤ 3 pages or when the source suggests a problem.
- Look for: right component for the job (`format.md`), pill colours consistent
  per value and with other pages, capture sizes consistent by role, no walls of
  text, no visual clutter (too many admonitions in a row, decoration on a how-to),
  balanced grids, nothing broken in dark mode, no literal markup leaking
  (`**Save **`, stray `- ` from a missing blank line after a UUID span).
- Don't flag deliberately inverted light/dark pairs (`…-light-mode.png#only-dark`).
- 10: clean, consistent, scannable in both themes. 6: inconsistent sizing or
  pills, one cluttered section. 2: broken rendering or unreadable layout.

## Structure

Is the information in the right order and hierarchy?

- Inputs: `page_facts.py` outline, `page-patterns.md` ordering rules.
- Look for: matches its pattern; prerequisites/access before step 1; warnings
  before the step they apply to; one job per page; heading levels not skipped;
  headings descriptive and sentence case; long procedures split into phases;
  "Relevant guides"/"Learn more" last.
- 10: a reader always knows where they are and what's next. 6: one misplaced
  section or a buried prerequisite. 2: no discernible order.

## Linking

Do links and buttons work and go where they say?

- Inputs: `links.py` (BROKEN / WARN / CHECK / EXPECTED), plus your judgement
  of each link's text vs its target's title (`→ "Target H1"` in the output).
- BROKEN = −2 each (cap at 0). WARN = −1 each. Link text that misdescribes its
  target, or "click here"/"here" text = −1 each. EXPECTED never costs points.
  CHECK: open by hand if you can; otherwise list it, don't penalise.
- Also: places that obviously *should* link to an existing guide but don't
  (−1 each, max −2), support links not using `window.supportWidget`, sales
  `/contact` used for a support question.
- A page with no links at all scores on the missing-links rule only.

## Freshness

Is it likely to still match the app? **Advisory: shown as "worth checking",
never as a claim the page is wrong.**

- Inputs: `page_facts.py` capture dates vs System Updates entries after them;
  page last-edited date; step text vs what each screenshot shows (read the
  images — a step saying **Save changes** beside a screenshot showing **Save**
  is a real mismatch).
- Only System Updates entries about **this page's area** count. Match by topic,
  not by date alone.
- 10: no relevant updates since capture, text matches screenshots. 6: one
  relevant update newer than the captures. 2: a redesign of this area
  (e.g. "Manage mode UI redesign") post-dates most captures, or text and
  screenshots disagree.

## House style

Does it follow the KB's conventions?

- Inputs: `lint.py` (errors/warnings), `format.md` conventions.
- Lint ERROR = −2 each, WARN = −1 each (cap at 0). Plus: hand-numbered steps,
  numbered lists instead of `!!! step`, `==highlight==`, `^^underline^^` for
  emphasis, UI labels not bolded, single images without a pair.

## Accessibility

- Every capture pair has meaningful context (the step text says what it
  shows); icons used to *signify* have accompanying text; link text makes
  sense out of context; headings in order (screen-reader navigation); tables
  have header rows; colour is never the only signal (a pill also has text);
  videos have a text equivalent of what they demonstrate.
- 10: nothing relies on seeing an image or colour. 6: a few image-only
  instructions. 2: the procedure can't be followed without the screenshots.

## Completeness

Does it cover the whole job?

- Steps missing a screenshot (`page_facts.py` steps_without_image) — list them;
  −1 per 3 missing, max −3. Gaps in a procedure (a jump from screen A to C);
  missing prerequisites, outcomes or "what happens next"; fields on a form
  page with no `!!! outline`; obvious edge cases unaddressed (no permission,
  item already archived).
- 10: a newcomer completes the task with no outside help.

## Overall

Mean of the selected metrics, one decimal. Freshness counts in the mean but
is labelled advisory in the report.
