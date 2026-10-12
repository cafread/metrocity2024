/**
 * Convert GeoJSON FeatureCollection to TopoJSON using Deno + npm topojson packages.
 * Usage:
 *   deno run --allow-read --allow-write topofy.ts --in cities_sanitized.geojson --out cities_sanitized.topojson --quantize 100000 --simplify 0.0015
 * The values shown are the defaults and the ones used for the committed cities_sanitized.topojson.
 */

import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import { topology } from "npm:topojson-server@3.0.1";
import { presimplify, simplify } from "npm:topojson-simplify@3.0.3";

type Feature = {
  type: "Feature";
  geometry: { type: string; coordinates: any } | null;
  properties?: Record<string, unknown>;
  id?: number | string;
};
type FeatureCollection = { type: "FeatureCollection"; features: Feature[] };

const args = parse(Deno.args);
const inputPath = (args.in as string) ?? "cities.geojson";
const outputPath = (args.out as string) ?? inputPath.replace(/\.geojson$/i, ".topojson");
const Q = args.quantize ? Number(args.quantize) : 100000; // quantization grid
const S = args.simplify ? Number(args.simplify) : 0.0015; // area threshold
const MIN_RING_POINTS = 4; // vertices every ring keeps through simplification, where it has that many

// Simplification drops every point whose triangle is smaller than S, so a ring smaller than
// about S (a few tile pixels: a tiny city, or a hole) would lose all its points. Mark the
// heaviest points of such rings as permanent. Arcs are shared, so both sides stay identical.
// deno-lint-ignore no-explicit-any
function protectSmallRings(topo: any, minWeight: number): number {
  let promoted = 0;
  const visitRing = (ring: number[]) => {
    const droppable: number[][] = [];
    let kept = 0;
    for (const i of ring) {
      const arc: number[][] = topo.arcs[i < 0 ? ~i : i];
      kept++; // one end of each arc; the other end is the start of the next arc
      for (let k = 1; k < arc.length - 1; k++) {
        if (arc[k][2] >= minWeight) kept++;
        else droppable.push(arc[k]);
      }
    }
    if (kept >= MIN_RING_POINTS) return;
    droppable.sort((a, b) => b[2] - a[2]);
    for (const point of droppable.slice(0, MIN_RING_POINTS - kept)) {
      point[2] = Infinity;
      promoted++;
    }
  };
  // deno-lint-ignore no-explicit-any
  const visit = (geometry: any) => {
    if (geometry.type === "GeometryCollection") geometry.geometries.forEach(visit);
    else if (geometry.type === "Polygon") geometry.arcs.forEach(visitRing);
    else if (geometry.type === "MultiPolygon") geometry.arcs.forEach((polygon: number[][]) => polygon.forEach(visitRing));
  };
  Object.values(topo.objects).forEach(visit);
  return promoted;
}

console.log(`Reading GeoJSON from ${inputPath}`);
const text = await Deno.readTextFile(inputPath);
const geojson = JSON.parse(text) as FeatureCollection;

if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
  throw new Error("Input must be a GeoJSON FeatureCollection with features array");
}

// Build Topology with quantization (name the layer 'cities')
console.log(`Building Topology (quantization=${Q})...`);
let topo = topology({ cities: geojson }, Q);

// Presimplify + Simplify to reduce arcs (optional)
console.log(`Presimplify + Simplify with S=${S}`);
topo = presimplify(topo);
console.log(`Kept ${protectSmallRings(topo, S)} extra points so small rings survive`);
topo = simplify(topo, S);

// Write TopoJSON
await Deno.writeTextFile(outputPath, JSON.stringify(topo));
console.log(`Wrote TopoJSON to ${outputPath}`);
