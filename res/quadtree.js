// Daniel Shiffman http://codingtra.in http://patreon.com/codingtrain https://github.com/CodingTrain/QuadTree
// Implementation changed slightly so that only leaves can contain points
// Also fixed a bug with subdivide so new x, y are correct
class Point {
  constructor (x, y, data) {
    this.x = x;
    this.y = y;
    this.userData = data;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  get left()   {return this.x - this.w / 2;}
  get right()  {return this.x + this.w / 2;}
  get top()    {return this.y - this.h / 2;}
  get bottom() {return this.y + this.h / 2;}
  contains (point) {
    return (point.x >= this.x - this.w / 2 &&
      point.x <= this.x + this.w / 2 &&
      point.y >= this.y - this.h / 2 &&
      point.y <= this.y + this.h / 2);
  }
  intersects (range) {
    return !(range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h);
  }
}

class QuadTree {
  constructor (boundary, capacity) {
    if (!boundary)                        throw TypeError('boundary is null or undefined');
    if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle');
    if (typeof capacity !== 'number')     throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
    if (capacity < 1)                     throw RangeError('capacity must be greater than 0');
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide () {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let nw = new Rectangle(x - w / 2, y - h / 2, w, h);
    this.northwest = new QuadTree(nw, this.capacity + 1);
    let ne = new Rectangle(x + w / 2, y - h / 2, w, h);
    this.northeast = new QuadTree(ne, this.capacity + 1);
    let sw = new Rectangle(x - w / 2, y + h / 2, w, h);
    this.southwest = new QuadTree(sw, this.capacity + 1);
    let se = new Rectangle(x + w / 2, y + h / 2, w, h);
    this.southeast = new QuadTree(se, this.capacity + 1);
    // Move points to leaf nodes as final comparison is more costly than doing this
    for (let point of this.points) {
      if (this.northwest.insert(point)) {
      } else if (this.northeast.insert(point)) {
      } else if (this.southwest.insert(point)) {
      } else if (this.southeast.insert(point)) {
      } else {
        console.log('err');
      }
    }
    this.points = [];
    this.divided = true;
  }

  insert (point) {
    if (!this.boundary.contains(point)) return false;
    if (!this.divided && this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }
    if (!this.divided) this.subdivide();
    return (this.northwest.insert(point) || this.northeast.insert(point) || this.southwest.insert(point) || this.southeast.insert(point));
  }

  query (range, found) {
    if (!found) found = [];
    if (!range.intersects(this.boundary)) return found;
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    } else {
      for (let p of this.points) {
        if (range.contains(p)) found.push(p);
      }
    }
    return found;
  }
  draw () {
    if (this.divided === false) {
      outputContext.fillStyle = getRandomColor();
      outputContext.fillRect(this.boundary.left, this.boundary.top, this.boundary.w, this.boundary.h);
    } else {
      this.northwest.draw();
      this.northeast.draw();
      this.southwest.draw();
      this.southeast.draw();
    }
  }
}
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
if (typeof module !== "undefined") {
  module.exports = {Point, Rectangle, QuadTree};
}