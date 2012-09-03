var Renderer = require("./renderer"), Player = require("./player"), Mine = require("./mine"), b2d = require("box2dnode");

var Game = (function() {
	var window = this, doc = window.document, canvas, context, renderer, player, physics_world;
	var mines;

	function init() {
		canvas = doc.getElementById('cnv');
		renderer = new Renderer(canvas);

		initWorld();

		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		requestAnimationFrame(update);
	}

	function initWorld() {
		physics_world = new b2d.b2World(new b2d.b2Vec2(0, 0), true);
		player = new Player(physics_world, 5, 5);
		mines = [new Mine(physics_world, 25, 25), new Mine(physics_world, 45, 45)];
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
		Mine.drawInstances(renderer, mines);
	}

	window.onload = init;
})();