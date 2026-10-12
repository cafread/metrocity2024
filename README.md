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

`viewer.html` is a Leaflet editor for `cities_sanitized.topojson`, as a proof of the new editing UI. In edit mode you can drag, add and delete vertices (a vertex shared with a neighbour moves in both cities), snap to neighbouring cities or country borders, rename a city, change its population, draw a new city and delete one. Every action can be undone and redone, each changed city can be reverted on its own, and Revert all restores the loaded data. Changes are kept in the browser's localStorage and can be exported as a change list or as a complete new TopoJSON file.

Run it with `deno run --allow-net --allow-read --allow-write=dev.log dev_server.ts` and open http://localhost:4507. When the page is served from localhost it runs in development mode: uncaught errors, console warnings and each edit action are shown in the sidebar and appended to `dev.log`.

Against the tiles, the polygons give the same city for 99.26% of painted pixels (77.6 million). Five cities fall below 90%, three of them only 1 to 13 pixels in size.

Known gaps:

- The tracer writes a hole (an enclave of another city, or unpainted pixels) as a separate filled polygon instead of an interior ring. 69 cities are affected, and step 3 then drops those rings, which fills the hole.
- The editor does not stop polygons from overlapping, and a new city has a provisional negative id.
- Nothing is sent to a server yet; saving goes through the export buttons.

`AGENTS_HISTORY.md` and `agent_plans.md` are the logs kept by the AI agents that wrote this, including the remaining plans.
