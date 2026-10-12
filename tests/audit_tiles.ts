/**
 * Measures how faithfully cities_sanitized.topojson reproduces the PNG tiles: the polygons are
 * rasterised back onto the tile pixel grid and compared with the tiles pixel by pixel.
 * Prints agreement, lost, wrong-city and gained pixel counts and the worst cities.
 *
 * Run with: deno run --allow-read --allow-env --allow-ffi --allow-net --no-lock --v8-flags=--max-old-space-size=8192 tests/audit_tiles.ts
 */
import { createCanvas, loadImage } from "jsr:@gfx/canvas-wasm";
import { feature } from "npm:topojson-client@3.1.0";
const REPO = `${import.meta.dirname}/..`;
const TILE_SIZE = 256;
const colorToId: Record<string, number> = JSON.parse(await Deno.readTextFile(`${REPO}/res/colorToId.json`));
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
async function readTileIds(tilePath: string): Promise<Uint32Array> {
  const img = await loadImage(await Deno.readFile(tilePath));
  const ctx = createCanvas(256, 256).getContext("2d");
  ctx.drawImage(img, 0, 0, 256, 256);
  const pixels = ctx.getImageData(0, 0, 256, 256).data;
  const ids = new Uint32Array(65536);
  for (let pos = 0; pos < ids.length; pos++) {
    const idx = pos << 2;
    ids[pos] = pixels[idx + 3] === 0 ? 0 : colorToIdLookup(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
  }
  return ids;
}
const N = 32768;
const tiles = new Map<number, Uint32Array>(); // key tx*1000+ty
const tileIdsPresent = new Map<number, number>(); // id -> pixels
for await (const e of Deno.readDir(`${REPO}/tiles`)) {
  const m = e.name.match(/^(\d+)_(\d+)\.png$/);
  if (!m) continue;
  const ids = await readTileIds(`${REPO}/tiles/${e.name}`);
  tiles.set(+m[1] * 1000 + +m[2], ids);
  for (let i = 0; i < 65536; i++) { const v = ids[i]; if (v) tileIdsPresent.set(v, (tileIdsPresent.get(v) ?? 0) + 1); }
}
console.log("tiles", tiles.size, "ids", tileIdsPresent.size);

const topo = JSON.parse(await Deno.readTextFile(`${REPO}/cities_sanitized.topojson`));
const fc: any = feature(topo, topo.objects.cities);
const poly = new Map<number, Uint32Array>();
const overlapPix = { n: 0 };
const polyCount = new Map<number, number>();
const names = new Map<number, string>();
function gx(lon: number) { return (lon + 180) / 360 * N; }
function gy(lat: number) { return (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * N; }
function fill(id: number, rings: number[][][]) {
  const pr = rings.map((r) => r.map(([lo, la]) => [gx(lo), gy(la)]));
  let minY = Infinity, maxY = -Infinity;
  for (const r of pr) for (const p of r) { if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1]; }
  for (let py = Math.max(0, Math.floor(minY - 1)); py <= Math.min(N - 1, Math.ceil(maxY)); py++) {
    const y = py + 0.5; const xs: number[] = [];
    for (const r of pr) for (let i = 0; i < r.length - 1; i++) {
      const [x1, y1] = r[i], [x2, y2] = r[i + 1];
      if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) xs.push(x1 + (y - y1) / (y2 - y1) * (x2 - x1));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.ceil(xs[k] - 0.5), b = Math.ceil(xs[k + 1] - 0.5) - 1; // px+0.5 in [xa,xb)
      for (let px = Math.max(0, a); px <= Math.min(N - 1, b); px++) {
        const key = (px >> 8) * 1000 + (py >> 8);
        let g = poly.get(key); if (!g) { g = new Uint32Array(65536); poly.set(key, g); }
        const o = (py & 255) * 256 + (px & 255);
        if (g[o]) { if (g[o] !== id) overlapPix.n++; else overlapPix.n++; } else { g[o] = id; polyCount.set(id, (polyCount.get(id) ?? 0) + 1); }
      }
    }
  }
}
const topoIds = new Set<number>();
for (const f of fc.features) {
  const id = +f.properties.id; topoIds.add(id); names.set(id, f.properties.name);
  const g = f.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  for (const p of polys) fill(id, p);
}
let tilePainted = 0, polyCovered = 0, agree = 0, lost = 0, wrong = 0, gained = 0, gainedNoTile = 0;
const cAgree = new Map<number, number>();
for (const [k, t] of tiles) {
  const p = poly.get(k);
  for (let i = 0; i < 65536; i++) {
    const a = t[i], b = p ? p[i] : 0;
    if (a) tilePainted++;
    if (b) polyCovered++;
    if (a && b) { if (a === b) { agree++; cAgree.set(a, (cAgree.get(a) ?? 0) + 1); } else wrong++; }
    else if (a) lost++;
    else if (b) gained++;
  }
}
for (const [k, p] of poly) if (!tiles.has(k)) for (let i = 0; i < 65536; i++) if (p[i]) { polyCovered++; gained++; gainedNoTile++; }
const pct = (x: number, d: number) => (100 * x / d).toFixed(2) + "%";
console.log({ tilePainted, polyCovered, agree, agreePct: pct(agree, tilePainted), lost, lostPct: pct(lost, tilePainted), wrong, wrongPct: pct(wrong, tilePainted), gained, gainedNoTile, overlap: overlapPix.n });
const rows = [...tileIdsPresent].filter(([id]) => topoIds.has(id)).map(([id, n]) => ({ id, name: names.get(id), n, a: cAgree.get(id) ?? 0, r: (cAgree.get(id) ?? 0) / n, poly: polyCount.get(id) ?? 0 }));
rows.sort((x, y) => x.r - y.r);
console.log("lowest15"); for (const r of rows.slice(0, 15)) console.log(r.id, r.name, r.n, r.a, (100 * r.r).toFixed(1) + "%");
console.log("cities", rows.length, "<90%", rows.filter((r) => r.r < .9).length, "<50%", rows.filter((r) => r.r < .5).length, "mean", (100 * rows.reduce((s, r) => s + r.r, 0) / rows.length).toFixed(2));
const mid = rows.filter((r) => r.n > 500 && r.n < 3000)[10]; console.log("sanity", mid, "poly/tile", mid.poly / mid.n);
const inTilesNotTopo = [...tileIdsPresent.keys()].filter((i) => !topoIds.has(i));
const inTopoNotTiles = [...topoIds].filter((i) => !tileIdsPresent.has(i));
console.log("tiles-not-topo", inTilesNotTopo.length, inTilesNotTopo.slice(0, 10), "topo-not-tiles", inTopoNotTiles.length, inTopoNotTiles.slice(0, 10).map((i) => [i, names.get(i)]));
console.log("pixels of tile-only ids", inTilesNotTopo.reduce((s, i) => s + tileIdsPresent.get(i)!, 0));
