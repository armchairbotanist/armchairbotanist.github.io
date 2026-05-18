# Armchair Botanist

A static, GitHub Pages-friendly explorer for a source-cited plant clade tree.

## Features

- Expandable left-to-right plant tree.
- Search across clades, orders, families, curated example genera, and broader taxon lookups for typed genus/species names.
- Persistent right-side fact pane that updates only when a node's `i` button is clicked.
- Resizable fact pane: drag the divider left/right on desktop or up/down on phone-sized layouts.
- Wikipedia overview text when available.
- Research-grade iNaturalist photos when an exact order, family, genus, or explicit `photoTaxon` match is available.
- Node-specific cited facts only.
- Simpson 2019 Chapter 3 through Chapter 8 figure/caption blocks for covered plant clades, orders, families, and selected example genera.
- Clickable figure thumbnails that open in a larger viewer.
- Search-result clicks reveal and highlight the matched tree node.
- Daily and random phylogeny guessing game at `/daily/`.

## Data

The tree is defined in `plant-tree-data.js` as plain JavaScript data so the structure can be reviewed directly.

Each node can include:

- `id`
- `name`
- `rank`
- `source`
- optional `description`
- optional node-specific `facts`
- optional `figureIds` pointing to source figure blocks in the top-level `figures` catalog
- optional explicit `photoTaxon`
- optional `searchAliases` for source-name mismatches
- optional `children`

The intended shape is:

```text
Clade
└── Subclade
    └── Order
        └── Family
            └── Optional example genera
```

The vascular-plant backbone is complete at order and family level for the selected sources. Genera are optional curated examples, not complete family inventories.

## Sources

The structural tree currently uses:

- APG IV for flowering plant clades, all 64 orders, and all 416 families.
- PPG I for lycophytes and ferns: 3 lycophyte orders/3 families and 11 fern orders/48 families.
- Christenhusz et al. 2011 for extant gymnosperms: 8 orders and 12 families.
- Bryophyte Nomenclator and broad botanical consensus for the current bryophyte seed scaffold.

The fact pane can also use Wikipedia summaries, iNaturalist photos, and explicitly cited node-specific facts from sources listed in `plant-tree-data.js`. These enrich the page but do not define the tree structure.

The Simpson 2019 PDF excerpts are represented as local images in `assets/simpson-2019/ch3/` through `assets/simpson-2019/ch8/` plus caption metadata in the top-level `figures` catalog. APG IV name changes are handled with explicit `searchAliases`, for example `Illiciaceae` mapping to APG IV `Schisandraceae`, `Agavaceae` and `Themidaceae` mapping to `Asparagaceae`, `Myrsinaceae` mapping to `Primulaceae`, and `Dipsacaceae`/`Valerianaceae` mapping to `Caprifoliaceae`.

## Fact Pane Rules

The fact pane should show:

- node name
- rank
- tree path
- overview text
- optional curated node-specific facts
- optional source figures and extracted captions
- optional photos
- sources at the bottom

The fact pane should not show internal data fields, parent/child debug metadata, inherited broad facts, generic textbook anatomy notes, heuristic identification text, or loose photo searches for informal clades.

## Data Checks

The repository intentionally keeps the data in `plant-tree-data.js` instead of a generated bundle so it can be read directly. For manual checks, confirm:

- APG IV angiosperms contain 64 orders and 416 families.
- PPG I lycophytes contain 3 orders and 3 families.
- PPG I ferns contain 11 orders and 48 families.
- Christenhusz et al. 2011 gymnosperms contain 8 orders and 12 families.
- Bryophytes are still a small scaffold, not a complete bryophyte classification.

## Fact Pane Links

The fact pane should make displayed enrichment easy to verify:

- Wikipedia overview text links to its Wikipedia page.
- Photo thumbnails link to their iNaturalist observation pages.
- Curated facts link to their source pages.
- Simpson figure captions cite the local Simpson 2019 source record.

## Code Layout

- `app.js` is the small startup file.
- `js/core.js` holds shared state, DOM references, and utilities.
- `js/config.js` holds maintainable app constants such as resize limits, search limits, source IDs, and fallback version.
- `js/tree-view.js` defines the `TreeView` class for the expandable tree and SVG edges.
- `js/details-pane.js` defines the `DetailsPane` class for the fact pane, enrichment, source figures, image viewer, and pane resizing.
- `js/search.js` defines the `SearchController` class for local and taxon-backed search.
- Design colors live as CSS custom properties at the top of `styles.css`.

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
- `daily/` contains the family-level plant guessing game.
- `assets/` contains local image assets used by source figure blocks.
- `js/` contains the modular browser code.
- `app.js` starts the app.

Current visible site version: `2.17`.
