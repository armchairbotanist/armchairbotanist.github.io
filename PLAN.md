# Armchair Botanist Plan

## Goal

Build a static GitHub Pages site for exploring the World Flora Online plant classification as an expandable top-down tree.

## Data Rules

- Use World Flora Online as the exclusive source for tree structure and taxonomic node metadata.
- Generate checked-in static JSON snapshots from the WFO Plant List GraphQL API at `https://list.worldfloraonline.org/gql.php`.
- Pin the app to a named WFO release instead of silently drifting between classifications.
- Current release: `2025-06`.
- Current root: `Plantae Haeckel`, WFO concept `wfo-4100001250-2025-06`.
- Describe the tree as a WFO taxonomic classification, not as a branch-length phylogeny.

## Current Phase

- Load the browser bundle from `app.bundle.js`.
- Lazily reveal generated child data from the bundled WFO snapshot when a node is expanded.
- Show scientific names, rank, subtaxon count, WFO concept ID, WFO name ID, path, and WFO links in the details panel.
- Keep node URLs shareable with `?node=<WFO concept id>`.
- Preserve the clean top-down tree UI with zoom controls.

## Near-Term Improvements

- Add search using WFO `taxonNameSuggestion` or `taxonNameMatch`.
- Add a release selector when multiple WFO releases need to be compared.
- Add pagination or “load more” for nodes with more than 500 direct children.
- Generate more levels of the WFO tree once repository size and browsing ergonomics are clearer.
- Add clearer loading and error states for missing snapshot chunks.
- Add keyboard navigation for tree traversal.
- Add tests for WFO response normalization.

## Publishing

Publish from a public repository named:

```text
armchairbotanist.github.io
```

Target URL:

```text
https://armchairbotanist.github.io/
```
