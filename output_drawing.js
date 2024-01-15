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
  let tileCoords = d3.select("#container").selectAll(".tile")[0].map(d => d.src.substr(52).replace('.png', '').split("/").map(Number));
  let tileY = d3.min(tileCoords, d => d[1]);
  // When crossing the international date line, the 'x' tile property resets to zero, but we want the min of the 'high' x values
  let minTileX = d3.min(tileCoords, d => d[0]);
  let maxTileX = d3.max(tileCoords, d => d[0]);
  let tileX = minTileX;
  if(minTileX === 0 && maxTileX > 120) tileX = d3.min(tileCoords, d => d[0] > 120 ? d[0] : null);
  return [tileX, tileY];
}
function dataToTile (x, y, source="localStorage") {
  // Given the upper left x & y tile details, pull from localStorage all saved tiles
  let tileX = 0;
  let tileY = 0;
  let tileKey = "";
  let lsVal = "";
  let imgSrc = "";
  while (tileY < 4) {
    while (tileX < 6) {
      tileKey = lpad(x + tileX, 3) + "_" + lpad(y + tileY, 3);
      lsVal = localStorage.getItem(tileKey);
      if (source === "localStorage" && lsVal !== null) {
        imgSrc = tileCode + LZString.decompress(lsVal).replace("image/octet-stream", "image/png");
        drawWipTile (tileX, tileY, imgSrc);
      } else { // Source is Master
        if (mastTileKeys.indexOf(tileKey) > -1) {
          imgSrc = "tiles/" + tileKey + ".png";
          drawWipTile (tileX, tileY, imgSrc);
        }
      }
      tileX++;
    }
    tileX = 0;
    tileY++;
  }
  // Show detailed controls
  document.getElementById("mcControls").style.visibility = "visible";
}
function drawWipTile (tileX, tileY, imgSrc) {
  let offsX = 256 * tileX;
  let offsY = 256 * tileY;
  let masterTile = new Image();
  masterTile.onload = function(){outputContext.drawImage(masterTile, offsX, offsY, 256, 256);};
  masterTile.src = imgSrc;
}
function toggleFrozen () {
  isFrozen = document.getElementById("frozenToggle").checked;
  if (!isFrozen) {
    document.getElementById("outputCanvas").style.cursor = "pointer";
    //document.getElementById("mapMCs").style.visibility = "visible";
    document.getElementById("dispWIP").style.visibility = "visible";
    document.getElementById("brushInfo").style.visibility = "hidden";
    d3.select("#outputCanvas").on("click", null);
    d3.select("#editCanvas").on("click", null);
    editState.allowDrawing = false;
    editState.busyDrawing = false
  } else {
    enableSample ();
    penColor = "rgba(255,255,255,1)";
    document.getElementById("colorPot").style.background = penColor;
    //document.getElementById("mapMCs").style.visibility = "hidden";
    document.getElementById("dispWIP").style.visibility = "hidden";
    document.getElementById("brushInfo").style.visibility = "visible";
    editState.allowDrawing = false;
  }
  if (document.getElementById("editCanvas") !== null) document.getElementById("editCanvas").remove();
}
function enableSample () {
  // Switch from observation mode to color sampling mode
  // Set cursor to pipette to make this obvious
  document.getElementById("outputCanvas").style.cursor = "url(res/pip.png), pointer";
  if (document.getElementById("editCanvas") !== null) document.getElementById("editCanvas").remove();
  d3.select("#outputCanvas").on("click", sampleOutput);
  editState.busyDrawing = false;
  editState.allowDrawing = false;
}
function enablePaint () {
  // Switch to painting mode
  // Set cursor to brush to make this obvious
  document.getElementById("outputCanvas").style.cursor = "url(res/brush.png), pointer";
  d3.select("#outputCanvas").on("click", sampleOutput);
  // Do painty stuff here
  d3.select("#colorPot").on("click", enableSample);
  addPaint();
}
function sampleOutput () {
  let [x, y] = d3.mouse(this);
  console.log("Sampled", outputContext.getImageData(x, y, 1, 1).data);
  let mcid = rgbaToId(outputContext.getImageData(x, y, 1, 1).data);
  penColor = mcid ? idToColor[mcid] : "rgba(0,0,0,1)";
  document.getElementById("colorPot").style.background = penColor;
  let mc = mcid ? cityData.find(d => d.i === mcid).n : "None";
  document.getElementById("paintCity").textContent = mc;
  enablePaint ();
}

// Requires Mootools 1.4.5
let editState = {
  busyDrawing: false,
  allowDrawing: false,
  clickX: [],
  clickY: [],
  clickDrag: [],
  context: null
}
function addClick (x, y, dragging) {
  editState.clickX.push(x);
  editState.clickY.push(y);
  editState.clickDrag.push(dragging);
  reDrawArt();
}
function reDrawArt () {
  editState.context.clearRect(0, 0, width, height); // Clears the canvas
  editState.context.strokeStyle = penColor;
  editState.context.lineJoin = "round";
  editState.context.lineWidth = document.getElementById("brushSize").value;
  for (let i = 0; i < editState.clickX.length; i++) {
    editState.context.beginPath();
    if (editState.clickDrag[i] && i) {
      editState.context.moveTo(editState.clickX[i - 1], editState.clickY[i - 1]);
     } else {
      editState.context.moveTo(editState.clickX[i] - 1, editState.clickY[i]);
     }
     editState.context.lineTo(editState.clickX[i], editState.clickY[i]);
     editState.context.closePath();
     editState.context.stroke();
  }
}
function transferArt () {
  // Takes the temporary work on the editCanvas and transfers it to the outputCanvas
  // This is only called once the edit work has completed and avoids glitchy drawing
  // In order to get the exact rgb to combine with the output, getImageData is used
  editState.busyDrawing = false;
  let erasing = (penColor === "rgba(0,0,0,1)" || penColor === "rgba(255,255,255,1)") ? 0 : 255;
  reDrawArt();
  let drawData = editState.context.getImageData(0, 0, width, height);
  let currData = outputContext.getImageData(0, 0, width, height).data;
  let [r, g, b] = penColor.replace("rgba(", "").replace(",1)", "").split(",");
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let pxr = 4 * (x + y * width); // Pixel is 4 entries: r, g, b, a
      if (drawData.data[pxr + 3] > 127) { // Above threshold, apply paint
        drawData.data[pxr    ] = r;
        drawData.data[pxr + 1] = g;
        drawData.data[pxr + 2] = b;
        drawData.data[pxr + 3] = erasing;
      } else { // Below threshold, maintain current value
        drawData.data[pxr    ] = currData[pxr    ];
        drawData.data[pxr + 1] = currData[pxr + 1];
        drawData.data[pxr + 2] = currData[pxr + 2];
        drawData.data[pxr + 3] = currData[pxr + 3];
      }
    }
  }
  // Write generated data to the output canvas
  outputContext.putImageData(drawData, 0, 0);
  // Reset drawing canvas
  editState.context.clearRect(0, 0, width, height);
  editState.clickX.length = 0;
  editState.clickY.length = 0;
  editState.clickDrag.length = 0;
}
function addPaint () {
  // Now to do the painty bit itself
  editState.allowDrawing = true;
  if (document.getElementById("editCanvas") !== null) document.getElementById("editCanvas").remove();
  let container = document.getElementById("map");
	let editCanvas = document.createElement("canvas");
  editCanvas.setAttribute("width", width);
  editCanvas.setAttribute("height", height);
  editCanvas.setAttribute("id", "editCanvas");
  editCanvas.style.cursor = "url(res/brush.png), pointer";
  container.appendChild(editCanvas);
  // Remove this canvas later - on sample, on persist, on unfreeze d3.select("#editCanvas").remove()
  editState.context = editCanvas.getContext("2d", {willReadFrequently: true});
  initArt (editCanvas);
}
function initArt (canvas) {
  canvas.onselectstart = () => {};
  canvas.unselectable = "on";
  canvas.style.MozUserSelect = "none";
  canvas.onmousedown = function (e) {
    editState.busyDrawing = editState.allowDrawing;
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    editState.busyDrawing = true;
    addClick(mouseX, mouseY, false);
  }
  canvas.onmousemove = function (e) {if (editState.busyDrawing) addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);}
  canvas.onmouseup = () => transferArt();
  canvas.onmouseleave = () => editState.busyDrawing = false;
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