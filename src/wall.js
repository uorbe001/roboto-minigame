var Entity = require('./entity'), extend = require('./utils').extend, b2d = require('box2dnode'), Scale = require("./scale"), Types = require('./types');

/**
 The Wall entity.
 @param world box2d world
 @param x
 @param y
 @param w
 @param h
*/
var Wall = function(world, x, y, w, h) {
	Wall.__super__.constructor.call(this, world, x, y);
	this.width = w;
	this.height = h;
	this.__initPhysics(world, x, y, w, h);
	Wall.count += 1;
};

//"Inheritance", Wall inherits from entity
extend(Wall, Entity);
Wall.count = 0;

/**
  Inits the Wall's physics.
  @param world Physics world.
*/
Wall.prototype.__initPhysics = function(world, x, y, w, h) {
	var fixtureDef = new b2d.b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.5;
	fixtureDef.restitution = 0.2;

	var bodyDef = new b2d.b2BodyDef();
	bodyDef.type = b2d.b2Body.b2_staticBody;
	fixtureDef.shape = new b2d.b2PolygonShape();

	fixtureDef.shape.SetAsBox(w/2, h/2);
	bodyDef.position.x = x;
	bodyDef.position.y = y;

	this.body = world.CreateBody(bodyDef);
	this.body.SetUserData(Types.Wall * 100 + Wall.count);
	this.fixture = this.body.CreateFixture(fixtureDef);
};

Wall.prototype.getPosition = function() {
	return this.body.GetPosition();
};

/**
 Draws the Wall.
 @param renderer The renderer to use.
*/
Wall.prototype.draw = function(renderer) {
	var p = this.getPosition();
	this.drawPosition.set(p.x * Scale.toScreen, p.y * Scale.toScreen);
	renderer.drawSquare(this.drawPosition, this.width * Scale.toScreen, this.height * Scale.toScreen, {'stroke_color': '#0f0', 'fill_color': '#254117'});
};

/**
 Draws all the given instances of Walls.
 @param rednerer The renderer to use.
 @param Walls Array holding the different instances.
*/
Wall.drawInstances = function(renderer, walls) {
	var wall, p;
	//This method is faster than calling once per Wall, function calls are pretty expensive on js.
	for (var i = walls.length - 1; i >= 0; i--) {
		wall = walls[i];
		p = wall.getPosition();
		wall.drawPosition.set(p.x * Scale.toScreen, p.y * Scale.toScreen);
		renderer.drawSquare(wall.drawPosition, wall.width * Scale.toScreen, wall.height * Scale.toScreen, {'stroke_color': '#0f0', 'fill_color': '#254117'});
	}
};

module.exports = Wall;