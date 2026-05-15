# Sources

This file documents the classification sources used by `plant-tree-data.js`.

## APG IV

Used for flowering plant clades, orders, and families.

- Angiosperm Phylogeny Group. 2016. *An update of the Angiosperm Phylogeny Group classification for the orders and families of flowering plants: APG IV*. Botanical Journal of the Linnean Society 181: 1-20.
- URL: https://academic.oup.com/botlinnean/article/181/1/1/2416499

## PPG I

Used for lycophytes and ferns.

- Pteridophyte Phylogeny Group. 2016. *A community-derived classification for extant lycophytes and ferns*. Journal of Systematics and Evolution 54: 563-603.
- URL: https://www.uvm.edu/~dbarring/209/ppgI2016.pdf

## Gymnosperms

Used for the current gymnosperm seed scaffold.

- Christenhusz, M. J. M., Reveal, J. L., Farjon, A., Gardner, M. F., Mill, R. R. & Chase, M. W. 2011. *A new classification and linear sequence of extant gymnosperms*. Phytotaxa 19: 55-70.
- URL: https://phytotaxa.mapress.com/pt/article/view/phytotaxa.19.1.3

## Bryophytes

Used for the current moss seed scaffold.

- Bryophyte Nomenclator. *A Classification of the Bryophyta*.
- URL: https://www.bryonames.org/nomenclator?group=Bryophyta

The liverwort and hornwort portions currently use broad botanical consensus placeholders. They should be upgraded with more specific references before treating that section as fully audited.

## Verification Notes

The validator checks internal consistency and source coverage. It does not parse papers automatically. Paper-to-data extraction is a curated process:

1. Read the classification table or hierarchy from the source.
2. Enter the corresponding node or edge in `plant-tree-data.js`.
3. Attach the relevant source key.
4. Run `node scripts/validate-plant-tree.mjs`.
5. Review the rendered tree.

## Display Enrichment Sources

These sources enrich the fact pane but do not define the tree structure.

- iNaturalist API for research-grade observation photos. The app resolves an exact taxon ID before requesting observations; informal labels such as "Bryophytes" do not use loose photo search.
- iNaturalist API reference: https://www.inaturalist.org/pages/api%2Breference
- Wikipedia REST summary API for short overview text: https://en.wikipedia.org/api/rest_v1/
- Britannica Asteraceae-related flower-head reference: https://www.britannica.com/science/flower
- Britannica orchid morphology: https://www.britannica.com/plant/orchid/Characteristic-morphological-features

Fact-pane notes should be node-specific. Broad inherited notes such as generic plant anatomy definitions or classroom trait summaries are intentionally excluded.
