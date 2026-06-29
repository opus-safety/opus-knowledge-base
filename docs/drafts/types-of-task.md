---
icon: lucide/grid-2-x-2-check
---

# Types of task
<span data-uuid="e0f63ac3-c844-4979-8eb4-0c28194addb7" style="display:none"></span>

Broadly speaking, tasks can be categorised into different types based on how they are generated and their content.

## Reminder Tasks
<span data-uuid="67d4309c-2663-49a1-85a2-6a73f9da9108" style="display:none"></span>


<span data-uuid="92864bfb-083b-44ee-90ca-77f029734506" style="display:none"></span>
=== "Diagram"

    <span data-uuid="1a7f0b20-73ed-49db-affd-77f66024b249" style="display:none"></span>

=== "Table"

    <span data-uuid="11d4dba4-b5e7-4f0b-9089-6f641f0b83ba" style="display:none"></span>

    <span data-uuid="96706bb5-e74a-4d3e-a0d0-e02124a06435" style="display:none"></span>

    | Applied to | Reminder Type | Examples |
    | :--- | :--- | :--- |
    | <span class="mb-label mb-label-lime">Assets</span> | <span class="mb-label mb-label-slate">Documents</span> | Annual Services, LOLER/Thorough Examinations, Inspection Certificates, etc. |
    | <span class="mb-label mb-label-lime">Assets</span> | <span class="mb-label mb-label-olive">Checklists</span> | Vehicle/Machinery Pre-use Checks, Ladder Checks, Racking Checks, etc. |
    | <span class="mb-label mb-label-lime">Assets</span> | <span class="mb-label mb-label-mauve">Playbooks</span> | Vehicle/Machinery Procedures, Routines, etc. |
    | <span class="mb-label mb-label-amber">Employees</span> | <span class="mb-label mb-label-slate">Documents</span> | Licences, Personal Assessments, etc. |
    | <span class="mb-label mb-label-amber">Employees</span> | <span class="mb-label mb-label-olive">Checklists</span> | DSE Assessments, Health Surveillance, etc. |
    | <span class="mb-label mb-label-amber">Employees</span> | <span class="mb-label mb-label-mauve">Playbooks</span> | Employee Inductions, Personal Workflows, etc. |
    | <span class="mb-label mb-label-amber">Employees</span> | <span class="mb-label mb-label-stone">E-learning</span> | Manual Handling, Racking Safety, Fire Marshal or more |
    | <span class="mb-label mb-label-amber">Employees</span> | <span class="mb-label mb-label-neutral">Training</span> | First Aid at Work, Counterbalance Training, Lorry Loader Training, etc |
    | <span class="mb-label mb-label-sky">Sites</span> | <span class="mb-label mb-label-slate">Documents</span> | Company policies, Handbooks or Risk assessments. |
    | <span class="mb-label mb-label-sky">Sites</span> | <span class="mb-label mb-label-olive">Checklists</span> | Managers’ Monthly Walk-arounds, including Fire Safety Checks, Office Checks, or Warehouse Checks. |
    | <span class="mb-label mb-label-sky">Sites</span> | <span class="mb-label mb-label-mauve">Playbooks</span> | Site Procedures or Step-by-step guides. |

<span data-uuid="7b4feecc-a42a-46c0-ab6e-59b78128abe1" style="display:none"></span>
```mermaid
---
config:
  layout: elk
---
flowchart LR
 subgraph s1[" "]
        n5(["Asset Checklists"])
        n8(["Asset Playbooks"])
        n9(["Asset Documents"])
  end
 subgraph s4[" "]
        n10(["Site Checklists"])
        n11(["Site Playbooks"])
        n12(["Site Documents"])
  end
 subgraph s5[" "]
        n13(["Employee Checklists"])
        n14(["Employee Playbooks"])
        n15(["E-learning"])
        n16(["Training"])
  end
    A["Reminder Tasks"] --> n1["Assets"] & n2["Sites"] & n3["Employees"]
    n1 --> s1
    n5 --- n8
    n8 --- n9
    n10 --- n11
    n11 --- n12
    n2 --> s4
    n13 --- n14
    n14 --- n15
    n3 --> s5
    n15 --> n16

    A@{ shape: rounded}
    n1@{ shape: rounded}
    n2@{ shape: rounded}
    n3@{ shape: rounded}
```