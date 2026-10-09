---
icon: lucide/user-x
search:
  exclude: true
tags:
  - Managing OCC
---

# Unlinking an employee
<span data-uuid="8b9e74b2-62ad-44eb-b449-dd89663ef622" style="display:none"></span>

Sometimes you may need to unlink an employee record from its linked account.

Follow the steps below:

<span data-uuid="dac11687-215f-4439-a9b4-42371bba6153" style="display:none"></span>
```mermaid
---
config:
  layout: elk
---
flowchart RL
    n3["Their site(s)"] --- n2["Employee record"]
    n4["Their e-learning"] --- n2
    n5["Their checklists"] --- n2
    n2 -. ✂️ Unlink .-> n1["Opus account"]

    n3@{ shape: rect}
    n2@{ shape: rect}
    n4@{ shape: rect}
    n5@{ shape: rect}
    n1@{ shape: rect}
    classDef question stroke:#6b7280,fill:#f3f4f6,stroke-width:2px
    classDef action stroke:#16a34a,fill:#dcfce7,stroke-width:2px
```

!!! step

    <span data-uuid="96dc6c76-8ba3-493d-8164-b9e2e4003a22" style="display:none"></span>

    From [My Dashboard](https://cloud.opus-safety.co.uk/dashboard), click on **Pick workspace** and select the site where the employee is located.

    <span data-uuid="af6dec9a-4a2e-4d6a-a648-b7f5ccd91aad" style="display:none"></span>
    ![](../assets/media/occ-captures/dashboard/pick-workspace-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/dashboard/pick-workspace-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="5d922a37-2415-4221-9604-5108138c491a" style="display:none"></span>

    From the site inbox, click the **Switch to Manage Mode** button.

    <span data-uuid="9924e31d-26ea-48a2-b2e0-227427438d56" style="display:none"></span>
    ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="bb502839-a7e2-4a1f-8ae4-3c9e901f61e4" style="display:none"></span>

    Click **Employee records** on the manage sidebar.

    <span data-uuid="6681a3e0-1115-4737-a059-ffd9144e8313" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/employee-records-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/employee-records-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="d454b58d-7f01-4252-a90a-383d3eda7ecb" style="display:none"></span>

    Find the employee from the list and click on their name

    <span data-uuid="ee14fad1-f4d5-4aef-85b8-3d8e84c420f4" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/list-light-mode.png#only-light){ style="border-radius: 8px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/list-dark-mode.png#only-dark){ style="border-radius: 8px" loading=lazy }

    !!! tip "Shortcut!<span class="meta">(optional)</span>"

        <span data-uuid="048798b1-730e-449f-9b74-f35d83288789" style="display:none"></span>

        If you see the red Remove button next to the employee’s name in the list, you can click this instead to schedule the employee to be archived at the end of the day. You can then skip the remaining steps.

        If you need to set a specific end date for the employee (for example, if their leaving date is in the future or was in the past), continue with the steps below.

!!! step

    <span data-uuid="62f06645-9360-456a-8fa2-1d359337d3a3" style="display:none"></span>

    Click **Unlink user account** on the record

    <span data-uuid="f97c98ba-81b7-4bca-804f-902b0e866c5d" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/edit-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/edit-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }