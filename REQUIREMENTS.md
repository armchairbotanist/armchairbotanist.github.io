# Armchair Botanist Website Requirements

## Purpose

Armchair Botanist is a static website for exploring plant relationships through a clean, expandable, source-cited clade tree.

## Core Experience

- Show a top-down plant tree with the root at the top and children growing downward.
- Use the structure `Clade -> Subclade -> Order -> Family -> Example genera`.
- Keep the interface focused on the tree, search, zoom controls, and node details.
- Support zoom in, zoom out, reset, and fit-to-view controls.
- Work comfortably on desktop and phone screens.

## Search

- Let users search for clades, orders, families, and example genera.
- Selecting a search result should expand the path to that node and focus it in the tree.
- Search should clearly explain when no match is available in the current curated dataset.

## Node Details

- Let users open a detail panel for any visible node.
- Show name, rank, path, child count, and classification source.
- Add a readable overview from Wikipedia or other reliable references when available.
- Include images when available.
- Include practical identification information when available, such as flower, leaf, fruit, habit, and habitat traits.
- Keep classification sources separate from optional enrichment sources.

## Data Requirements

- No WFO dependency.
- The tree must be directly reviewable in code.
- Every node must point to a documented source.
- The data must pass a validation script before publishing.
- Orders must include family examples.
- Families must include example genera.
- Example genera are not complete inventories and should be described as examples.

## Publishing

- The site must run as static files on GitHub Pages.
- Target repository: `armchairbotanist.github.io`.
- Target URL: `https://armchairbotanist.github.io/`.
- The repository should contain the runtime files, data file, validator, and documentation needed to audit the tree.
