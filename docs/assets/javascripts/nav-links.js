/**
 * nav-links.js — fills "Nav links" component placeholders with a live, nested
 * list of links to every page under a part of the site nav.
 *
 * Each placeholder is an empty `<div class="mb-nav-links" data-nav-path="…">`
 * authored into a page by the more-buttons extension. The full nav tree is baked
 * into every page as a hidden `<template id="__mb-nav-tree">` by overrides/main.html
 * (derived from zensical.toml at build time). At runtime we walk that tree to the
 * section named by the path and clone its subtree as nested <ul>s of new-tab links.
 *
 * Because the page stores only the path, editing zensical.toml + rebuilding the
 * site updates every list without re-editing any page. If the path no longer
 * resolves to a section, the placeholder is left empty (silent).
 */
(function () {
  'use strict';

  // MUST match the extension's navToml.js slugify so paths resolve identically.
  function slugify(title) {
    return String(title)
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // The first direct-child <ul> of an <li> (a section's children), or null.
  function directChildUl(li) {
    for (var k = 0; k < li.children.length; k++) {
      if (li.children[k].tagName === 'UL') return li.children[k];
    }
    return null;
  }

  // Walk the hidden tree's <ul> to the <li> SECTION named by the slug path, or
  // null. Each segment must match a section (an <li> that has its own <ul>).
  function findSection(rootUl, path) {
    var segs = String(path || '').split('/').map(slugify).filter(Boolean);
    if (!segs.length || !rootUl) return null;
    var level = rootUl;
    var match = null;
    for (var i = 0; i < segs.length; i++) {
      match = null;
      for (var j = 0; j < level.children.length; j++) {
        var li = level.children[j];
        if (li.tagName !== 'LI') continue;
        if (!directChildUl(li)) continue; // only sections can be descended
        if (slugify(li.getAttribute('data-title') || '') === segs[i]) { match = li; break; }
      }
      if (!match) return null;
      level = directChildUl(match);
      if (!level) return null;
    }
    return match;
  }

  // Clone a hidden-tree <ul> into a rendered nested list: pages → new-tab links,
  // sections → a heading span plus their own nested list.
  function renderList(srcUl) {
    var ul = document.createElement('ul');
    ul.className = 'mb-nav-links__list';
    for (var i = 0; i < srcUl.children.length; i++) {
      var src = srcUl.children[i];
      if (src.tagName !== 'LI') continue;
      var li = document.createElement('li');
      var title = src.getAttribute('data-title') || '';
      var url = src.getAttribute('data-url');
      if (url) {
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = title;
        li.appendChild(a);
      } else {
        var span = document.createElement('span');
        span.className = 'mb-nav-links__section';
        span.textContent = title;
        li.appendChild(span);
      }
      var childUl = directChildUl(src);
      if (childUl) li.appendChild(renderList(childUl));
      ul.appendChild(li);
    }
    return ul;
  }

  function hydrate() {
    var tpl = document.getElementById('__mb-nav-tree');
    if (!tpl) return;
    var root = (tpl.content || tpl).querySelector('ul');
    if (!root) return;
    var placeholders = document.querySelectorAll('.mb-nav-links[data-nav-path]');
    for (var i = 0; i < placeholders.length; i++) {
      var ph = placeholders[i];
      ph.innerHTML = ''; // idempotent: clear before (re)injecting
      var section = findSection(root, ph.getAttribute('data-nav-path'));
      if (!section) continue; // unresolved path → leave empty
      var sub = directChildUl(section);
      if (sub) ph.appendChild(renderList(sub));
    }
  }

  // Material/Zensical instant navigation swaps page content without a full reload;
  // re-run on each document change. Fall back to a one-shot run otherwise.
  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(hydrate);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
  } else {
    hydrate();
  }
})();
