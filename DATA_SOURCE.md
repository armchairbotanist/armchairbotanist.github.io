# Data Source

## World Flora Online

This project uses World Flora Online as the source for plant classification data.

- Website: https://www.worldfloraonline.org/
- Plant List: https://list.worldfloraonline.org/
- GraphQL endpoint: https://list.worldfloraonline.org/gql.php
- Configured classification release: `2025-06`
- Root concept used by the app: `wfo-4100001250-2025-06` (`Plantae Haeckel`)

## What The Tree Represents

The displayed tree is the WFO taxonomic classification. It is scientific, citable taxonomy from WFO, but it is not a branch-length phylogenetic tree.

The checked-in data snapshot is generated from WFO `TaxonConcept.hasPart` relationships. The browser loads `app.bundle.js`, which contains the WFO snapshot and app code in one file, so it can work on GitHub Pages and when `index.html` is opened from disk.

## Source Boundary

Tree structure and node metadata should come from WFO only:

- concept IDs
- scientific names
- author strings
- ranks
- parent/child relationships
- WFO paths
- WFO stable URLs
- WFO citation text when available

If photos, Wikipedia extracts, or other enrichment are added later, they should be treated as a separate non-taxonomic display layer and clearly labeled as not part of the WFO tree data.

## Published Bundle

The GitHub Pages repository intentionally publishes only the browser-ready bundle, `app.bundle.js`, rather than intermediate JSON chunks or local generation scripts.

For this snapshot, the bundle includes the first 4 WFO levels below `Plantae`. Increasing the depth later will increase the bundle size.
