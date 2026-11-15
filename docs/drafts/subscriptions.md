---
icon: lucide/bell-plus
search:
  exclude: true
tags:
  - Using OCC
---

# Subscriptions
<span data-uuid="ea89b15a-ec64-40ba-acc1-6849beb33c19" style="display:none"></span>

<span data-uuid="76d2d1a4-4687-43a5-85df-51a6f58a83a7" style="display:none"></span>
In Opus Compliance Cloud, you can configure your account to be notified when certain in-system events occur. We call these **subscriptions**.

## How do subscriptions work?
<span data-uuid="d60b9714-c931-402b-8655-c2db053d693f" style="display:none"></span>

<span data-uuid="8da1aa6c-d4cf-41bb-89fa-d83b109483ec" style="display:none"></span>
When a task is generated, either automatically by the system or as a result of user reporting, such as an incident, the system will check whether you are subscribed to that kind of task. If you are, you will receive a **notification**.

You can configure your subscriptions to receive notifications in the following ways:

- **:lucide-bell-ring: In-system:** Receive a notification in-system via the bell icon & the notifications page.
- **:lucide-mail: Email:** Receive a direct notification straight to your email inbox.

??? example "Example 1 - Incidents"

    <span data-uuid="52143830-ca9d-473d-8d83-007bbca75d77" style="display:none"></span>

    <span data-uuid="f4588f41-7113-44da-91e8-d702061dfb8e" style="display:none"></span>

    <div class="grid" markdown>

    <div markdown>

    <span data-uuid="67eb3710-a0d1-43be-9d7a-11af18a8ad46" style="display:none"></span>

    <span data-uuid="7c4b312e-1d7c-4107-970e-019961706396" style="display:none"></span>
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

    </div>

    <div markdown>

    <span data-uuid="edd5a8ec-c22e-466e-b2b1-6261f453496c" style="display:none"></span>

    </div>

    </div>

??? example "Example 2 - Your own e-learning"

    <span data-uuid="83d0c528-2195-4436-98a8-80d2d91050b0" style="display:none"></span>

    <span data-uuid="1cac9828-8f51-47a7-b191-0c123eed0c5b" style="display:none"></span>

    <div class="grid" markdown>

    <div class="card" markdown>

    <span data-uuid="065ffc3e-6806-4e93-a353-8d871a1656dc" style="display:none"></span>

    <span data-uuid="6fea9534-a77d-4695-ae0c-5f403df19c9a" style="display:none"></span>
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
      s4 --> s6:Subscribed (in-system)?
      s6 --> s9:Digest enabled?
      s1 --> s4
      s4:E-learning reminder task generates automatically
      s6:In-system notification sent
      s9:Notification included in next digest email (if unread)
      s1:E-learning becomes due
      class s1 trigger
      class s4 question
      class s6,s9 action
    ```

    </div>

    <div class="card" markdown>

    <span data-uuid="a30550e5-15cf-4496-95c2-9c7d08fa0cd8" style="display:none"></span>

    </div>

    </div>

## Subscription Wizard
<span data-uuid="b69fbe19-0474-4fef-9382-102eeeca1441" style="display:none"></span>

<span data-uuid="8321856e-3984-4a42-afe8-fbc071b8a7ca" style="display:none"></span>
The subscription wizard is a quick and easy way to setup default in-system and email notifications for your account. All new users will go through the wizard as part of the registration process, while existing users can re-run the wizard at any time via their subscription settings or directly below.

<span data-uuid="4ec0c199-d089-42b0-98e4-270ed62b74db" style="display:none"></span>
[Run the subscription wizard :lucide-arrow-up-right:](https://cloud.opus-safety.co.uk/my/subscriptions/wizard){ .md-button .custom-button-emerald .custom-button--slim }

??? outline "<span class="mb-label mb-label-olive">Subscription wizard step-by-step instructions</span>"

    <span data-uuid="2d46c4ff-e2d5-4a0b-a892-7290840b4106" style="display:none"></span>

    !!! step

        <span data-uuid="fb92490a-4b37-475a-bcef-48fff57f668d" style="display:none"></span>

        Set your **Display name**.

        *This is the name associated with your account as seen by your colleagues.*

        <span data-uuid="a2f0717f-d720-4da4-81fe-0f37659ee360" style="display:none"></span>
        ![](../assets/media/occ-captures/my/subscriptions/wizard/display-name-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
        ![](../assets/media/occ-captures/my/subscriptions/wizard/display-name-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

    !!! step "<span class="meta">(optional)</span>"

        <span data-uuid="a563778e-ebb2-4ef9-ad2a-53e6fd0e1b46" style="display:none"></span>

        Change your **Avatar**.

        <span data-uuid="770fcf01-7126-4c20-b6bd-2c9a82b8540b" style="display:none"></span>
        ![](../assets/media/occ-captures/my/subscriptions/wizard/avatar-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
        ![](../assets/media/occ-captures/my/subscriptions/wizard/avatar-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

    !!! step

        <span data-uuid="410e3d25-f2f4-4efb-b039-7b1b14ea29ae" style="display:none"></span>

        Configure your subscriptions using one of our presets. Based on your configured access, the system will **recommend** the most suitable preset for you.

        <span data-uuid="262dc07a-5d81-4e5c-a411-52b9da6567f8" style="display:none"></span>
        ![](../assets/media/occ-captures/my/subscriptions/wizard/automatic-subscription-management-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
        ![](../assets/media/occ-captures/my/subscriptions/wizard/automatic-subscription-management-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

        ??? question "What are Subscriptions?"

            <span data-uuid="4a61ab52-bf89-45fa-8c9d-f3cdce591518" style="display:none"></span>

            Subscriptions are an account configuration that allows you to receive in-system and email notifications about events that happen in Opus Compliance Cloud, such as reminders when your e-learning is due or notifications when incidents occur.

    !!! step

        <span data-uuid="7fa11e66-1f27-4e67-bd40-1e612cea3d2a" style="display:none"></span>

        Choose whether you wish to share your subscription configuration with your manager(s).

        <span data-uuid="0fe9d034-41ed-47d2-89b7-521da378f6fd" style="display:none"></span>
        ![](../assets/media/occ-captures/my/subscriptions/wizard/share-setting-with-managers-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
        ![](../assets/media/occ-captures/my/subscriptions/wizard/share-setting-with-managers-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

        !!! warning

            <span data-uuid="9272c78f-e198-419c-b9e0-bdcf94019f54" style="display:none"></span>

            It may be a **requirement** as part of your employment contract to turn this on.

    !!! step

        <span data-uuid="a818cae9-bad2-423c-a332-bc496de18029" style="display:none"></span>

        Configure your notification preferences, including the **digest email**.

        <span data-uuid="93714081-bfaa-44ca-b665-8da853579f00" style="display:none"></span>
        ![](../assets/media/occ-captures/my/subscriptions/wizard/subscribe-when-assigned-and-more-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
        ![](../assets/media/occ-captures/my/subscriptions/wizard/subscribe-when-assigned-and-more-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

        ??? question "What is the Digest Email?"

            <span data-uuid="503a3610-29a6-4e9e-9a80-f3ea58d7d830" style="display:none"></span>

            The digest email brings together all your unread in-system notifications and sends them to you in a single daily or weekly email, making them easier to review.

    !!! step "<span class="meta">(optional, but recommended)</span>"

        <span data-uuid="756b978f-e6b2-4c6d-9592-1b0a12d9a888" style="display:none"></span>

        Subscribe to our newsletters to **stay informed** about the listed topics.

        <span data-uuid="4a992d49-1dc9-4ddb-ba3f-0c111ead7e4c" style="display:none"></span>
        ![](../assets/media/occ-captures/my/subscriptions/wizard/subscribable-newsletters-light-mode.png#only-light){ style="border-radius: 8px" width="400" loading=lazy }
        ![](../assets/media/occ-captures/my/subscriptions/wizard/subscribable-newsletters-dark-mode.png#only-dark){ style="border-radius: 8px" width="400" loading=lazy }

        !!! tip

            <span data-uuid="34304bf5-f48f-47d8-836e-77f587a77fbf" style="display:none"></span>

            The **System Updates** option is particularly useful if you want to stay up to date with the latest changes, features and updates to Opus Compliance Cloud.

    !!! step

        <span data-uuid="fe9fad01-6716-4c46-94f6-14b3d16ae71f" style="display:none"></span>

        Finally at the bottom, select **Save choices & continue**.

        <span data-uuid="d16fb034-9f29-43cd-a3f6-758c850f2043" style="display:none"></span>
        ![](../assets/media/occ-captures/my/subscriptions/wizard/save-choices-light-mode.png#only-light){ style="height: 50px" loading=lazy }
        ![](../assets/media/occ-captures/my/subscriptions/wizard/save-choices-dark-mode.png#only-dark){ style="height: 50px" loading=lazy }