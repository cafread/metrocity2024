/**
 * Builds res/state_codes.json: the state code shown in a city's name, by country and GeoNames
 * admin1 code, e.g. { "CN": { "10": "HE" } } for "Tangshan, (HE), CN".
 *
 * The codes are this project's own and live in ClickHouse, data_mas0000.location_states.
 * GeoNames identifies a region by an admin1 code, so the two are linked by region name using
 * res/admin1CodesASCII.txt (https://download.geonames.org/export/dump/admin1CodesASCII.txt).
 *
 * Input: an export of the states, one JSON object per line, from
 *   SELECT country_code, state_code, name, local_name, alt_name, region_code, lat, lon
 *   FROM data_mas0000.location_states
 *   WHERE country_code IN ('AU', 'BR', 'CA', 'CN', 'IN', 'JP', 'US')
 *   FORMAT JSONEachRow
 *
 * Run with: deno run --allow-read --allow-write build_state_codes.ts <states.jsonl>
 *
 * The script stops if a mapped city already carries a different code for its region, so a
 * mismatch between the map and ClickHouse is seen before it reaches new city names.
 */

const dir = import.meta.dirname!;
const statesPath = Deno.args[0];
if (!statesPath) {
  console.error("Usage: deno run --allow-read --allow-write build_state_codes.ts <states.jsonl>");
  Deno.exit(1);
}

// Countries whose city names carry a state code
const COUNTRIES = ["AU", "BR", "CA", "CN", "IN", "JP", "US"];

type State = { country_code: string; state_code: string; name: string; local_name: string; alt_name: string[] };
const states: State[] = (await Deno.readTextFile(statesPath)).split("\n").filter(Boolean).map((line) => JSON.parse(line));

const regions = (await Deno.readTextFile(`${dir}/res/admin1CodesASCII.txt`)).split("\n").filter(Boolean)
  .map((line) => line.replace(/\r$/, "").split("\t"))
  .map(([key, name, ascii]) => ({ cc: key.split(".")[0], admin1: key.split(".")[1], name, ascii }))
  .filter((region) => COUNTRIES.includes(region.cc));

// Names are compared without accents, case or punctuation, then without words such as "Prefecture"
const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const GENERIC = ["prefecture", "province", "state of", "state", "union territory of", "union territory", "national capital territory of", "autonomous region", "municipality", "islands"];
const strip = (text: string) => {
  let s = ` ${fold(text)} `;
  for (const word of GENERIC) s = s.replace(` ${word} `, " ");
  return s.trim();
};
const namesOf = (state: State) => [state.name, state.local_name, ...state.alt_name].filter(Boolean);

const candidates = new Map<string, State[]>();
for (const region of regions) {
  const inCountry = states.filter((state) => state.country_code === region.cc);
  let hits = inCountry.filter((state) => namesOf(state).some((n) => fold(n) === fold(region.name) || fold(n) === fold(region.ascii)));
  if (hits.length !== 1) {
    const loose = inCountry.filter((state) => namesOf(state).some((n) => strip(n) !== "" && (strip(n) === strip(region.name) || strip(n) === strip(region.ascii))));
    if (loose.length > 0 && (hits.length === 0 || loose.length < hits.length)) hits = loose;
  }
  candidates.set(`${region.cc}.${region.admin1}`, hits);
}
// A name can fit two states (Shanxi also fits Shaanxi once tones are dropped). The state that
// another region matches on its own is taken, which leaves one.
const taken = new Set([...candidates.values()].filter((hits) => hits.length === 1).map((hits) => `${hits[0].country_code}.${hits[0].state_code}`));
const codes: Record<string, Record<string, string>> = {};
const unmatched: string[] = [];
for (const region of regions) {
  const key = `${region.cc}.${region.admin1}`;
  let hits = candidates.get(key)!;
  if (hits.length > 1) hits = hits.filter((state) => !taken.has(`${state.country_code}.${state.state_code}`));
  if (hits.length === 1) (codes[region.cc] ??= {})[region.admin1] = hits[0].state_code;
  else unmatched.push(`${key} ${region.name}`);
}

// Check against the cities already mapped
type Mapped = { i: number; n: string };
const mapped: Mapped[] = JSON.parse(await Deno.readTextFile(`${dir}/res/2020cities15k_trimmed.json`));
const places = (await Deno.readTextFile(`${dir}/res/cities5000.txt`)).split("\n").filter(Boolean).map((line) => line.replace(/\r$/, "").split("\t"));
const header = places.shift()!;
const ID = header.indexOf("geonameid"), CC = header.indexOf("country code"), ADMIN1 = header.indexOf("admin1 code");
const placeById = new Map(places.map((row) => [Number(row[ID]), row]));
const conflicts: string[] = [];
let agreed = 0;
for (const city of mapped) {
  const row = placeById.get(city.i);
  const m = city.n.match(/, \(([^)]+)\), ([A-Z]{2})$/);
  // A city named under another country than GeoNames files it (Macau, (MO), CN) is a custom name
  if (!row || !m || m[2] !== row[CC]) continue;
  const code = codes[row[CC]]?.[row[ADMIN1]];
  if (!code) conflicts.push(`${city.n}: no state code for ${row[CC]} admin1 ${row[ADMIN1]}`);
  else if (code !== m[1]) conflicts.push(`${city.n}: ClickHouse gives (${code})`);
  else agreed++;
}
// Regions that places use but admin1CodesASCII.txt no longer lists
const missing = new Map<string, number>();
for (const row of places) {
  if (COUNTRIES.includes(row[CC]) && !codes[row[CC]]?.[row[ADMIN1]]) missing.set(`${row[CC]}.${row[ADMIN1]}`, (missing.get(`${row[CC]}.${row[ADMIN1]}`) ?? 0) + 1);
}

console.log(`Regions matched to a state code: ${regions.length - unmatched.length} of ${regions.length}`);
if (unmatched.length) console.log(`Unmatched regions: ${unmatched.join("; ")}`);
console.log(`Mapped cities agreeing with the table: ${agreed}`);
if (missing.size) console.log(`Places left without a state code: ${[...missing].map(([key, count]) => `${key} (${count})`).join(", ")}`);
if (conflicts.length) {
  console.error(`Mapped cities that disagree with the table (${conflicts.length}); nothing written:\n${conflicts.join("\n")}`);
  Deno.exit(1);
}

const sorted = Object.fromEntries(Object.keys(codes).sort().map((cc) => [cc, Object.fromEntries(Object.entries(codes[cc]).sort(([a], [b]) => a.localeCompare(b)))]));
await Deno.writeTextFile(`${dir}/res/state_codes.json`, JSON.stringify(sorted, null, 1) + "\n");
console.log("Wrote res/state_codes.json");
