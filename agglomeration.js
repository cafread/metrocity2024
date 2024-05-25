let agglomData = {};
function runAgglomeration() {
  let vitalCities = {
    2643743: "London",
    5128581: "New York",
    2988507: "Paris",
    31117735: "Madrid",
    3128760: "Barcelona",
    3169070: "Rome",
    2657896: "Zurich",
    2867714: "Munich",
    3054643: "Budapest",
    2761369: "Vienna",
    2950159: "Berlin",
    756135: "Warsaw",
    360630: "Cairo",
    361058: "Alexandria",
    281184: "Jerusalem",
    276781: "Beirut",
    170654: "Damascus",
    745044: "Istanbul",
    2538475: "Rabat", // Probably
    2553604: "Casablanca",
    2650225: "Edinburgh",
    2648579: "Glasgow",
    2747373: "The Hague", // Probably
    2747891: "Rotterdam",
    2759794: "Amsterdam",
    2692969: "Malmö",
    2618425: "Copenhagen",
    524901: "Moscow",
    292223: "Dubai",
    1174872: "Karachi",
    1176734: "Hyderabad",
    1264733: "Lucknow",
    1267995: "Kanpur",
    1819728: "Hong Kong",
    1795565: "Shenzen",
    1812545: "Dongguan",
    1809858: "Guangzhou",
    1886760: "Suzhou", // Probably
    1790923: "Wuxi", // Probably
    1859171: "Kobe", // Probably
    1853909: "Osaka",
    1857910: "Kyoto",
    3042287: "Saint Peter Port", // Guernsey
    3042091: "Saint Helier", // Jersey
    3042237: "Douglas", // Isle of Man
    2654710: "Brighton & Hove",
    2640729: "Oxford",
    2653941: "Cambridge",
    // Tri City Area?
    // Northern Rhine Area?
    // Basel-Mulhouse-Freiburg?
  };
  d3.tsv("res/cities15000.txt", (err, dat) => {
  //d3.tsv("res/cities5000.txt", (err, dat) => {
  //d3.tsv("res/cities1000.txt", (err, dat) => {
  //d3.tsv("res/cities500.txt", (err, dat) => {
    let allQtBound = new Rectangle(width / 2, height / 2, width * 300 / 6, height * 150 / 4);
    let allQuad = new QuadTree(allQtBound, 1);
    if (err) throw err;
    dat.forEach(d => {
      let [x, y] = projection([+d.longitude, +d.latitude]);
      let isVital = vitalCities[d.geonameid] !== undefined || +d.population > 3000000;
      let isCandidate = isVital || cityData.some(c => c.i === +d.geonameid);
      let thisCity = cityData.find(c => c.i === +d.geonameid);
      let displayName = '';
      let countryCode = d["country code"];
      if (thisCity) {
        displayName = thisCity.n;
      } else {
        let state = countryCode === "US" ? ", (" + d["admin1 code"] + ")" : ""; // Other countries have states, but need decoding
        displayName = d.asciiname + state + ", " + countryCode;
      }
      let color = idToColor[d.geonameid] || "rgba(0,0,0,1)";
      agglomData[d.geonameid] = new City(+d.geonameid, x, y, +d.latitude, +d.longitude, +d.population, d.asciiname, displayName, countryCode, color, isVital, isCandidate, []);
      let pt = new Point(x, y, {id: +d.geonameid, pop: +d.population, name: displayName, basicName: d.asciiname, countryCode: countryCode, lat: +d.latitude, lon: +d.longitude, x: x, y: y});
      allQuad.insert(pt);
    });
    console.log("Algo data made");
    Object.keys(agglomData)
      .forEach(c => {
        let neighbourCandidates = searchQt(allQuad, agglomData[c].x, agglomData[c].y).filter(n => n.id !== agglomData[c].id && n.countryCode === agglomData[c].countryCode);
        if (!agglomData[c].isCandidate) {
          neighbourCandidates = neighbourCandidates.filter(n => agglomData[n.id].isCandidate); // Food will only be testing vs. neighbours which can consume it, not other food
          // Add a property to each neighbour stating the current influence power
          // this will be updated per run to reflect changes in MCPops
          for (let n of neighbourCandidates) {
            n.influence = agglomData[n.id].calcInfluence(n.distance);
          }
        }
        agglomData[c].neighbours = neighbourCandidates;
      });
    console.log("Neighbours found");
    /*
    // Vital cities get to hunt first and can consume up to 3 to get an early start
    // Candidate (inc vital) cities get to hunt and can consume up to 3
    for (let i = 0; i < 100; i++) {
      let vitals = Object.keys(agglomData).filter(k => agglomData[k].isVital);
      let cands = Object.keys(agglomData).filter(k => agglomData[k].isCandidate);
      vitals.forEach(c => agglomData[c].hunt(agglomData, 5));
      cands.forEach(c => agglomData[c].hunt(agglomData, 3));
    }
    */
    for (let i = 0; i < 2; i++) {
      Object.values(agglomData).forEach(c => c.agglomerate(agglomData));
      // Recalculate influce of each neighbour else further iterations do nothing
      for (c of Object.values(agglomData).filter(d => !d.isCandidate)) {
        for (let n of c.neighbours) n.influence = agglomData[n.id].calcInfluence(n.distance);
      }
    }
    console.log("Agglomeration complete");
    showAlgoResult();
  })
  function searchQt (qt, x, y) {
    // Given a projected x, y, return locations within 100 km radius
    let range = new Rectangle(...projBBox(x, y, true));
    let candidates = qt.query(range);
    if (candidates.length === 0) return [];
    let [lo, la] = projection.invert([x, y]);
    let cands = candidates.map(d => {
      let thisDist = greatCircleKm(la, lo, d.userData.lat, d.userData.lon);
      return {
        id: d.userData.id,
        distance: +thisDist.toFixed(2),
        countryCode: d.userData.countryCode
      };
    });
    return cands.filter(d => d !== undefined && d.distance < 100).sort((a, b) => a.distance - b.distance);
  }
}
function showAlgoResult () {
  citiesContext.clearRect(0, 0, width, height);
  labelContext.clearRect(0, 0, width, height);
  Object.values(agglomData).forEach(d => [d.x, d.y] = projection([d.lon, d.lat]));
  Object.values(agglomData)
    .filter(d => offScreenTest(d.x, d.y))
    .filter(d => d.isCandidate)
    .forEach(c => c.show(citiesContext, labelContext));
}