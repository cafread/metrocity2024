/**
 * Sanitize MultiPolygons by keeping only the largest polygon (by area)
 * and converting all MultiPolygons to Polygons.
 *
 * This removes micro-polygons/islands that cause bugs in the editing system
 * while keeping the main polygon for each city.
 *
 * Usage (Deno):
 *   deno run --allow-read --allow-write sanitise_multipolygons.ts cities.geojson cities_sanitized.geojson
 *   deno run --allow-read --allow-write sanitise_multipolygons.ts cities.topojson cities_sanitized.topojson
 */

/**
 * Calculate the area of a polygon ring using the Shoelace formula
 * @param {Array<Array<number>>} ring - Array of [lng, lat] coordinates
 * @returns {number} Absolute area in degrees squared
 */
export function calculatePolygonArea(ring: number[][]): number {
  if (!ring || ring.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    area += (x1 * y2) - (x2 * y1);
  }

  return Math.abs(area / 2);
}

/**
 * Find the largest polygon in a MultiPolygon by area
 * @param {Array<Array<Array<number>>>} polygons - Array of polygons (each is array of rings)
 * @returns {Array<Array<Array<number>>>} The largest polygon
 */
export function findLargestPolygon(polygons: number[][][][]): number[][][] | null {
  if (!polygons || polygons.length === 0) return null;
  if (polygons.length === 1) return polygons[0];

  let largestPolygon = polygons[0];
  let largestArea = calculatePolygonArea(polygons[0][0]); // Outer ring of first polygon

  for (let i = 1; i < polygons.length; i++) {
    const polygon = polygons[i];
    const area = calculatePolygonArea(polygon[0]); // Outer ring

    if (area > largestArea) {
      largestArea = area;
      largestPolygon = polygon;
    }
  }

  return largestPolygon;
}

/**
 * Sanitize a GeoJSON FeatureCollection by converting all MultiPolygons to Polygons
 */
export function sanitiseMultiPolygons(geojson: any): any {
  if (!geojson || geojson.type !== 'FeatureCollection') {
    throw new Error('Input must be a GeoJSON FeatureCollection');
  }

  let multiPolygonCount = 0;
  let convertedCount = 0;
  let totalPolygonsRemoved = 0;

  const sanitized = {
    type: 'FeatureCollection',
    features: geojson.features.map((feature: any) => {
      // Only process MultiPolygon features
      if (feature.geometry.type !== 'MultiPolygon') {
        return feature;
      }

      multiPolygonCount++;
      const polygons = feature.geometry.coordinates;
      const polygonCount = polygons.length;

      // Find the largest polygon
      const largestPolygon = findLargestPolygon(polygons);

      if (!largestPolygon) {
        console.warn(`Warning: City ${feature.properties.name} (ID: ${feature.properties.id}) has no valid polygons`);
        return feature;
      }

      // Create new feature with Polygon geometry
      const sanitizedFeature = {
        ...feature,
        geometry: {
          type: 'Polygon',
          coordinates: largestPolygon
        }
      };

      convertedCount++;
      totalPolygonsRemoved += (polygonCount - 1);

      // Log cities with many polygons removed
      if (polygonCount > 2) {
        console.log(`  ${feature.properties.name}: kept 1 polygon, removed ${polygonCount - 1} micro-polygons`);
      }

      return sanitizedFeature;
    })
  };

  console.log('\nSanitization Summary:');
  console.log(`  Total features: ${geojson.features.length}`);
  console.log(`  MultiPolygons found: ${multiPolygonCount}`);
  console.log(`  MultiPolygons converted: ${convertedCount}`);
  console.log(`  Total micro-polygons removed: ${totalPolygonsRemoved}`);
  console.log(`  Final Polygons: ${sanitized.features.length}`);

  return sanitized;
}

// CLI usage
if (import.meta.main) {
  const args = Deno.args;

  if (args.length < 2) {
    console.error('Usage: deno run --allow-read --allow-write sanitise_multipolygons.ts <input> <output>');
    console.error('Example: deno run --allow-read --allow-write sanitise_multipolygons.ts cities.geojson cities_sanitized.geojson');
    Deno.exit(1);
  }

  const [inputPath, outputPath] = args;

  console.log(`Reading ${inputPath}...`);
  const inputText = await Deno.readTextFile(inputPath);
  const inputData = JSON.parse(inputText);

  // Detect if TopoJSON or GeoJSON
  let geojson: any;
  let isTopojson = false;

  if (inputData.type === 'Topology' && inputData.objects) {
    console.log('Detected TopoJSON format');
    isTopojson = true;

    // Import topojson-client for conversion
    const { feature } = await import('npm:topojson-client@3.1.0');
    geojson = feature(inputData, inputData.objects.cities);
  } else if (inputData.type === 'FeatureCollection') {
    console.log('Detected GeoJSON format');
    geojson = inputData;
  } else {
    console.error('Unknown format - expected GeoJSON FeatureCollection or TopoJSON');
    Deno.exit(1);
  }

  // Sanitize
  console.log('Sanitizing MultiPolygons...');
  const sanitized = sanitiseMultiPolygons(geojson);

  // Convert back to TopoJSON if needed
  let outputData: any;
  if (isTopojson) {
    console.log('Converting back to TopoJSON...');
    const { topology } = await import('npm:topojson-server@3.0.1');
    const { presimplify, simplify } = await import('npm:topojson-simplify@3.0.3');

    const topo = topology({ cities: sanitized }, 100000); // quantization
    const presimp = presimplify(topo);
    outputData = simplify(presimp, 0.0015);
  } else {
    outputData = sanitized;
  }

  // Write output
  console.log(`Writing ${outputPath}...`);
  await Deno.writeTextFile(outputPath, JSON.stringify(outputData));

  console.log('Done!');
}
