var Renderer = require("./renderer"), Vector2d = require('./vector2d');

var Game = (function() {
	var window = this, doc = window.document, canvas, context, renderer;

	function init() {
		canvas = doc.getElementById('cnv');
		renderer = new Renderer(canvas);
		context = renderer.context;

		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		requestAnimationFrame(update);
	}


	function update(timestamp) {
		renderer.clear(context);
		renderer.drawCircle(context, new Vector2d(canvas.width/2, canvas.height/2), 5);
	}

	window.onload = init;
})();