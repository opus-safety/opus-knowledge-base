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

!!! success "Complete!"

    <span data-uuid="9b6b3a47-c110-4370-8030-25337b2f4eaf" style="display:none"></span>
    The account has now been successfully unlinked from the record. If needed, you can now re-register/link this employee following our **Registering an employee** guide below.

    <span data-uuid="fb55c4b5-9a39-487b-8038-6a9a8d0e4758" style="display:none"></span>
    [Registering an employee :lucide-arrow-right:](registering-an-employee.md){ .md-button .custom-button-slate .custom-button--slim }