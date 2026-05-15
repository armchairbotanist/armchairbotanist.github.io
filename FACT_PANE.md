# Fact Pane

The fact pane is the always-visible right side of the Armchair Botanist website. It updates only when the user clicks the `i` button on a visible node.

## Layout

The pane should read in this order:

1. Node name.
2. Rank.
3. Tree path.
4. Overview text.
5. Optional curated node-specific facts.
6. Optional photo grid.
7. Source links and citations at the bottom.

The pane should avoid section headings unless a future design clearly needs them. The content should feel like a compact field-guide note, not a database record.

## Include

- A short, readable overview from Wikipedia when available.
- The node's curated `description` when present.
- Photos from iNaturalist only when the app resolves an exact order, family, genus, or explicitly audited `photoTaxon` match.
- Curated facts only when they are specific to the selected node and cite a source in `plant-tree-data.js`.
- Classification source and Wikipedia links at the bottom.

## Exclude

- Generic flower-part explanations.
- Generic textbook anatomy definitions unless a later node-specific source makes the feature genuinely central to that node.
- Facts inherited from ancestor clades.
- Heuristic identification notes.
- Internal data fields such as node ID, parent, child count, children shown, or classification debug metadata.
- Loose photo searches for informal clade or grade labels.

## Data Contract

Every fact must use this shape:

```js
{ text: "Short node-specific statement.", source: "source_key" }
```

The `source_key` must exist in `window.PLANT_TREE_DATA.sources`, and the source must include a label, citation, and URL. Run `node scripts/validate-plant-tree.mjs` after changing fact data.
