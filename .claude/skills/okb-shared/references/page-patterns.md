# Opus KB page patterns

Shared by `okb-new-draft`, `okb-revise-draft` and `okb-page-audit`. Pick the
pattern by the page's **job**, then read its best live example before writing
or judging. A page that mixes jobs (a concept explainer with a procedure
buried in it) usually wants splitting, or the procedure moving into a
collapsible `??? outline`.

Never model on `system-updates.md`, `system-status.md` or `index.md` — they're
special-purpose (generated content, status-banner attributes, hero frontmatter).

## 1. Straight procedure (how-to)

**Job:** get one task done. **Examples:** `adding-a-contractor.md`,
`adding-an-asset.md`, `registering-an-employee.md`.

```
# <Verb>ing a <thing>
[optional one-line intro: what this does / who can do it]
[optional !!! info for prerequisites or required access level]
!!! step × N      (one action each, capture pair where one exists)
[optional !!! tip / !!! warning for consequences]
[optional ## Relevant guides]
```

- No `##` headings needed for a single short run of steps.
- With 10+ steps or distinct phases, split into `##` phases
  (`## Navigating to the asset`, `## Archiving the asset`) — see
  `archiving-an-asset.md`.
- Navigation steps (Pick workspace → Manage mode → sidebar item) are the same
  on most pages: reuse the exact wording and captures from a neighbour.

## 2. Procedure with a form

**Job:** a how-to whose core is filling in fields.
**Example:** `adding-a-new-employee.md`.

- One `!!! outline "<Field name>"` per field, in the order the form shows them.
- Mark optional fields `<span class="meta">(optional)</span>`.
- Say what the field *does* and any constraints, not "enter the name in the
  Name field".

## 3. Branching procedure

**Job:** the same task done differently by different people or paths.
**Examples:** `creating-and-linking-your-opus-account.md` (new vs existing
user), `adding-a-new-document.md`.

- `=== "Path A"` / `=== "Path B"` content tabs, each with its own steps.
- Or `## User Steps` / `## Manager Steps` when the paths are sequential
  hand-offs rather than alternatives (`registering-an-employee.md`,
  `granting-an-employee-temporary-access.md`).
- Shared lead-in steps go *above* the tabs, not duplicated inside each.

## 4. Reference / value table

**Job:** look up what a value means.
**Examples:** `task-severities.md`, `kinds-of-reportable-tasks.md`.

```
# <Things>
One-paragraph intro: what they are, how they're ordered
<div class="nowrap-first" markdown> | Icon | Name (pill) | Description | </div>
[optional admonition for exceptions]
```

- Order rows meaningfully (severity high→low, lifecycle order) and say so.
- Each value gets its pill colour once and keeps it across every page.

## 5. Concept explainer

**Job:** understand how part of the system works.
**Examples:** `task-inboxing.md`, `contractor-and-project-statuses.md`,
`types-of-task.md`.

- `##` per concept, each opening with one or two sentences of definition,
  then a capture showing it.
- Procedures related to a concept go in `??? outline "How to …"` collapsibles
  under it, so the page stays readable top to bottom.
- Diagrams (mermaid) usually sit in a `=== "Diagram"` tab beside a
  `=== "Table"` tab of the same content.

## 6. Overview / landing

**Job:** orient someone in an area or add-on and send them onward.
**Examples:** `contractors-overview.md`, `rams-overview.md`,
`employees-overview.md`.

- `## What is <add-on>?` → `## Who is it for?` → feature grid/cards →
  `## Learn more` with an `mb-nav-links` block → sales CTA button (add-ons only).
- A bare `## -` followed by the `data-mb-hide-section-title` style marker is
  a deliberate *hidden* section heading (see `format.md`) — not an error.
- This is where grids, video, buttons and `hide:` frontmatter belong — not on
  how-tos.

## 7. FAQ

**Job:** answer standalone questions. **Example:** `faqs.md`.

- `##` per topic, `??? outline "<The question?>"` per question, answer
  inside. Each answer stands alone and links to the full guide rather than
  repeating it.

## Ordering rules that apply to every pattern

1. What it is / what you'll achieve (one or two lines, or none for an obvious
   how-to).
2. Prerequisites and required access level — **before** step 1, never
   discovered mid-procedure.
3. The main content.
4. Consequences, irreversibility, what happens next.
5. `## Relevant guides` / `## Learn more` last.

Warnings go **before** the step they apply to, not after it.
