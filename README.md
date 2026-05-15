# Armchair Botanist

A static, GitHub Pages-friendly explorer for a source-cited plant clade tree.

## Features

- Expandable left-to-right plant tree.
- Search across clades, orders, families, and example genera.
- Persistent right-side fact pane that updates only when a node's `i` button is clicked.
- Portrait phone notice recommending landscape mode.
- Wikipedia overview text when available.
- Research-grade iNaturalist photos when an exact order, family, genus, or explicit `photoTaxon` match is available.
- Node-specific cited facts only.

## Data

The tree is defined in `plant-tree-data.js` as plain JavaScript data so the structure can be reviewed directly.

Each node can include:

- `id`
- `name`
- `rank`
- `source`
- optional `description`
- optional node-specific `facts`
- optional explicit `photoTaxon`
- optional `children`

The intended shape is:

```text
Clade
└── Subclade
    └── Order
        └── Family
            └── Example genera
```

The genera are examples, not complete family inventories.

## Sources

The structural tree currently uses:

- APG IV for flowering plant clades, orders, and families.
- PPG I for lycophytes and ferns.
- Christenhusz et al. 2011 for gymnosperms.
- Bryophyte Nomenclator and broad botanical consensus for the current bryophyte seed scaffold.

The fact pane can also use Wikipedia summaries, iNaturalist photos, and explicitly cited node-specific facts from sources listed in `plant-tree-data.js`. These enrich the page but do not define the tree structure.

## Fact Pane Rules

The fact pane should show:

- node name
- rank
- tree path
- overview text
- optional curated node-specific facts
- optional photos
- sources at the bottom

The fact pane should not show internal data fields, parent/child debug metadata, inherited broad facts, generic textbook anatomy notes, heuristic identification text, or loose photo searches for informal clades.

## Verification

Run:

```sh
node scripts/validate-plant-tree.mjs
```

The validator checks that:

- every node has a valid rank and source
- every source has a citation and URL
- every child reference exists
- the tree has no cycles
- every node is reachable from the root
- orders contain family examples
- families contain example genera
- genera do not contain children

## Fact Pane Links

The fact pane should make displayed enrichment easy to verify:

- Wikipedia overview text links to its Wikipedia page.
- Photo thumbnails link to their iNaturalist observation pages.
- Curated facts link to their source pages.

## Local Preview

You can open `index.html` directly in a browser.

For the most accurate GitHub Pages-style preview, run:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

For the username `armchairbotanist`, create a public repository named exactly:

```text
armchairbotanist.github.io
```

Push the repository files to the root. GitHub Pages will serve the site at:

```text
https://armchairbotanist.github.io/
```

## Files

- `.nojekyll` keeps GitHub Pages from running Jekyll processing.
- `index.html` contains the page structure.
- `styles.css` contains the visual design.
- `plant-tree-data.js` contains the source-cited tree data.
- `app.js` renders and searches the tree.
- `scripts/validate-plant-tree.mjs` verifies the tree structure.
