/**
 * End-to-end check of viewer.html through headless Chrome with real mouse and keyboard input.
 * Covers selecting, vertex drag/add/delete with shared borders, snapping, undo and redo, rename,
 * adding a city from GeoNames, reload, revert, delete, export, the map cut, commit, mock login
 * and push, and keyboard navigation of the search boxes.
 *
 * Needs dev_server.ts running on port 4507 and a local Chrome. It writes test pushes to
 * dev_pushes.jsonl as user "e2e-test" and clears the page's localStorage.
 *
 * Run with: deno run -A --no-lock tests/e2e.ts [screenshot.png]
 * Set CHROME_PATH if Chrome is not in its default Windows location.
 */
// @ts-nocheck The functions passed to page.evaluate run in the browser and use the page's own globals
import puppeteer from "npm:puppeteer-core@23.11.1";

const URL_ = "http://localhost:4507/viewer.html";
const SHOT = Deno.args[0] ?? "shot.png";
const browser = await puppeteer.launch({
  executablePath: Deno.env.get("CHROME_PATH") ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-first-run", "--window-size=1500,950"],
  protocolTimeout: 120000,
  defaultViewport: { width: 1500, height: 950 },
});
const problems: string[] = [];
// Each load uses a fresh tab. Navigating one tab from a loaded map to another made headless
// Chrome drop the session in most runs.
let page = await openTab();
async function openTab() {
  const tab = await browser.newPage();
  tab.on("pageerror", (e) => problems.push("pageerror: " + e.message));
  tab.on("console", (m) => { if ((m.type() === "error" || m.type() === "warn") && !m.text().includes("401")) problems.push(`console.${m.type()}: ${m.text()}`); });
  tab.on("dialog", async (d) => { problems.push("unexpected dialog: " + d.message()); await d.dismiss(); });
  return tab;
}

let failed = 0;
function check(name: string, ok: boolean, detail: unknown = "") {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail !== "" ? "  " + JSON.stringify(detail) : ""}`);
}
const ev = <T>(fn: any, ...args: any[]): Promise<T> => page.evaluate(fn, ...args) as Promise<T>;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function load() {
  if (page.url() !== "about:blank") {
    const old = page;
    page = await openTab();
    await old.close();
  }
  await page.goto(URL_, { waitUntil: "domcontentloaded" });
  await page.waitForFunction("typeof cities !== 'undefined' && cities.size > 0 && document.getElementById('loading').style.display === 'none'", { timeout: 60000 });
  await page.waitForFunction("countriesLayer !== null", { timeout: 60000 });
}
async function dragMouse(from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let s = 1; s <= 6; s++) await page.mouse.move(from.x + ((to.x - from.x) * s) / 6, from.y + ((to.y - from.y) * s) / 6);
  await page.mouse.up();
  await sleep(150);
}
const state = () => ev<{ undo: number; redo: number; dirty: number[]; cities: number; selected: number | null; saved: boolean; status: string }>(() => ({
  undo: undoStack.length, redo: redoStack.length, dirty: dirtyIds(), cities: cities.size, selected: selectedId,
  saved: localStorage.getItem(STORAGE_KEY) !== null, status: document.getElementById("status").textContent,
}));
const px = (id: number, i: number) => ev<{ x: number; y: number }>((id, i) => { const p = toPoint(ringsOf(id)[0][i]); return { x: p.x, y: p.y }; }, id, i);
const coord = (id: number, i: number) => ev<number[]>((id, i) => ringsOf(id)[0][i], id, i);
const nVerts = (id: number) => ev<number>((id) => ringsOf(id)[0].length - 1, id);

await load();
await ev(() => localStorage.clear());
await load();
const loaded = await state();
check("loads 3721 cities with no saved edits", loaded.cities === 3721 && loaded.dirty.length === 0, loaded);

// Fixture: a European city with one vertex shared with exactly one neighbour and one unshared vertex
const fx = await ev<{ id: number; name: string; sharedIdx: number; freeIdx: number; neighbour: number } | null>(() => {
  for (const [id, layer] of cities) {
    const ring = ringsOf(id)[0];
    const c = layer.getBounds().getCenter();
    if (ring.length < 12 || c.lng < -5 || c.lng > 15 || c.lat < 42 || c.lat > 52) continue;
    let sharedIdx = -1, freeIdx = -1, neighbour = 0;
    for (let i = 1; i < ring.length - 1; i++) {
      const refs = findShared(ring[i]);
      if (refs.length === 2 && sharedIdx < 0) { sharedIdx = i; neighbour = refs.find((r: { id: number }) => r.id !== id).id; }
      if (refs.length === 1 && freeIdx < 0) freeIdx = i;
    }
    if (sharedIdx >= 0 && freeIdx >= 0) {
      map.fitBounds(layer.getBounds().pad(0.5), { animate: false });
      if (map.getZoom() < 9) map.setZoom(9, { animate: false });
      return { id, name: layer.feature.properties.name, sharedIdx, freeIdx, neighbour };
    }
  }
  return null;
});
if (!fx) throw new Error("no fixture city found");
console.log("fixture", fx);
await sleep(800);

// Select by clicking inside the polygon (browse mode zooms to it)
const inside = await ev<{ x: number; y: number }>((id: number) => {
  const layer = cities.get(id); const b = layer.getBounds();
  for (let k = 0; k < 400; k++) {
    const ll = L.latLng(b.getSouth() + Math.random() * (b.getNorth() - b.getSouth()), b.getWest() + Math.random() * (b.getEast() - b.getWest()));
    const pt = map.latLngToContainerPoint(ll);
    const el = document.elementFromPoint(pt.x, pt.y);
    if (el === layer.getElement()) return { x: pt.x, y: pt.y };
  }
  return { x: -1, y: -1 };
}, fx.id);
await page.mouse.click(inside.x, inside.y);
await sleep(900);
check("clicking a polygon selects it", (await state()).selected === fx.id);

await page.click("#editMode");
await sleep(300);
const markers = await ev<number>(() => vertexMarkers.length);
check("edit mode shows one handle per vertex", markers === await nVerts(fx.id), { markers });
check("edit mode shows rename fields", await ev<boolean>(() => !!document.getElementById("cityName")));

// 1. Drag a shared vertex with snapping off: both cities must move together
await page.click('input[name="snapMode"][value="none"]');
const sharedBefore = await coord(fx.id, fx.sharedIdx);
const nbVertsBefore = await ev<number[][]>((id: number) => ringsOf(id)[0], fx.neighbour);
let p = await px(fx.id, fx.sharedIdx);
await dragMouse(p, { x: p.x + 25, y: p.y + 18 });
let s = await state();
const sharedAfter = await coord(fx.id, fx.sharedIdx);
const nbHas = await ev<boolean>((id: number, c: number[]) => ringsOf(id)[0].some((v: number[]) => same(v, c)), fx.neighbour, sharedAfter);
check("drag moves the vertex", Math.abs(sharedAfter[0] - sharedBefore[0]) > 1e-6, { sharedBefore, sharedAfter });
check("neighbour's shared vertex moved with it", nbHas);
check("one undo step, two dirty cities, saved", s.undo === 1 && s.dirty.length === 2 && s.saved, s);
check("selection kept after drag", s.selected === fx.id);

// 2. Undo with Ctrl+Z, redo with Ctrl+Y
await page.keyboard.down("Control"); await page.keyboard.press("z"); await page.keyboard.up("Control");
await sleep(150);
s = await state();
const afterUndo = await coord(fx.id, fx.sharedIdx);
const nbRestored = await ev<boolean>((id: number, before: number[][]) => JSON.stringify(ringsOf(id)[0]) === JSON.stringify(before), fx.neighbour, nbVertsBefore);
check("undo restores both cities exactly", afterUndo[0] === sharedBefore[0] && afterUndo[1] === sharedBefore[1] && nbRestored);
check("undo leaves nothing dirty and clears storage", s.dirty.length === 0 && !s.saved && s.undo === 0 && s.redo === 1, s);
await page.keyboard.down("Control"); await page.keyboard.press("y"); await page.keyboard.up("Control");
await sleep(150);
s = await state();
const afterRedo = await coord(fx.id, fx.sharedIdx);
check("redo reapplies the move", afterRedo[0] === sharedAfter[0] && s.dirty.length === 2 && s.redo === 0, s);

// 3. A click on a vertex without moving records nothing
p = await px(fx.id, fx.freeIdx);
await page.mouse.move(p.x, p.y); await page.mouse.down(); await page.mouse.up(); await sleep(100);
check("click without movement records no edit", (await state()).undo === 1);

// 4. Snap: drag the free vertex next to a neighbour vertex with city snapping on
await page.click('input[name="snapMode"][value="cities"]');
const snapTarget = await ev<{ x: number; y: number; c: number[]; id: number } | null>((id: number, freeIdx: number) => {
  const from = toPoint(ringsOf(id)[0][freeIdx]);
  let best: { x: number; y: number; c: number[]; id: number; d: number } | null = null;
  cities.forEach((layer, oid) => {
    if (oid === id) return;
    ringsOf(oid)[0].forEach((c: number[]) => {
      if (ringsOf(id)[0].some((v: number[]) => same(v, c))) return; // not already shared
      const q = toPoint(c); const d = Math.hypot(q.x - from.x, q.y - from.y);
      if (q.x > 20 && q.x < 1180 && q.y > 20 && q.y < 930 && (!best || d < best.d)) best = { x: q.x, y: q.y, c, id: oid, d };
    });
  });
  return best;
}, fx.id, fx.freeIdx);
if (snapTarget) {
  await dragMouse(p, { x: snapTarget.x + 6, y: snapTarget.y + 5 });
  const snapped = await coord(fx.id, fx.freeIdx);
  check("dropping near a neighbour vertex snaps onto it exactly", snapped[0] === snapTarget.c[0] && snapped[1] === snapTarget.c[1], { snapped, target: snapTarget.c });
  await page.click("#undoBtn"); await sleep(100);
} else check("snap target available", false);

// 5. Add a vertex on an edge of the selected city
await page.click('input[name="tool"][value="add"]');
const vBefore = await nVerts(fx.id);
const a = await px(fx.id, fx.freeIdx), b = await px(fx.id, fx.freeIdx + 1);
await page.mouse.click((a.x + b.x) / 2, (a.y + b.y) / 2);
await sleep(200);
s = await state();
check("add tool inserts a vertex on the clicked edge", await nVerts(fx.id) === vBefore + 1 && s.selected === fx.id, { before: vBefore, after: await nVerts(fx.id), status: s.status });
// Add on a shared edge: the neighbour must get the vertex too
const sharedEdge = await ev<{ i: number; other: number } | null>((id: number) => {
  const ring = ringsOf(id)[0];
  for (let i = 0; i < ring.length - 1; i++) {
    for (const ref of findShared(ring[i])) {
      if (ref.id === id) continue;
      const o = ringsOf(ref.id)[ref.r]; const n = o.length - 1;
      if (same(o[(ref.i + 1) % n], ring[i + 1]) || same(o[(ref.i + n - 1) % n], ring[i + 1])) return { i, other: ref.id };
    }
  }
  return null;
}, fx.id);
if (sharedEdge) {
  const oBefore = await nVerts(sharedEdge.other);
  const e1 = await px(fx.id, sharedEdge.i), e2 = await px(fx.id, sharedEdge.i + 1);
  await page.mouse.click((e1.x + e2.x) / 2, (e1.y + e2.y) / 2);
  await sleep(200);
  check("adding on a shared edge adds the vertex to the neighbour too", await nVerts(sharedEdge.other) === oBefore + 1, { other: sharedEdge.other, long: Math.hypot(e1.x - e2.x, e1.y - e2.y) });
  await page.click("#undoBtn"); await sleep(100);
  check("undo removes it from both", await nVerts(sharedEdge.other) === oBefore && await nVerts(fx.id) === vBefore + 1);
} else console.log("SKIP  no shared edge on fixture");

// 6. Delete a vertex
await page.click('input[name="tool"][value="delete"]');
p = await px(fx.id, fx.freeIdx + 1);
await page.mouse.move(p.x, p.y); await page.mouse.down(); await page.mouse.up(); await sleep(200);
check("delete tool removes the vertex", await nVerts(fx.id) === vBefore, { after: await nVerts(fx.id) });
const closed = await ev<boolean>((id: number) => { const r = ringsOf(id)[0]; return same(r[0], r[r.length - 1]); }, fx.id);
check("ring still closed", closed);
await page.click('input[name="tool"][value="drag"]');

// 7. Rename
await page.click("#cityName", { clickCount: 3 });
await page.keyboard.type("Testville <b>, XX");
await page.keyboard.press("Tab");
await sleep(200);
const renamed = await ev<string>((id: number) => cities.get(id).feature.properties.name, fx.id);
check("rename applies", renamed === "Testville <b>, XX", renamed);
const listHtml = await ev<string>(() => document.getElementById("changeList")!.innerHTML);
check("changes list shows the renamed city, escaped", listHtml.includes("Testville &lt;b&gt;") && listHtml.includes("edited"), listHtml.slice(0, 200));

// 8. New city: draw four points, finish with Enter
const before8 = await state();
await page.click("#newCityBtn");
await page.waitForFunction("places !== null", { timeout: 60000 });
const items = () => ev<{ t: string; blocked: boolean; id: string }[]>(() => Array.from(document.querySelectorAll("#placeResults .result-item")).map((e) => ({ t: e.textContent ?? "", blocked: e.classList.contains("blocked"), id: (e as HTMLElement).dataset.id ?? "" })));
const typeSearch = async (text: string) => { await page.click("#placeSearch", { clickCount: 3 }); await page.keyboard.press("Backspace"); await page.type("#placeSearch", text); await sleep(150); };
const drawDisabled = () => ev<boolean>(() => (document.getElementById("drawBtn") as HTMLButtonElement).disabled);
check("GeoNames places load and nothing can be drawn before a pick", await ev<number>(() => places.length) > 40000 && await drawDisabled());
await typeSearch("london");
let found = await items();
check("London, GB is listed first, blocked as on the map", found[0]?.t.startsWith("London, GB") && found[0].blocked && found[0].t.includes("on the map"), found.slice(0, 3));
await page.click("#placeResults .result-item");
check("clicking a blocked place picks nothing", await ev<boolean>(() => chosenPlace === null) && await drawDisabled());
await typeSearch("san jose");
found = await items();
check("a customised city is found by its GeoNames name", found.some((f) => f.t.startsWith("Silicon Valley, (CA), US") && f.blocked), found.slice(0, 3));
await typeSearch("goteborg");
found = await items();
check("search ignores accents and matches the native spelling", found.some((f) => f.t.startsWith("Goeteborg, SE") && f.blocked), found.slice(0, 2));
await typeSearch("dover");
found = await items();
check("a state the map has no city in still gets its code from the table", found.some((f) => f.t.startsWith("Dover, (DE), US") && !f.blocked), found.slice(0, 4));
await typeSearch("silvassa");
found = await items();
check("a place in a region the table lacks is blocked, not guessed", found.some((f) => f.t.startsWith("Silvassa, IN") && f.blocked && f.t.includes("no state code")), found.slice(0, 3));
await typeSearch("zzzzqq");
check("free text that is not a place offers nothing to add", (await items()).every((f) => f.blocked) && await drawDisabled());
// Pick a real place that is not on the map, in a country with state codes
const target = await ev<{ id: number; name: string; pop: number; lat: number; lng: number }>(() => {
  const names = namesOnMap();
  const p = places.find((p) => !placeBlock(p, names) && /, \([A-Z]+\), US$/.test(p.name));
  return { id: p.id, name: p.name, pop: p.pop, lat: p.lat, lng: p.lng };
});
await typeSearch(target.name.split(",")[0]);
await page.click(`#placeResults .result-item[data-id="${target.id}"]`);
await sleep(600);
const picked = await ev<{ chosen: number | null; text: string; centre: number[] }>(() => ({ chosen: chosenPlace && chosenPlace.id, text: document.getElementById("placeChosen")!.textContent ?? "", centre: [map.getCenter().lat, map.getCenter().lng] }));
check("picking a place shows it and moves the map to its GeoNames centre", picked.chosen === target.id && picked.text.includes(target.name) && !(await drawDisabled()) && Math.abs(picked.centre[0] - target.lat) < 0.5 && Math.abs(picked.centre[1] - target.lng) < 0.5, { target, picked });
await page.click("#drawBtn");
await page.click('input[name="snapMode"][value="none"]');
for (const [x, y] of [[80, 80], [200, 90], [210, 200], [90, 190]]) { await page.mouse.click(x, y); await sleep(350); }
await page.keyboard.press("Enter");
await sleep(300);
s = await state();
const created = await ev<any>(() => { const l = cities.get(selectedId); return l ? { ...l.feature.properties, n: ringsOf(selectedId)[0].length } : null; });
check("new city takes its id, name, population and centre from GeoNames", s.cities === before8.cities + 1 && s.selected === target.id && created?.name === target.name && created?.population === target.pop && created?.lat === target.lat && created?.lon === target.lng && created?.n === 5, { s, created });
// The same place cannot be added twice
await page.click("#newCityBtn");
await typeSearch(target.name.split(",")[0]);
found = await items();
check("a place just added is now blocked as on the map", found.some((f) => f.id === String(target.id) && f.blocked), found.slice(0, 3));
await page.click("#cancelDrawBtn");
await ev((id: number) => select(id), target.id);
await sleep(150);
const newId = s.selected!;
check("new city is editable straight away", await ev<number>(() => vertexMarkers.length) === 4);

// 9. Reload: edits persist, history does not
const dirtyBefore = s.dirty.slice().sort();
await load();
s = await state();
check("reload restores every changed city", JSON.stringify(s.dirty.slice().sort()) === JSON.stringify(dirtyBefore) && s.cities === before8.cities + 1, { dirty: s.dirty, status: s.status });
check("restored rename and geometry", await ev<boolean>((id: number, nid: number) => cities.get(id).feature.properties.name === "Testville <b>, XX" && cities.has(nid), fx.id, newId));

// 10. Revert one city, revert all, undo the revert
await page.click("#editMode");
await ev((id: number) => select(id), fx.id);
await page.click("#revertCityBtn"); await sleep(150);
s = await state();
check("revert city restores its loaded state", !s.dirty.includes(fx.id) && await ev<boolean>((id: number) => cities.get(id).feature.properties.name !== "Testville <b>, XX", fx.id), s.dirty);
await page.click("#revertAllBtn"); await sleep(150);
s = await state();
check("revert all leaves nothing changed and removes the new city", s.dirty.length === 0 && s.cities === 3721 && !s.saved, s);
await page.click("#undoBtn"); await sleep(150);
s = await state();
check("undo brings the reverted changes back", s.dirty.length > 0 && s.cities === 3722, s);

// 11. Delete a city and undo
await ev((id: number) => select(id), fx.neighbour);
await page.click("#deleteCityBtn"); await sleep(150);
s = await state();
check("delete city removes it", s.cities === 3721 && s.selected === null, s);
await page.click("#undoBtn"); await sleep(150);
s = await state(); check("undo restores and reselects the deleted city", s.cities === 3722 && s.selected === fx.neighbour, s);

// 12. Export
const exp = await ev<{ actions: string[]; topoType: string; geoms: number; arcs: number; roundTrip: boolean }>(() => {
  const cs = buildChangeSet(); const topo = buildTopology();
  const back = topojson.feature(topo, topo.objects.cities);
  const sample = back.features.find((f: { properties: { id: number } }) => f.properties.id === selectedId || true);
  const same0 = JSON.stringify(sample.geometry.coordinates) === JSON.stringify(wrapRings(ringsOf(sample.properties.id), wrapOut));
  return { actions: cs.changes.map((c: { action: string }) => c.action).sort(), topoType: topo.type, geoms: topo.objects.cities.geometries.length, arcs: topo.arcs.length, roundTrip: same0 };
});
check("change set lists create and update actions", exp.actions.includes("create") && exp.actions.includes("update"), exp.actions);
check("TopoJSON export holds every city and round-trips coordinates", exp.topoType === "Topology" && exp.geoms === 3722 && exp.roundTrip, exp);

// 13. Map cut: cities west of it sit at longitudes above 180 in the page and export unchanged
const cut = await ev<{ inPage: number; exported: number; exact: boolean; maxExported: number; minInPage: number }>(async () => {
  const base = await (await fetch(DATA_URL)).json();
  const baseFc = topojson.feature(base, base.objects.cities);
  const id = 4034821; // Mata-Utu, WF, around 176 W
  const topo = buildTopology(); const out = topojson.feature(topo, topo.objects.cities);
  const o = out.features.find((f: { properties: { id: number } }) => f.properties.id === id);
  const b0 = baseFc.features.find((f: { properties: { id: number } }) => f.properties.id === id);
  let maxExported = -Infinity, minInPage = Infinity;
  out.features.forEach((f: { geometry: { coordinates: number[][][] } }) => f.geometry.coordinates.forEach((r) => r.forEach((c) => { if (c[0] > maxExported) maxExported = c[0]; })));
  cities.forEach((layer) => layer.feature.geometry.coordinates.forEach((r: number[][]) => r.forEach((c) => { if (c[0] < minInPage) minInPage = c[0]; })));
  return { inPage: ringsOf(id)[0][0][0], exported: o.geometry.coordinates[0][0][0], exact: JSON.stringify(o.geometry.coordinates) === JSON.stringify(b0.geometry.coordinates), maxExported, minInPage };
});
check("city west of the cut is drawn east of 180 and exports exactly as in the file", cut.inPage > 180 && cut.exported < -168.5 && cut.exact && cut.maxExported <= 180 && cut.minInPage >= -168.5, cut);

// 14. Commit, revert to the commit, reload, commit all, login, push, uncommit
const cs = () => ev<any>(() => ({
  pending: dirtyIds(), committed: Array.from(committed.keys()), unpushed: unpushedIds().length, user,
  pushDisabled: (document.getElementById("pushBtn") as HTMLButtonElement).disabled,
  pushText: document.getElementById("pushBtn")!.textContent,
  commitDisabled: document.getElementById("commitCityBtn")?.classList.contains("inactive"),
  revertDisabled: (document.getElementById("revertCityBtn") as HTMLButtonElement | null)?.disabled,
  note: document.getElementById("committedNote")?.textContent,
  status: document.getElementById("status")!.textContent,
}));
const geom = (id: number) => ev<string>((id) => JSON.stringify({ n: cities.get(id).feature.properties.name, c: ringsOf(id) }), id);
await ev(() => localStorage.removeItem("metrocity_user"));
await ev((id: number) => select(id), fx.neighbour);
let c = await cs();
const pendingBefore = c.pending.length;
check("before commit: city pending, commit enabled, push disabled for anon", c.pending.includes(fx.neighbour) && c.commitDisabled === false && c.pushDisabled && c.user === "anon", c);
await page.click("#commitCityBtn"); await sleep(200);
c = await cs();
check("commit moves the city from pending to committed", !c.pending.includes(fx.neighbour) && c.pending.length === pendingBefore - 1 && c.committed.includes(fx.neighbour) && c.commitDisabled && c.revertDisabled && c.note.includes("Committed by anon"), c);
const committedGeom = await geom(fx.neighbour);
// Rename, then click Commit straight from the name field: the click must not be lost
await page.click("#cityName", { clickCount: 3 });
await page.keyboard.type("Exeter Two, GB");
await page.click("#commitCityBtn"); await sleep(250);
c = await cs();
const afterRename = await geom(fx.neighbour);
check("typing a name then clicking Commit commits the rename in one click", afterRename.includes("Exeter Two, GB") && !c.pending.includes(fx.neighbour) && c.committed.includes(fx.neighbour), c);
// Edit again, then revert: back to the committed state, not the file's
await page.click("#cityPop", { clickCount: 3 });
await page.keyboard.type("999");
await page.keyboard.press("Tab"); await sleep(200);
check("an edit after commit is pending again", (await cs()).pending.includes(fx.neighbour));
await page.click("#revertCityBtn"); await sleep(200);
c = await cs();
check("revert returns to the committed state", await geom(fx.neighbour) === afterRename && !c.pending.includes(fx.neighbour) && c.committed.includes(fx.neighbour) && afterRename !== committedGeom, c);
// Reload keeps the commit
await load();
c = await cs();
check("reload keeps committed and pending apart", c.committed.includes(fx.neighbour) && !c.pending.includes(fx.neighbour) && c.pending.length === pendingBefore - 1 && await geom(fx.neighbour) === afterRename, c);
await page.click("#editMode");
await page.click("#commitAllBtn"); await sleep(200);
c = await cs();
check("commit all empties the pending list", c.pending.length === 0 && c.committed.length === pendingBefore && c.unpushed === pendingBefore && c.pushDisabled, c);
// The mock remote refuses an anonymous push
const anonStatus = await ev<number>(async () => (await fetch("/dev/push", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ user: "anon", changes: [] }) })).status);
check("remote refuses a push from anon with 401", anonStatus === 401, anonStatus);
// Log in and push
await page.click("#loginBtn");
await page.type("#loginName", "e2e-test");
await page.keyboard.press("Enter"); await sleep(200);
c = await cs();
check("login enables push", c.user === "e2e-test" && !c.pushDisabled && c.pushText === `Push (${pendingBefore})`, c);
await page.click("#pushBtn");
await page.waitForFunction("unpushedIds().length === 0", { timeout: 15000 });
await sleep(150);
c = await cs();
const listHtml2 = await ev<string>(() => document.getElementById("committedList")!.innerHTML);
check("push marks every commit as pushed", c.unpushed === 0 && c.pushDisabled && c.status.includes(`Pushed ${pendingBefore} changes`) && listHtml2.includes("pushed"), c);
const pushLines = (await Deno.readTextFile(`${import.meta.dirname}/../dev_pushes.jsonl`)).trim().split("\n");
const lastPush = JSON.parse(pushLines[pushLines.length - 1]);
const lngs = lastPush.changes.flatMap((ch: any) => (ch.geometry ? ch.geometry.coordinates.flat().map((p: number[]) => p[0]) : []));
check("mock remote stored the push with user, actions and file longitudes", lastPush.user === "e2e-test" && lastPush.changes.length === pendingBefore && lastPush.changes.some((ch: any) => ch.action === "create") && lastPush.changes.some((ch: any) => ch.action === "update" && ch.name === "Exeter Two, GB") && Math.max(...lngs) <= 180 && Math.min(...lngs) >= -180, { user: lastPush.user, actions: lastPush.changes.map((ch: any) => ch.action) });
// Uncommit moves a city back to pending; the export labels both kinds
await page.click('#committedList button[data-act="uncommit"]'); await sleep(200);
c = await cs();
check("uncommit returns one city to pending", c.pending.length === 1 && c.committed.length === pendingBefore - 1, c);
const statuses = await ev<string[]>(() => buildChangeSet().changes.map((ch: { status: string }) => ch.status).sort());
check("export labels pending and committed changes", statuses.includes("pending") && statuses.includes("committed") && statuses.length === pendingBefore, statuses);
await page.click("#loginBtn"); await sleep(150);
c = await cs();
check("logout returns to anon and disables push", c.user === "anon" && c.pushDisabled, c);

// 15. Commits saved before cities carried a centre must not come back as pending after a reload
await page.click("#commitAllBtn"); await sleep(200);
c = await cs();
const committedCount = c.committed.length;
check("everything committed before the reload", c.pending.length === 0 && committedCount > 0, c);
await ev(() => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const old = (snap: any) => snap && ({ coordinates: snap.coordinates, population: snap.population, name: snap.name, id: snap.id });
  for (const k of Object.keys(saved.committed)) { saved.committed[k].file = old(saved.committed[k].file); saved.committed[k].state = old(saved.committed[k].state); }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
});
await load();
c = await cs();
const pendingButtons = await ev<string>(() => document.getElementById("pendingButtons")!.style.display);
check("commits saved without a centre stay committed after a reload", c.pending.length === 0 && c.committed.length === committedCount && pendingButtons === "none", { c, pendingButtons });

// 16. Arrow keys move through search results, Enter picks
await page.click("#editMode");
await page.click("#newCityBtn");
await page.waitForFunction("places !== null", { timeout: 60000 });
await typeSearch("windsor");
const open = (await items()).filter((f) => !f.blocked);
const active = () => ev<string | null>(() => document.querySelector("#placeResults .result-item.active")?.textContent ?? null);
await page.keyboard.press("ArrowDown");
const a1 = await active();
await page.keyboard.press("ArrowDown");
const a2 = await active();
await page.keyboard.press("ArrowUp");
const a3 = await active();
check("Down and Up move through the places that can be picked, skipping blocked ones", a1 === open[0].t && a2 === open[1].t && a3 === open[0].t, { a1, a2, a3, first: (await items())[0] });
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter"); await sleep(400);
const viaKeys = await ev<{ id: number | null; focus: string }>(() => ({ id: chosenPlace && chosenPlace.id, focus: document.activeElement?.id ?? "" }));
check("Enter picks the highlighted place and moves focus to Draw outline", String(viaKeys.id) === open[1].id && viaKeys.focus === "drawBtn", viaKeys);
await page.click("#cancelDrawBtn");
await page.click("#search");
await page.type("#search", "plymouth"); await sleep(150);
const firstCity = await ev<string>(() => (document.querySelector("#results .result-item") as HTMLElement).dataset.id!);
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter"); await sleep(400);
check("the city search works the same way", String((await state()).selected) === firstCity, firstCity);

await page.screenshot({ path: SHOT });
await ev(() => localStorage.clear());
await browser.close();
console.log(problems.length ? "PAGE PROBLEMS:\n" + problems.join("\n") : "no page errors, warnings or dialogs");
console.log(failed ? `${failed} CHECK(S) FAILED` : "ALL CHECKS PASSED");
Deno.exit(failed || problems.length ? 1 : 0);
