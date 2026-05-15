# Data Source

## Source Strategy

This project now uses a curated, source-cited clade tree rather than a WFO snapshot.

The tree data lives in `plant-tree-data.js`. Every node points to a source key in the same file. The validator fails if a node is missing its source or if a source is missing citation metadata.

## What The Tree Represents

The displayed tree is an educational clade atlas. It is not a branch-length phylogenetic tree and it is not intended to be a complete taxonomic checklist.

The structure follows:

```text
Clade
└── Subclade
    └── Order
        └── Family
            └── Example genera
```

Orders and families are intended to be source-verifiable. Genera are included as recognizable examples under each family, not as exhaustive lists.

## Current Source Boundaries

- Flowering plant clades, orders, and families: APG IV.
- Lycophytes and ferns: PPG I.
- Gymnosperms: Christenhusz et al. 2011.
- Bryophytes: current seed scaffold uses Bryophyte Nomenclator plus broad botanical consensus and should be strengthened with more precise liverwort/hornwort references.
- Wikipedia enrichment in the details panel is display-only and does not define the tree structure.
- iNaturalist photos are display-only enrichment from research-grade observations when available. Informal clade/grade labels do not use loose photo search; only orders, families, genera, or explicitly audited `photoTaxon` mappings may request photos.
- Curated facts are display-only notes stored in `plant-tree-data.js`. They must be specific to the selected node, cite a source that the validator can check, and must not be inherited from ancestor nodes.
- Broad classroom anatomy notes, generic flower-part definitions, and heuristic identification notes are intentionally excluded from the fact pane.

## Verification

Run:

```sh
node scripts/validate-plant-tree.mjs
```

Passing validation means the data is internally consistent and source-cited. It does not mean every scientific relationship has been independently audited by a botanist. The next quality step is to add per-edge source notes for the larger clade placements.
