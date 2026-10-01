---
search:
  exclude: true
---

# System update drafts

??? improvement "Improvement: Overhauled incident form<span class="meta">1st October 2026</span>"

    <span data-uuid="2a5e1583-d1a5-4018-b85d-6881cc6a14c3" style="display:none"></span>
    We have overhauled the incident form to include some of the new features released as part of task updates. See a summary of the main changes below.

    ??? outline "<span class="mb-label mb-label-mauve">:lucide-eye: Better required field visibility</span>"

        <span data-uuid="654cbefb-bef3-4456-8b03-ea895963575a" style="display:none"></span>

        Fields marked as required now have a red <span class="mb-label mb-label-red">:lucide-asterisk:</span> icon, making it easier to see what needs filling in.

        <span data-uuid="e64b0690-0cd2-4d51-997f-7664a6564cc1" style="display:none"></span>
        ![](../assets/media/system-update-captures/was-somebody-injured-dbcaa069-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
        ![](../assets/media/system-update-captures/was-somebody-injured-dbcaa069-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

    ??? outline "<span class="mb-label mb-label-mauve">:lucide-triangle-alert: New missing information flow</span>"

        <span data-uuid="7b4ceb8c-b4fa-4942-808d-ad1eb6e34bd1" style="display:none"></span>

        When attempting to resolve a task with missing required information, a new warning popup will appear. The warning lists links to all required fields that are incomplete. Clicking on the link will focus and highlight the relevant field(s) in red.


        [img of popup warning]

        <span data-uuid="cd42644f-6f4b-4a6a-a5ff-18ca99dc2596" style="display:none"></span>
        ![](../assets/media/system-update-captures/who-is-investigating-5d30da5a-light-mode.png#only-light){ style="border-radius: 8px" loading=lazy }
        ![](../assets/media/system-update-captures/who-is-investigating-5d30da5a-dark-mode.png#only-dark){ style="border-radius: 8px" loading=lazy }

??? feature-release "Feature release: New task features & improvements<span class="meta">16th September 2026</span>"

    <span data-uuid="afccf694-a60b-4386-a870-331ab1166f37" style="display:none"></span>
    Following on from the research and work carried out on redesigning the Manage side of Opus Compliance Cloud, we have now released a refreshed Task page.

    Here are the highlights:

    ??? outline "<span class="mb-label mb-label-mauve">:lucide-layout: Redesigned layout and header</span>"

        <span data-uuid="fa3ee4dc-3640-4b10-a2c0-aefbb49d29a5" style="display:none"></span>

        - The page header has been redesigned and now stays fixed at the top of the screen, so it remains visible as you scroll.
        - Task actions, such as moving, printing and creating subtasks, can now be accessed via the new :lucide-ellipsis: **More options** button in the top right.
        - The breadcrumb has also been improved to provide a more consistent experience with the design used in Manage mode.

        <span data-uuid="163c2fa9-d386-450e-ac71-53573876bac1" style="display:none"></span>
        ![](../assets/media/system-update-captures/open-a-breadcrumbs-z-420d05cd-light-mode.png#only-light){ style="border-radius: 8px" loading=lazy }
        ![](../assets/media/system-update-captures/open-a-breadcrumbs-z-420d05cd-dark-mode.png#only-dark){ style="border-radius: 8px" loading=lazy }

    ??? outline "<span class="mb-label mb-label-mauve">:lucide-user-check: Improved assigning</span>"

        <span data-uuid="d1c0c48a-7f4e-42f9-a5e2-1425b91ef89a" style="display:none"></span>
        Assigning tasks is now easier than ever. Potential assignees are now grouped by access level, and we’ve also added a search bar to make finding the right person quicker and easier.

        <span data-uuid="d13bc63c-ca69-4299-84c3-da51ed695615" style="display:none"></span>
        ![](../assets/media/system-update-captures/change-assigned-user-z-250f57e5-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
        ![](../assets/media/system-update-captures/change-assigned-user-z-250f57e5-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

    ??? outline "<span class="mb-label mb-label-mauve">:lucide-arrow-up-circle: Improved selector style inputs</span>"

        <span data-uuid="47981c41-2559-4636-b236-e9f4b07bd22a" style="display:none"></span>
        We've improved the inputs that require you to select a site or an employee.

        <span data-uuid="7dcbdb57-0a6a-4c12-aa06-39316674f3fe" style="display:none"></span>

        <div class="nowrap-first" markdown>

        | Before | After |
        | :--- | :--- |
        | <span data-uuid="458baba3-8b25-4f13-a904-3660ccdabdb0" style="display:none"></span>![](../assets/media/system-update-captures/who-is-investigating-9679ad5a-light-mode.png#only-light) ![](../assets/media/system-update-captures/who-is-investigating-9679ad5a-dark-mode.png#only-dark) | <span data-uuid="a7f07dcd-e8ae-4fe8-89de-a7d6ee32e8e9" style="display:none"></span>![](../assets/media/system-update-captures/pick-employee-z-1f28efe9-light-mode.png#only-light){ width="350" loading=lazy } ![](../assets/media/system-update-captures/pick-employee-z-1f28efe9-dark-mode.png#only-dark){ width="350" loading=lazy } |
        | <span data-uuid="792f17b3-47c6-4c9b-97d6-ed2d26efafea" style="display:none"></span>![](../assets/media/system-update-captures/against-which-site-should-this-be-logged-ce84e794-light-mode.png#only-light){ width="210" loading=lazy } ![](../assets/media/system-update-captures/against-which-site-should-this-be-logged-ce84e794-dark-mode.png#only-dark){ width="210" loading=lazy } | <span data-uuid="e7298e7d-1981-4625-a5de-376d5822038c" style="display:none"></span>![](../assets/media/system-update-captures/pick-site-3f288417-light-mode.png#only-light){ width="350" loading=lazy } ![](../assets/media/system-update-captures/pick-site-3f288417-dark-mode.png#only-dark){ width="350" loading=lazy } |

        </div>

