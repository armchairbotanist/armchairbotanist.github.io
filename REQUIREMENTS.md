# Armchair Botanist Website Requirements

## Purpose

Armchair Botanist is a static website for exploring plant relationships through a clean, expandable, source-cited clade tree.

## Core Experience

- Show a left-to-right plant tree with the root on the left and children growing rightward.
- Use the structure `Clade -> Subclade -> Order -> Family -> Example genera`.
- Keep the interface focused on the tree, search, and the always-visible fact pane.
- Do not show zoom controls or orientation settings in the current UI.
- Work comfortably on desktop and phone screens.

## Search

- Let users search for clades, orders, families, and example genera.
- Selecting a search result should expand the path to that node and focus it in the tree.
- Search should clearly explain when no match is available in the current curated dataset.

## Node Details

- Let users update the fact pane for any visible node by clicking that node's `i` button.
- Do not update the fact pane on ordinary expand/collapse clicks or search focus.
- Show name, rank, and tree path.
- Put the overview above photos.
- Put source links at the bottom.
- Add a readable overview from Wikipedia when available, plus the node's curated description when present.
- Include images only from exact or audited taxon matches.
- Include curated facts only when they are specific to the selected node and cite a documented source.
- Exclude broad inherited textbook notes, generic flower-part explanations, internal IDs, child counts, parent labels, and shown-child metadata.
- Keep classification sources separate from optional enrichment sources.

## Data Requirements

- No WFO dependency.
- The tree must be directly reviewable in code.
- Every node must point to a documented source.
- Every displayed fact must point to a documented source.
- The data must pass a validation script before publishing.
- Orders must include family examples.
- Families must include example genera.
- Example genera are not complete inventories and should be described as examples.

## Publishing

- The site must run as static files on GitHub Pages.
- Target repository: `armchairbotanist.github.io`.
- Target URL: `https://armchairbotanist.github.io/`.
- The repository should contain the runtime files, data file, validator, and documentation needed to audit the tree.
