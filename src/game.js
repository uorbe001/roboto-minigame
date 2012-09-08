var Renderer = require("./renderer"), Player = require("./player"), Mine = require("./mine"), Wall = require('./wall'),
	b2d = require("box2dnode"), Scale = require('./scale');

var Game = (function() {
	var window = this, doc = window.document, canvas, context, renderer, player, physics_world;
	var mines, walls;

	function init() {
		canvas = doc.getElementById('cnv');
		renderer = new Renderer(canvas);

		initWorld();
		initListeners();

		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		requestAnimationFrame(update);
	}

	function initWorld() {
		physics_world = new b2d.b2World(new b2d.b2Vec2(0, 0), true);
		player = new Player(physics_world, 25, 25);
		mines = [new Mine(physics_world, 5, 5), new Mine(physics_world, 45, 45)];
		walls = [
			new Wall(physics_world, 15, canvas.height/2 * Scale.toWorld, 5, canvas.height * Scale.toWorld),
			new Wall(physics_world, 35, canvas.height/2 * Scale.toWorld, 5, canvas.height * Scale.toWorld)
		];

		setScreenBoundaries();
	}

	function __createBoundary(x, y, w, h) {
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
		physics_world.CreateBody(bodyDef).CreateFixture(fixtureDef);
	}

	function setScreenBoundaries() {
		//Bottom boundary
		__createBoundary(canvas.width / 2 * Scale.toWorld, canvas.height * Scale.toWorld,
			(canvas.width * Scale.toWorld) / 2, (10 * Scale.toWorld) / 2);
		//Top boundary
		__createBoundary(canvas.width / 2 * Scale.toWorld, 0,
			(canvas.width * Scale.toWorld) / 2, (10 * Scale.toWorld) / 2);
		//Left boundary
		__createBoundary(0, canvas.height / 2 * Scale.toWorld,
			5 * Scale.toWorld, (canvas.height * Scale.toWorld) / 2);
		//Left boundary
		__createBoundary(canvas.width * Scale.toWorld, canvas.height / 2 * Scale.toWorld,
			5 * Scale.toWorld, (canvas.height * Scale.toWorld) / 2);
	}

	function initListeners() {
		doc.addEventListener('keyup', function(e) {
			switch(event.keyCode) {
				case 37: //left
					player.move(-5, 0);
					break;
				case 38: //up
					player.move(0, -5);
					break;
				case 39: //right
					player.move(5, 0);
					break;
				case 40: //down
					player.move(0, 5);
					break;
			}
		});
	}

	function updatePhysics() {
		physics_world.Step(1/60, 10, 10);
		physics_world.ClearForces();
	}

	function update(timestamp) {
		requestAnimationFrame(update);
		updatePhysics();

		renderer.clear();
		player.draw(renderer);

		for (var i = mines.length - 1; i >= 0; i--) {
			mines[i].think(player, walls);
		}

		Mine.drawInstances(renderer, mines);
		Wall.drawInstances(renderer, walls);
	}

	window.onload = init;
})();