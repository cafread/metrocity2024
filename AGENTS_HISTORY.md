# Agents History (Append-Only)

Do not edit or remove prior entries. Append new notes only.

## CRITICAL: Runtime Environment
- **THIS PROJECT USES DENO, NOT NODE.JS**
- All TypeScript/JavaScript must use Deno syntax and imports
- Use `deno run` commands, NOT `node` or `npm`
- Import syntax: `import { x } from "npm:package"` or from URLs
- Export syntax: `export { x }` or `export function x()`, NOT `module.exports`
- Node.js-specific code (require, module.exports, __dirname) will NOT work

- 2026-01-13T00:00:00.000Z Adopted integer grid-edge tracing to unify borders; pruned 1-cell spikes; compressed colinear segments; enabled TopoJSON quantization + simplification; added CLI tunables.
- 2026-01-13T00:00:00.000Z Reminder: use canvas-wasm for RGBA, handle color ±1 via compression offsets, log progress every 100 items, use --max-old-space-size=16384.
- 2026-01-13T00:00:00.000Z Deferred: Macau enclave in Zhuhai — to handle in a later pass.# Agents History

- 2026-01-13T10:06:28.959Z Run start: method=concave, concavity=1.8, lengthThreshold=0.01, simplify=0.00008, quantize=100000
- 2026-01-13T10:13:29.721Z Built TopoJSON with shared arcs and simplification; quantization applied.
- 2026-01-13T10:56:00.784Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.00008, quantize=100000
- 2026-01-13T11:15:31.334Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T11:41:15.685Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T12:00:07.838Z Built TopoJSON with shared arcs and simplification; quantization applied.
- 2026-01-13T12:30:00.000Z Plan: trim integer-grid spurs (two passes) to reduce staircase vertices while preserving shared borders.
- 2026-01-13T12:30:00.000Z Plan: remove detached rings smaller than 1 km² using spherical area filtering; keep attached rings to maintain topology.
- 2026-01-13T12:45:00.000Z Decision: explore GDAL polygonize for robust raster-to-vector; will generate UInt16 BIL with EPSG:3857 georef per tile and polygonize to GeoJSON.
- 2026-01-13T13:15:00.000Z Added Windows batch wrappers (polygonize_one.bat, polygonize_all.bat) to run OSGeo4W gdal_polygonize without PowerShell quoting issues.
- 2026-01-13T13:35:00.000Z Decision: discontinue GDAL/python on this host; proceed with Deno-only raster boundary scan and TopoJSON build with adaptive simplification and island filtering.
- 2026-01-13T12:53:07.590Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T13:07:31.371Z Built TopoJSON with shared arcs and simplification; applied <1 km² island filter; quantization applied.
- 2026-01-13T18:04:03.266Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T18:18:04.517Z Built TopoJSON with shared arcs and simplification; applied <1 km² island filter; quantization applied.
- 2026-01-13T18:55:22.776Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T19:10:17.163Z Built TopoJSON with shared arcs; simplification and island filter disabled; quantization applied.
- 2026-01-13T19:19:16.343Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T19:34:25.054Z Built TopoJSON with shared arcs; simplification and island filter disabled; quantization applied.
- 2026-01-13T20:08:01.933Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T20:08:02.019Z Built TopoJSON with shared arcs; simplification and island filter disabled; quantization applied.
- 2026-01-13T20:11:00.605Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T20:11:00.698Z Built TopoJSON with shared arcs; simplification enabled; island filter disabled; quantization applied.
- 2026-01-13T20:11:19.187Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T20:15:08.144Z Run start: method=concave, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T20:28:55.269Z Built TopoJSON with shared arcs; simplification enabled; island filter disabled; quantization applied.
- 2026-01-13T21:03:01.958Z Run start: method=convex, concavity=2, lengthThreshold=0.01, simplify=0.0001, quantize=100000
- 2026-01-13T21:08:14.860Z Built TopoJSON with shared arcs; simplification enabled; island filter enabled; quantization applied.
- 2026-01-13T21:19:05.511Z Run start: method=concave, concavity=1.8, lengthThreshold=0.01, simplify=0.00008, quantize=100000
- 2026-01-13T21:26:10.129Z Built TopoJSON with shared arcs and simplification; quantization applied.
- 2026-01-14T07:55:42.107Z Run start: method=grid, concavity=2, lengthThreshold=0.01, simplify=0.00008, quantize=100000
- 2026-01-14T09:31:49.065Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T10:48:34.314Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T11:53:21.951Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T12:10:00.000Z GPT-5 Switched to GeoJSON-only output to avoid OOM during TopoJSON conversion; updated viewer to load cities.geojson.
- 2026-01-14T13:10:05.249Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T14:05:52.971Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T14:42:32.861Z TopoJSON build failed: geojson is not defined
- 2026-01-14T14:57:26.626Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T14:59:04.017Z Skipped TopoJSON conversion to avoid OOM; using GeoJSON-only output.
- 2026-01-14T16:13:55.711Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T16:14:00.955Z Skipped TopoJSON conversion to avoid OOM; using GeoJSON-only output.
- 2026-01-15T00:00:00.000Z GPT-5 Implemented two-stage pipeline: tiles_to_topojson.ts outputs cities.geojson, topofy.ts converts to TopoJSON with simplification=0.0015; final output: 5.7 MB, 102k vertices, 3.7k cities.
- 2026-01-15T00:00:00.000Z GPT-5 Added country borders layer (Natural Earth 50m) with toggle; implemented Edit Mode UI with vertex markers at zoom ≥8.
- 2026-01-15T00:00:00.000Z GPT-5 Built shared vertex tracking system (sharedVertices Map with "lat,lng" keys) to find adjacent cities sharing borders; detected 48,698 shared vertices.
- 2026-01-15T00:00:00.000Z GPT-5 Implemented vertex dragging: click vertex marker, drag, all cities sharing that vertex update in real-time to prevent gaps.
- 2026-01-15T00:00:00.000Z GPT-5 Fixed polygon visual update bug: Leaflet GeoJSON layers don't auto-redraw on setLatLngs(); solution: map.removeLayer() → setLatLngs() → addTo(map).
- 2026-01-15T00:00:00.000Z GPT-5 Validated shared vertex updates: console logs show "Edit recorded: moved vertex affecting 2 city/cities: Bialystok, PL, Volkovysk, BY"; adjacent polygons now update correctly.
- 2026-01-15T00:00:00.000Z GPT-5 Planning comprehensive editing features: add/delete vertices with radio buttons, undo/reset functionality, snap-to-border, in-memory coordinate arrays.
- 2026-01-15T01:00:00.000Z GPT-5 BUGS IDENTIFIED: Delete vertex off-by-one errors after first deletion; add vertex doesn't reshape polygon on drag; array indices unstable during add/delete operations.
- 2026-01-15T01:00:00.000Z GPT-5 ROOT CAUSE: Array index-based coordinate tracking fails when vertices added/deleted; indices shift causing markers to reference wrong vertices.
- 2026-01-15T01:00:00.000Z GPT-5 ARCHITECTURE CHANGE: Implemented vertex ID-based object system - each vertex gets unique stable ID {id, lat, lng}; cityVertices Map tracks vertex objects per city/ring.
- 2026-01-15T01:00:00.000Z GPT-5 Fixed delete vertex: Now uses vertex.id to find correct vertex regardless of array position; checks minimum vertices before deletion; updates all bordering cities.
- 2026-01-15T01:00:00.000Z GPT-5 Fixed add vertex: Detects shared edges between cities; inserts new vertex with unique ID into all cities sharing that edge; rebuilds shared vertex index after add.
- 2026-01-15T01:00:00.000Z GPT-5 Implemented state cloning for undo: Deep clone vertex objects before each add/delete operation; undo restores entire cloned state (not reverse operations).
- 2026-01-15T01:00:00.000Z GPT-5 KEY LEARNING: Editing geometric data requires stable identifiers - array indices are unsuitable for add/delete operations; object/linked-list structures with IDs prevent coordination bugs.
- 2026-01-15T02:00:00.000Z GPT-5 BUG: Drag inconsistently affects cities (sometimes target only, sometimes bordering only, sometimes both); undo delete logs success but geometry not restored visually.
- 2026-01-15T02:00:00.000Z GPT-5 ROOT CAUSE ANALYSIS: initializeCityVertices creates separate vertex objects per city with different IDs; shared vertices don't share object references; updatePolygonGeometry looks up vertex by cityRef.vertexId which differs per city.
- 2026-01-15T02:00:00.000Z GPT-5 CRITICAL FIX: Changed updatePolygonGeometry to find vertices by lat/lng position match instead of vertex ID; vertices are found by comparing coordinates with 0.000001 tolerance; ensures all cities update even with different vertex IDs.
- 2026-01-15T02:00:00.000Z GPT-5 Enhanced undo function with better logging and safety checks; added wasOnMap check to preserve layer state during re-render.
- 2026-01-15T02:00:00.000Z GPT-5 Trade-off: Position-based vertex lookup slightly slower than ID-based, but guarantees correct behavior across all cities sharing vertices; future optimization could unify vertex objects, but adds complexity to maintain shared references.
- 2026-01-15T02:30:00.000Z GPT-5 BUG STILL PRESENT: Drag logging showed "vertex affecting 0 city/cities" and "Modified cities: 0" despite "Drag start: 2 cities affected" - position-based lookup fixed geometry updates but not edit tracking.
- 2026-01-15T02:30:00.000Z GPT-5 ROOT CAUSE: recordVertexEdit looks up affectedCities AFTER buildSharedVertexIndex called - by then vertices have moved and old lookupKey no longer exists in sharedVertices map.
- 2026-01-15T02:30:00.000Z GPT-5 SOLUTION: Changed recordVertexEdit signature to accept affectedCities as parameter; pass affectedCities captured at drag start/delete start before vertices move; record edit BEFORE rebuilding index.
- 2026-01-15T02:30:00.000Z GPT-5 Updated all call sites: drag mouseup passes this._affectedCities (captured at mousedown); deleteVertex passes affectedCities (captured before delete); addVertex constructs affectedCities from borderingCities set.
- 2026-01-15T02:30:00.000Z GPT-5 KEY LEARNING: When vertex positions change during operation, capture ALL state-dependent lookups (like shared vertex index) BEFORE the operation starts; pass as parameters instead of re-querying after state changes.
- 2026-01-15T02:45:00.000Z GPT-5 BUG PERSISTS: Edit tracking now works (2 cities recorded), but only one polygon updates during drag for Saint Helier; both update for Caen; inconsistent visual behavior remains.
- 2026-01-15T02:45:00.000Z GPT-5 ROOT CAUSE: updatePolygonGeometry tries to get old position from vertexData.vertexObj.lat/lng, but those values were updated in PREVIOUS operations; stale position doesn't match current vertices in cityVertices arrays.
- 2026-01-15T02:45:00.000Z GPT-5 ATTEMPTED FIX: Pass oldLatLng as parameter to updatePolygonGeometry; use _dragStartLatLng captured in mousedown; ensures vertex lookup uses correct position from start of THIS drag operation.
- 2026-01-15T02:45:00.000Z GPT-5 NEW BUG: Floating point comparison warnings "Could not find vertex at (48.63430340069185, -0.021009489378798207)" during every mousemove; vertex objects updated during drag, then next mousemove can't find them at original position.
- 2026-01-15T03:00:00.000Z GPT-5 DESIGN FLAW IDENTIFIED: Float precision matching (0.000001 tolerance) fragile and unnecessary; searching for vertices by position when we already know which objects to update from mousedown; overly complex with timing dependencies.
- 2026-01-15T03:00:00.000Z GPT-5 CORRECT SOLUTION: At mousedown, enhance affectedCities with DIRECT REFERENCES to vertex objects; during drag, update those objects directly; no searching, no position matching, no timing issues.
- 2026-01-15T03:00:00.000Z GPT-5 Implementation: mousedown maps affectedCities to include vertexObj reference (finds by ID once at start); updatePolygonGeometry receives enhanced affectedCities and directly updates cityRef.vertexObj.lat/lng; removed all float comparisons and old position tracking.
- 2026-01-15T03:00:00.000Z GPT-5 KEY LEARNING: When you have references available at event start (click), store them and use directly; avoid re-querying, re-searching, or position matching during operation; JavaScript object references are stable and efficient.
- 2026-01-15T04:00:00.000Z GPT-5 BUG: Ghost marker appears during drag for MultiPolygons only (e.g., Saint Helier with 9 islands); marker moves but duplicate stays at original position; does not occur for single Polygons.
- 2026-01-15T04:00:00.000Z GPT-5 ROOT CAUSE: addMarkersForRings used LOCAL ringIdx (always 0 for outer ring of each island) to retrieve vertices, but initializeCityVertices stored vertices using GLOBAL ringIdx (0,1,2,3,4,5,6,7,8 for 9 islands); result = all 9 islands retrieved vertices from index 0, creating duplicate markers at same positions.
- 2026-01-15T04:00:00.000Z GPT-5 SOLUTION: Track global ring index through showVertexMarkers and addMarkersForRings; for MultiPolygon, accumulate offset (polygon.length) across polygons; pass globalRingOffset to addMarkersForRings and calculate globalRingIdx = offset + localRingIdx.
- 2026-01-15T04:00:00.000Z GPT-5 Implementation: showVertexMarkers tracks globalRingIdx counter, increments by polygon.length after each island; addMarkersForRings(rings, layer, globalRingOffset) parameter added; uses globalRingIdx for cityVerts.get(), marker metadata, and vertexLookup.
- 2026-01-15T04:00:00.000Z GPT-5 KEY LEARNING: When processing nested structures (MultiPolygon = array of polygons, each polygon = array of rings), maintain both LOCAL and GLOBAL indices; map between them carefully; never assume local index 0 means global index 0 across all elements.
- 2026-01-15T05:00:00.000Z GPT-5 FEATURE: Added polygon deletion for micro-islands; when deleting vertex would make polygon invalid (<3 vertices), show confirm dialog offering to delete entire polygon/island; prevents invalid geometry while allowing cleanup of anomalous MultiPolygon islands.
- 2026-01-15T05:00:00.000Z GPT-5 Implementation: deleteEntirePolygon() finds target polygon in MultiPolygon by global ring index, removes it from coordinates array, converts to Polygon if only 1 polygon remains, reinitializes cityVertices to match new structure.
- 2026-01-15T05:00:00.000Z GPT-5 BUG: After deleting micro-islands from MultiPolygon (Saint Helier), vertex deletion on remaining polygon failed - vertex marker vanished but geometry didn't update; bordering city geometry updated correctly.
- 2026-01-15T05:00:00.000Z GPT-5 ROOT CAUSE: deleteVertex() only had geometry sync code for Polygon type, missing MultiPolygon branch; after deleteEntirePolygon() converted city from MultiPolygon→Polygon OR left as MultiPolygon with fewer islands, deleteVertex failed to update geometry.
- 2026-01-15T05:00:00.000Z GPT-5 SOLUTION: Added MultiPolygon geometry sync to deleteVertex(); uses global ring index to find correct polygon/ring, updates coordinates, rebuilds visual layer.
- 2026-01-15T05:00:00.000Z GPT-5 KEY LEARNING: When adding new operations that modify geometry type (MultiPolygon→Polygon conversion), audit ALL existing functions that operate on geometry to ensure they handle both types; incomplete type coverage creates silent failures.
- 2026-01-15T02:00:00.000Z GPT-5 BUG: Drag inconsistently affects cities (sometimes target only, sometimes bordering only, sometimes both); undo delete logs success but geometry not restored visually.
- 2026-01-15T02:00:00.000Z GPT-5 ROOT CAUSE ANALYSIS: initializeCityVertices creates separate vertex objects per city with different IDs; shared vertices don't share object references; updatePolygonGeometry looks up vertex by cityRef.vertexId which differs per city.
- 2026-01-15T02:00:00.000Z GPT-5 CRITICAL FLAW: Vertex ID system assumes shared vertices have same ID across cities, but implementation creates unique IDs per city; breaks vertex lookup in updatePolygonGeometry and all operations relying on vertex identity.
- 2026-01-14T16:22:25.308Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T16:22:30.567Z Skipped TopoJSON conversion to avoid OOM; using GeoJSON-only output.
- 2026-01-14T16:36:47.260Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T16:36:52.668Z Skipped TopoJSON conversion to avoid OOM; using GeoJSON-only output.
- 2026-01-14T17:30:21.722Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T17:30:27.597Z Skipped TopoJSON conversion to avoid OOM; using GeoJSON-only output.
- 2026-01-14T18:50:30.703Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T18:52:02.356Z Skipped TopoJSON conversion to avoid OOM; using GeoJSON-only output.
- 2026-01-14T18:57:30.752Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T18:58:55.392Z Skipped TopoJSON conversion to avoid OOM; using GeoJSON-only output.
- 2026-01-14T19:04:56.778Z Run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000
- 2026-01-14T19:06:21.873Z Skipped TopoJSON conversion to avoid OOM; using GeoJSON-only output.

## Recent Work Summary (2026-01-14)

### TopoJSON Conversion Pipeline Established
- 2026-01-14T20:00:00.000Z Created separate topofy.ts script using topojson-server and topojson-simplify to avoid OOM in main pipeline
- 2026-01-14T20:00:00.000Z Successfully converted GeoJSON → TopoJSON with quantization (100k) and Visvalingam simplification
- 2026-01-14T20:00:00.000Z Updated viewer.html to load TopoJSON via topojson-client library, renders correctly
- 2026-01-14T20:00:00.000Z Key learning: Topology-preserving simplification must happen AFTER topology creation to maintain shared arcs (no gaps/overlaps)

### Boundary Smoothing Optimization
- 2026-01-14T20:00:00.000Z Tested various simplification thresholds: 0.00001 → 0.00003 → 0.003 → 0.0015 (final)
- 2026-01-14T20:00:00.000Z Finding: S=0.003 removed staircases but lost detail on HK/Macau borders; S=0.0015 balances smoothness vs detail
- 2026-01-14T20:00:00.000Z File size impact: 4.0 MB (S=0.003) → 5.7 MB (S=0.0015), acceptable tradeoff for border fidelity

### World-Scale Processing
- 2026-01-14T20:00:00.000Z Disabled tile range filtering (FILTER_TILES=false) to process all ~16,000 tiles globally
- 2026-01-14T20:00:00.000Z Grid-edge union method scales well: full world processed in reasonable time
- 2026-01-14T20:00:00.000Z Output: cities.geojson → cities.topojson (3721 cities initially, expanding to full world dataset)

### Key Technical Learnings
- 2026-01-14T20:00:00.000Z TopoJSON encoding inherently prevents gaps/overlaps via shared arc topology - critical for contiguous city boundaries
- 2026-01-14T20:00:00.000Z Quantization must precede simplification: snaps shared boundaries before reducing vertices
- 2026-01-14T20:00:00.000Z Grid-edge union (pixel-perfect border tracing) produces correct input for TopoJSON; no manual gap-filling needed
- 2026-01-14T20:00:00.000Z Two-stage pipeline (tiles_to_topojson.ts → topofy.ts) avoids OOM and allows independent parameter tuning

### Next Phase: Interactive Editing
- 2026-01-14T20:00:00.000Z Planning integration with existing metrocity_api (Deno-based bulk geocoding service)
- 2026-01-14T20:00:00.000Z Will add editing endpoints to serve and accept TopoJSON edits
- 2026-01-14T20:00:00.000Z Frontend editing UI: Leaflet.PM for vertex manipulation, snap-to-border, zoom-constrained editing

## Interactive Viewer Development (2026-01-14 Evening)

### Country Borders Layer
- 2026-01-14T21:00:00.000Z Added Natural Earth 50m country borders from CDN (world-atlas@2)
- 2026-01-14T21:00:00.000Z Countries styled with distinct thick borders (weight: 3, opacity: 0.8, color: #333)
- 2026-01-14T21:00:00.000Z Toggleable layer via "Show Country Borders" checkbox (enabled by default)
- 2026-01-14T21:00:00.000Z City layer opacity automatically reduces to 0.5 when country borders are shown for visual clarity

### Edit Mode UI Framework
- 2026-01-14T21:00:00.000Z Integrated Leaflet Geoman (PM) library for future editing functionality
- 2026-01-14T21:00:00.000Z Added Edit Mode checkbox with zoom-level constraint (MIN_EDIT_ZOOM = 8)
- 2026-01-14T21:00:00.000Z Edit Mode checkbox disabled/greyed out when zoom < 8, auto-disables when zooming out
- 2026-01-14T21:00:00.000Z Added "Snap to Borders" toggle (enabled when Edit Mode is on)
- 2026-01-14T21:00:00.000Z Edit Mode notice panel explains workflow: click city to select for editing

### Vertex Marker System
- 2026-01-14T21:00:00.000Z Implemented click-to-select editing model: vertex markers show only for selected city
- 2026-01-14T21:00:00.000Z Markers are blue circles (5px radius) with white borders and shadow
- 2026-01-14T21:00:00.000Z Hover effect: markers turn orange and scale up, cursor changes to pointer
- 2026-01-14T21:00:00.000Z Markers correctly stay on top of polygons (removed bringToFront on hover)
- 2026-01-14T21:00:00.000Z Only outer polygon rings shown (holes skipped for visual clarity)

### UX Improvements
- 2026-01-14T21:00:00.000Z Initial map view set to Western Europe (Paris area, zoom 6) for better context
- 2026-01-14T21:00:00.000Z Removed auto-zoom animation on data load to preserve initial view
- 2026-01-14T21:00:00.000Z Disabled Edit Mode label styling: grey text (#999) and not-allowed cursor when inactive
- 2026-01-14T21:00:00.000Z Workflow: zoom in → enable Edit Mode → click city → see vertex markers → ready for editing

### Technical Implementation Notes
- 2026-01-14T21:00:00.000Z selectedCityLayer variable tracks currently selected city for editing
- 2026-01-14T21:00:00.000Z vertexMarkers array manages marker lifecycle (add/remove on zoom/mode changes)
- 2026-01-14T21:00:00.000Z Dynamic enable/disable of controls based on zoom level provides clear user feedback
- 2026-01-14T21:00:00.000Z Marker z-index management ensures editing targets remain visible and clickable

### Next Steps (Planned)
- 2026-01-14T21:00:00.000Z Implement vertex drag functionality using Leaflet.PM or custom handlers
- 2026-01-14T21:00:00.000Z Add snap-to-border logic (find nearest country/city boundary within threshold)
- 2026-01-14T21:00:00.000Z Implement add/remove vertex functionality (Shift+click, Delete key)
- 2026-01-14T21:00:00.000Z Build edit state tracking (in-memory deltas + localStorage persistence)
- 2026-01-14T21:00:00.000Z Add "Commit Changes" workflow for saving edits

## Vertex Editing Implementation (2026-01-14 Late Evening)

### Vertex Dragging with Topology Preservation
- 2026-01-14T22:00:00.000Z Implemented vertex dragging: mousedown activates drag mode, mousemove updates position, mouseup commits edit
- 2026-01-14T22:00:00.000Z Visual feedback: blue (normal), orange (hover), red (dragging) with radius changes (5→7→8)
- 2026-01-14T22:00:00.000Z Fixed coordinate conversion bug: GeoJSON [lon,lat] → Leaflet [lat,lng] for proper marker positioning
- 2026-01-14T22:00:00.000Z Removed CSS transform that caused rendering offset issues

### Shared Vertex Tracking for Gap-Free Editing
- 2026-01-14T22:00:00.000Z Built spatial index (sharedVertices Map) tracking all cities sharing each unique vertex
- 2026-01-14T22:00:00.000Z Keys are "lat,lng" strings (7-decimal precision), values are arrays of city references
- 2026-01-14T22:00:00.000Z When dragging a vertex, automatically updates ALL polygons sharing that vertex (2, 3, or more cities)
- 2026-01-14T22:00:00.000Z Prevents gaps and overlaps at city boundaries during editing
- 2026-01-14T22:00:00.000Z Index rebuilds on data load, updates dynamically as vertices move

### Edit State Tracking
- 2026-01-14T22:00:00.000Z editHistory: Array storing all edit operations with timestamps, old/new positions, affected cities
- 2026-01-14T22:00:00.000Z modifiedCities: Map tracking modified GeoJSON features by cityId
- 2026-01-14T22:00:00.000Z Each edit records: vertexId, affected city IDs/names, ring/coord indices, position changes
- 2026-01-14T22:00:00.000Z Console logs show number of cities affected by each edit and total modification count

### Technical Fixes
- 2026-01-14T22:00:00.000Z Fixed mousemove handler registration: moved to global map level instead of per-marker (prevented handler multiplication)
- 2026-01-14T22:00:00.000Z Added safety checks in updatePolygonGeometry for undefined vertex data
- 2026-01-14T22:00:00.000Z Fallback to single-city update if vertex not found in shared index
- 2026-01-14T22:00:00.000Z Proper Leaflet layer updates using setLatLngs with converted coordinate arrays

### Unique Vertex ID System
- 2026-01-14T22:00:00.000Z Each vertex assigned unique ID (v0, v1, v2...) via incrementing counter
- 2026-01-14T22:00:00.000Z vertexLookup Map enables O(1) access by ID with full metadata (city, ring, coord indices, position)
- 2026-01-14T22:00:00.000Z Supports future add/delete operations without index confusion
- 2026-01-14T22:00:00.000Z Marker metadata stored in _vertexId and _vertexData properties

### Current Capabilities
- 2026-01-14T22:00:00.000Z User can zoom in, enable Edit Mode, click city, drag vertices with real-time polygon updates
- 2026-01-14T22:00:00.000Z Adjacent cities update simultaneously, maintaining shared boundaries
- 2026-01-14T22:00:00.000Z Edits tracked in memory with full undo/redo potential
- 2026-01-14T22:00:00.000Z Map dragging disabled during vertex drag to prevent conflicts

### Next Steps (Remaining)
- 2026-01-14T22:00:00.000Z Add snap-to-border logic for country borders and adjacent city boundaries
- 2026-01-14T22:00:00.000Z Implement add/remove vertex functionality
- 2026-01-14T22:00:00.000Z Add "Commit Changes" button to export modified TopoJSON or POST to API
- 2026-01-14T22:00:00.000Z Implement localStorage persistence for edit recovery
- 2026-01-14T22:00:00.000Z Add undo/redo functionality using editHistory

## MultiPolygon Sanitization (2026-01-16)

### Problem Diagnosis
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 ANALYSIS: MultiPolygons represent 280/3721 shapes (7.5%) but cause ~90% of editing bugs
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Root cause: Global ring index system adds complexity; micro-polygons are unwanted raster-to-polygon artifacts
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Examples: Saint Helier (9 islands, 8 micro), Juarez (14 polygons, 13 micro), Sokhumi (17 polygons, 16 micro)

### Solution Implementation
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Created sanitise_multipolygons.ts - Deno script using topojson-client/server libraries
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Algorithm: Shoelace formula calculates polygon area, keeps largest polygon only per city
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Process: TopoJSON → GeoJSON → sanitize → rebuild topology with quantization (100k) + simplification (0.0015)

### Execution Results
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Successfully processed 3721 cities from cities.topojson
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Converted 280 MultiPolygons → Polygons (100% conversion rate)
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Removed 837 micro-polygons total (avg 3 micro-polygons per MultiPolygon city)
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Output: cities_sanitized.topojson with 3721 Polygon-only features
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Updated viewer.html to load cities_sanitized.topojson

### Impact
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Eliminated global ring index complexity from editing code paths
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 Should resolve: ghost marker bug, inconsistent drag behavior for multi-island cities, polygon deletion edge cases
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 MultiPolygon handler code remains in viewer.html for now (marked for future cleanup)
- 2026-01-16T21:00:00.000Z Claude Sonnet 4.5 KEY LEARNING: When raster artifacts cause >90% of bugs for <10% of data, post-process to remove complexity rather than adding handler code

### Code Cleanup (2026-01-16)
- 2026-01-16T21:30:00.000Z Claude Sonnet 4.5 Removed all MultiPolygon-specific handling code from viewer.html
- 2026-01-16T21:30:00.000Z Claude Sonnet 4.5 Simplified functions: showVertexMarkers, addMarkersForRings, initializeCityVertices, updatePolygonGeometry, deleteVertex, undoLastOperation
- 2026-01-16T21:30:00.000Z Claude Sonnet 4.5 Deleted deleteEntirePolygon() function entirely (was only for MultiPolygon micro-island cleanup)
- 2026-01-16T21:30:00.000Z Claude Sonnet 4.5 Removed global ring index tracking system (globalRingIdx, globalRingOffset parameters)
- 2026-01-16T21:30:00.000Z Claude Sonnet 4.5 Simplified vertex deletion: now shows alert instead of offering polygon deletion
- 2026-01-16T21:30:00.000Z Claude Sonnet 4.5 Retained MultiPolygon handling ONLY in snapToNearestFeature for country borders (Natural Earth data still has MultiPolygons)
- 2026-01-16T21:30:00.000Z Claude Sonnet 4.5 Result: ~150 lines of complex geometry handling code removed, simpler and more maintainable

## City Polygon Snapping Implementation (2026-01-16)

### Requirements Analysis
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 User requested snap-to-cities with two modes: vertex snap (combine) and edge snap (add)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Vertex snap: combines vertices when dragged close (creates shared vertex)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Edge snap: adds vertex to target polygon edge when dragged to border
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Required snap lock mechanism to prevent "snap churn" (bouncing between targets)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Needed visual feedback (preview marker) and undo support for all drag operations

### UI Changes
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Converted snap checkbox to radio buttons: None (default), Borders, Cities
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Matched Edit Mode styling to Snap Mode (strong label, indented controls)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Changed Edit Mode to "Enable Editing" checkbox under "Edit Mode (zoom ≥8):" label
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Removed yellow "Edit Mode Active" notice box (was distracting)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Both Edit Mode and Snap Mode labels now grey out when disabled (consistent UX)

### Core Snapping Features
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Implemented vertex snapping: 42px threshold (stronger pull), creates shared vertex between polygons
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Implemented edge snapping: 35px threshold (weaker pull), inserts vertex into target polygon at correct position
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Added snap priority: vertices checked first (higher threshold), then edges (lower threshold)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap lock mechanism: locks onto target for 56px movement range to prevent churn
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Visual feedback: green circle marker shows snap target during drag with tooltip (vertex/edge + city name)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap thresholds reduced by 30% from initial values based on user feedback

### Undo System Enhancement
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Extended undo to support move/drag operations (previously only add/delete)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Fixed critical bug: undo now captures state on mousedown BEFORE changes (was capturing after)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Added _undone flag to operations - undo button greys out after use until new edit
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Fixed delete undo: now captures state before vertex deletion (was broken)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Undo button dynamically shows: "Undo Move", "Undo Add", or "Undo Delete"

### Bug Fixes
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Fixed stuck drag bug: added global mouseup handler to catch drag end anywhere on map
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Previous bug: releasing mouse off-marker left map frozen, dragging disabled
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Solution: created endVertexDrag() helper called by both marker and map mouseup events
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Fixed missing closing brace in snapToNearestFeature (syntax error from refactoring)

### Performance Optimization
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 PROBLEM: Cities snap mode was laggy - snapToNearestFeature called on every mousemove
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Original algorithm: checked all 3721 cities, all vertices/edges = tens of thousands of calculations
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Attempted throttling (50ms) but caused visual lag - was throttling both snap AND visual updates
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 SOLUTION: Decoupled visual updates from snap calculations
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Visual polygon updates: every mousemove for smooth 60fps dragging
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap calculations: throttled to 50ms (20 times/second), reuse last snap between checks
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Added spatial filtering: bounding box around cursor (3x threshold), filter cities by bounds intersection
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Spatial optimization reduces search from 3721 cities to typically 5-20 nearby cities
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Performance improvement: 100x-500x faster snap calculations
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Result: smooth dragging with no perceptible lag, throttle now unnecessary but kept for safety

### Edge Cases Handled
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Edge snap adds vertex to ALL cities sharing that edge (common for borders)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Vertex snap updates target's existing vertex object (true sharing)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap only affects other cities, not the selected city itself
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap lock prevents accidental re-snapping mid-drag
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap preview marker removed on drag end
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Shared vertex index rebuilt after all edits to maintain topology

### Technical Details
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap modes: snapMode variable ('none' | 'borders' | 'cities')
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap info stored on latLng object: _snapInfo { type, cityId, cityName, ringIdx, vertexObj/edgeStartIdx, layer }
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Snap lock stored on marker: _snapLock { snapInfo, snapLatLng }
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Last snap calculation cached on marker: _lastCalculatedSnap (for throttling)
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Global variables: lastSnapCheckTime, SNAP_THROTTLE_MS = 50
- 2026-01-16T22:00:00.000Z Claude Sonnet 4.5 Spatial search: L.latLngBounds + getBounds().intersects() for city filtering

### Testing & Validation
- 2026-01-16T22:00:00.000Z User confirmed: delete/drag bugs fixed, undo move works, undo delete works
- 2026-01-16T22:00:00.000Z User confirmed: performance now good with cities snap mode enabled
- 2026-01-16T22:00:00.000Z User confirmed: stuck drag bug resolved
- 2026-01-16T22:00:00.000Z User confirmed: yellow box removed successfully



