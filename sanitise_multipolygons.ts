/**
 * Sanitize MultiPolygons by keeping only the largest polygon (by area),
 * converting all MultiPolygons to Polygons and dropping holes.
 *
 * This removes micro-polygons/islands that cause bugs in the editing system
 * while keeping the main polygon for each city.
 *
 * Works on the GeoJSON, before topofy.ts, so the data is quantised and simplified only once.
 *
 * Usage (Deno):
 *   deno run --allow-read --allow-write sanitise_multipolygons.ts cities.geojson cities_sanitized.geojson
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
  let holesRemoved = 0;

  const sanitized = {
    type: 'FeatureCollection',
    features: geojson.features.map((feature: any) => {
      if (feature.geometry.type !== 'MultiPolygon') {
        holesRemoved += feature.geometry.coordinates.length - 1;
        return {...feature, geometry: {type: 'Polygon', coordinates: [feature.geometry.coordinates[0]]}};
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
          coordinates: [largestPolygon[0]]
        }
      };
      holesRemoved += largestPolygon.length - 1;

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
  console.log(`  Holes removed: ${holesRemoved}`);
  console.log(`  Final Polygons: ${sanitized.features.length}`);

  return sanitized;
}

// CLI usage
if (import.meta.main) {
  const args = Deno.args;

  if (args.length < 2) {
    console.error('Usage: deno run --allow-read --allow-write sanitise_multipolygons.ts <input> <output>');
        Deno.exit(1);
  }

  const [inputPath, outputPath] = args;

  console.log(`Reading ${inputPath}...`);
  const inputText = await Deno.readTextFile(inputPath);
  const inputData = JSON.parse(inputText);

  if (inputData.type !== 'FeatureCollection') {
    console.error('Expected a GeoJSON FeatureCollection');
    Deno.exit(1);
  }

  // Sanitize
  console.log('Sanitizing MultiPolygons...');
  const outputData = sanitiseMultiPolygons(inputData);

  // Write output
  console.log(`Writing ${outputPath}...`);
  await Deno.writeTextFile(outputPath, JSON.stringify(outputData));

  console.log('Done!');
}
