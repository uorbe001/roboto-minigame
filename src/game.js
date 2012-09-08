var Renderer = require("./renderer"), Level = require('./level'), Scale = require('./scale'), Types = require('./types');

var Game = (function() {
	var window = this, doc = window.document, canvas, context, renderer, level;

	function init() {
		canvas = doc.getElementById('cnv');
		renderer = new Renderer(canvas);

		level = new Level({
			'player': { 'position': {'x': 5, 'y': 5} },
			'mines': [
				{ 'position': {'x': 25, 'y': 25} },
				{ 'position': {'x': 45, 'y': 45} }
			],
			'walls': [
				{ 'position': {'x': 15, 'y': canvas.height/2 * Scale.toWorld}, 'width': 5, 'height': canvas.height/2 * Scale.toWorld },
				{ 'position': {'x': 35, 'y': canvas.height/2 * Scale.toWorld}, 'width': 5, 'height': canvas.height/2 * Scale.toWorld }
			],
			'canvas_width': canvas.width,
			'canvas_height': canvas.height,
			'callbacks': {
				'begin_contact': function(a, b) {
					var id;
					//check the type of the first body
					if (Math.floor(a / 100) == Types.Mine) {
						id = a % 100;
						console.log("explode! id:", id);

						//if (Math.floor(b / 100) == Types.Player)
						//	console.log("Hit! (superscared)");
					}
					//check the type of the second body
					if (Math.floor(b / 100) == Types.Mine) {
						id = a % 100;
						console.log("explode! id:", id);

						//if (Math.floor(a / 100) == Types.Player)
						//	console.log("Hit! (superscared)");
					}
				}/*,
				'end_contact': function(a, b) {}*/
			}
		});

		initListeners();

		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		requestAnimationFrame(update);
	}

	function initListeners() {
		doc.addEventListener('keydown', function(e) {
			switch(event.keyCode) {
				case 37: //left
					level.player.setLinearVelocity(-20, 0);
					break;
				case 38: //up
					level.player.setLinearVelocity(0, -20);
					break;
				case 39: //right
					level.player.setLinearVelocity(20, 0);
					break;
				case 40: //down
					level.player.setLinearVelocity(0, 20);
					break;
			}
		});

		doc.addEventListener('keyup', function(e) {
			level.player.setLinearVelocity(0, 0);
		});
	}

	function update(timestamp) {
		requestAnimationFrame(update);
		level.updateAI();
		level.updatePhysics();
		renderer.clear();
		level.draw(renderer);
	}

	window.onload = init;
})();