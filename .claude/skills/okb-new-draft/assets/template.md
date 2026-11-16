---
icon: lucide/file-text
tags:
  - Managing OCC
search:
  exclude: true
---

# PAGE TITLE
<span data-uuid="REPLACE-WITH-FRESH-UUID" style="display:none"></span>

Optional one-paragraph intro. State the goal and any assumptions in **bold**,
e.g. **This guide assumes the contractor record already exists.**

!!! tip "Optional callout"

    <span data-uuid="REPLACE-WITH-FRESH-UUID" style="display:none"></span>
    A helpful pointer or cross-link goes here.

## Section heading
<span data-uuid="REPLACE-WITH-FRESH-UUID" style="display:none"></span>

Lead-in sentence introducing the steps.

!!! step

    <span data-uuid="REPLACE-WITH-FRESH-UUID" style="display:none"></span>
    From [My Dashboard](https://cloud.opus-safety.co.uk/dashboard), click **Pick workspace** and select the site.

    <span data-uuid="REPLACE-WITH-FRESH-UUID" style="display:none"></span>
    ![](../assets/media/occ-captures/dashboard/pick-workspace-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/dashboard/pick-workspace-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="REPLACE-WITH-FRESH-UUID" style="display:none"></span>
    Describe the next action, bolding every **clickable label**.

    !!! warning

        <span data-uuid="REPLACE-WITH-FRESH-UUID" style="display:none"></span>
        Call out a gotcha here if the step has one.

    <span data-uuid="REPLACE-WITH-FRESH-UUID" style="display:none"></span>
    ![](../assets/media/occ-captures/PATH/TO/capture-light-mode.png#only-light){ width="400" loading=lazy }
    ![](../assets/media/occ-captures/PATH/TO/capture-dark-mode.png#only-dark){ width="400" loading=lazy }

<!--
  Reminders:
  - Run scripts/uuids.py to generate FRESH UUIDs for every span above; never reuse.
  - The "Written for" audience line under the H1 is generated at build time from
    the audience tag. Never write it into the page.
  - `search: exclude: true` stays while the page lives in docs/drafts/; remove it
    when the page is promoted to docs/pages/.
  - Named statuses/severities/categories go in label pills, not backticks:
    <span class="mb-label mb-label-red">Critical</span>
  - Steps are !!! step admonitions (4-space indented), not numbered lists.
    Don't number them yourself — "Step N" is auto-generated and resets at each ##.
  - Reuse an existing occ-captures pair per step; if none fits, omit the image
    and tell the user. Don't invent screenshot paths.
  - Save this page in docs/drafts/ and register it in draft_nav in zensical.toml.
-->
