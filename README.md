# metrocity2024
Demo: https://cafread.github.io/metrocity2024/

This is one piece of location modelling for business travel, using quadtrees, tile generation, string compression, canvas drawing, leaflet, d3 and a whole lot of optimisations to make a neat little front end for editing the 'where' that can be displayed on geolocated data.

Generally speaking, someone travelling to New York City does not want to see their location details in reports as a mix of Queens, Manhattan, NYC, New York etc.  It's very possible for different individuals to have different opinions about where boundaries should be, but difficult to convert that to something concrete without a supporting layer.  This serves as that layer, letting you paint exactly what you mean when you say 'Berlin'.

Generated tiles were put through png gauntlet to further minimise their size and make what is very complex under the hood as responsive as possible.

Zoom isn't possible as implemented - it would make the tileset much larger and was chosen to be appropriate for the task.  The output from this is intended to show what people feel is right, not to define boundaries accurate to within a few metres.  All processing is done in browser, so limits are also necessary out of respect for the end user.

## TopoJSON pipeline (experimental)

Work in progress to replace the PNG tiles with one TopoJSON file, so that neighbouring cities share boundary arcs and an edit to a border moves both sides.

The scripts run on [Deno](https://deno.com/):

1. `tiles_to_topojson.ts` traces `tiles/*.png` into `cities.geojson` (3,721 cities, about 29 MB), each with its id, name, population and GeoNames centre. A ring inside another ring of the same city becomes a hole. It needs a large heap: `deno run --allow-read --allow-write --v8-flags=--max-old-space-size=16384 tiles_to_topojson.ts`
2. `sanitise_multipolygons.ts` keeps the largest polygon of each city: `deno run --allow-read --allow-write sanitise_multipolygons.ts cities.geojson cities_sanitized.geojson`
3. `topofy.ts` quantises and simplifies that into the TopoJSON, keeping at least four vertices in every ring so tiny cities and holes survive: `deno run --allow-read --allow-write topofy.ts --in cities_sanitized.geojson --out cities_sanitized.topojson`

Only `cities_sanitized.topojson` is committed; the intermediate files are ignored and can be rebuilt with the steps above.

`viewer.html` is a Leaflet editor for `cities_sanitized.topojson`, as a proof of the new editing UI. In edit mode you can drag, add and delete vertices (a vertex shared with a neighbour moves in both cities), snap to neighbouring cities or country borders, rename a city, change its population, add a new city and delete one. Every action can be undone and redone.

A new city is picked from GeoNames, not typed: the editor reads `res/cities5000.txt`, and the place supplies the id, name, population and centre. A place already on the map cannot be added again. Names follow the mapped cities, with a state code in the countries that carry one (AU, BR, CA, CN, IN, JP, US). The codes come from `res/state_codes.json`, which lists them by GeoNames region code. `build_state_codes.ts` builds that file by matching the region names in `res/admin1CodesASCII.txt` to an export of the ClickHouse table `data_mas0000.location_states`, and refuses to write it if a mapped city disagrees. A place in a region the table lacks is not offered; that is four places in two Indian territories whose old GeoNames codes have been retired.

A changed city is pending until it is committed. Commit accepts its current state, after which Revert returns to that state instead of the file's; Uncommit takes a commit back. Pending and committed changes are kept in the browser's localStorage. They can be exported as a change list or as a complete new TopoJSON file, or pushed to the remote once logged in. The user defaults to `anon`; login is mocked (a name, no password) and so is the remote.

Run it with `deno run --allow-net --allow-read --allow-write=dev.log,dev_pushes.jsonl dev_server.ts` and open http://localhost:4507. When the page is served from localhost it runs in development mode: uncaught errors and console warnings are shown in the sidebar, and they and each edit action are appended to `dev.log`. The same server is the mock remote: it refuses a push from `anon` and appends an accepted one to `dev_pushes.jsonl` without applying it to the data.

Against the tiles, the polygons give the same city for 99.38% of painted pixels (77.6 million). Four cities fall below 90%: Haifa, Macau and two of 10 and 13 pixels.

Two scripts in `tests/` check the work:

- `tests/e2e.ts` drives the editor through headless Chrome with real mouse and keyboard input (61 checks). It needs the dev server running: `deno run -A --no-lock tests/e2e.ts`
- `tests/audit_tiles.ts` rasterises the polygons back onto the tile grid and reports the agreement figures quoted above.

Known gaps:

- Step 2 drops every polygon of a city except its largest: 684 small detached pieces in 232 cities.
- The editor does not stop polygons from overlapping.
- Login and the remote are mocks. A pushed change is recorded by the dev server but the served data does not change.

`AGENTS_HISTORY.md` and `agent_plans.md` are the logs kept by the AI agents that wrote this, including the remaining plans.
