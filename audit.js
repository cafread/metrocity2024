
let auditObject = {};
let dbOutput = {};
function genAuditData () {
  // Ensure we are sitting at a tile boundary, so we get the correct pixel
  moveToTile();
  // Using new Image() and attaching an onload listener is async and creates major mismatches
  // Instead, run through this one tile at a time and audit the results for pop centres on that tile
  for (let tileKey of mastTileKeys) {
    // tileKey is like "001_069"
    let [xTile, yTile] = tileKey.split("_").map(Number);
    let tileURL = genTileUrl([xTile, yTile]);
    auditObject[tileKey] = {rgbaData: [], popCentres: []};
    getMasterTileData (tileURL, tileKey, auditObject);
  }
  // Now store which pop centres are going to look to which tile for an answer
  // Each will be {id: 123, x: 456, y: 789}
  let [refX, refY] = projection([0, 0]);
  for (let popCentre of Object.values(agglomData)) {
    let [popX, popY] = projection([popCentre.lon, popCentre.lat]);
    let xTile = 64 + Math.floor((popX - refX) / 256);
    let yTile = 64 + Math.floor((popY - refY) / 256);
    let tileURL = genTileUrl([xTile, yTile]);
    if (tileURL !== "tiles/none.png") {
      let tileKey = lpad(xTile, 3) + "_" + lpad(yTile, 3);
      // Find the right pixel on the tile
      let x = Math.floor(popX % 256);
      let y = Math.floor(popY % 256);
      let algoMCID = popCentre.parentCity ? popCentre.parentCity.id : null;
      auditObject[tileKey].popCentres.push({id: popCentre.id, x: x, y: y, algoMCID: algoMCID});
    }
  }
  console.log("Audit data building");
}
function runAudit () {
  for (let tileObj of Object.values(auditObject)) {
    for (let popCentre of tileObj.popCentres) {
      // Read data and get mcid
      let start = 4 * (popCentre.x + 256*popCentre.y);
      let [r, g, b, a] = tileObj.rgbaData.slice(start, start + 4);
      let masterMCID = rgbaToId([r, g, b, a], true);
      if (masterMCID !== 0) {
        let algoMatch = masterMCID == popCentre.algoMCID;
        popCentre.masterMCID = masterMCID;
        popCentre.algoMatch = algoMatch;
        agglomData[popCentre.id].masterResult = agglomData[masterMCID];
        agglomData[popCentre.id].algoMatch = algoMatch;
      }
    }
  }
  Object.values(agglomData).forEach(d => {
    let mcid = d.masterResult ? d.masterResult.id : null;
    let mcName = d.masterResult ? d.masterResult.name : null;
    dbOutput[d.id] = {
      id: d.id,
      lat: d.lat,
      lon: d.lon,
      basicName: d.basicName,
      mcid: mcid,
      mcName: mcName
    };
  })
  console.log("Audit complete");
}
// This is an async function
function getMasterTileData (tileURL, tileKey, auditObject) {
  // Given a tile URL, read it, drop it on the hiddenCanvas, read the data, store the data
  let masterTile = new Image();
  masterTile.onload = function() {
    hiddenContext.clearRect(0, 0, 256, 256);
    hiddenContext.drawImage(masterTile, 0, 0, 256, 256, 0, 0, 256, 256);
    auditObject[tileKey].rgbaData = hiddenContext.getImageData(0, 0, 256, 256).data;
  }
  masterTile.src = tileURL;
}
function makeCsvData () {
  let csvArr = Object.values(dbOutput).filter(d => d.mcid).map(d => d.id + "," + d.lat + "," + d.lon + "," + d.mcid + ',"' + d.mcName + '","' + d.basicName + '"');
  csvArr.unshift('"geonames_id","latitude","longitude","mc_geonames_id","mc_name","basic_name"');
  return csvArr.join(",\r\n");
}