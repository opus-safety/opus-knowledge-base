---
icon: lucide/user-key
search:
  exclude: true
tags:
  - Managing OCC
---

# Changing an employee's access
<span data-uuid="94f9c5e2-8bbe-4f0c-9939-7890617b8381" style="display:none"></span>

## Finding the employee
<span data-uuid="6f049889-d171-43c7-be39-ae802b939063" style="display:none"></span>


!!! step

    <span data-uuid="badbf1fc-a44a-45cd-8ff8-d0b33a10d250" style="display:none"></span>

    From [My Dashboard](https://cloud.opus-safety.co.uk/dashboard), click on **Pick workspace** and select the site where the employee is located.

    <span data-uuid="816cf8f2-7091-42e8-92da-696d0bb85575" style="display:none"></span>
    ![](../assets/media/occ-captures/dashboard/pick-workspace-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/dashboard/pick-workspace-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="444e2d1f-bca3-446b-bdbd-d74210cf77c1" style="display:none"></span>

    From the site inbox page, click the **Switch to Manage Mode** button.

    <span data-uuid="c4a9df37-6ede-4f8f-abf5-4c16ef270cc6" style="display:none"></span>
    ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="a42e209f-407c-4c72-849c-6655772d46e8" style="display:none"></span>

    Click **Employee records** on the manage sidebar.

    <span data-uuid="f9d28be3-4cfb-4ec0-b231-f4b51e6b84b2" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/employee-records-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/employee-records-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="6b8b00a0-fec4-4b3a-84a3-5f41b339fb95" style="display:none"></span>

    Find the employee from the list and click on their name

    <span data-uuid="87b67220-0b9c-4fc1-96b7-92b3f756f8ed" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/list-light-mode.png#only-light){ style="border-radius: 8px" width="500" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/list-dark-mode.png#only-dark){ style="border-radius: 8px" width="500" loading=lazy }

## Changing the employee's access
<span data-uuid="f6dd80e6-2c6e-49da-8bd2-c66b11ae392b" style="display:none"></span>


!!! step

    <span data-uuid="1d281c59-a65e-4592-a21f-8da85846e486" style="display:none"></span>
    On the employee's record, select **Change access**

    <span data-uuid="fc067b45-4675-4959-b093-18c24a965684" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/change-access-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/change-access-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step "<span class="meta">(optional)</span>"

    <span data-uuid="9efe8c39-c9e8-4f99-940b-543d3d1457fe" style="display:none"></span>
    Under the **Authorisation & tags** section, modify the authorisations this employee holds *(you can only configure this if you possess the authorisation yourself)*.

    <span class="mb-label mb-label-mauve">authorised/health</span> — Assigning this tag grants the employee authorisation to access sensitive health data (e.g. Health Surveillance corrective actions) for the employees they manage.

    <span data-uuid="ae1e1ced-aaec-4fbe-ac09-f67e9a0d2560" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/authorisations-tags-light-mode.png#only-light)
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/authorisations-tags-dark-mode.png#only-dark)

    !!! note

        <span data-uuid="8635e257-57b3-45ae-8cd9-f5f8725f4d0c" style="display:none"></span>

        By default, all sites will have the `authorised/health` tag available, but depending on your site configuration you may have more.

!!! step "<span class="meta">(optional)</span>"

    <span data-uuid="5461081e-c0d3-479d-8b91-4144f851b59d" style="display:none"></span>
    Under the **Own employee record access** section, modify whether this employee can manage their own record.

    - <span class="mb-label mb-label-blue">:lucide-user: User</span> - Can fulfil employee-scoped tasks such as their own e-learning completion. Cannot open their own confidential tasks unless assigned.
    - <span class="mb-label mb-label-purple">:lucide-user-shield: Manager</span> - Can change their own requirements and deal with their own confidential tasks even when not assigned.
    - <span class="mb-label mb-label-pink">:lucide-user-cog: Administrator</span> - Can make administrative-level changes to the employee record, such as adding requirements to their roles.

    <span data-uuid="c3f67b7a-6e30-4f46-bb2d-395bcdc672ea" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/own-employee-record-access-light-mode.png#only-light)
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/own-employee-record-access-dark-mode.png#only-dark)

!!! step

    <span data-uuid="60c84834-ac94-447b-8b77-93283857557b" style="display:none"></span>
    Under the **Site access** section, modify the employees access to your site(s).

    *:lucide-info: Select between **<span class="mb-label mb-label-blue">:lucide-user: User</span>**, **<span class="mb-label mb-label-purple">:lucide-user-shield: Manager</span>** and **<span class="mb-label mb-label-pink">:lucide-user-cog: Administrator</span>** access. To remove access to a site, select the <span class="mb-label mb-label-slate">-</span> option from the dropdown menu.*

    <span data-uuid="5d23596b-d01a-4493-a448-c5e10084a978" style="display:none"></span>
    ![](../assets/media/other/screenshots/APaQ0ST_UgoGam1x7NuixSy7GtD8fAnNNkSZd6b1_013f3a85.gif)

    !!! info "Multi-sited?"

        <span data-uuid="8206d323-98ef-43cc-ae38-2be4789ca951" style="display:none"></span>
        You can navigate up and down your site hierarchy using the <span class="mb-label mb-label-slate">:lucide-chevron-up-square: Up</span> and <span class="mb-label mb-label-slate">:lucide-chevron-down-square: Down</span> arrow buttons to set access to other sites/regions, or your entire organisation.

        <span data-uuid="4866e87b-56da-4311-822e-cae574761764" style="display:none"></span>
        ![](../assets/media/other/screenshots/APaQ0SRL-eDqthpF8jrV9xBNKwEhqf67e9IeA91W_d2fe5420.gif)

    !!! tip

        <span data-uuid="580751d5-0da4-4347-a594-ac99da4bd9a6" style="display:none"></span>

        Access cascades down the site hierarchy. Granting access at a site automatically applies the same access to all of its sub-sites.

!!! step

    <span data-uuid="a43e0eac-8187-44c2-a199-10316ff33860" style="display:none"></span>

    Once you have made the changes, click **Apply changes**.

    <span data-uuid="59fe8787-580a-49d7-952a-815c21b0ee7d" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/apply-changes-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/employees/uuid/access/edit/apply-changes-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }