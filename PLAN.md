# Armchair Botanist Plan

## Goal

Build a static GitHub Pages site for exploring plants through a source-cited clade tree.

## Data Rules

- Do not depend on WFO snapshot data.
- Keep the tree in a directly reviewable data file: `plant-tree-data.js`.
- Cite every node with a source key.
- Use APG IV, PPG I, gymnosperm classification literature, and bryophyte classification references as structural authorities.
- Treat example genera as examples, not complete inventories.
- Validate the data before publishing.

## Current Phase

- Render a curated seed tree from `plant-tree-data.js`.
- Show the intended hierarchy: clade/subclade -> order -> family -> example genera.
- Search across all included nodes.
- Show source citation in the details panel.
- Verify data with `scripts/validate-plant-tree.mjs`.

## Near-Term Improvements

- Add per-edge citations, not just per-node citations.
- Strengthen liverwort and hornwort references.
- Expand APG IV coverage toward all flowering plant orders and families.
- Mark incomplete branches clearly in the UI.
- Add a generated source audit table.
- Add keyboard navigation for tree traversal.
- Improve mobile zoom and pan controls.

## Publishing

Publish from a public repository named:

```text
armchairbotanist.github.io
```

Target URL:

```text
https://armchairbotanist.github.io/
```
