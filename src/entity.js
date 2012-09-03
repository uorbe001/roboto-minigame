var b2d = require('box2dnode'),
	Vector2d = require('./vector2d'),
	Scale = require('./scale');

/**
 The entities represented err... entities in the game.
 @param world box2d world
 @param x
 @param y
*/
var Entity = function (x, y) {
	this.drawPosition = new Vector2d(x * Scale.toScreen, y * Scale.toScreen);
};

Entity.prototype.draw = function(renderer) {
	// body...
};

module.exports = Entity;