---
icon: lucide/lock
tags:
  - Managing OCC
---

# Task sensitivity
<span data-uuid="f770aa2b-e00a-4e10-a24c-0a331926180d" style="display:none"></span>

<span data-uuid="1a348836-79d0-43b6-816f-f730628b8cb0" style="display:none"></span>
Certain tasks may be flagged as sensitive because they contain sensitive information. As a result, these tasks are required to have additional access controls.

!!! note

    <span data-uuid="83e20d5a-96c0-4271-a16d-6cc1e32f8205" style="display:none"></span>

    <span data-uuid="61dcb4e5-0475-437e-8631-ba9643989d0d" style="display:none"></span>
    This guide explains how task sensitivity behaves by default. Your organisation may have modified this feature to suit its specific business needs.

## What do sensitive tasks look like?
<span data-uuid="e62be4a8-1798-4e07-aa50-46512a90f123" style="display:none"></span>

<span data-uuid="f0b747e5-7d71-4be4-8083-8bdcfd4577dd" style="display:none"></span>
When viewing from the site inbox or task reports, sensitive tasks will appear redacted.

<span data-uuid="83fb63c1-95a6-41d5-aaa9-6ed9312a9b41" style="display:none"></span>
![](../assets/media/occ-captures/sites/uuid/sensitive-task-light-mode.png#only-light){ style="border-radius: 8px" loading=lazy }
![](../assets/media/occ-captures/sites/uuid/sensitive-task-dark-mode.png#only-dark){ style="border-radius: 8px" loading=lazy }

## Kinds of sensitive tasks
<span data-uuid="6cc9d5be-dc46-40d2-b1a4-a3efd5d2aa92" style="display:none"></span>

<span data-uuid="14f81571-9cfc-423c-88bd-6b1b00b99c56" style="display:none"></span>
By default, there are three different types of sensitive task based on the data they contain. Certain types of sensitive tasks require additional authorisation before you can access them.

<span data-uuid="6c545462-785b-43d9-b296-5bd5cf68d156" style="display:none"></span>

<div class="nowrap-first" markdown>

| Type of task | Sensitive label | Required authorisation |
| :--- | :--- | :--- |
| :lucide-monitor-dot: DSE assessment corrective actions | <span class="mb-label mb-label-slate">:lucide-lock: DSE related data</span> | <span class="mb-label mb-label-fuchsia">Health related data authorisation</span> |
| :lucide-stethoscope: Health surveillance corrective actions | <span class="mb-label mb-label-slate">:lucide-lock: Health related data</span> | <span class="mb-label mb-label-fuchsia">Health related data authorisation</span> |
| :lucide-cross: Resolved injury related incidents | <span class="mb-label mb-label-slate">:lucide-lock: Injury related data</span> | No additional authorisation required |

</div>

!!! info

    <span data-uuid="3c68a342-42ed-469e-9501-430df7ca4e00" style="display:none"></span>

    <span data-uuid="57f27b0e-a08c-43fe-8512-8d68b26c4598" style="display:none"></span>
    Sensitive tasks are typically confidential, meaning that only managers can see that they exist in the first place.

## Authorisations
<span data-uuid="d1e6d765-67c8-43f1-8aa0-e5e0c98c6358" style="display:none"></span>

<span data-uuid="7c3cc7c9-8502-4beb-8f7d-473ed643ab1c" style="display:none"></span>
Authorisations can be assigned to employees to grant access to specific types of sensitive data. You can view the authorisations assigned to an employee on their record.

<span data-uuid="ec574a81-0569-4d0a-b55f-c71fe6f45801" style="display:none"></span>
![](../assets/media/occ-captures/admin/sites/uuid/dashboard/authorisations-and-tags-a-health-related-data-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
![](../assets/media/occ-captures/admin/sites/uuid/dashboard/authorisations-and-tags-a-health-related-data-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

??? outline "<span class="mb-label mb-label-slate">How to grant authorisations to employees</span>"

    <span data-uuid="d54e7e08-9113-43c9-8f24-8d22c35af2d8" style="display:none"></span>

    <span data-uuid="dac6aa68-f750-4e66-81bb-19d7bc2d7dd9" style="display:none"></span>
    Sensitive tasks containing DSE or health-related data typically require a <span class="mb-label mb-label-fuchsia">Health related data authorisation</span> to be granted on the employee’s record. The steps below explain how to grant this authorisation to an employee.

    :lucide-info: *The Health-Related Data authorisation is intended for relevant managers or administrators only. It should not be granted to employees with standard user access.*

    !!! warning

        <span data-uuid="9ab434fa-82cb-4ddd-b375-b3525019627b" style="display:none"></span>

        <span data-uuid="9561ef4f-ab7e-41a6-8cce-6eb1a2d12058" style="display:none"></span>
        You can only grant this authorisation to other employees if you have the authorisation yourself. As a result, we recommend being conservative with who should be granted this access.

    !!! step

        <span data-uuid="648ef5fe-187e-4378-ba07-2259f219d971" style="display:none"></span>

        <span data-uuid="b5997738-c752-4ee0-8cd2-85184e198cc0" style="display:none"></span>
        From [My Dashboard](https://cloud.opus-safety.co.uk/dashboard), click on **Pick workspace** and select the site where the employee is located.

        <span data-uuid="dc335c6b-97c5-4ae4-bc98-1693b117463c" style="display:none"></span>
        ![](../assets/media/occ-captures/dashboard/pick-workspace-light-mode.png#only-light){ style="height: 50px" loading=lazy }
        ![](../assets/media/occ-captures/dashboard/pick-workspace-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

    !!! step

        <span data-uuid="486fa9e7-09cf-4f67-98fd-157998213fb5" style="display:none"></span>

        <span data-uuid="72c06160-7bf0-46dc-85ba-1c736c8adbcf" style="display:none"></span>
        From the site inbox, click the **Switch to Manage Mode** button.

        <span data-uuid="7a1cb536-7b12-47aa-b09d-aa2d93ae3557" style="display:none"></span>
        ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-light-mode.png#only-light){ style="height: 50px" loading=lazy }
        ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

    !!! step

        <span data-uuid="ce93cf61-08c8-42a8-b420-5c044cfb4ab2" style="display:none"></span>

        <span data-uuid="203207f6-f4c7-4ae3-8a58-ca5e6ead374b" style="display:none"></span>
        Click **Employee records** on the manage sidebar.

        <span data-uuid="24ed3407-cfcb-4827-a4eb-1845543aef09" style="display:none"></span>
        ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/employee-records-light-mode.png#only-light){ style="height: 50px" loading=lazy }
        ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/employee-records-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

    !!! step

        <span data-uuid="bc3c3f93-a1cf-4ef8-a10e-c76d0c0f1958" style="display:none"></span>

        <span data-uuid="5e32e445-155a-48b3-8f6d-3a0f540506f9" style="display:none"></span>
        Find the employee from the list and click on their name

        <span data-uuid="e99cc41d-045c-480b-b54c-4118fa864fb0" style="display:none"></span>
        ![](../assets/media/occ-captures/admin/sites/uuid/employees/list-light-mode.png#only-light){ style="border-radius: 8px" loading=lazy }
        ![](../assets/media/occ-captures/admin/sites/uuid/employees/list-dark-mode.png#only-dark){ style="border-radius: 8px" loading=lazy }

    !!! step

        <span data-uuid="c58b7364-33ac-46f4-bf3c-5102ddcf322a" style="display:none"></span>

        <span data-uuid="ca04edd1-696b-40da-8df3-2de46e9c60ef" style="display:none"></span>
        On the employee's record, select **Change access**

        <span data-uuid="441b6ea9-e2c6-4fea-ac0b-54ed853eb56e" style="display:none"></span>
        ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/change-access-light-mode.png#only-light){ style="height: 50px" loading=lazy }
        ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/change-access-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

    !!! step

        <span data-uuid="c75a44a3-63c1-4a2f-9350-72ce51fccec0" style="display:none"></span>

        <span data-uuid="99d455ad-f15a-4c92-894a-b9cd41c4d0f2" style="display:none"></span>
        Grant the relevant authorisations or tags if the employee needs them (you can only configure this if you possess the tag yourself).

        `authorised/health` — Assigning this tag grants the employee authorisation to access sensitive health data (e.g. Health Surveillance corrective actions) for the employees they manage.

        <span data-uuid="508a3643-5c16-4df7-8d93-468d88f99735" style="display:none"></span>
        ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/authorisations-tags-light-mode.png#only-light)
        ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/authorisations-tags-dark-mode.png#only-dark)

        !!! note

            <span data-uuid="abc62e0d-e231-4281-8b81-61f1bbf2ea89" style="display:none"></span>

            <span data-uuid="aa91caa1-436e-44b8-8c9c-aa037563541a" style="display:none"></span>
            By default, all sites will have the `authorised/health` tag available, but depending on your site configuration you may have more.

    !!! step

        <span data-uuid="89598337-7f40-49d4-b3f0-e2a5d9400f4f" style="display:none"></span>

        <span data-uuid="3b6fbb4b-ba9b-4f3d-8c56-3ed32da28aa5" style="display:none"></span>
        Once you have selected the authorisation(s), click **Apply changes**.

        <span data-uuid="164513f2-e2c7-4f8b-9ac5-5b10240082e6" style="display:none"></span>
        ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/apply-changes-light-mode.png#only-light){ style="height: 50px" loading=lazy }
        ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/apply-changes-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

## How to access sensitive tasks
<span data-uuid="13778d21-0334-4fc1-83e6-a300db7a3832" style="display:none"></span>

<span data-uuid="6a46d923-8559-4f12-8572-efeeea6da9df" style="display:none"></span>
Assuming you have the appropriate access and authorisation to view the task content, selecting the task or attempting to export task data will prompt you to complete an exception form.

The form requires you to provide the following information:

??? outline "<span class="mb-label mb-label-slate">Access reason</span>"

    <span data-uuid="18c92c47-da25-48e1-8bf9-3a88de93eaa8" style="display:none"></span>

    <span data-uuid="a7746855-b198-4337-81d6-2ba2f73a20c0" style="display:none"></span>
    You will be asked to provide a reason for requesting access to this data. This reason will be recorded in the system logs and visible to others who access the task, supporting transparency and accountability.

    <span data-uuid="8e883a75-ebc2-43e5-beba-00c21941748f" style="display:none"></span>
    ![](../assets/media/occ-captures/tasks/uuid/sensitive/access-reason-light-mode.png#only-light){ style="border-radius: 8px" width="500" loading=lazy }
    ![](../assets/media/occ-captures/tasks/uuid/sensitive/access-reason-dark-mode.png#only-dark){ style="border-radius: 8px" width="500" loading=lazy }

    !!! failure "Important"

        <span data-uuid="5a3d4815-ab75-4a74-a98d-c032aabb8664" style="display:none"></span>

        <span data-uuid="d291abeb-cb33-4c8b-83ec-0be02a4efc80" style="display:none"></span>
        Please provide a clear and legitimate reasons for accessing sensitive data. Unnecessary or unjustified access to sensitive data may have consequences under your organisation’s policies.

??? outline "<span class="mb-label mb-label-slate">Access expiration</span>"

    <span data-uuid="a95d8033-3485-4843-a958-1e30e3ecae52" style="display:none"></span>

    <span data-uuid="af789e11-66ed-40f1-8ef3-ce33c76640d3" style="display:none"></span>
    This allows you to specify how long you would like to retain access to the data before you are required to complete another exception form.

    <span data-uuid="16071a6a-8c76-4177-b59a-c028a2f20f03" style="display:none"></span>
    ![](../assets/media/occ-captures/tasks/uuid/sensitive/access-expiration-light-mode.png#only-light){ style="border-radius: 8px" width="500" loading=lazy }
    ![](../assets/media/occ-captures/tasks/uuid/sensitive/access-expiration-dark-mode.png#only-dark){ style="border-radius: 8px" width="500" loading=lazy }

??? outline "<span class="mb-label mb-label-slate">Access scope</span>"

    <span data-uuid="580fdb12-ede3-46e5-8958-c8c4fbb91a33" style="display:none"></span>

    <span data-uuid="d556f66c-1d89-4bc9-85f1-f3937d2eae36" style="display:none"></span>
    Define the access scope of this exception.

    <span data-uuid="082c5fd0-529c-422f-8d2f-b2afd75c0dc5" style="display:none"></span>
    ![](../assets/media/occ-captures/tasks/uuid/sensitive/access-scope-light-mode.png#only-light){ style="border-radius: 8px" width="500" loading=lazy }
    ![](../assets/media/occ-captures/tasks/uuid/sensitive/access-scope-dark-mode.png#only-dark){ style="border-radius: 8px" width="500" loading=lazy }

    !!! tip

        <span data-uuid="84f678b9-295d-4903-8ae3-73c6e34a623f" style="display:none"></span>

        <span data-uuid="b37e0d34-c6fb-4688-8044-286625c183da" style="display:none"></span>
        The scope defines the area covered by a single exception request. For example, when accessing sensitive employee tasks, you can broaden the scope to include all employees or an entire site. This eliminates the need to submit a separate exception request for each employee.
