#!/usr/bin/env python3
"""Check every link and button on KB pages.

    python3 links.py docs/pages/mfa.md [more.md ...]
    python3 links.py --all            # every live page (docs/pages/*.md)
    python3 links.py --drafts         # every draft (docs/drafts/*.md)
    python3 links.py --json ...       # machine-readable output
    python3 links.py --offline ...    # skip network requests

For each link it prints: page:line, kind, status, the link text, the target,
and (for KB targets) the target page's H1 — so a human/model can judge whether
the link goes where its text says it does.

Statuses:
  OK        resolves (HTTP 2xx/3xx, or the KB file/anchor exists)
  BROKEN    404/410, DNS failure, missing KB file, missing anchor
  WARN      works but is wrong-ish: live page linking to a draft, absolute
            support.opus-safety.co.uk/pages/ URL instead of a relative <slug>.md
            link, legacy window.groove call, sales /contact used for support,
            http:// instead of https://
  CHECK     couldn't be verified automatically (403/429/5xx/timeout) — look
            at it by hand. App links (cloud.opus-safety.co.uk) are checked
            logged-out: a real route redirects to sign-in, a dead one 404s.
  EXPECTED  a draft's bare sibling .md link that resolves once the draft is
            promoted to pages/ — deliberate, don't report as broken
  SKIP      mailto:, tel:
"""
import concurrent.futures as cf
import glob
import json
import os
import re
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DOCS = os.path.join(ROOT, "docs")
TOML = os.path.join(ROOT, "zensical.toml")
KB_HOST = "support.opus-safety.co.uk"
APP_HOST = "cloud.opus-safety.co.uk"
UA = "Mozilla/5.0 (compatible; okb-link-check/1.0)"

MD_LINK = re.compile(r"(?<!!)\[((?:[^\[\]]|\[[^\]]*\])*)\]\(\s*<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\s*\)(\{[^}]*\})?")
A_TAG = re.compile(r"<a\b([^>]*)>(.*?)</a>", re.I | re.S)
ATTR = re.compile(r'(\w[\w-]*)\s*=\s*"([^"]*)"')
NAV_DIV = re.compile(r'<div[^>]*class="[^"]*mb-nav-links[^"]*"[^>]*>', re.I)
UUID_SPAN = re.compile(r'<span[^>]*data-uuid[^>]*></span>')


def slugify(text):
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r":[a-z0-9-]+:", "", text)          # :lucide-x: shortcodes
    text = re.sub(r"[*_`]", "", text).strip().lower()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s]+", "-", text).strip("-")


def page_info(path, _cache={}):
    """(h1, set of anchor ids) for a docs file."""
    if path in _cache:
        return _cache[path]
    h1, anchors = None, set()
    try:
        for ln in open(path, encoding="utf-8"):
            m = re.match(r"^(#{1,6})\s+(.*?)\s*(\{[^}]*\})?\s*$", ln)
            if m:
                title = m.group(2)
                if m.group(1) == "#" and h1 is None:
                    h1 = re.sub(r"<[^>]+>", "", title).strip()
                idm = re.search(r"#([\w-]+)", m.group(3) or "")
                anchors.add(idm.group(1) if idm else slugify(title))
            for idm in re.finditer(r'\bid="([^"]+)"', ln):
                anchors.add(idm.group(1))
            # anchor-links.js gives each admonition its own data-uuid as an id
            for idm in re.finditer(r'data-uuid="([^"]+)"', ln):
                anchors.add(idm.group(1))
    except OSError:
        pass
    _cache[path] = (h1, anchors)
    return _cache[path]


def js_slug(t):
    t = re.sub(r"[\s_]+", "-", t.lower().strip())
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9-]", "", t))


def nav_sections(toml):
    """Set of slugified section paths in the live `nav` (as nav-links.js sees them)."""
    m = re.search(r"(?m)^nav\s*=\s*\[", toml)
    if not m:
        return set()
    i, depth, stack, out = m.end(), 1, [], set()
    tok = re.compile(r'\{\s*"([^"]+)"\s*=\s*\[|\[|\]|"(?:[^"\\]|\\.)*"')
    while depth and i < len(toml):
        t = tok.search(toml, i)
        if not t:
            break
        i = t.end()
        if t.group(1) is not None:
            depth += 1
            stack.append(js_slug(t.group(1)))
            out.add("/".join(stack))
        elif t.group(0) == "[":
            depth += 1
            stack.append(None)
        elif t.group(0) == "]":
            depth -= 1
            if stack:
                stack.pop()
    return {"/".join(x for x in p.split("/") if x and x != "None") for p in out}


def nav_text():
    try:
        return open(TOML, encoding="utf-8").read()
    except OSError:
        return ""


def extract(path):
    out = []
    in_fence = False
    for i, raw in enumerate(open(path, encoding="utf-8"), 1):
        if raw.lstrip().startswith(("```", "~~~")):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        ln = UUID_SPAN.sub("", raw)
        for m in MD_LINK.finditer(ln):
            attrs = m.group(3) or ""
            kind = "button" if "md-button" in attrs else "link"
            onclick = re.search(r'onclick="([^"]*)"', attrs)
            out.append(dict(line=i, kind=kind, text=m.group(1).strip(),
                            target=m.group(2), onclick=onclick.group(1) if onclick else ""))
        for m in A_TAG.finditer(ln):
            attrs = dict(ATTR.findall(m.group(1)))
            out.append(dict(line=i, kind="a", text=re.sub(r"<[^>]+>", "", m.group(2)).strip(),
                            target=attrs.get("href", ""), onclick=attrs.get("onclick", "")))
        for m in NAV_DIV.finditer(ln):
            attrs = dict(ATTR.findall(m.group(0)))
            out.append(dict(line=i, kind="nav-links", text="",
                            target=attrs.get("data-nav-path") or "tag:" + attrs.get("data-nav-tag", ""),
                            onclick=""))
    return out


def http_check(url):
    def go(method):
        req = urllib.request.Request(url, method=method, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as r:
            body = r.read(65536).decode("utf-8", "replace") if method == "GET" else ""
            t = re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
            return r.status, r.geturl(), (t.group(1).strip() if t else "")
    try:
        try:
            return go("GET")
        except urllib.error.HTTPError as e:
            if e.code in (405, 501):
                return go("HEAD")
            raise
    except urllib.error.HTTPError as e:
        return e.code, url, ""
    except Exception as e:  # DNS, timeout, TLS
        return None, url, type(e).__name__ + ": " + str(e)[:80]


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def app_check(url):
    """Unauthenticated GET, no redirects: real routes 302 to sign-in, dead ones 404."""
    opener = urllib.request.build_opener(_NoRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with opener.open(req, timeout=15) as r:
            return r.status, ""
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Location", "")
    except Exception as e:
        return None, type(e).__name__


def classify(page, link, offline, http_cache, nav):
    t, oc = link["target"], link["onclick"]
    rel_page = os.path.relpath(page, ROOT)
    is_live = os.sep + "pages" + os.sep in page or page.endswith(os.sep + "index.md")
    res = dict(link, page=rel_page, status="OK", note="", target_title="")

    if link["kind"] == "nav-links":
        if t.startswith("tag:"):
            missing = [x.strip() for x in t[4:].split(",") if x.strip() and ('"%s"' % x.strip()) not in nav]
            res.update(status="BROKEN" if missing else "OK",
                       note=("tag(s) not in mb_created_tags: " + ", ".join(missing)) if missing else "")
        else:
            path = "/".join(js_slug(x) for x in t.split("/") if x.strip())
            ok = path in nav_sections(nav)
            res.update(status="OK" if ok else "BROKEN",
                       note="" if ok else "no nav section at this path — the block renders empty")
        return res
    if "window.groove" in oc or "window.groove" in t:
        return dict(res, status="WARN", note="legacy window.groove call — use window.supportWidget")
    if "supportWidget" in oc:
        return dict(res, note="opens support widget")
    if t.startswith(("mailto:", "tel:")):
        return dict(res, status="SKIP")
    if t in ("", "#"):
        return dict(res, status="BROKEN", note="empty href with no onclick action")

    kb = re.match(r"https?://%s(/[^#?]*)?(?:\?[^#]*)?(?:#(.*))?$" % re.escape(KB_HOST), t)
    if t.startswith("#") or kb or not re.match(r"^[a-z]+:", t):
        # Resolve to a docs file + anchor.
        if t.startswith("#"):
            target_file, anchor = page, t[1:]
        elif kb:
            p, anchor = (kb.group(1) or "/").strip("/"), kb.group(2)
            target_file = os.path.join(DOCS, p + ".md") if p else os.path.join(DOCS, "index.md")
            if not os.path.exists(target_file):
                target_file = os.path.join(DOCS, p, "index.md")
            if p.startswith("drafts/") and is_live:
                res.update(status="WARN", note="live page links to a draft")
            elif p.startswith("pages/"):
                res.update(status="WARN", note="use the relative link %s.md, not the deployed URL" % p[len("pages/"):])
            if t.startswith("http://"):
                res.update(status="WARN", note="use https://")
        else:
            p, _, anchor = t.partition("#")
            target_file = os.path.normpath(os.path.join(os.path.dirname(page), p))
        if not os.path.exists(target_file) and not t.startswith("#") and not kb \
                and os.sep + "drafts" + os.sep in page:
            published = os.path.normpath(os.path.join(DOCS, "pages", t.partition("#")[0]))
            if os.path.exists(published):
                # Deliberate: a draft's links are written for where it'll live once
                # promoted to pages/. Zensical warns until then; not a real break.
                return dict(res, status="EXPECTED",
                            note="draft link written for its published location (resolves after promotion)")
        if not os.path.exists(target_file):
            return dict(res, status="BROKEN", note="no such KB page: " + os.path.relpath(target_file, ROOT))
        h1, anchors = page_info(target_file)
        res["target_title"] = h1 or ""
        if anchor and anchor not in anchors:
            return dict(res, status="BROKEN", note="anchor #%s not found on target" % anchor)
        rel_target = os.path.relpath(target_file, DOCS)
        if rel_target.startswith("pages") and ('"%s"' % rel_target) not in nav and res["status"] == "OK":
            res.update(status="WARN", note="target page not registered in nav")
        return res

    if APP_HOST in t:
        if offline:
            return dict(res, status="CHECK", note="offline: not requested")
        code, loc = http_cache.get(t, (None, ""))
        if code in (200, 302, 303) and (code == 200 or "sign_in" in loc or APP_HOST in loc):
            return dict(res, note="app route exists" + (" (needs login)" if code != 200 else ""))
        if code == 404:
            return dict(res, status="BROKEN", note="app route returns 404 — page moved or removed")
        return dict(res, status="CHECK", note="app returned %s %s" % (code, loc))
    if offline:
        return dict(res, status="CHECK", note="offline: not requested")
    code, final, title = http_cache[t]
    res["target_title"] = title if code else ""
    if code is None:
        return dict(res, status="BROKEN", note=title)
    if code in (404, 410):
        return dict(res, status="BROKEN", note="HTTP %d" % code)
    if code >= 400:
        return dict(res, status="CHECK", note="HTTP %d (may block bots)" % code)
    if final.rstrip("/") != t.rstrip("/"):
        res["note"] = "redirects to " + final
    if t.startswith("http://"):
        res.update(status="WARN", note=(res["note"] + "; " if res["note"] else "") + "use https://")
    if "opus-safety.co.uk/contact" in t:
        res["note"] = (res["note"] + "; " if res["note"] else "") + "sales page — only for buying enquiries"
    return res


def main(argv):
    as_json = "--json" in argv
    offline = "--offline" in argv
    args = [a for a in argv if not a.startswith("--")]
    pages = list(args)
    if "--all" in argv:
        pages += sorted(glob.glob(os.path.join(DOCS, "pages", "*.md")))
    if "--drafts" in argv:
        pages += sorted(glob.glob(os.path.join(DOCS, "drafts", "*.md")))
    pages = [os.path.abspath(p) for p in pages]
    if not pages:
        print(__doc__)
        return 2
    nav = nav_text()
    links = [(p, l) for p in pages for l in extract(p)]
    ext = sorted({l["target"] for _, l in links
                  if re.match(r"^https?://", l["target"]) and KB_HOST not in l["target"]})
    http_cache = {}
    if not offline and ext:
        def check(u):
            return app_check(u) if APP_HOST in u else http_check(u)
        with cf.ThreadPoolExecutor(8) as ex:
            for u, r in zip(ext, ex.map(check, ext)):
                http_cache[u] = r
    results = [classify(p, l, offline, http_cache, nav) for p, l in links]

    if as_json:
        print(json.dumps(results, indent=1))
    else:
        for r in results:
            extra = (" → \"%s\"" % r["target_title"]) if r["target_title"] else ""
            print("%-6s %s:%d [%s] \"%s\" → %s%s%s" % (
                r["status"], r["page"], r["line"], r["kind"], r["text"][:60],
                r["target"][:100], extra, ("  (" + r["note"] + ")") if r["note"] else ""))
        counts = {}
        for r in results:
            counts[r["status"]] = counts.get(r["status"], 0) + 1
        print("\n%d link(s) across %d page(s): %s" % (
            len(results), len(pages), ", ".join("%s %d" % kv for kv in sorted(counts.items()))))
    return 1 if any(r["status"] == "BROKEN" for r in results) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
