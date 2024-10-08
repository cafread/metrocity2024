const nullTile = "data:image/octet-stream;base64,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";
let nullTile2 = "data:image/octet-stream;base64,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"
const tileCode = "data:image/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAA"; // Tile results all start with this
const width  = 1536; // 256 * 6 and tiles are 256x256 pixels
const height = 1024; // 256 * 4
let cityData = [];
let isFrozen = false;
let penColor = "rgba(255,255,255,1)";
let quadtree;
let qtBound = new Rectangle(width / 2, height / 2, width * 1.2, height * 1.2);
// Put this, canvas initiation, mastTileKeys in an onload completed async function and call render once complete
// Could also kick off algo run, then present the ability to switch
// Need to add border opacity control as well
d3.json("res/2020cities15k_trimmed.json", (err, dat) => {
//d3.json("res/2020cities15k.json", (err, dat) => {
  if (err) throw err;
  cityData = dat.filter(d => excludedGeoIds.indexOf(d.i) === -1);
  cityData.forEach(d => colorGen(d.i));
  createMap();
});
function colorGen (id) {
  // Generates a unique color which can be mapped back to the id
  if (idToColor.hasOwnProperty(id)) return; // Dupe check
  console.log("unmapped id:" + id);
  let code = randomRGBA();
  while (!isOriginalColor (code)) code = randomRGBA();
  colorToId[code] = id;
  idToColor[id] = code;
}
function isOriginalColor (code) {
  // Check colorToId has space around each of r, g, b to avoid color collisions when the browser compresses it during Canvas.toDataURL
  if (colorToId.hasOwnProperty(code)) return false;
  let [r, g, b] = code.replace("rgba", "").replace(",1)", "").split(",");
  for (let per of compressionDebug) {
    code = "rgba(" + (r + per.r) + "," + (g + per.g) + "," + (b + per.b) + ",1)";
    if (colorToId.hasOwnProperty(code)) return false;
  }
  return true;
}
function randomRGBA () {
  let [r, g, b] = [Math.random()*255 | 0, Math.random()*255 | 0, Math.random()*255 | 0];
  return "rgba(" + r + "," + g + "," + b + ",1)";
}
let projection = d3.geo.mercator()
    .scale(1 << 15)
    .translate([-width / 2, -height / 2]);
let zoom = d3.behavior.zoom()
    .scale(1 << 15) // For pixel perfect tiles
    .scaleExtent([1 << 15, 1 << 15])
    .on("zoom", zoomed);
let container = d3.select("#container")
    .style("width", width + "px")
    .style("height", height + "px")
    .call(zoom)
    .on("mousemove", mousemoved);

let citiesCanvas = document.getElementById("citiesCanvas");
citiesCanvas.width = width;
citiesCanvas.height = height;
let citiesContext = citiesCanvas.getContext("2d");

let outputCanvas = document.getElementById("outputCanvas");
outputCanvas.width = width;
outputCanvas.height = height;
let outputContext = outputCanvas.getContext("2d", {willReadFrequently: true});

let labelCanvas = document.getElementById("labelCanvas");
labelCanvas.width = width;
labelCanvas.height = height;
let labelContext = labelCanvas.getContext("2d");

let hiddenCanvas = document.getElementById("hiddenCanvas");
hiddenCanvas.width = 256;
hiddenCanvas.height = 256;
let hiddenContext = hiddenCanvas.getContext("2d", {willReadFrequently: true});

moveToTile();

function createMap () {
  if (isFrozen) return;
  let rad = Math.pow(zoom.scale(), 0.4) / 20;
  cityData = cityData.map(d => {
    [d.x, d.y] = projection([d.lo, d.la]);
    d.r = rad * Math.sqrt(d.p / 80000);
    d.f = idToColor[d.i];
    d.show = offScreenTest (d.x, d.y);
    return d;
  });
  createReferenceNullTile();
  drawCanvas();
}
function offScreenTest (x, y) {
  if (x < -100) return false;
  if (y < -100) return false;
  if (x > width + 100) return false;
  if (y > height + 100) return false;
  return true;
}
function drawCanvas () {
  if (isFrozen) return;
  quadtree = new QuadTree(qtBound, 1);
  if (Object.keys(agglomData).length > 0) {
    showAlgoResult ();
  } else {
    cityData.filter(d => d.show).forEach(d => {
      let pt = new Point(d.x, d.y, d);
      quadtree.insert(pt);
      citiesContext.beginPath();
      citiesContext.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
      citiesContext.fillStyle = d.f;
      citiesContext.fill();
      citiesContext.closePath();
    });
  }
}
function reDraw () {
  if (isFrozen) return;
  // Clear cities
  citiesContext.clearRect(0, 0, width, height);
  // Clear the output
  if (document.getElementById("mcControls") && document.getElementById("mcControls").style)document.getElementById("mcControls").style.visibility = "hidden";
  if (document.getElementById("freezeControl") && document.getElementById("freezeControl").style)document.getElementById("freezeControl").style.visibility = "hidden";
  outputContext.clearRect(0, 0, width, height);
  // Plot cities again
  drawCanvas();
}
function zoomed () {
  if (isFrozen) return;
  // Update projection
  projection
    .scale(zoom.scale() / 2 / Math.PI)
    .translate(zoom.translate());
  // Re-project cities
  let rad = Math.pow(zoom.scale(), 0.4) / 20;
  cityData = cityData.map(d => {
    [d.x, d.y] = projection([d.lo, d.la]);
    d.r = rad * Math.sqrt(d.p / 80000);
    d.show = offScreenTest (d.x, d.y);
    return d;
  });
  reDraw();
  // Map and master result
  let mapTiles = d3GeoTile().size([width, height]).scale(zoom.scale()).translate(zoom.translate())();
  let cartoDbTiles = d3.select("#mapLayer")
    .style(prefixMatch(["webkit", "ms", "Moz", "O"]) + "transform", matrix3d(mapTiles.scale, mapTiles.translate))
    .selectAll(".tile")
      .data(mapTiles, d => d);
  cartoDbTiles.exit().remove();
  cartoDbTiles.enter().append("img")
    .attr("class", "tile")
    .attr("src", d => genCartoDbTileUrl (d))
    .style("left", d => (d[0] << 8) + "px")
    .style("top",  d => (d[1] << 8) + "px");
  d3.selectAll(".masterTile").style("opacity", 0.20);
  let masterTiles = d3.select("#mapLayer")
    .style(prefixMatch(["webkit", "ms", "Moz", "O"]) + "transform", matrix3d(mapTiles.scale, mapTiles.translate))
    .selectAll(".masterTile")
      .data(mapTiles, d => d);
  masterTiles.exit().remove();
  masterTiles.enter().append("img")
    .attr("class", "masterTile")
    .attr("src", d => genTileUrl(d))
    .attr("onerror", "this.src='tiles/none.png'")
    .style("opacity", 0.20)
    .style("left", d => (d[0] << 8) + "px")
    .style("top",  d => (d[1] << 8) + "px");
}
function matrix3d (scale, translate) {
  let k = scale / 256, r = scale % 1 ? Number : Math.round;
  return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ")";
}
function d3GeoTile () {
  let size = [1536, 1024];
  let scale = 256;
  let translate = [size[0] / 2, size[1] / 2];
  let zoomDelta = 0;
  function tile() {
    let z = Math.max(Math.log(scale) / Math.LN2 - 8, 0);
    let z0 = Math.round(z + zoomDelta);
    let k = Math.pow(2, z - z0 + 8);
    let origin = [(translate[0] - scale / 2) / k, (translate[1] - scale / 2) / k];
    let tiles = [];
    let cols = d3.range(Math.max(0, Math.floor(-origin[0])), Math.max(0, Math.ceil(size[0] / k - origin[0])));
    let rows = d3.range(Math.max(0, Math.floor(-origin[1])), Math.max(0, Math.ceil(size[1] / k - origin[1])));
    rows.forEach(y => cols.forEach(x => tiles.push([x, y, z0])));
    tiles.translate = origin;
    tiles.scale = k;
    return tiles;
  }
  tile.size = function (_) {
    if (!arguments.length) return size;
    size = _;
    return tile;
  };
  tile.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return tile;
  };
  tile.translate = function (_) {
    if (!arguments.length) return translate;
    translate = _;
    return tile;
  };
  tile.zoomDelta = function (_) {
    if (!arguments.length) return zoomDelta;
    zoomDelta = +_;
    return tile;
  };
  return tile;
}
function prefixMatch (p) {
  let i = -1;
  let n = p.length;
  let s = document.body.style;
  while (++i < n) {
    if (p[i] + "Transform" in s) {
      return "-" + p[i].toLowerCase() + "-";
    }
  }
  return "";
}
function genCartoDbTileUrl (d) {
  if (d=== undefined || d.length === 0) return "tiles/none.png";
  let [xTile, yTile, zoomLevel] = d;
  if (d[0] <   0) xTile += 128; // 0-127 is specific to this zoom level
  if (d[0] > 127) xTile -= 128;
  let cartoDbTileUrl = "https://" + ["a", "b", "c", "d"][Math.random() * 3 | 0] + ".basemaps.cartocdn.com/rastertiles/voyager_nolabels/" + zoomLevel + "/" + xTile + "/" + yTile + ".png";
  //let cartoDbTileUrl = "https://cartocdn_" + ["a", "b", "c"][Math.random() * 3 | 0] + ".global.ssl.fastly.net/base-eco/" + zoomLevel + "/" + xTile + "/" + yTile + ".png";
  // https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png
  return cartoDbTileUrl;
}
function genTileUrl (d) {
  if (d=== undefined || d.length === 0) return "tiles/none.png";
  let [xTile, yTile, zoomLevel] = d;
  if (yTile < 17 || yTile > 87) return "tiles/none.png";
  if (d[0] <   0) xTile += 128; // 0-127 is specific to this zoom level
  if (d[0] > 127) xTile -= 128;
  let tileKey = lpad(xTile, 3) + "_" + lpad(yTile, 3);
  if (mastTileKeys.indexOf(tileKey) === -1) return "tiles/none.png";
  return "tiles/" + tileKey + ".png";
}
function search (x, y) {
  // Given a projected x, y, return the most influential metro city
  let range = new Rectangle(...projBBox(x, y, true));
  let candidates = quadtree.query(range);
  if (candidates.length === 0) return;
  // Caution here to not mutate the points
  let [lo, la] = projection.invert([x, y]);
  let cands = candidates.map(d => {
    let thisDist = greatCircleKm (la, lo, d.userData.la, d.userData.lo);
    let thisScore = genScore(d.userData.p, thisDist);
    return {
      i: d.userData.i,
      n: d.userData.n,
      p: d.userData.p,
      s: thisScore,
      d: thisDist
    };
  });
  return cands.filter(d => d.s > 0).sort((a, b) => b.s - a.s)[0];
}
function greatCircleKm (lat1, lon1, lat2, lon2) {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1);
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  return d;
}
const deg2rad = (degs) => Math.PI * degs / 180.0;
const rad2deg = (rads) => 180.0 * rads / Math.PI;
function genScore (pop, dist) {
  //return Math.sqrt(pop) * (100 - dist);
  return Math.pow(pop, 0.25) * (100 - dist);
}
function mapMCs (scl=8) {
  outputContext.clearRect(0, 0, width, height);
  reDraw(); // Just to be sure that things are ready
  let xCount = Math.floor(width / scl);
  let yCount = Math.floor(height / scl);
  for (let i = 0; i < xCount; i++) {
    for (let j = 0; j < yCount; j++) {
      shadeMap(i * scl, j * scl, scl);
    }
  }
  document.getElementById("mcControls").style.visibility = "visible"; // Should only show opacity, not painting
}
function shadeMap (x=0, y=0, w=8) {
  // width = height as square
  // Note that x is the left, y, the top, not the centroid as in a Rectangle
  // This will be called recursively for dense areas
  let MC = {
    nw: search(x    , y    ), // North West corner
    ne: search(x + w, y    ), // North East corner
    sw: search(x    , y + w), // South West corner
    se: search(x + w, y + w)  // South East corner
  };
  if (mcEqual(MC)) { // Draw the full size rectangle on the canvas
    let outputId = MC.nw ? MC.nw.i : 0;
    if (outputId > 0) {
      //cityData.find(d => d.i === outputId).px += w*w;
      outputContext.fillStyle = idToColor[outputId];
      outputContext.fillRect(x, y, w, w);
    }
  } else if (w === 2) { // Draw corner points
    let corners = ["nw", "ne", "sw", "se"];
    let outputId;
    for (let c of corners) {
      outputId = MC[c] ? MC[c].i : 0;
      if (outputId > 0) {
        //cityData.find(d => d.i === outputId).px += 4;
        outputContext.fillStyle = idToColor[outputId];
        outputContext.fillRect(x, y, w, w);
      }
    }
  } else { // Sub-divide
    shadeMap(x,       y      , w/2, w/2);
    shadeMap(x + w/2, y      , w/2, w/2);
    shadeMap(x      , y + w/2, w/2, w/2);
    shadeMap(x + w/2, y + w/2, w/2, w/2);
  }
}
function mcEqual (mc4) { // Test if four corner MCs have the same id
  let nw = mc4.nw ? mc4.nw.i : 0;
  let ne = mc4.ne ? mc4.ne.i : 0;
  if (nw !== ne) return false;
  let sw = mc4.sw ? mc4.sw.i : 0;
  if (nw !== sw) return false;
  let se = mc4.se ? mc4.se.i : 0;
  return nw === se;
}
function generateMaster () {
  if (!confirm("Are you sure? This will take a little while and will clear local storage")) return;
  localStorage.clear();
  // For testing how many pixels each claims
  //for (let i = 0; i < cityData.length; i++) cityData[i].px = 0;
  let tileX = 0;  // Range is 00 to 127, window is 6 tiles wide (1536px) so max out with the left tile at 122
  let tileY = 17; // Range is 17 to 087, window is 4 tiles tall (1024px)
  moveToTile(tileX, tileY);
  while (tileY < 88) {
    console.log("executing for y = " + tileY + " of 87");
    while (tileX < 128) {
      mapMCs();
      persistResult();
      moveToTile(tileX, tileY);
      if (tileX === 122) {
        tileX = 128;
      } else {
        tileX = Math.min(122, tileX + 6);
      }
    }
    tileX = 0;
    tileY = tileY + 4;
    moveToTile(tileX, tileY);
  }
  moveToTile(); // Reset back to the UK
  alert("Master made");
}
function setOpacity (sliderValue, elementIds=[]) {
  for (let elid of elementIds) {
    if (document.getElementById(elid) !== null) document.getElementById(elid).style.opacity = sliderValue / 100;
  }
}
function dispWIP () {
  // Get top left
  let [x, y] = topLeftTile ();
  // Move to that tile
  moveToTile(x, y);
  // Check to see if we have a work in progress tile set to work with for this area
  let wipTileCount = Object.keys(localStorage).length;
  let wipOnscreenCount = countOnscreenWipTiles(x, y);
  let masterOnscreenCount = countOnscreenMasterTiles();
  if (wipTileCount === 0 && masterOnscreenCount === 0) {
    alert("No tiles found");
  } else if (wipOnscreenCount === 0 && masterOnscreenCount === 0) {
    alert("No tiles found for this area");
  } else if (wipOnscreenCount === 0 && masterOnscreenCount > 0) {
    // Copy master to outputCanvas if master has data but localStorage does not
    dataToTile(x, y, "Master");
    // Fade master
    d3.selectAll(".masterTile").style("opacity", 0);
    document.getElementById("freezeControl").style.visibility = "visible";
  } else { // Find WIP tile data and draw it for x, y
    dataToTile(x, y, "localStorage");
    // Fade master
    d3.selectAll(".masterTile").style("opacity", 0);
    document.getElementById("freezeControl").style.visibility = "visible";
  }
}
function topLeftTile () {
  //let tileCoords = d3.select("#container").selectAll(".tile")[0][0].map(d => d3.select(d).attr("src").substr(44, 15).replace(".png", "").split("/"));
  let tileCoords = d3.select("#container").selectAll(".tile")[0].map(d => d.src.substr(-12).replace('.png', '').split("/").slice(-2).map(Number));
  let tileY = d3.min(tileCoords, d => d[1]);
  // When crossing the international date line, the 'x' tile property resets to zero, but we want the min of the 'high' x values
  let minTileX = d3.min(tileCoords, d => d[0]);
  let maxTileX = d3.max(tileCoords, d => d[0]);
  let tileX = minTileX;
  if(minTileX === 0 && maxTileX > 120) tileX = d3.min(tileCoords, d => d[0] > 120 ? d[0] : null);
  return [tileX, tileY];
}
function moveToTile (x=60, y=40) {
  zoom.translate([256 * (64 - x), 256 * (64 - y)]);
  zoomed();
}
function persistResult () {
  let [minTileX, minTileY] = topLeftTile ();
  let row = 0;
  let col = 0;
  let outTile;
  let tileKey = "";
  while (row < 4) { // Row is our Y
    while (col < 6) { // Col is our X
      if (minTileX + col < 128) {
        hiddenContext.clearRect(0, 0, 256, 256);
        hiddenContext.drawImage(outputCanvas, col * 256, row * 256, 256, 256, 0, 0, 256, 256);
        outTile = hiddenCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        if (outTile !== nullTile && outTile != nullTile2) {
          tileKey = lpad(minTileX + col, 3) + "_" + lpad(minTileY + row, 3);
          let compressedTile = LZString.compress(outTile.replace(tileCode, ""));
          localStorage.setItem(tileKey, compressedTile);
        }
        col++;
      } else {
        col = 10; // End if we have tried to get something beyond maximum x tile
      }
    }
    col = 0;
    row++;
  }
  document.getElementById("storeEdits").style.background = "lightgreen";
  setTimeout(function(){document.getElementById("storeEdits").style.background = "";}, 600);
}
function lpad (str, len, padChar="0") {
  str = str + "";
  let retLen = Math.max(str.length, len);
  return padChar.repeat(retLen - str.length) + str;
}
function zipAndDownload () {
  let zip = new JSZip();
  let tls = zip.folder("tiles");
  let lsKeys = Object.keys(localStorage);
  lsKeys.forEach(k => {
    let b64Str = tileCode.substring(31, 78) + LZString.decompress(localStorage.getItem(k));
    tls.file(k + ".png", b64Str, {base64: true});
  });
  zip.generateAsync({type:"blob"}).then(function(content) {saveAs(content, "tiles.zip");});
}
function getTileData (x, y) {
  let _key = lpad(x, 3) + "_" + lpad(y, 3);
  let compressed = localStorage.getItem(_key);
  if (compressed === null) return nullTile;
  let uncompressed = LZString.decompress(compressed);
  return tileCode + uncompressed;
}
function createReferenceNullTile () {
  // Creates a null tile specific to this browser to avoid breaking on browser updates to canvas handling
  // Called once on load
  hiddenContext.clearRect(0, 0, 256, 256);
  hiddenContext.drawImage(outputCanvas, 0, 0, 256, 256, 0, 0, 256, 256);
  let outTile = hiddenCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  if (outTile !== nullTile && outTile != nullTile2) {
    nullTile2 = outTile;
  }
}
function countOnscreenWipTiles (x, y) {
  let lsKeys = Object.keys(localStorage);
  [xMin, xMax, yMin, yMax] = [+x, +x + 6, +y, +y + 4];
  if (lsKeys.length === 0) return 0;
  let onscKeys = lsKeys.filter(k => {
    [_x, _y] = k.split("_");
    return _x >= xMin && _x < xMax && _y >= yMin && _y < yMax;
  });
  return onscKeys.length;
}
function countOnscreenMasterTiles () {
  return d3.selectAll(".masterTile")[0].filter(d => d["src"].slice(-8) != "none.png").length;
}
function projBBox (cx, cy, simple) {
  // Generate a bounding box based on a distance in all directions
  const searchDist = 100;
  // x, y are the centre of the rectangle we wish to create
  let [lo, la] = projection.invert([cx, cy]); // lo, la in degrees
  if (simple === true) {
    // https://en.wikipedia.org/wiki/Latitude
    // Longitude: 1 deg = 111.320 * cos(latitude in radians) km
    let longAdj = searchDist / (111.320 * Math.cos(deg2rad(la)));
    let x = projection([lo - longAdj, la])[0];
    // Latitude: 1 deg = 110.574 km at the equator
    let latAdj = searchDist / [110.574, 110.649, 110.852, 111.132, 111.412, 111.618, 111.694][Math.round(Math.abs(la) / 15)];
    let y = projection([lo, la + latAdj])[1];
    let w = projection([lo + longAdj, la])[0] - x;
    let h = projection([lo, la - latAdj])[1] - y;
    return [x + w / 2, y + h / 2, w, h];
  }
  // Complex method for verification
  // Semi-axes of WGS-84 geoidal reference
  const WGS84_a = 6378137.0;  // Major semiaxis in metres
  const WGS84_b = 6356752.3;  // Minor semiaxis in metres
  // Earth radius at a given latitude, according to the WGS-84 ellipsoid in metres
  function WGS84EarthRadius (lat) {
    // http://en.wikipedia.org/wiki/Earth_radius
    let An = WGS84_a * WGS84_a * Math.cos(lat);
    let Bn = WGS84_b * WGS84_b * Math.sin(lat);
    let Ad = WGS84_a * Math.cos(lat);
    let Bd = WGS84_b * Math.sin(lat);
    return Math.sqrt((An*An + Bn*Bn) / (Ad*Ad + Bd*Bd));
  }
  // Bounding box surrounding the point at given coordinates,
  // assuming local approximation of Earth surface as a sphere
  // of radius given by WGS84
  let lat = deg2rad(la);
  let lon = deg2rad(lo);
  let halfSide = searchDist * 1000;
  // Radius of Earth at given latitude
  let radius = WGS84EarthRadius(lat);
  // Radius of the parallel at given latitude
  let pradius = radius * Math.cos(lat);
  let latMin = rad2deg(lat - halfSide / radius);
  let latMax = rad2deg(lat + halfSide / radius); // latmax - latmin should be ~ 2 degrees
  let lonMin = rad2deg(lon - halfSide / pradius);
  let lonMax = rad2deg(lon + halfSide / pradius);
  // Re-project
  let x = projection([lonMin, la])[0];
  let y = projection([lo, latMax])[1];
  let h = projection([lo, latMin])[1] - y;
  let w = projection([lonMax, la])[0] - x;
  return [x + w / 2, y + h / 2, w, h];
}
function mousemoved (e) {
  let metroCity = "None";
  let thisPosition = ", [" + d3.mouse(this).toString() +"], ";
  let thisLatLong = formatLocation(projection.invert(d3.mouse(this)), zoom.scale());
  if (document.getElementById("mcControls")?.style?.visibility === "visible") { // WIP projection active
    let pixelData = outputContext.getImageData(d3.mouse(this)[0], d3.mouse(this)[1], 1, 1).data;
    let mcId = rgbaToId(pixelData);
    let mcInf = cityData.find(d => d.i === mcId);
    if (mcInf) metroCity = mcInf.n + ", id: " + mcId + ", pop: " + mcInf.p + ", color: " + idToColor[mcId];
  } else {
    metroCity = search(...d3.mouse(this));
    if (metroCity && metroCity.n) {
      metroCity = metroCity.n + ", id: " + metroCity.i + ", pop: " + metroCity.p + ", color: " + idToColor[metroCity.i];
    } else {
      metroCity = "None";
    }
  }
  document.getElementById("info").textContent = metroCity + thisPosition + thisLatLong;
}
function rgbaToId ([r, g, b, a], nolog=false) {
  if ([r, g, b].join("") === "000") return 0;
  let code = "rgba(" + r + "," + g + "," + b + ",1)";
  if (colorToId[code]) return colorToId[code];
  for (let per of compressionDebug) {
    code = "rgba(" + (r + per.r) + "," + (g + per.g) + "," + (b + per.b) + ",1)";
    if (colorToId[code]) return colorToId[code];
  }
  if (!nolog) console.log("Sample not matched", [r, g, b]);
  return 0;
}
function formatLocation (p, k) {
  let format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
  return (p[1] < 0 ? format(-p[1]) + " S" : format(p[1]) + " N") + " "
       + (p[0] < 0 ? format(-p[0]) + " W" : format(p[0]) + " E");
}