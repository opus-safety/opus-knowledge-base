import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
import elkLayouts from 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0/dist/mermaid-layout-elk.esm.min.mjs';

mermaid.registerLayoutLoaders(elkLayouts);

// Lucide icon pack so diagrams can reference `lucide:bell` etc. via the
// @{ icon: ... } node syntax. Loaded on demand from the hosted Iconify pack
// (full ~1,900-icon set, cached by the browser after first fetch).
mermaid.registerIconPacks([
  {
    name: 'lucide',
    loader: () =>
      fetch('https://unpkg.com/@iconify-json/lucide@1/icons.json').then((r) => r.json()),
  },
]);

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  layout: "elk",
});

// Important: necessary to make it visible to Zensical
window.mermaid = mermaid;
