import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
import elkLayouts from 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0/dist/mermaid-layout-elk.esm.min.mjs';

// Register the ELK layout engine so diagrams can opt in via `layout: elk`.
// Zensical loads Mermaid 11 natively but does not bundle ELK, so this custom
// loader is required for ELK support.
mermaid.registerLayoutLoaders(elkLayouts);

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
});

// Important: necessary to make it visible to Zensical
window.mermaid = mermaid;
