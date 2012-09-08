var Player = require("./player"), Mine = require("./mine"), Wall = require('./wall'),
	b2d = require("box2dnode"), Scale = require('./scale');

/**
	Level.
	@param config
*/
function Level(config) {
	if (!config || !config.mines) throw "The config must specify a mines array";
	if (!config || !config.walls) throw "The config must specify a walls array";
	if (!config || !config.player) throw "The config must specify player data";
	if (!config || !config.canvas_width || !config.canvas_height) throw "The config must specify canvas width and height";
	
	this.canvasHeight = config.canvas_height;
	this.canvasWidth = config.canvas_width;

	this.physics_world = new b2d.b2World(new b2d.b2Vec2(0, 0), true);
	this.player = new Player(this.physics_world, config.player.position.x, config.player.position.y);
	this.mines = [];

	for (var i = config.mines.length - 1; i >= 0; i--) {
		this.mines.push(new Mine(this.physics_world, config.mines[i].position.x, config.mines[i].position.y));
	}

	this.walls = [];

	for (i = config.walls.length - 1; i >= 0; i--) {
		this.walls.push(new Wall(this.physics_world, config.walls[i].position.x, config.walls[i].position.y,
			config.walls[i].width, config.walls[i].height));
	}

	this.__setScreenBoundaries();
}

Level.prototype.__createBoundary = function(x, y, w, h) {
	var fixtureDef = new b2d.b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.5;
	fixtureDef.restitution = 0.2;
	var bodyDef = new b2d.b2BodyDef();
	bodyDef.type = b2d.b2Body.b2_staticBody;

	bodyDef.position.x = x;
	bodyDef.position.y = y;
	fixtureDef.shape = new b2d.b2PolygonShape();

	fixtureDef.shape.SetAsBox(w, h);
	this.physics_world.CreateBody(bodyDef).CreateFixture(fixtureDef);
};

Level.prototype.__setScreenBoundaries = function() {
	//Bottom boundary
	this.__createBoundary(this.canvasWidth / 2 * Scale.toWorld, this.canvasHeight * Scale.toWorld,
		(this.canvasWidth * Scale.toWorld) / 2, (10 * Scale.toWorld) / 2);
	//Top boundary
	this.__createBoundary(this.canvasWidth / 2 * Scale.toWorld, 0,
		(this.canvasWidth * Scale.toWorld) / 2, (10 * Scale.toWorld) / 2);
	//Left boundary
	this.__createBoundary(0, this.canvasHeight / 2 * Scale.toWorld,
		5 * Scale.toWorld, (this.canvasHeight * Scale.toWorld) / 2);
	//Left boundary
	this.__createBoundary(this.canvasWidth * Scale.toWorld, this.canvasHeight / 2 * Scale.toWorld,
		5 * Scale.toWorld, (this.canvasHeight * Scale.toWorld) / 2);
};

Level.prototype.updatePhysics = function() {
	this.physics_world.Step(1/60, 10, 10);
	this.physics_world.ClearForces();
};

Level.prototype.updateAI = function() {
	for (var i = this.mines.length - 1; i >= 0; i--) {
		this.mines[i].think(this.player, this.walls);
	}
};

Level.prototype.draw = function(renderer) {
	this.player.draw(renderer);
	Mine.drawInstances(renderer, this.mines);
	Wall.drawInstances(renderer, this.walls);
};

module.exports = Level;