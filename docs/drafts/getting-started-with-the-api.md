---
icon: lucide/key-round
tags:
  - API
search:
  exclude: true
---

# Getting started with the API
<span data-uuid="e29a6035-36bb-46ef-b602-376b12091ad5" style="display:none"></span>

This guide takes you from having no access to making your first request to the **Opus Compliance Cloud** API. It covers how to authenticate, how to explore the API from inside Opus Compliance Cloud, and how we expect integrations to behave.

New to the API? Read the [API Overview](api-overview.md) first.

## Before you start
<span data-uuid="67981eb4-37c3-4123-aea1-fad6b9e8cfb6" style="display:none"></span>

!!! info "What you need"

    <span data-uuid="778f64ac-5ab7-4a97-9559-bfbf3f45f7c4" style="display:none"></span>

    <span data-uuid="6324e417-41da-4f7b-8660-5414649e4f78" style="display:none"></span>

    - An **API key** and **API secret**, issued by Opus Safety.
    - A tool or language that can send HTTPS requests, such as `curl`, Postman, Python or Power Automate.
    - An Opus Compliance Cloud account with relevant access, if you want to use the API viewer.

## Getting your API credentials
<span data-uuid="bc92584f-8f7d-46a2-981c-2f5e2ad2318e" style="display:none"></span>

API credentials are issued by Opus Safety. To request them, <a href="#" onclick="event.preventDefault(); window.supportWidget.open();">get in touch</a> and tell us what you would like to connect.

Your credentials come as a pair:

`API key`
:   Identifies your integration. Used as the username.

`API secret`
:   Proves the request is yours. Used as the password.

Each pair is **linked to a user** in your organisation. The API can see and change exactly what that user can, so the user's sites and access level decide what your integration is able to do.

!!! warning "Treat your API secret like a password"

    <span data-uuid="c982cfbe-1f59-4bfa-ad94-f00c308c95f4" style="display:none"></span>

    - Store it in a secrets manager or an environment variable, never in source code, a spreadsheet or an email.
    - Use a separate pair of credentials for each integration.
    - If you think a secret has been exposed, <a href="#" onclick="event.preventDefault(); window.supportWidget.open();">get in touch</a> straight away so we can replace it.

??? info "Do credentials expire?"

    <span data-uuid="a514c60b-f3af-4911-95c8-488e69892186" style="display:none"></span>

    Credentials can be issued with an expiry date. If requests that used to work start being refused, check with us whether your credentials have expired.

## Authenticating
<span data-uuid="53ff6717-ff5e-4675-8d0e-43b149c27f6b" style="display:none"></span>

The API uses **HTTP Basic authentication** over HTTPS. There is no separate sign-in request and no token to refresh: you send your credentials with every request.

Every request needs these three headers:

<span data-uuid="d03a6c38-2422-4e40-8291-c3b1be3b19b7" style="display:none"></span>

<div class="nowrap-first" markdown>

| Header | Value | Notes |
| :--- | :--- | :--- |
| `Authorization` | `Basic`, followed by your API key and API secret | Most tools build this for you from a username and password. |
| `Accept` | The media type of the record you are asking for | Tells the API which record, and which version of it, you expect. A request without a supported media type is refused with `406 Not Acceptable`. |
| `User-Agent` | A name for your integration | **Required.** A request with no `User-Agent` is refused with `400 Bad Request`. |

</div>

### Making your first request
<span data-uuid="b8041204-7940-4028-8005-66536af18417" style="display:none"></span>

!!! step

    <span data-uuid="4d80f6f8-90cc-4f6c-9903-ceb697cccf73" style="display:none"></span>
    Send a `GET` request to the entry point, `https://cloud.opus-safety.co.uk`, using your API key as the username and your API secret as the password.

    <span data-uuid="9f90e6f2-48db-4b25-ab19-20f9c97d939b" style="display:none"></span>
    ```bash
    curl https://cloud.opus-safety.co.uk \
      --user "YOUR_API_KEY:YOUR_API_SECRET" \
      --header "Accept: application/vnd.opus-safety.entrypoint.v1+json" \
      --user-agent "your-organisation-integration/1.0"
    ```

!!! step

    <span data-uuid="4ee48d2f-1c26-4302-9840-2fe31949bb74" style="display:none"></span>
    Check the response. A successful request returns `200 OK` and a `_links` section, which confirms your credentials work.

    <span data-uuid="df2c7cf8-0a41-4102-a5a8-2fe110f2da50" style="display:none"></span>
    ```json
    {
      "_links": {
        "site_list": { "href": "https://cloud.opus-safety.co.uk/sites" }
      }
    }
    ```

!!! step

    <span data-uuid="77541b4c-510a-41d4-939b-16a48c35e218" style="display:none"></span>
    Follow the `site_list` link to see the sites your credentials can access. Each site then links on to its own employees, documents, checklists and tasks.

!!! tip "Follow links, don't build them"

    <span data-uuid="e1bfd2b4-be34-496b-bf36-e4428cde9149" style="display:none"></span>
    The API is designed to be navigated. Take the next address from the `_links` section of the response you already have, instead of assembling it yourself. Your integration then keeps working if an address changes.

## Exploring with the API viewer
<span data-uuid="d49a9156-5dbf-4482-913a-b08469b2c1bf" style="display:none"></span>

Opus Compliance Cloud has a built-in **API viewer**, which shows you the API behind the page you are looking at. It is the quickest way to find the address, media type and links for a record, without writing any code.

There are two ways in:

- **Start at the entry point.** While signed in, go to [cloud.opus-safety.co.uk/api](https://cloud.opus-safety.co.uk/api) and follow the links from there, exactly as your integration would.
- **Start from a page you already know.** Follow the steps below to see the API behind any View mode page.

!!! step

    <span data-uuid="55fcd539-33c2-4011-981f-a99b7bc8712c" style="display:none"></span>
    Sign in to [Opus Compliance Cloud](https://cloud.opus-safety.co.uk) as usual.

!!! step

    <span data-uuid="68af3943-1f6a-4458-a3bb-d556a97e2e03" style="display:none"></span>
    In **View mode**, open the page you are interested in, such as a site or an employee.

!!! step

    <span data-uuid="b2a8329c-6a33-4a06-b869-28b7fd827994" style="display:none"></span>
    In your browser's address bar, add `?api_viewer=last` to the end of the page address, then press ++enter++.

    <span data-uuid="5a7c0f3b-5c06-4186-8c71-2b143196b4cf" style="display:none"></span>
    ```text
    https://cloud.opus-safety.co.uk/sites/…?api_viewer=last
    ```

!!! step

    <span data-uuid="d5396ea5-ee5f-4d26-84f2-6bec85b8a4fa" style="display:none"></span>
    Read the result. The API viewer shows the same record as the API returns it, including its media type and its `_links`. Click a link to move to the related record, exactly as your integration would.

!!! note

    <span data-uuid="6902a32e-4857-4c63-904a-a592fbfa8452" style="display:none"></span>
    The API viewer works on **View mode** pages. It shows what *you* can see: if your integration's credentials are linked to a different user, it may see more or less than you do.

## Fair usage
<span data-uuid="c0dea60a-08c5-4f16-a5af-5eb5564de0c2" style="display:none"></span>

The API shares its capacity with everyone using Opus Compliance Cloud, including your own colleagues. We ask every integration to follow the practices below, so the service stays fast for everybody.

<span data-uuid="06c1cb0e-0e94-4997-a46c-21c714be83c4" style="display:none"></span>

<div class="nowrap-first" markdown>

| Practice | What we expect |
| :--- | :--- |
| **One request at a time** | Send requests sequentially. Wait for each response before sending the next, instead of running requests concurrently. |
| **Space requests out** | Leave a short pause between requests, especially in loops and bulk jobs. |
| **Ask only for what you need** | Follow links to the records you want, instead of downloading everything. |
| **Don't ask twice** | Keep hold of what you have already fetched, and avoid polling for data that rarely changes. |
| **Back off when asked** | If a request fails, or you receive `429 Too Many Requests`, wait before trying again. Never retry in a tight loop. |
| **Schedule the heavy lifting** | Run large imports, exports and syncs outside working hours where you can. |
| **Say who you are** | Use a `User-Agent` that names your organisation and integration, so we can contact you if something looks wrong. |

</div>

!!! warning

    <span data-uuid="a840ae1f-0cc7-4827-9175-d14f069c926b" style="display:none"></span>
    Integrations that put the service at risk for other customers may be slowed down or have their access paused while we work with you to resolve it.

!!! info "Planning something large?"

    <span data-uuid="e5c338a1-35cc-486d-8ac7-bacf27f8fd47" style="display:none"></span>
    If you are planning a one-off bulk import or a high-volume integration, <a href="#" onclick="event.preventDefault(); window.supportWidget.open();">get in touch</a> first. We can advise on the best approach.

## Relevant guides
<span data-uuid="3d375900-5934-464b-8f75-fd1ce0a6ad22" style="display:none"></span>

- [API Overview](api-overview.md)
