let batchInput;
let batchOutput = {};
d3.csv("res/to_mc_apt.csv", (err, dat) => {
    if (err) throw err;
    let [zLon, zLat] = projection([0.0, 0.0]);
    let sought = {};
    for (let d of dat) { // {type: 'N', id: '132635', lat: '51.670914', lon: '0.5001963'}
        let [pLon, pLat] = projection([+d.lon, +d.lat]); // lon first
        let xTile = Math.floor(64 - (zLon - pLon) / 256);
        let yTile = Math.floor(64 - (zLat - pLat) / 256);
        let tileKey = lpad(xTile, 3) + "_" + lpad(yTile, 3);
        if (mastTileKeys.indexOf(tileKey) > -1) sought[tileKey] = sought[tileKey] ? sought[tileKey].concat([d]) : [d];
        batchOutput[d.id] = {type: d.type, id: d.id, mcid: null, mcn: null};
    };
    batchInput = Object.entries(sought);
    console.log('prepped');
    batchMCFind();
});
function batchMCFind (idx = 0) {
    // Tiles are read individually, only where needed
    // All associated points are read and exported if an mc is found
    // This takes a minute to run in the worst case, a couplf of seconds for realistic data
    // So, while I could spend longer speeding it up, this is good enough for the task
    // output = input.map(...) doesn't work... as the operation is async due to file read
    if (batchInput[idx]) {
        let tileKey = batchInput[idx][0];
        [tileX, tileY] = tileKey.split("_").map(Number);
        let imgSrc = "tiles/" + tileKey + ".png";
        moveToTile(tileX, tileY); // offsX, offsY === 0
        let masterTile = new Image();
        masterTile.onload = function() {
            // As this is onload, it is inherently async
            outputContext.drawImage(masterTile, 0, 0, 256, 256);
            // Read and write output
            for (let loc of batchInput[idx][1]) {
                let metroCity = {type: loc.type, id: loc.id, mcid: null, mcn: null};
                let [locX, locY] = projection([loc.lon, loc.lat]);
                let mcid = rgbaToId(outputContext.getImageData(locX, locY, 1, 1).data);
                let mcInf = cityData.find(d => d.i === mcid);
                if (mcid > 0) {
                    let disp_name = mcInf.n;
                    batchOutput[loc.id] = {type: loc.type, id: loc.id, mcid: mcid, mcn: disp_name};
                }
            }
            // Call stack will handle the next tile
            batchMCFind(idx + 1);
        };
        masterTile.src = imgSrc;
    } else {
        // Could convert to a blob to save, but console is already open
        console.log(Object.values(batchOutput).sort((a, b) => a.id > b.id).map(d => d.type + '|' + d.id + '|' + d.mcn));
    }
}