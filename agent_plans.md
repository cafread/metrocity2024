# Agent Plans (Append-Only)

This file is append-only. New plans must be appended in the format:
- [timestamp, agent model, plan]

Examples:
- [2026-01-13T12:00:00.000Z, GPT-5, Initialize agent plans log]
- [2026-01-13T12:05:00.000Z, GPT-5, Run tiles_to_topojson with concave hull and quantization]

[2026-01-14T00:00:00.000Z, GPT-5, Temporarily skip TopoJSON to avoid OOM; output GeoJSON-only and update viewer.html to consume cities.geojson.]
[2026-01-13T10:06:28.963Z, GPT-5, tiles_to_topojson run start: method=concave, concavity=1.8, lengthThreshold=0.01, simplify=0.00008, quantize=100000]
[2026-01-13T10:13:29.725Z, GPT-5, tiles_to_topojson completed: features=3721, cities=3721]
[2026-01-13T21:19:05.515Z, GPT-5, tiles_to_topojson run start: method=concave, concavity=1.8, lengthThreshold=0.01, simplify=0.00008, quantize=100000]
[2026-01-13T21:26:10.133Z, GPT-5, tiles_to_topojson completed: features=3721, cities=3721]
[2026-01-14T07:55:42.112Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, simplify=0.00008, quantize=100000]
[2026-01-14T09:31:49.070Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T10:48:34.318Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T11:53:21.957Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T13:10:05.254Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T14:05:52.976Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T14:57:26.632Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T14:59:04.021Z, GPT-5, tiles_to_topojson completed (GeoJSON-only): features=318, cities=318]
[2026-01-14T16:13:55.716Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T16:14:00.959Z, GPT-5, tiles_to_topojson completed (GeoJSON-only): features=317, cities=317]
[2026-01-14T16:22:25.313Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T16:22:30.572Z, GPT-5, tiles_to_topojson completed (GeoJSON-only): features=317, cities=317]
[2026-01-14T16:36:47.265Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T16:36:52.672Z, GPT-5, tiles_to_topojson completed (GeoJSON-only): features=318, cities=318]
[2026-01-14T17:30:21.726Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T17:30:27.601Z, GPT-5, tiles_to_topojson completed (GeoJSON-only): features=318, cities=318]
[2026-01-14T18:50:30.709Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T18:52:02.381Z, GPT-5, tiles_to_topojson completed (GeoJSON-only): features=3721, cities=3721]
[2026-01-14T18:57:30.757Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T18:58:55.397Z, GPT-5, tiles_to_topojson completed (GeoJSON-only): features=3721, cities=3721]
[2026-01-14T19:04:56.783Z, GPT-5, tiles_to_topojson run start: method=grid, concavity=2, lengthThreshold=0.01, rdpEps=0.0075, spikeLen=0.01, spikeAngle=5, simplify=0.0001, quantize=100000]
[2026-01-14T19:06:21.878Z, GPT-5, tiles_to_topojson completed (GeoJSON-only): features=3721, cities=3721]

## Interactive Editing System Plan (2026-01-14)

### Phase 1: Foundational Components
[2026-01-14T20:00:00.000Z, GPT-5, Add country borders layer (Natural Earth) as toggleable Leaflet layer]
[2026-01-14T20:00:00.000Z, GPT-5, Prototype Edit Mode UI with checkbox and visual indicators (zoom-constrained)]
[2026-01-14T20:00:00.000Z, GPT-5, Integrate Leaflet.PM or custom vertex editing handlers]
[2026-01-14T20:00:00.000Z, GPT-5, Implement snap-to-border logic (countries + adjacent cities)]

### Phase 2: City Management
[2026-01-14T20:00:00.000Z, GPT-5, Add city search UI for hidden cities from 2020cities15k_trimmed.json]
[2026-01-14T20:00:00.000Z, GPT-5, Implement add city workflow: search → place at lat/lon → create default square → edit]
[2026-01-14T20:00:00.000Z, GPT-5, Build edit state tracking (in-memory + localStorage backup)]
[2026-01-14T20:00:00.000Z, GPT-5, Create commit workflow UI (prepare for future API integration)]

### Phase 3: API Integration (Combined with metrocity_api)
[2026-01-14T20:00:00.000Z, GPT-5, Design API endpoints for editing (GET /topology, POST /topology/update, GET /cities/search)]
[2026-01-14T20:00:00.000Z, GPT-5, Extend existing metrocity_api Deno server with editing endpoints]
[2026-01-14T20:00:00.000Z, GPT-5, Implement version-based optimistic locking for conflict resolution]
[2026-01-14T20:00:00.000Z, GPT-5, Build topology validation (no gaps/overlaps) on server-side]
[2026-01-14T20:00:00.000Z, GPT-5, Add git-backed or timestamp-based versioning for cities.topojson]
[2026-01-14T20:00:00.000Z, GPT-5, Implement tile regeneration pipeline from TopoJSON for bulk API consistency]

### Technical Decisions
- **Frontend**: Leaflet + Leaflet.PM, topojson-client, localStorage for edit persistence
- **Backend**: Deno (TypeScript-first), extend existing metrocity_api
- **Data Source**: cities.topojson as source of truth, Natural Earth for countries
- **Edit Mode**: Zoom-level ≥10 required, checkbox toggle, keyboard modifiers for vertex add/remove
- **Snap Logic**: Toggleable, targets country borders and adjacent city boundaries
- **No Right-Click**: Use keyboard modifiers (Shift/Ctrl) + click or toolbar buttons instead

### API Endpoints (Proposed)
```
Existing (metrocity_api):
POST /mc_api          → Bulk geocoding (lat/lon → city)
GET  /status          → Uptime
GET  /changelog       → Tile/city edit timestamps

New Editing Endpoints:
GET  /topology        → Serve cities.topojson (source of truth)
GET  /countries       → Serve countries TopoJSON (Natural Earth)
POST /topology/update → Accept client edits (delta or full)
  Body: { cityId, geometry, metadata, version }
  Response: { success, newVersion, conflicts? }
GET  /cities/search   → Search hidden cities
  Query: ?q=hong
  Response: [{ id, name, lat, lon, pop }]
```

### Data Flow
1. Server loads cities.topojson on startup (cached in memory)
2. Client GETs /topology, renders in viewer
3. User enables Edit Mode, edits polygons (tracked as deltas in memory + localStorage)
4. User clicks "Commit Changes" → POSTs to /topology/update
5. Server validates (no gaps/overlaps), merges, increments version
6. Server writes updated cities.topojson to disk
7. Server updates /changelog with timestamp
8. Optionally: Rebuild tiles from TopoJSON for bulk API consistency

## Advanced Vertex Editing Features (2026-01-15)

### CRITICAL ARCHITECTURE DECISION: Vertex ID System
[2026-01-15T01:00:00.000Z, GPT-5, Array indices cause off-by-one errors during add/delete]
[2026-01-15T01:00:00.000Z, GPT-5, Implemented stable vertex ID objects: {id, lat, lng}]
[2026-01-15T01:00:00.000Z, GPT-5, cityVertices Map: cityId → Map(ringIdx → Array of vertex objects)]
[2026-01-15T01:00:00.000Z, GPT-5, Markers reference vertexObj instead of coordIdx]
[2026-01-15T01:00:00.000Z, GPT-5, Sync vertex objects to geometry.coordinates on updates]
[2026-01-15T01:00:00.000Z, GPT-5, Benefits: No off-by-one errors, stable references, proper undo via cloning]

### BUG FIX: Shared Vertex Object References (2026-01-15T02:00:00.000Z)
[2026-01-15T02:00:00.000Z, GPT-5, Problem: Each city creates separate vertex objects with different IDs for same position]
[2026-01-15T02:00:00.000Z, GPT-5, Impact: updatePolygonGeometry can't find vertex by ID; drag inconsistent; undo fails]
[2026-01-15T02:00:00.000Z, GPT-5, Root cause: initializeCityVertices creates unique IDs per city, not shared references]
[2026-01-15T02:00:00.000Z, GPT-5, Solution: Use coordinate-based lookup instead of vertex ID in updatePolygonGeometry]
[2026-01-15T02:00:00.000Z, GPT-5, Implementation: Find vertex by matching lat/lng instead of cityRef.vertexId]
[2026-01-15T02:00:00.000Z, GPT-5, Trade-off: Slightly slower lookup, but guarantees correct vertex updates across cities]

### BUG FIX: Edit Tracking Lookup Timing (2026-01-15T02:30:00.000Z)
[2026-01-15T02:30:00.000Z, GPT-5, Problem: recordVertexEdit looks up affectedCities AFTER vertices moved and index rebuilt]
[2026-01-15T02:30:00.000Z, GPT-5, Impact: Edit recorded with 0 affected cities; modified cities count stays 0; undo fails]
[2026-01-15T02:30:00.000Z, GPT-5, Root cause: buildSharedVertexIndex updates position keys; old lookupKey no longer exists]
[2026-01-15T02:30:00.000Z, GPT-5, Solution: Pass affectedCities as parameter to recordVertexEdit instead of looking up]
[2026-01-15T02:30:00.000Z, GPT-5, Implementation: Capture affectedCities before operation; record edit before rebuilding index]
[2026-01-15T02:30:00.000Z, GPT-5, Updated call sites: drag (pass this._affectedCities), delete (pass local affectedCities), add (construct from borderingCities)]
[2026-01-15T02:30:00.000Z, GPT-5, Key learning: Capture state-dependent lookups before operation; pass as parameters not re-query]

### BUG FIX: Vertex Lookup with Stale Position (2026-01-15T02:45:00.000Z)
[2026-01-15T02:45:00.000Z, GPT-5, Problem: updatePolygonGeometry uses vertexData.vertexObj.lat/lng for old position, but those updated by previous operations]
[2026-01-15T02:45:00.000Z, GPT-5, Impact: Vertex lookup fails for some cities; only one polygon updates during drag; inconsistent behavior]
[2026-01-15T02:45:00.000Z, GPT-5, ATTEMPTED: Pass oldLatLng parameter, but created new bug with float precision warnings]

### FINAL FIX: Direct Vertex Object References (2026-01-15T03:00:00.000Z)
[2026-01-15T03:00:00.000Z, GPT-5, Problem: Searching for vertices by float position matching (0.000001 tolerance) fragile and unnecessary]
[2026-01-15T03:00:00.000Z, GPT-5, Design flaw: Re-searching for objects we already identified at mousedown; timing issues with when to update]
[2026-01-15T03:00:00.000Z, GPT-5, Solution: At mousedown, enhance affectedCities with direct vertex object references; update them directly during drag]
[2026-01-15T03:00:00.000Z, GPT-5, Implementation: Map affectedCities to include vertexObj (find by ID once); updatePolygonGeometry directly updates cityRef.vertexObj]
[2026-01-15T03:00:00.000Z, GPT-5, Benefits: No position matching, no timing dependencies, no float precision issues, simpler and more reliable]
[2026-01-15T03:00:00.000Z, GPT-5, Key learning: Store references at event start, use them directly; avoid re-querying or re-searching during operation]
[2026-01-15T01:00:00.000Z, GPT-5, cityVertices Map: cityId → Map(ringIdx → Array of vertex objects)]
[2026-01-15T01:00:00.000Z, GPT-5, Markers reference vertexObj instead of coordIdx]
[2026-01-15T01:00:00.000Z, GPT-5, Sync vertex objects to geometry.coordinates on updates]
[2026-01-15T01:00:00.000Z, GPT-5, Benefits: No off-by-one errors, stable references, proper undo via cloning]

### Edit Mode Radio Buttons (Edit/Add/Delete)
[2026-01-15T00:00:00.000Z, GPT-5, Add radio button UI for edit/add/delete modes]
[2026-01-15T00:00:00.000Z, GPT-5, Change cursor based on selected mode (default/crosshair/not-allowed)]
[2026-01-15T00:00:00.000Z, GPT-5, Update edit mode notice to explain current action]

### Add Vertex Functionality
[2026-01-15T00:00:00.000Z, GPT-5, Click on polygon edge to add new vertex at click position]
[2026-01-15T00:00:00.000Z, GPT-5, Use in-memory coordinate array copy to avoid off-by-one errors]
[2026-01-15T00:00:00.000Z, GPT-5, Insert vertex between closest two vertices on polygon edge]
[2026-01-15T00:00:00.000Z, GPT-5, Update all cities sharing the affected edge segment]
[2026-01-15T00:00:00.000Z, GPT-5, Rebuild vertex markers after add operation]
[2026-01-15T00:00:00.000Z, GPT-5, Track operation in editHistory as type: 'add']

### Delete Vertex Functionality
[2026-01-15T00:00:00.000Z, GPT-5, Click on vertex marker to delete it (minimum 3 vertices required)]
[2026-01-15T00:00:00.000Z, GPT-5, Remove vertex from in-memory coordinate array]
[2026-01-15T00:00:00.000Z, GPT-5, Update all cities sharing the deleted vertex]
[2026-01-15T00:00:00.000Z, GPT-5, Rebuild vertex markers with updated coordIdx values]
[2026-01-15T00:00:00.000Z, GPT-5, Track operation in editHistory as type: 'delete']

### In-Memory Coordinate Management
[2026-01-15T00:00:00.000Z, GPT-5, Create workingGeometry map: cityId → coordinate arrays]
[2026-01-15T00:00:00.000Z, GPT-5, Copy original coordinates on city selection]
[2026-01-15T00:00:00.000Z, GPT-5, All edits modify workingGeometry, not original feature]
[2026-01-15T00:00:00.000Z, GPT-5, Sync workingGeometry to feature.geometry on commit/save]
[2026-01-15T00:00:00.000Z, GPT-5, Prevents index confusion during add/delete operations]

### Undo Functionality
[2026-01-15T00:00:00.000Z, GPT-5, Add "Undo" button that shows context-aware text]
[2026-01-15T00:00:00.000Z, GPT-5, Show "Undo Add" when last operation was vertex add]
[2026-01-15T00:00:00.000Z, GPT-5, Show "Undo Delete" when last operation was vertex delete]
[2026-01-15T00:00:00.000Z, GPT-5, Grey out "Undo" when last operation was drag/move]
[2026-01-15T00:00:00.000Z, GPT-5, Pop last add/delete operation from editHistory]
[2026-01-15T00:00:00.000Z, GPT-5, Reverse the operation (delete added vertex or restore deleted vertex)]
[2026-01-15T00:00:00.000Z, GPT-5, Rebuild vertex markers after undo]

### Reset Functionality
[2026-01-15T00:00:00.000Z, GPT-5, Add "Reset All" button with confirmation dialog]
[2026-01-15T00:00:00.000Z, GPT-5, Reload cities.topojson from server (fresh data)]
[2026-01-15T00:00:00.000Z, GPT-5, Clear editHistory, modifiedCities, workingGeometry]
[2026-01-15T00:00:00.000Z, GPT-5, Rebuild shared vertex index]
[2026-01-15T00:00:00.000Z, GPT-5, Clear and rebuild vertex markers for selected city]

### Snap to Border Implementation
[2026-01-15T00:00:00.000Z, GPT-5, Enable snap-to-border checkbox functionality]
[2026-01-15T00:00:00.000Z, GPT-5, Find nearest point on country borders within threshold (e.g., 50px screen distance)]
[2026-01-15T00:00:00.000Z, GPT-5, Find nearest point on adjacent city boundaries]
[2026-01-15T00:00:00.000Z, GPT-5, Snap vertex to nearest target if within threshold during drag]
[2026-01-15T00:00:00.000Z, GPT-5, Visual feedback: highlight snap target line/point]
[2026-01-15T00:00:00.000Z, GPT-5, Use Leaflet's GeometryUtil for point-to-polyline distance calculation]

### Technical Implementation Details
- **Cursor Styles**: 
  - Edit mode: `cursor: pointer` (default drag)
  - Add mode: `cursor: crosshair`
  - Delete mode: `cursor: not-allowed` over vertices
- **Off-by-one Prevention**:
  - Use workingGeometry as source of truth during editing session
  - coordIdx references position in workingGeometry, not original feature
  - After add/delete, rebuild all vertex markers with fresh coordIdx values
  - Never mutate coordIdx directly, always rebuild from workingGeometry
- **Snap Algorithm**:
  1. Get mouse position in screen pixels
  2. Convert to lat/lng
  3. Find all line segments within screen distance threshold
  4. Calculate closest point on each segment
  5. Snap to closest if distance < threshold (50px)
  6. Priority: country borders > adjacent city edges
- **Edit History Structure**:
  ```javascript
  {
    type: 'add'|'delete'|'move',
    timestamp: Date.now(),
    cityId, vertexId, coordIdx,
    // For add: newPosition
    // For delete: deletedVertex, deletedPosition
    // For move: oldPosition, newPosition
  }
  ```

## MultiPolygon Sanitization Plan (2026-01-16)

### Problem Analysis
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, MultiPolygons represent 280/3721 shapes (7.5%) but cause ~90% of editing bugs]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Micro-polygons are unwanted artifacts from raster-to-polygon conversion]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Complex global ring indexing required for MultiPolygon editing adds fragility]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Example: Saint Helier has 9 islands, most are micro-polygons causing ghost markers]

### Solution: Post-Processing Sanitization
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Created sanitise_multipolygons.ts - Deno script to process GeoJSON/TopoJSON]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Algorithm: Calculate polygon area using Shoelace formula, keep largest polygon only]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Convert all MultiPolygon → Polygon, update geometry.type property]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, For TopoJSON input: convert to GeoJSON, sanitize, rebuild topology with quantization]

### Implementation Details
- **Usage**: `deno run --allow-read --allow-write sanitise_multipolygons.ts cities.topojson cities_sanitized.topojson`
- **Auto-detects format**: Checks for type='Topology' vs type='FeatureCollection'
- **Preserves properties**: City name, ID, population unchanged
- **Logging**: Reports MultiPolygons found, converted, total micro-polygons removed
- **TopoJSON rebuild**: Uses topojson-server topology() + simplify() to maintain shared arcs

### Next Steps
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Run sanitization on cities.topojson to create cities_sanitized.topojson]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Update viewer.html to load cities_sanitized.topojson]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, Test editing with sanitized data - should eliminate MultiPolygon-related bugs]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, LATER: Remove MultiPolygon handler code from viewer.html once validated]
[2026-01-16T20:00:00.000Z, Claude Sonnet 4.5, LATER: Update tiles_to_topojson.ts to include inline sanitization for future runs]


