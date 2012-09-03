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

module.exports = Vector2d;