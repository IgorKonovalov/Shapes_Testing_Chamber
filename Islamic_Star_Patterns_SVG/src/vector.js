function Vector(x, y) {
  this.x = x;
  this.y = y;
  this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}
Vector.prototype.length = function () {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}

Vector.prototype.plus = function(other) {
  x = this.x + other.x;
  y = this.y + other.y;
  return new Vector(x, y);
}

Vector.prototype.multiply = function(factor) {
  x = this.x * factor;
  y = this.y * factor;
  return new Vector(x, y)
}

Vector.prototype.subtract = function(other) {
	x = this.x - other.x;
	y = this.y - other.y;
	return new Vector(x, y);
}

Vector.prototype.rotate = function(angle) {
	x = this.length * Math.cos(angle);
	y = this.length * Math.sin(angle);
	return new Vector(x, y);
}

Vector.prototype.rotate = function(angle) {
    x = Math.round(10000*(this.x * Math.cos(angle) - this.y * Math.sin(angle)))/10000;
    y = Math.round(10000*(this.x * Math.sin(angle) + this.y * Math.cos(angle)))/10000;
    return new Vector(x, y);
}

Vector.prototype.middle = function (end) {
  let line = Math.sqrt(Math.pow((this.x - end.x), 2) + Math.pow((this.y - end.y),2));
  let middleLength = line / 2;
  x = this.x - (middleLength * (this.x - end.x)) / line;
  y = this.y - (middleLength * (this.y - end.y)) / line;
  return new Vector(x, y);
}

Vector.prototype.setMagnitude = function (magnitude) {
  let length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  x = this.x * magnitude / length;
  y = this.y * magnitude / length;
  return new Vector(x, y);
};
