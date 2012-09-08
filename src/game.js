var Renderer = require("./renderer"), Level = require('./level'), Scale = require('./scale');

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
			'canvas_height': canvas.height
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
					level.player.move(-5, 0);
					break;
				case 38: //up
					level.player.move(0, -5);
					break;
				case 39: //right
					level.player.move(5, 0);
					break;
				case 40: //down
					level.player.move(0, 5);
					break;
			}
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