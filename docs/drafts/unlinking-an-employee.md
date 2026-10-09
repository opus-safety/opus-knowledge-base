---
icon: lucide/user-x
tags:
  - Managing OCC
search:
  exclude: true
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
