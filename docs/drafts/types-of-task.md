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

R@{ icon: "lucide:bell", form: "square", label: "Reminder Tasks", pos: "b" }

R --> S@{ icon: "lucide:building-2", form: "square", label: "Sites", pos: "b" }

R --> A@{ icon: "lucide:truck", form: "square", label: "Assets", pos: "b" }

R --> E@{ icon: "lucide:users", form: "square", label: "Employees", pos: "b" }

S --> S1@{ icon: "lucide:clipboard-check", form: "square", label: "Site Checklists / Playbooks", pos: "b" }

S --> S2@{ icon: "lucide:file-text", form: "square", label: "Site Documents", pos: "b" }

A --> A1@{ icon: "lucide:clipboard-check", form: "square", label: "Asset Checklists / Playbooks", pos: "b" }

A --> A2@{ icon: "lucide:file-text", form: "square", label: "Asset Documents", pos: "b" }

E --> E1@{ icon: "lucide:clipboard-check", form: "square", label: "Employee Checklists / Playbooks", pos: "b" }

E --> E2@{ icon: "lucide:graduation-cap", form: "square", label: "E-learning", pos: "b" }

E --> E3@{ icon: "lucide:book-open", form: "square", label: "Training", pos: "b" }

class R root

class S,A,E branch

class S1,S2,A1,A2,E1,E2,E3 leaf
```