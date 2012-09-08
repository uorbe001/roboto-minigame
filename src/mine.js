var Entity = require('./entity'), extend = require('./utils').extend, b2d = require('box2dnode'), Scale = require("./scale");

/**
 The Mine entity.
 @param world box2d world
 @param x
 @param y
*/
var Mine = function(world, x, y) {
	Mine.__super__.constructor.call(this, world, x, y);
	this.radious = 0.5;
	this.__attractionForce = new b2d.b2Vec2();
	this.__initPhysics(world, x, y);
};

//"Inheritance", Mine inherits from entity
extend(Mine, Entity);

/**
  Inits the Mine's physics.
  @param world Physics world.
*/
Mine.prototype.__initPhysics = function(world, x, y) {
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

Mine.prototype.getPosition = function() {
	return this.body.GetPosition();
};

/**
 Draws the Mine.
 @param renderer The renderer to use.
*/
Mine.prototype.draw = function(renderer) {
	var p = this.getPosition();
	this.drawPosition.set(p.x * Scale.toScreen, p.y * Scale.toScreen);
	renderer.drawCircle(this.drawPosition, this.radious, {'stroke_color': '#f00'});
};

/**
 Makes the mine "think" (attracts it to the player when it is visible)
*/
Mine.prototype.think = function(player, walls) {
	var input = new b2d.b2RayCastInput();
	var output = new b2d.b2RayCastOutput();
	input.p1 = this.getPosition();
	input.p2 = player.getPosition();
	input.maxFraction = 1;
	
	//Test if the player can be seen
	var fixture = player.body.GetFixtureList();
	//If the player cannot be seen, get out
	if (!fixture.RayCast(output, input))
		return;

	var player_fraction = output.fraction, player_visible = true;
	//check if any of the walls is closer than the player
	for (var i = walls.length - 1; i >= 0; i--) {
		fixture = walls[i].body.GetFixtureList();

		if (!fixture.RayCast(output, input))
			continue;

		if (output.fraction < player_fraction) {
			player_visible = false;
			return;
		}
	}

	//Player is visible
	//Calculate the distance to the player
	input.p2.Subtract(input.p1);
	var direction = input.p2;
	var distance = input.p2.Length();
	var factor = -distance + 10;
	factor = factor > 0? factor: 0;
	//Attract the mine to the player.
	this.__attractionForce.Set(direction.x * factor, direction.y * factor);
	this.body.ApplyForce(this.__attractionForce, this.body.GetWorldCenter());
};

/**
 Draws all the given instances of mines.
 @param rednerer The renderer to use.
 @param mines Array holding the different instances.
*/
Mine.drawInstances = function(renderer, mines) {
	var mine, p;
	//This method is faster than calling once per mine, function calls are pretty expensive on js.
	for (var i = mines.length - 1; i >= 0; i--) {
		mine = mines[i];
		p = mine.getPosition();
		mine.drawPosition.set(p.x * Scale.toScreen, p.y * Scale.toScreen);
		renderer.drawCircle(mine.drawPosition, mine.radious * Scale.toScreen, {'stroke_color': '#f00'});
	}
};

module.exports = Mine;