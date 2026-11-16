# Opus KB voice, spelling and terminology

Shared by `okb-new-draft`, `okb-revise-draft` and `okb-page-audit`. The live
pages in `docs/pages/` are the authority; this file records what they do so it
doesn't have to be re-derived. When a live page and this file disagree, check
which is right with the user and fix the loser.

## Spelling: UK English, always

- `-ise` / `-isation`: organisation, authorise, authorisation, prioritise,
  customise, recognise, summarise.
- `-our`: colour, behaviour, favour. `-re`: centre. Also: licence (noun) /
  license (verb), cancelled, labelled, travelling, enrolment, programme
  (but *program* for software), judgement, catalogue, grey.
- Dates: `12th November 2026` — ordinal day, full month, no comma (as on
  `system-updates.md`).
- **Exceptions — keep as-is:** code, CSS/HTML attributes (`color`,
  `align-self`), CSS class names, URLs, and **UI labels that the app itself
  spells the US way** (bold UI text is quoted verbatim, not corrected).

## Tone

- Second person, imperative, present tense: "Click **Save**", not "The user
  should click Save" or "You will need to click Save".
- One action per `!!! step`. If a step has "and then", it's probably two steps
  (exception: an action plus where it happens — "click **Pick workspace** and
  select the site").
- Short sentences. Lead with the outcome or the condition: "To archive an
  employee, …" / "If the employee has open tasks, …".
- Friendly but not chatty. No "Simply", "Just", "Easy!", exclamation marks, or
  "Please note that". A caveat that matters becomes an admonition.
- Explain *why* only when it changes what the reader does.

## Formatting words

| Thing | Treatment | Example |
| :--- | :--- | :--- |
| Clickable UI label (button, tab, menu item, link text in the app) | **bold**, verbatim | Click **Switch to Manage Mode** |
| Named status / severity / access level / category | `mb-label` pill | <span class="mb-label mb-label-red">Critical</span> |
| Named app area / screen | backticks, as live pages do | the `Site Inbox` |
| Literal value the user types | backticks | enter `0` |
| A navigable destination | a real link | From [My Dashboard](https://cloud.opus-safety.co.uk/dashboard) |
| Optional form field | `<span class="meta">(optional)</span>` | |

Watch for broken bold: `**+New contractor **` (space inside the closing `**`)
renders as literal asterisks — always `**+New contractor**`.

## Verbs

- **click** — buttons, links, icons, tabs.
- **select** — choosing an option from a dropdown, list, radio or checkbox.
- **enter** — typing into a field. (Not "input", "key in", "fill in".)
- **choose** — a decision the reader makes, not a control ("choose who should …").
- Avoid "click on" in new writing — "click" is enough (both appear on live
  pages; prefer "click" when revising, but don't churn a page just for this).
- Avoid "tap", "hit", "press" (except keyboard keys).

## Product and domain terms

| Use | Not | Notes |
| :--- | :--- | :--- |
| **Opus Compliance Cloud** | OCC, the system, the platform | Full name on first mention; "Opus Compliance Cloud" thereafter too in prose. `OCC` only in tags (`Using OCC`) |
| Opus Contractor Management, Opus RAMS | | Add-on names, title case |
| sign in / sign-in | log in, login | See *Signing in* below |
| site | location, branch | The physical place; pages talk about "the site inbox" |
| workspace | | What **Pick workspace** chooses between |
| employee | staff member, worker | A record in a site |
| user | | A person with an Opus account / access level. An employee *may* be linked to a user |
| User / Manager / Administrator | admin, superuser | Access levels — always the fixed pills (see `format.md`) |
| Manage mode / View mode | admin mode, edit mode | Bold when it's the button label |
| task, inbox | ticket, to-do | `todos` only appears in URLs |
| add-on | module, plugin | |
| organisation | company, org | |

**Signing in:** "sign in" (verb: "sign in to Opus Compliance Cloud"),
"sign-in" (noun/adjective: "the sign-in page", "failed sign-in attempts"),
"sign out". Never "log in", "login", "log-in" or "log out" in prose — the app
itself uses sign-in (`/users/sign_in`). Exception: a bold UI label or status
name quoted verbatim (e.g. a `Login` status title on `system-status.md`).

## Headings

- Sentence case: `## Finding the employee`, not `## Finding The Employee`.
  Exception: a named app area or feature keeps its capitals
  (`## Site Inbox`, `## Snapshot`).
- Task-shaped for procedures (`## Navigating to the asset`), question-shaped
  for concept/FAQ pages (`## What are employees?`).
- No trailing punctuation except `?`. A bare `## -` is only valid as a
  hidden section heading (followed by the `data-mb-hide-section-title`
  marker on overview pages); anywhere else it's an error.
- Don't skip levels (`##` → `####`).
