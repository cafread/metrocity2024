/**
 * Traces the PNG city tiles into GeoJSON polygons.
 * Each pixel is matched to a city id by colour. A pixel edge is a boundary edge when the pixel on
 * its other side belongs to a different city, looking across tile joins. Each city's boundary
 * edges are stitched into rings in global pixel coordinates, so neighbouring cities share exactly
 * the same vertices and topofy.ts can build shared arcs from the result.
 *
 * Writes cities.geojson only. Building the TopoJSON in the same process ran out of memory, so
 * that step lives in topofy.ts.
 *
 * Run with: deno run --allow-read --allow-write --v8-flags=--max-old-space-size=16384 tiles_to_topojson.ts
 */

import { createCanvas, loadImage } from "jsr:@gfx/canvas-wasm";

const TILE_SIZE = 256;
const ZOOM_LEVEL = 7; // Tiles are at zoom level 7 (128 tiles across)

const scriptDir = import.meta.dirname!;

// Load color-to-id mapping
const colorToId: Record<string, number> = JSON.parse(await Deno.readTextFile(`${scriptDir}/res/colorToId.json`));
const cityData: Array<{ i: number; p: number; n: string; la: number; lo: number }> = JSON.parse(await Deno.readTextFile(`${scriptDir}/res/2020cities15k_trimmed.json`));

// Create city lookup by id
const cityById: Record<number, { i: number; p: number; n: string; la: number; lo: number }> = {};
cityData.forEach((c) => { cityById[c.i] = c; });

// Optional tile range filter to speed up testing
// Enable and set to the desired inclusive range (Europe example: 060_038 to 070_048)
const FILTER_TILES = false;
const FILTER_MIN_X = 60;
const FILTER_MAX_X = 70;
const FILTER_MIN_Y = 38;
const FILTER_MAX_Y = 48;

// Output file name; set to 'cities_europe.geojson' for subset tests
const OUTPUT_FILE = 'cities.geojson';

// Stitch axis-aligned edges into closed rings
function stitchEdgesToRings(edges: Array<[[number, number],[number, number]]>): [number, number][][] {
  // Build adjacency from vertex -> list of neighbouring vertices
  const keyV = (v: [number, number]) => `${v[0]},${v[1]}`;
  const adj = new Map<string, Array<[number, number]>>();
  for (const [a,b] of edges) {
    const ka = keyV(a), kb = keyV(b);
    if (!adj.has(ka)) adj.set(ka, []);
    if (!adj.has(kb)) adj.set(kb, []);
    adj.get(ka)!.push(b);
    adj.get(kb)!.push(a);
  }
  // Track used edges by normalized pair key
  const edgeKey = (u: [number, number], v: [number, number]) => `${Math.min(u[0],v[0])},${Math.min(u[1],v[1])}->${Math.max(u[0],v[0])},${Math.max(u[1],v[1])}`;
  const used = new Set<string>();
  const rings: [number, number][][] = [];
  // Helper to get next neighbor not using the back edge
  function nextStep(cur: [number, number], prev: [number, number] | null): [number, number] | null {
    const nbrs = adj.get(keyV(cur)) || [];
    for (const n of nbrs) {
      const ek = edgeKey(cur, n);
      if (used.has(ek)) continue;
      // avoid immediately going back if other options exist
      if (prev && n[0] === prev[0] && n[1] === prev[1] && nbrs.length > 1) continue;
      return n;
    }
    return null;
  }
  // Iterate vertices to build loops
  for (const [kv, nbrs] of adj.entries()) {
    for (const n of nbrs) {
      const start: [number, number] = kv.split(',').map(Number) as [number, number];
      const e0 = edgeKey(start, n);
      if (used.has(e0)) continue;
      // trace
      const ring: [number, number][] = [start];
      let prev: [number, number] | null = null;
      let cur: [number, number] = start;
      let nxt: [number, number] | null = n;
      used.add(e0);
      while (nxt) {
        ring.push(nxt);
        used.add(edgeKey(cur, nxt));
        prev = cur;
        cur = nxt;
        if (cur[0] === start[0] && cur[1] === start[1]) break;
        nxt = nextStep(cur, prev);
      }
      // close if not closed
      if (ring.length > 2 && (ring[0][0] !== ring[ring.length-1][0] || ring[0][1] !== ring[ring.length-1][1]))
        ring.push(ring[0]);
      if (ring.length >= 4) rings.push(ring);
    }
  }
  return rings;
}

// Remove collinear middle points in axis-aligned rings
function removeCollinear(ring: [number, number][]): [number, number][] {
  if (ring.length <= 4) return ring;
  const closed = ring[0][0] === ring[ring.length-1][0] && ring[0][1] === ring[ring.length-1][1];
  const pts = closed ? ring.slice(0, -1) : ring.slice();
  const out: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[(i - 1 + pts.length) % pts.length];
    const curr = pts[i];
    const next = pts[(i + 1) % pts.length];
    const colX = prev[0] === curr[0] && curr[0] === next[0];
    const colY = prev[1] === curr[1] && curr[1] === next[1];
    if (!(colX || colY)) out.push(curr);
  }
  if (out.length < 2) {
    // Fallback to original ring if over-pruned
    return ring;
  }
  out.push(out[0]);
  return out;
}

/**
 * Convert RGBA to a string key
 */
function rgbaToKey(r: number, g: number, b: number, a: number): string {
  return `rgba(${r},${g},${b},${a === 255 ? 1 : 0})`;
}

// Offsets to compensate for ±1 compression artifacts per channel (excluding 0,0,0)
const compressionOffsets: Array<{ r: number; g: number; b: number }> = [
  { r: 0, g: 0, b: 1 }, { r: 0, g: 0, b: -1 }, { r: 0, g: 1, b: 0 },
  { r: 0, g: 1, b: 1 }, { r: 0, g: 1, b: -1 }, { r: 0, g: -1, b: 0 },
  { r: 0, g: -1, b: 1 }, { r: 0, g: -1, b: -1 }, { r: 1, g: 0, b: 0 },
  { r: 1, g: 0, b: 1 }, { r: 1, g: 0, b: -1 }, { r: 1, g: 1, b: 0 },
  { r: 1, g: 1, b: 1 }, { r: 1, g: 1, b: -1 }, { r: 1, g: -1, b: 0 },
  { r: 1, g: -1, b: 1 }, { r: 1, g: -1, b: -1 }, { r: -1, g: 0, b: 0 },
  { r: -1, g: 0, b: 1 }, { r: -1, g: 0, b: -1 }, { r: -1, g: 1, b: 0 },
  { r: -1, g: 1, b: 1 }, { r: -1, g: 1, b: -1 }, { r: -1, g: -1, b: 0 },
  { r: -1, g: -1, b: 1 }, { r: -1, g: -1, b: -1 },
];

function clamp8(n: number): number { return n < 0 ? 0 : n > 255 ? 255 : n; }

/**
 * Get city ID from color, handling compression variations
 */
function colorToIdLookup(r: number, g: number, b: number): number {
  if (r === 0 && g === 0 && b === 0) return 0;
  if (r === 255 && g === 255 && b === 255) return 0;

  // Exact match
  let key = rgbaToKey(r, g, b, 255);
  if (colorToId[key]) return colorToId[key];

  // Try ±1 per-channel offsets, clamped; first hit wins
  for (const off of compressionOffsets) {
    const rr = clamp8(r + off.r);
    const gg = clamp8(g + off.g);
    const bb = clamp8(b + off.b);
    key = rgbaToKey(rr, gg, bb, 255);
    const id = colorToId[key];
    if (id) return id;
  }
  return 0;
}

type TileIds = { w: number; h: number; ids: Uint32Array };

/**
 * Read a tile and map each pixel to a city id (0 = no city).
 * Decoding goes through canvas-wasm; reading the PNG bytes directly gave corrupted pixels.
 */
async function readTileIds(tilePath: string): Promise<TileIds> {
  const img = await loadImage(await Deno.readFile(tilePath));
  const w = TILE_SIZE; // tiles are known 256x256
  const h = TILE_SIZE;
  const ctx = createCanvas(w, h).getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  const pixels = ctx.getImageData(0, 0, w, h).data; // RGBA Uint8ClampedArray
  const ids = new Uint32Array(w * h);
  for (let pos = 0; pos < ids.length; pos++) {
    const idx = pos << 2;
    ids[pos] = pixels[idx + 3] === 0 ? 0 : colorToIdLookup(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
  }
  return { w, h, ids };
}

function getIdAt(tileMap: Map<string, TileIds>, tx: number, ty: number, x: number, y: number): number {
  // Move across tile boundaries if needed
  let nx = x, ny = y, ntx = tx, nty = ty;
  if (nx < 0) { ntx = tx - 1; nx = TILE_SIZE - 1; }
  else if (nx >= TILE_SIZE) { ntx = tx + 1; nx = 0; }
  if (ny < 0) { nty = ty - 1; ny = TILE_SIZE - 1; }
  else if (ny >= TILE_SIZE) { nty = ty + 1; ny = 0; }
  const key = `${ntx}_${nty}`;
  const tile = tileMap.get(key);
  if (!tile) return 0;
  return tile.ids[ny * tile.w + nx] || 0;
}

function addEdge(edges: Map<number, Set<string>>, cityId: number, x1: number, y1: number, x2: number, y2: number) {
  // Normalize edge orientation for uniqueness
  let ax = x1, ay = y1, bx = x2, by = y2;
  if (ax > bx || (ax === bx && ay > by)) { const tx = ax; const ty = ay; ax = bx; ay = by; bx = tx; by = ty; }
  const k = `${ax},${ay}|${bx},${by}`;
  if (!edges.has(cityId)) edges.set(cityId, new Set());
  edges.get(cityId)!.add(k);
}

function globalVertexToLatLon(vx: number, vy: number): [number, number] {
  const n = Math.pow(2, ZOOM_LEVEL);
  const lon = (vx / (n * TILE_SIZE)) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (vy / (n * TILE_SIZE)))));
  const lat = latRad * 180 / Math.PI;
  return [lon, lat];
}

/**
 * Main conversion function
 */
async function convertTilesToGeojson() {
  console.log('Starting tile to GeoJSON conversion...');

  const tilesDir = `${scriptDir}/tiles`;
  const files: string[] = [];
  for await (const entry of Deno.readDir(tilesDir)) {
    if (entry.isFile && entry.name.endsWith('.png') && entry.name !== 'none.png') {
      const m = entry.name.match(/^(\d+)_(\d+)\.png$/);
      if (!m) continue;
      const x = parseInt(m[1], 10);
      const y = parseInt(m[2], 10);
      if (FILTER_TILES) {
        if (x < FILTER_MIN_X || x > FILTER_MAX_X || y < FILTER_MIN_Y || y > FILTER_MAX_Y) continue;
      }
      files.push(entry.name);
    }
  }

  console.log(`Found ${files.length} tiles to process${FILTER_TILES ? ` (filtered ${FILTER_MIN_X}_${FILTER_MIN_Y} to ${FILTER_MAX_X}_${FILTER_MAX_Y})` : ''}`);

  // Pass 1: Read tiles into per-pixel ID arrays for cross-tile edge union
  const tileMap = new Map<string, TileIds>();
  let processed = 0;
  for (const file of files) {
    const m = file.match(/^(\d+)_(\d+)\.png$/);
    if (!m) continue;
    const tileX = parseInt(m[1], 10);
    const tileY = parseInt(m[2], 10);
    const ids = await readTileIds(`${tilesDir}/${file}`);
    tileMap.set(`${tileX}_${tileY}`, ids);
    processed++;
    if (processed % 50 === 0) console.log(`Loaded ${processed}/${files.length} tiles...`);
  }
  console.log(`Loaded ${tileMap.size} tiles of ${files.length}`);

  // Pass 2: Build union boundary edges per city across all tiles
  const cityEdges = new Map<number, Set<string>>();
  for (const [key, t] of tileMap.entries()) {
    const [tileX, tileY] = key.split('_').map(Number);
    for (let y = 0; y < t.h; y++) {
      for (let x = 0; x < t.w; x++) {
        const id = t.ids[y * t.w + x];
        if (!id) continue;
        // For each side, if neighbor is different, add that border edge in global pixel vertex coords
        // left
        if (getIdAt(tileMap, tileX, tileY, x - 1, y) !== id) {
          addEdge(cityEdges, id, tileX * TILE_SIZE + x, tileY * TILE_SIZE + y, tileX * TILE_SIZE + x, tileY * TILE_SIZE + (y + 1));
        }
        // right
        if (getIdAt(tileMap, tileX, tileY, x + 1, y) !== id) {
          addEdge(cityEdges, id, tileX * TILE_SIZE + (x + 1), tileY * TILE_SIZE + y, tileX * TILE_SIZE + (x + 1), tileY * TILE_SIZE + (y + 1));
        }
        // top
        if (getIdAt(tileMap, tileX, tileY, x, y - 1) !== id) {
          addEdge(cityEdges, id, tileX * TILE_SIZE + x, tileY * TILE_SIZE + y, tileX * TILE_SIZE + (x + 1), tileY * TILE_SIZE + y);
        }
        // bottom
        if (getIdAt(tileMap, tileX, tileY, x, y + 1) !== id) {
          addEdge(cityEdges, id, tileX * TILE_SIZE + x, tileY * TILE_SIZE + (y + 1), tileX * TILE_SIZE + (x + 1), tileY * TILE_SIZE + (y + 1));
        }
      }
    }
  }
  console.log(`Built edge sets for ${cityEdges.size} cities`);

  // Convert edge sets to polygons (stream output to GeoJSON to minimize RAM)
  const geojsonPath = `${scriptDir}/${OUTPUT_FILE}`;
  const file = await Deno.open(geojsonPath, { create: true, write: true, truncate: true });
  const enc = new TextEncoder();
  await file.write(enc.encode('{"type":"FeatureCollection","features":[\n'));
  let firstFeature = true;
  const cityIds = Array.from(cityEdges.keys());
  const totalCities = cityIds.length;
  let polygonCount = 0;
  let skippedCount = 0;
  let unknownMeta = 0;

  for (let i = 0; i < cityIds.length; i++) {
    const cityId = cityIds[i];
    const edgeSet = cityEdges.get(cityId);
    if (!edgeSet || edgeSet.size === 0) { skippedCount++; continue; }
    // Convert edge strings to numeric edges
    const edges: Array<[[number, number],[number, number]]> = [];
    for (const ek of edgeSet) {
      const [a, b] = ek.split('|');
      const [ax, ay] = a.split(',').map(Number);
      const [bx, by] = b.split(',').map(Number);
      edges.push([[ax, ay], [bx, by]]);
    }
    const ringsGrid = stitchEdgesToRings(edges);
    if (ringsGrid.length === 0) { skippedCount++; continue; }
    // Map to lon/lat
    // FIXME: every ring becomes its own polygon, so a hole (an enclave of another city, or
    // unpainted pixels) is written as a filled polygon instead of an interior ring.
    const polygonsLL: number[][][] = [];
    for (const ring of ringsGrid) {
      let coords: [number, number][] = ring.map(([vx, vy]) => globalVertexToLatLon(vx, vy));
      // ensure closed
      if (coords[0][0] !== coords[coords.length-1][0] || coords[0][1] !== coords[coords.length-1][1]) coords.push(coords[0]);
      // remove collinear points on axis-aligned segments
      coords = removeCollinear(coords);
      polygonsLL.push(coords as unknown as number[][]);
    }
    const city = cityById[cityId];
    if (!city) unknownMeta++;
    const feature = {
      type: 'Feature',
      id: cityId,
      properties: {
        id: cityId,
        name: city ? city.n : `City ${cityId}`,
        population: city ? city.p : 0
      },
      geometry: polygonsLL.length === 1 ? {
        type: 'Polygon',
        coordinates: [polygonsLL[0]]
      } : {
        type: 'MultiPolygon',
        coordinates: polygonsLL.map(r => [r])
      }
    };
    // Stream this feature to file
    const prefix = firstFeature ? '' : ',\n';
    firstFeature = false;
    await file.write(enc.encode(prefix + JSON.stringify(feature)));
    polygonCount++;
    if ((i + 1) % 100 === 0) {
      console.log(`Converting polygons: ${i + 1}/${totalCities} cities (${polygonCount} polygons, ${skippedCount} skipped)...`);
    }
  }

  console.log(`Created ${polygonCount} city polygons (${skippedCount} skipped)`);
  if (unknownMeta > 0) {
    console.log(`Note: ${unknownMeta} features lacked metadata (id not in 2020cities15k_trimmed.json).`);
  }
  // Close GeoJSON array and object
  await file.write(enc.encode('\n]}\n'));
  file.close();
  console.log(`Written GeoJSON to ${geojsonPath}`);
}

convertTilesToGeojson().catch((e) => { console.error(e); Deno.exit(1); });
