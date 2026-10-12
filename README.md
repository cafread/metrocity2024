# metrocity2024
Demo: https://cafread.github.io/metrocity2024/

This is one piece of location modelling for business travel, using quadtrees, tile generation, string compression, canvas drawing, leaflet, d3 and a whole lot of optimisations to make a neat little front end for editing the 'where' that can be displayed on geolocated data.

Generally speaking, someone travelling to New York City does not want to see their location details in reports as a mix of Queens, Manhattan, NYC, New York etc.  It's very possible for different individuals to have different opinions about where boundaries should be, but difficult to convert that to something concrete without a supporting layer.  This serves as that layer, letting you paint exactly what you mean when you say 'Berlin'.

Generated tiles were put through png gauntlet to further minimise their size and make what is very complex under the hood as responsive as possible.

Zoom isn't possible as implemented - it would make the tileset much larger and was chosen to be appropriate for the task.  The output from this is intended to show what people feel is right, not to define boundaries accurate to within a few metres.  All processing is done in browser, so limits are also necessary out of respect for the end user.

## TopoJSON pipeline (experimental)

Work in progress to replace the PNG tiles with one TopoJSON file, so that neighbouring cities share boundary arcs and an edit to a border moves both sides.

The scripts run on [Deno](https://deno.com/):

1. `tiles_to_topojson.ts` traces `tiles/*.png` into `cities.geojson` (3,721 cities, about 29 MB). It needs a large heap: `deno run --allow-read --allow-write --v8-flags=--max-old-space-size=16384 tiles_to_topojson.ts`
2. `topofy.ts` quantises and simplifies that into `cities.topojson`: `deno run --allow-read --allow-write topofy.ts`
3. `sanitise_multipolygons.ts` keeps the largest polygon of each city: `deno run --allow-read --allow-write sanitise_multipolygons.ts cities.topojson cities_sanitized.topojson`

Only `cities_sanitized.topojson` is committed; the two intermediate files are ignored and can be rebuilt with the steps above.

`viewer.html` is a Leaflet editor for `cities_sanitized.topojson`. It fetches the file, so it needs a local web server, for example `deno run --allow-net --allow-read jsr:@std/http/file-server --port 4507` and then http://localhost:4507/viewer.html.

Known gaps:

- The tracer writes a hole (an enclave of another city, or unpainted pixels) as a separate filled polygon instead of an interior ring. 69 cities are affected, and step 3 then drops those rings, which fills the hole.
- The viewer saves edits to the browser's localStorage only. There is no export and the Push button is a stub.

`AGENTS_HISTORY.md` and `agent_plans.md` are the logs kept by the AI agents that wrote this, including the remaining plans.
