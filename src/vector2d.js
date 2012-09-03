/**
 Vector2d constructor.
 @param x
 @param y
*/
var Vector2d = function(x, y) {
	//Using typed arrays would be faster, but since little advantage would be achieved from it,
	//I prefer to make this more readable.
	this.x = x || 0;
	this.y = y || 0;
};

Vector2d.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
};

module.exports = Vector2d;