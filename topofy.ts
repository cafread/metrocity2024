/**
 * Convert GeoJSON FeatureCollection to TopoJSON using Deno + npm topojson packages.
 * Usage:
 *   deno run --allow-read --allow-write topofy.ts --in cities.geojson --out cities.topojson --quantize 100000 --simplify 0.0015
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
topo = simplify(topo, S);

// Write TopoJSON
await Deno.writeTextFile(outputPath, JSON.stringify(topo));
console.log(`Wrote TopoJSON to ${outputPath}`);
