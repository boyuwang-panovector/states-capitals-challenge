# TrailTrek Map Repair Findings

The current custom GeoJSON source renders one or more state paths incorrectly under the mobile map projection. Public browser measurement confirmed that the Virginia path expands to roughly 436 by 228 CSS pixels, obscuring other states and invalidating the learning map.

The repair will replace this unverified geometry file with a standard U.S. atlas topology, drive state identity through official FIPS identifiers, and use verified longitude/latitude coordinates for capital markers. The map will retain a compact, mobile-safe full-U.S. view; selecting a state will reveal an expanded discovery panel with the capital marker, landmark imagery, source-linked facts, and visible credits.

## Local repair validation

The local production preview now renders all 50 Census-derived state shapes and capital-marker abbreviations without the prior oversized Virginia geometry. The selected state’s full name, capital, landmark photo, fact, history note, and source links render in the adjacent discovery panel. The labels are intentionally being enlarged further for the narrow map panel so learners can more easily identify states at mobile scale.

## Final renderer replacement

The geography-package renderer left state `<path>` elements empty under this project’s build. The final implementation renders topology features with D3 `geoPath(geoAlbersUsa())` directly into SVG paths. This produced visible, clickable state geometry and a verified Texas selection in the production preview.

The repaired public site was also checked after deployment: the browser exposed all 50 state shapes as interactive paths, while the local click test selected Texas and updated the panel to Austin, The Alamo, its photo credit, and linked facts.
