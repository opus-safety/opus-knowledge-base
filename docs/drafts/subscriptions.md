---
icon: lucide/bell-plus
search:
  exclude: true
tags:
  - Using OCC
---

# Subscriptions
<span data-uuid="ea89b15a-ec64-40ba-acc1-6849beb33c19" style="display:none"></span>

In Opus Compliance Cloud, you can configure your account to be notified when certain in-system events occur. We call these subscriptions.

## How do subscriptions work?
<span data-uuid="d60b9714-c931-402b-8655-c2db053d693f" style="display:none"></span>

When a task is generated, either automatically by the system or as a result of user reporting, such as an incident, you can choose to be notified of its occurrence via subscribing.

??? example "Example 1 - Incidents"

    <span data-uuid="52143830-ca9d-473d-8d83-007bbca75d77" style="display:none"></span>

    <span data-uuid="9f43b4a6-6306-4718-aae5-5585758e3a36" style="display:none"></span>
    ```mermaid
    ---
    config:
      layout: elk
    ---
    stateDiagram
      direction TB
      classDef trigger stroke:#d97706,fill:#f59e0b26,stroke-width:2px;
      classDef question stroke:#7d8590,fill:#9ca3af26,stroke-width:2px;
      classDef action stroke:#16a34a,fill:#22c55e26,stroke-width:2px;
      s1 --> s2:<br>
      s2 --> s4:<br>
      s4 --> s6:Subscribed (in-system)?
      s6 --> s9:Digest enabled?
      s6 --> s8:Subscribed (email)?
      s1:Incident occurs
      s2:Incident reported on OCC
      s4:Incident task created
      s6:In-system notification sent
      s9:Notification included in next digest email (if unread)
      s8:Instant email notification sent
      class s1 trigger
      class s2,s4 question
      class s6,s9,s8 action
    ```

??? example "Example 1 - Your own e-learning"

    <span data-uuid="83d0c528-2195-4436-98a8-80d2d91050b0" style="display:none"></span>

    <span data-uuid="c217f97e-e840-4372-8c74-0254378d1f1b" style="display:none"></span>
    ```mermaid
    ---
    config:
      layout: elk
    ---
    stateDiagram
      direction TB
      classDef trigger stroke:#d97706,fill:#f59e0b26,stroke-width:2px;
      classDef question stroke:#7d8590,fill:#9ca3af26,stroke-width:2px;
      classDef action stroke:#16a34a,fill:#22c55e26,stroke-width:2px;
      s1 --> s2:<br>
      s2 --> s4:<br>
      s4 --> s6:Subscribed (in-system)?
      s6 --> s9:Digest enabled?
      s6 --> s8:Subscribed (email)?
      s1:Incident occurs
      s2:Incident reported on OCC
      s4:Incident task created
      s6:In-system notification sent
      s9:Notification included in next digest email (if unread)
      s8:Instant email notification sent
      class s1 trigger
      class s2,s4 question
      class s6,s9,s8 action
    ```