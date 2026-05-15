# Armchair Botanist

A static, GitHub Pages-friendly explorer for a source-cited plant clade tree.

## Data Model

The tree is defined in `plant-tree-data.js`. It is intentionally plain JavaScript data so the structure can be reviewed directly.

Each node has:

- `id`
- `name`
- `rank`
- `source`
- optional `description`
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

## Sources

The current seed tree uses:

- APG IV for flowering plant clades, orders, and families.
- PPG I for lycophytes and ferns.
- Christenhusz et al. 2011 for gymnosperms.
- Bryophyte Nomenclator and broad botanical consensus for the current bryophyte seed scaffold.

See `SOURCES.md` for details.

## Current Features

- Expandable top-down plant tree.
- Search across clades, orders, families, and example genera.
- Zoom in, zoom out, reset, and fit-to-view controls.
- Details panel with source citation and optional Wikipedia enrichment.
- Static files only, suitable for GitHub Pages.

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

- `index.html` contains the page structure.
- `styles.css` contains the visual design.
- `plant-tree-data.js` contains the source-cited tree data.
- `app.js` renders and searches the tree.
- `scripts/validate-plant-tree.mjs` verifies the tree structure.
- `SOURCES.md` explains the source strategy.
- `PLAN.md` contains the working roadmap.
- `REQUIREMENTS.md` summarizes product requirements.
