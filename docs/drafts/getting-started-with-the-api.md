---
icon: lucide/key-round
tags:
  - API
search:
  exclude: true
---

# Getting started with the API
<span data-uuid="e29a6035-36bb-46ef-b602-376b12091ad5" style="display:none"></span>

<span data-uuid="1443ac6d-5c41-4721-80eb-8b0b28e9d047" style="display:none"></span>
How to authenticate against the **Opus Compliance Cloud** API, make a first request, discover resources with the in-app API viewer, and the usage we expect from integrations.

For what the API offers, see the [API Overview](api-overview.md).

## Before you start
<span data-uuid="67981eb4-37c3-4123-aea1-fad6b9e8cfb6" style="display:none"></span>

!!! info "What you need"

    <span data-uuid="778f64ac-5ab7-4a97-9559-bfbf3f45f7c4" style="display:none"></span>

    <span data-uuid="6324e417-41da-4f7b-8660-5414649e4f78" style="display:none"></span>

    - An **API key** and **secret**, issued by Opus Safety.
    - Any HTTP client.
    - An Opus Compliance Cloud account with relevant access, if you want to use the API viewer.

## Obtaining your API credentials
<span data-uuid="bc92584f-8f7d-46a2-981c-2f5e2ad2318e" style="display:none"></span>

<span data-uuid="2acc0ae2-805a-4a07-8615-167c7c83d699" style="display:none"></span>
Credentials are issued by Opus Safety as an API key and API secret pair. To request a pair, <a href="#" onclick="event.preventDefault(); window.supportWidget.open();">get in touch</a>.

We like to distinguish between two different kinds of API usage, so please let us know when making your request:

- **:lucide-user: Personal usage:** Using Opus API for running requests as yourself for things like personal reports or bulk ad-hoc changes.
- **:lucide-cpu: Integration usage:** Using Opus API as part of an automated integration. For example, automating processes between OCC and a separate software (such as a HR platform).

!!! warning "Store your API credentials appropriately"

    <span data-uuid="c982cfbe-1f59-4bfa-ad94-f00c308c95f4" style="display:none"></span>

    <span data-uuid="e7fb194a-732f-4bc7-8c9d-24dac8492657" style="display:none"></span>
    Once you have obtained your credentials, please store them appropriately.
    - Store in a secrets manager or an environment variable, never in source code.
    - Use a separate pair of credentials for each integration.
    - If a secret may have been exposed, <a href="#" onclick="event.preventDefault(); window.supportWidget.open();">get in touch</a> straight away so we can rotate it.

## Requests and Authentication
<span data-uuid="53ff6717-ff5e-4675-8d0e-43b149c27f6b" style="display:none"></span>

<span data-uuid="dbebc5ca-7457-4f9a-8ac5-3c6c7579063c" style="display:none"></span>
The API uses **HTTP Basic authentication** over HTTPS, with the API key as the username and the API secret as the password. Authentication is stateless: there is no token exchange or session, so credentials are sent on every request.

Every request needs at least these three headers:

<span data-uuid="d03a6c38-2422-4e40-8291-c3b1be3b19b7" style="display:none"></span>

<div class="nowrap-first" markdown>

| Header | Example |
| :--- | :--- |
| `Authorization` | `Basic <base64(key:secret)>` |
| `Accept` | `application/vnd.opus-safety.entrypoint.v1+json` |
| `User-Agent` | `OrganisationNameIntegrationName/version (contact-dev@domain.tld)` |

</div>

<span data-uuid="76c8aeb4-2bc4-467e-8103-4dd14c0fa51b" style="display:none"></span>
A request with no supported media type in `Accept` returns `406 Not Acceptable`. A request with no `User-Agent` returns `400 Bad Request`.

### Making your first request
<span data-uuid="b8041204-7940-4028-8005-66536af18417" style="display:none"></span>

<span data-uuid="9f60971e-86b7-4ede-80b8-d1b1496fb871" style="display:none"></span>
`GET` the entry point, `https://cloud.opus-safety.co.uk`:

<span data-uuid="9f90e6f2-48db-4b25-ab19-20f9c97d939b" style="display:none"></span>
```bash
curl https://cloud.opus-safety.co.uk \
  --user "$OPUS_API_KEY:$OPUS_API_SECRET" \
  --header "Accept: application/vnd.opus-safety.entrypoint.v1+json" \
  --user-agent "ExampleOrgHrSync/1.0 (dev@example.org)"
```

<span data-uuid="891602ca-8a79-4b46-8d4b-0095ae244919" style="display:none"></span>
A `200 OK` confirms your credentials. The body carries the links available from the entry point:

<span data-uuid="df2c7cf8-0a41-4102-a5a8-2fe110f2da50" style="display:none"></span>
```json
{
  "_links": {
    "site_list": { 
      "href": "https://cloud.opus-safety.co.uk/sites?hidden=1&special=1"
     }
  }
}
```

<span data-uuid="5edb911b-72c3-4bfe-84a8-c58e28b0af6b" style="display:none"></span>
`site_list` resolves to the sites your credentials can access. Each site response contains the `_links` relevant to the site.

## Conventions
<span data-uuid="d66e8839-241e-4882-9b3d-e21ac964daa6" style="display:none"></span>

<span data-uuid="167787df-85b7-4348-bc01-7a3e3180860d" style="display:none"></span>

<div class="nowrap-first" markdown>

| Convention | Detail |
| :--- | :--- |
| **Hypermedia** | The API is HATEOAS-style. Every resource carries a `_links` object of `rel` → `href`. Treat URLs as opaque and take them from `_links`, instead of constructing them. |
| **Content negotiation** | Each resource has its own versioned vendor media type, in the form `application/vnd.opus-safety.<resource>.v<n>+json`. Send it in `Accept`, and in `Content-Type` when sending a body. Pin the version you built against. |
| **Errors** | Error bodies are [problem details](https://www.rfc-editor.org/rfc/rfc9457) (`application/problem+json`). Include that type in `Accept` alongside the resource type, so failures are returned in a readable form. |
| **Updates** | There is no `PATCH`. To update a resource, `GET` it, then `PUT` the full representation with the response's `ETag` in `If-Match`. If the resource has changed in the meantime, the API returns `412 Precondition Failed`. |

</div>

## Exploring with the API viewer
<span data-uuid="d49a9156-5dbf-4482-913a-b08469b2c1bf" style="display:none"></span>

<span data-uuid="0a44b59d-48f8-4c9a-8a45-d58f08f91c88" style="display:none"></span>
Opus Compliance Cloud has a built-in **API viewer**: a browsable rendering of the API, served from the same URLs as the live application. Use it to easily browse endpoints, representations and their responses.

There are two ways in, both from a signed-in browser session:

- **From the entry point:** Go to [cloud.opus-safety.co.uk/api](https://cloud.opus-safety.co.uk/api) and follow the links, as your client would.
- **From a page in the app:** Append `?api_viewer=last` to the URL of most **View mode** pages to see the resource behind it.

<span data-uuid="5a7c0f3b-5c06-4186-8c71-2b143196b4cf" style="display:none"></span>
```text
https://cloud.opus-safety.co.uk/sites/…?api_viewer=last
```

!!! note

    <span data-uuid="6902a32e-4857-4c63-904a-a592fbfa8452" style="display:none"></span>
    The API viewer runs as *your* signed-in user. If your API credentials are bound to a different user, your client may see more or less than the viewer shows you.

## Fair usage
<span data-uuid="c0dea60a-08c5-4f16-a5af-5eb5564de0c2" style="display:none"></span>

<span data-uuid="b818042e-7ba4-45d1-86a9-2873f515798c" style="display:none"></span>
The API shares capacity with the interactive application, so a heavy client affects real users, including your own colleagues. We expect every integration to follow these practices:

<span data-uuid="06c1cb0e-0e94-4997-a46c-21c714be83c4" style="display:none"></span>

<div class="nowrap-first" markdown>

| Practice | What we expect |
| :--- | :--- |
| **No concurrency** | Issue requests sequentially. Wait for each response before sending the next. |
| **Throttle** | Leave a delay between requests, particularly in loops and bulk jobs. |
| **Fetch selectively** | Follow links to the resources you need, instead of crawling the whole tree. |
| **Cache** | Reuse responses you already hold, and avoid polling resources that rarely change. |
| **Back off** | On `429 Too Many Requests`, honour `Retry-After`. On other failures, retry with exponential backoff and a retry limit. |
| **Schedule bulk work** | Run large imports, exports and syncs outside UK working hours where you can. |
| **Identify your client** | Send a `User-Agent` that names your organisation and integration and includes a contact address, so we can reach you if you encounter a problem. |

</div>

!!! info "Planning something large?"

    <span data-uuid="e5c338a1-35cc-486d-8ac7-bacf27f8fd47" style="display:none"></span>
    If you are planning a one-off bulk import or a high-volume integration, <a href="#" onclick="event.preventDefault(); window.supportWidget.open();">get in touch</a> first. We can advise on the best approach.