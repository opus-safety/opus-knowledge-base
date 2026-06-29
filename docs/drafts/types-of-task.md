---
icon: lucide/grid-2-x-2-check
---

# Types of task
<span data-uuid="e0f63ac3-c844-4979-8eb4-0c28194addb7" style="display:none"></span>

Broadly speaking, tasks can be categorised into different types based on how they are generated and their content.

## Reminder Tasks
<span data-uuid="67d4309c-2663-49a1-85a2-6a73f9da9108" style="display:none"></span>


<span data-uuid="7b4feecc-a42a-46c0-ab6e-59b78128abe1" style="display:none"></span>
```mermaid
%%{init: {'flowchart': {'curve': 'stepBefore', 'nodeSpacing': 20, 'rankSpacing': 45, 'padding': 4}, 'themeVariables': {'fontSize': '12px'}}}%%

graph LR

R("<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"> <path fill-rule="evenodd" d="M12 5a4 4 0 0 0-8 0v2.379a1.5 1.5 0 0 1-.44 1.06L2.294 9.707a1 1 0 0 0-.293.707V11a1 1 0 0 0 1 1h2a3 3 0 1 0 6 0h2a1 1 0 0 0 1-1v-.586a1 1 0 0 0-.293-.707L12.44 8.44A1.5 1.5 0 0 1 12 7.38V5Zm-5.5 7a1.5 1.5 0 0 0 3 0h-3Z" clip-rule="evenodd" /> </svg> Reminder Tasks")

R --> S(Sites)

R --> A(Assets)

R --> E(Employees)

S --> S1(Site Checklists / Playbooks)

S --> S2(Site Documents)

A --> A1(Asset Checklists / Playbooks)

A --> A2(Asset Documents)

E --> E1(Employee Checklists / Playbooks)

E --> E2(E-learning)

E --> E3(Training)

class R root

class S,A,E branch

class S1,S2,A1,A2,E1,E2,E3 leaf
```