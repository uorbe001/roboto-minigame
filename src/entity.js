var Vector2d = require('./vector2d');

/**
 The entities represented err... entities in the game.
 @param x
 @param y
*/
var Entity = function (x, y) {
	this.position = new Vector2d(x,y);
	// body...
};

module.exports = Entity;