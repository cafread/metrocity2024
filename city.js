// Based on the raw city data, establish neighbours for each (id and distance of all within 100 km)
// Identify important cities (MK work)
// Identify candidate cities (CR work)
// Build an object with lots of cities in
// Once this is full, call hunt() for each city so it will try to merge with its neighbours
class City {
  constructor (id, x=0, y=0, lat, lon, pop, basicName, name, countryCode, color, isVital=false, isCandidate=false, neighbours=[]) {
    this.id = id;
    this.x = x; // Reprojected on pan / zoom
    this.y = y; // Reprojected on pan / zoom
    this.lat = lat;
    this.lon = lon;
    this.pop = pop;
    this.basicName = basicName;
    this.name = name;
    this.countryCode = countryCode;
    this.color = color;
    this.originalColor = color;
    this.isVital = isVital; // Flag for major cities we have pre-decided upon
    this.isCandidate = isCandidate; // Flag for towns etc. which are like food
    this.parentCity = null; // Will point to parent city (not hold id)
    this.MCpop = pop;
    this.neighbours = neighbours; // Array of objects - {id: 123, distance: 25}
    this.hasConsumed = []; // Array of Cities
  }
  consume (target) {
    // Consume another City
    this.MCpop += target.pop;
    this.hasConsumed.push(target);
    // Neighbours beyond the maximum merge distance will not be in neighbours, we do not wish to merge neighbours
    // May have consumed sub-targets which are beyond the maximum range
    while (target.hasConsumed.length > 0) {
      let grandChild = target.hasConsumed.pop();
      if (this.neighbours.map(d => d.id).contains(grandChild.id)) {
        this.consume(grandChild);
      } else {
        grandChild.released();
      }
    }
    target.beConsumed(this);
  }
  unConsume (target) {
    this.MCpop -= target.pop;
    let index = this.hasConsumed.findIndex(f => f.id === target.id);
    this.hasConsumed.splice(index, 1);
  }
  released () {
    this.parentCity = null;
    this.MCpop = this.pop;
    this.color = this.originalColor;
    for (let c of this.hasConsumed) c.released();
  }
  beConsumed (parentCity) {
    this.parentCity = parentCity; // City, not ID
    this.MCpop = 0;
    this.color = parentCity.color;
  }
  hunt (cityData, consumeLimit=3) { // cityData is the main repository for all the cities, an object keyed on id
    if (this.parentCity !== null) return; // Too late, you've been eaten already
    if (!this.isCandidate) return; // Sorry, food doesn't go hunting
    for (let nb of this.neighbours) {
      if (consumeLimit <= 0) return; // Burp!
      let target = cityData[nb.id];
      // Test if they can be consumed and if so try consume them.
      if (
          !target.isVital &&
          target.parentCity === null &&
          this.countryCode === target.countryCode &&
          this.canConsume(target, nb.distance)
        ) {
          this.consume(target);
          consumeLimit--;
        }
    }
  }
  agglomerate (cityData) {
    // Prey seeking out the most influential mc neighbour amongst candidates
    // The result will change as the algo iterates and MC pops grow
    // This should be run for all several times as the MC pops will change after each run
    // -- What about candidates consuming one another?  Separate step?
    if (!this.isCandidate && this.neighbours.length > 0) {
      // Update neighbour influence once round is complete to reflect new MC Pops
      let mc = this.neighbours.sort((a, b) => b.influence - a.influence).filter(n => cityData[n.id].parentCity === null)[0];
      // Need to filter for mc candidates which have not yet been consumed, otherwise we will likely have the same result as original mapping
      // If the current parent mc was consumed, this must be released if it wasn't already
      if (mc === undefined) {
        if (this.parentCity !== null) this.released();
      } else if (cityData[mc.id].canConsume(this, mc.distance) && (this.parentCity === null || this.parentCity.id !== mc.id)) {
        if (this.parentCity !== null) this.parentCity.unConsume(this);
        cityData[mc.id].consume(this);
      }
    }
  }
  canConsume (target, distance) {
    if (this.MCpop < target.MCpop) return false;
    if ((1.0 * this.calcInfluence(distance)) > target.calcInfluence(0)) return true;
    // Magic number - higher > more agglomeration, lower > independent cities
    return false;
  }
  calcInfluence (distance=0) {
    return Math.pow(this.MCpop, 0.25) * (100 - distance);
  }
  show (canvasContext, labelContext) {
    // Plot city, lines to children / parent
    // Draw this city as a circle, with r proportional to pop
    canvasContext.beginPath();
		canvasContext.arc(this.x, this.y, Math.sqrt(this.pop / 10000), 0, 2 * Math.PI);
		canvasContext.fillStyle = this.color;
    canvasContext.fill();
    canvasContext.closePath();
    if (this.parentCity !== null) {
      // Draw a line from this to Parent
      canvasContext.strokeStyle = this.color;
      canvasContext.beginPath();
      canvasContext.moveTo(this.x, this.y);
      canvasContext.lineTo(this.parentCity.x, this.parentCity.y);
      canvasContext.stroke();
    } else {
      for (let target of this.hasConsumed) {
        // Draw a line to target
        canvasContext.strokeStyle = this.color;
        canvasContext.beginPath();
        canvasContext.moveTo(this.x, this.y);
        canvasContext.lineTo(target.x, target.y);
        canvasContext.stroke();
      }
      // Add text label
      labelContext.fillStyle = "black";
      labelContext.font = "bold 18px Arial";
      labelContext.fillText(this.name, this.x + 10, this.y);
    }
  }
}

if (typeof module !== "undefined") {
  module.exports = {City};
}