# Armchair Botanist

A static, GitHub Pages-friendly explorer for the World Flora Online plant classification.

## Data Source

The checked-in tree snapshot is generated from the World Flora Online Plant List GraphQL API:

```text
https://list.worldfloraonline.org/gql.php
```

Current configured release:

```text
WFO Classification 2025-06
```

The app starts at the WFO concept `Plantae Haeckel`:

```text
wfo-4100001250-2025-06
```

This is a WFO taxonomic classification tree, not an inferred branch-length phylogeny. See [DATA_SOURCE.md](./DATA_SOURCE.md) for source notes.

## Updating WFO Data

The published site uses `app.bundle.js`, which contains the WFO snapshot and the app code in one file. The local generation scripts and intermediate JSON chunks are intentionally ignored by Git so the GitHub Pages repository stays small and focused.

To publish a newer snapshot later, regenerate `app.bundle.js` locally, then commit the updated bundle.

## Local Preview

You can open `index.html` directly in a browser. The page loads `app.bundle.js`, which contains both the app code and the bundled WFO snapshot, so it does not need local JSON fetches.

For the most accurate GitHub Pages-style preview, run a small local server from this folder:

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

Push these files to the repository root. GitHub Pages will serve the site at:

```text
https://armchairbotanist.github.io/
```

## Files

- `index.html` contains the page structure.
- `styles.css` contains the visual design.
- `app.bundle.js` is the browser-loaded bundle containing the WFO snapshot plus app code.
- `DATA_SOURCE.md` documents the WFO source boundary.
- `PLAN.md` contains the working roadmap.
