# TrailTrek State Discovery Sources

## Map geometry

TrailTrek uses `states-10m.json` from [topojson/us-atlas](https://github.com/topojson/us-atlas), a convenient redistribution of U.S. Census Bureau cartographic boundary data. The file is rendered with the standard D3 `geoAlbersUsa` projection and state FIPS identifiers, so states, Alaska, and Hawaii use a consistent full-U.S. atlas layout.

## Capital markers

Capital names and decimal-degree reference coordinates are from [xFront: U.S. States and Capitals with Coordinates](https://www.xfront.com/us_states/). The map labels this source directly as `Capital coordinates: xFront`.

## State discovery facts and imagery

Each state record includes a linked primary educational or public-history fact source and a linked Wikimedia Commons image page. Individual image credits and license notes appear beside the active landmark image in the discovery panel. The complete, machine-readable source references, fact text, and credits are retained in `client/src/data/stateDiscovery.ts`.

## Interaction validation

The direct D3 path implementation was checked in a production preview: all 50 state paths render as interactive SVG paths, and selecting Texas updated the panel to Austin, The Alamo, cited facts, and image credit. This replaces the earlier renderer that created empty or malformed state path data on mobile.
