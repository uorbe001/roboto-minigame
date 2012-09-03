var Entity = require('./entity'), extend = require('./utils').extend, b2d = require('box2dnode'), Scale = require("./scale");

/**
 The player entity.
 @param world box2d world
 @param x
 @param y
*/
var Player = function(world, x, y) {
	Player.__super__.constructor.call(this, world, x, y);
	this.radious = 5;
	this.__initPhysics(world, x, y);
};

//"Inheritance", player inherits from entity
extend(Player, Entity);

/**
  Inits the player's physics.
  @param world Physics world.
*/
Player.prototype.__initPhysics = function(world, x, y) {
	var fixtureDef = new b2d.b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.5;
	fixtureDef.restitution = 0.2;

	var bodyDef = new b2d.b2BodyDef();
	bodyDef.type = b2d.b2Body.b2_dynamicBody;
	fixtureDef.shape = new b2d.b2CircleShape(this.radious);

	bodyDef.position.x = x;
	bodyDef.position.y = y;

	this.body = world.CreateBody(bodyDef);
	this.fixture = this.body.CreateFixture(fixtureDef);
};

Player.prototype.getPosition = function() {
	return this.body.GetPosition();
};

/**
 Draws the player.
 @param renderer The renderer to use.
*/
Player.prototype.draw = function(renderer) {
	var p = this.getPosition();
	this.drawPosition.set(p.y * Scale.toScreen, p.y * Scale.toScreen);
	renderer.drawCircle(this.drawPosition, this.radious);
};

module.exports = Player;