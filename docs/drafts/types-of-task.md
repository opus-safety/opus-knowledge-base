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

R("<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='vertical-align:-2px'><path d='M10.268 21a2 2 0 0 0 3.464 0'/><path d='M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326'/></svg> Reminder Tasks")

R --> S(:lucide-send: Sites)

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