---
icon: lucide/user-x
tags:
  - Managing OCC
---

# Unlinking an employee
<span data-uuid="8b9e74b2-62ad-44eb-b449-dd89663ef622" style="display:none"></span>

Sometimes you may need to unlink an employee record from its linked account.

Follow the steps below:

<span data-uuid="c04532b8-017b-41b9-9971-d872097aaf3b" style="display:none"></span>
```mermaid
---
config:
  layout: elk
---
flowchart RL
    n3["Site(s)"] --- n2["Employee record"]
    n4["E-learning"] --- n2
    n5["Checklists"] --- n2
    n2 -. ✄ Unlink .- n1["Opus account"]

    n3@{ shape: rect}
    n2@{ shape: rect}
    n4@{ shape: rect}
    n5@{ shape: rect}
    n1@{ shape: rect}
    classDef question stroke:#6b7280,fill:#f3f4f6,stroke-width:2px
    classDef action stroke:#16a34a,fill:#dcfce7,stroke-width:2px
```

## Steps
<span data-uuid="57c6b82a-7543-4cd9-b6ba-a07402f9905b" style="display:none"></span>


!!! step

    <span data-uuid="4c1dfe5b-d7dc-4d79-80b6-05e81f7f30c0" style="display:none"></span>

    From [My Dashboard](https://cloud.opus-safety.co.uk/dashboard), click on **Pick workspace** and select the site where the employee is located.

    <span data-uuid="3e18874b-ba04-4c00-91a2-6c80ec4b1f9b" style="display:none"></span>
    ![](../assets/media/occ-captures/dashboard/pick-workspace-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/dashboard/pick-workspace-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="9ea2ee88-286f-42d7-946f-332b559488b5" style="display:none"></span>

    From the site inbox, click the **Switch to Manage Mode** button.

    <span data-uuid="e5fe539f-1daf-49d4-a44b-07b807d18f9c" style="display:none"></span>
    ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="a6cd0f45-001b-4f23-82b1-e1f9fabf0c0c" style="display:none"></span>

    Click **Employee records** on the manage sidebar.

    <span data-uuid="088bd10a-6e7d-4576-aff5-6a5fa3a9263b" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/employee-records-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/employee-records-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="c374f74a-3c5f-42e1-a42e-bb2cdf9a4cd8" style="display:none"></span>

    Find the employee from the list and click on their name

    <span data-uuid="5eb2b61b-98f5-46da-90fa-03b631488322" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/list-light-mode.png#only-light){ style="border-radius: 8px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/list-dark-mode.png#only-dark){ style="border-radius: 8px" loading=lazy }

    !!! tip "Shortcut!<span class="meta">(optional)</span>"

        <span data-uuid="1b489189-578d-4ba5-963b-7342a5993994" style="display:none"></span>

        If you see the red Remove button next to the employee’s name in the list, you can click this instead to schedule the employee to be archived at the end of the day. You can then skip the remaining steps.

        If you need to set a specific end date for the employee (for example, if their leaving date is in the future or was in the past), continue with the steps below.

!!! step

    <span data-uuid="b4c446b1-a541-414f-bb2b-8d732f35b99a" style="display:none"></span>

    Click **Unlink user account** on the record

    <span data-uuid="ab0152eb-ead2-4b18-a880-f2eb10323b2a" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/unlink-user-account-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/unlink-user-account-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="33e81e09-e4c2-4164-a591-53479432c19b" style="display:none"></span>

    On the confirmation page, read the information and warnings carefully to ensure you understand the implications of unlinking the record.

    If you’re happy to proceed, select **Confirm unlinking**

    <span data-uuid="dab89c15-89e2-43af-9f41-ca769a27ea43" style="display:none"></span>
    ![](../assets/media/occ-captures/employees/uuid/unlink/confirm-unlinking-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/employees/uuid/unlink/confirm-unlinking-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! success "Complete!"

    <span data-uuid="c716873d-d17b-4fd0-83f3-3d0a47395f56" style="display:none"></span>

    The account has now been successfully unlinked from the record. If needed, you can now re-register/link this employee following our **Registering an employee** guide below.

    <span data-uuid="74924b1a-e73d-41af-9a67-2f1a0add1993" style="display:none"></span>
    [Registering an employee :lucide-arrow-right:](registering-an-employee.md){ .md-button .custom-button-slate .custom-button--slim }