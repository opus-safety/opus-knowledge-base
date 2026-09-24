---
icon: lucide/camera
search:
  exclude: true
tags:
  - Managing OCC
---

# Snapshot
<span data-uuid="ca6f732c-3ef5-400c-8178-ca2bec4070c0" style="display:none"></span>

The Snapshot is a valuable reporting tool that enables managers and administrators to gain a clear, high-level overview of the current state of sites, employees and assets, while also providing the flexibility to generate targeted, filtered reports.

!!! warning

    <span data-uuid="015baa16-6e37-47a5-bb53-01cce49bfbbb" style="display:none"></span>
    The Snapshot should **not** be used as a replacement for the Site Inbox. It is designed to provide a high-level overview rather without some of the detail needed for day-to-day management of the system. The Snapshot does not include all kinds of task and does not provide prioritisation. While it is a useful reporting and monitoring tool, we recommend using the Site Inbox for general task management.

## How to run the Snapshot against a site
<span data-uuid="cbf09369-9c74-403d-b42e-8ba2c6dc7136" style="display:none"></span>


!!! step

    <span data-uuid="0511d89d-65a3-4b70-bb22-b0d098ecc706" style="display:none"></span>

    From [My Dashboard](https://cloud.opus-safety.co.uk/dashboard), click on **Pick workspace** and select the site where you wish to run the report.

    <span data-uuid="ab2a0bd5-a82d-41f5-8dce-36f75893516f" style="display:none"></span>
    ![](../assets/media/occ-captures/dashboard/pick-workspace-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/dashboard/pick-workspace-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="00e53f32-b4f6-4d76-a750-74cc616b71ad" style="display:none"></span>

    From the site inbox, click the **Switch to Manage Mode** button.

    <span data-uuid="f0e69fab-3ff8-4137-a215-c6f9a4eb9d2f" style="display:none"></span>
    ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/sites/uuid/switch-to-manage-mode-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

!!! step

    <span data-uuid="a62e0671-12ea-4aab-824c-2dc7d6675a94" style="display:none"></span>
    In the sidebar, under Reporting, click **Snapshot**.

    <span data-uuid="87bd7730-a902-45cd-8379-c81b952278f9" style="display:none"></span>
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/snapshot-light-mode.png#only-light){ style="height: 50px" loading=lazy }
    ![](../assets/media/occ-captures/admin/sites/uuid/dashboard/snapshot-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }

## The Snapshot overview page
<span data-uuid="e2dc7af4-0752-40d8-aa8c-45098a3a6a65" style="display:none"></span>

The overview page provides a series of "due counts" across a range of different requirement/task types.

<span data-uuid="2d8fecf8-b21b-46f0-9896-da7617c7287d" style="display:none"></span>
![](../assets/media/occ-captures/admin/sites/uuid/snapshot/overview/site-snapshot-a-sites-assets-employees-light-mode.png#only-light){ style="border-radius: 8px" loading=lazy }
![](../assets/media/occ-captures/admin/sites/uuid/snapshot/overview/site-snapshot-a-sites-assets-employees-dark-mode.png#only-dark){ style="border-radius: 8px" loading=lazy }

<span data-uuid="8e9de844-d005-4117-9be4-96ebeba5cb52" style="display:none"></span>

| Highlighted element | Description |
| :--- | :--- |
| <span class="mb-label mb-label-blue">Include sub-sites toggle</span> | Toggle this option to enable or disable the inclusion of data from sites beneath the current site. |
| <span class="mb-label mb-label-rose">Sites section</span> | This section displays different categories of site-related requirements and tasks, along with their corresponding due counts. |
| <span class="mb-label mb-label-amber">Assets section</span> | This section displays different categories of asset-related requirements and tasks, along with their corresponding due counts. |
| <span class="mb-label mb-label-emerald">Employees section</span> | This section displays different categories of employee-related requirements and tasks, along with their corresponding due counts. |
| <span class="mb-label mb-label-purple">Asset type / Employee role filters</span> | Use these options to filter the due counts by selected asset types and/or employee roles. |
| <span class="mb-label mb-label-cyan">CSV export</span> | Export the data to a CSV file containing a detailed breakdown of the Snapshot figures for each individual site. |

## The Snapshot report page
<span data-uuid="b8c29132-042f-4ac3-8a3a-d2f32caa1278" style="display:none"></span>


<span data-uuid="66d442d2-51d2-40ee-a9a4-f61a8f0aeeef" style="display:none"></span>
![](../assets/media/occ-captures/admin/sites/uuid/reports/due/employees/elearning/search-or-filter-a-overdue-after-name-employee-due-from-overdue-at-generate-csv-export-z-light-mode.png#only-light){ style="border-radius: 8px" loading=lazy }
![](../assets/media/occ-captures/admin/sites/uuid/reports/due/employees/elearning/search-or-filter-a-overdue-after-name-employee-due-from-overdue-at-generate-csv-export-z-dark-mode.png#only-dark){ style="border-radius: 8px" loading=lazy }

<span data-uuid="71544a40-3e10-4deb-a1c7-694cace84eb9" style="display:none"></span>

| Highlighted element | Description |
| :--- | :--- |
| <span class="mb-label mb-label-yellow">Search bar</span> | Use the search bar to find or filter for specific results. |
| <span class="mb-label mb-label-blue">Overdue date range</span> | Adjust the overdue date range to customise the results shown. By default, this is set to show anything overdue before tomorrow (i.e. everything currently overdue). :lucide-lightbulb: Clear the date range to show all available results. |
| <span class="mb-label mb-label-green">Results table</span> | All relevant results, based on the filters you have applied, will be displayed in this table. |
| <span class="mb-label mb-label-orange">More filters</span> | Apply additional filters using this section, including filters for role/type, site, employee/asset and more. |
| <span class="mb-label mb-label-pink">CSV Export</span> | Export the results table as a CSV file containing a more detailed breakdown of the data. :lucide-lightbulb: These CSV exports are commonly used to provide evidence for submissions across a range of employees and assets. |