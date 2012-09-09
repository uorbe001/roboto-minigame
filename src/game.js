var Renderer = require("./renderer"), Level = require('./level'), Scale = require('./scale'), Types = require('./types'), AudioManager = require('./audio_manager');

var Game = (function() {
	var window = this, doc = window.document, canvas, context, renderer, level, game_cleared, game_scores, stress;
	var audio_manager = new AudioManager();
	var valuations = ['Excellent!', 'Well done!', 'Not bad!', 'He is kind of stressed...', 'Oh dear! He is scared to death!'];
	var sounds = {'explosion': '/sounds/explosion.wav', 'background': '/sounds/background.wav'};

	function intro() {
		setTimeout(function() {
			var intro = doc.getElementById('intro');
			canvas = doc.getElementById('cnv');
			game_scores = doc.getElementById('game-scores');
			intro.style.display = 'none';
			canvas.style.display = 'block';
			game_scores.style.display = 'block';
			stress = doc.querySelector('#game-scores .stress-bar > .value');
			init();
		}, 3000);
	}

	function cleared() {
		canvas.style.display = 'none';
		game_scores.style.display = 'none';
		var scores = doc.getElementById('scores');
		var score = doc.querySelector("#scores .score");
		score.innerHTML = level.player.stress;
		var valuation = doc.querySelector("#scores .valuation");
		var vindx = Math.floor(level.player.stress / 10);
		vindx = vindx > 4? 4: vindx;
		valuation.innerHTML = valuations[vindx];
		scores.style.display = 'block';
	}

	function init() {
		game_cleared = false;
		canvas = doc.getElementById('cnv');
		renderer = new Renderer(canvas);
		
		//Load all the sounds in the sounds map.
		for (var key in sounds) {
			if (key == 'background') {
				audio_manager.load(sounds[key], function(url) {
					audio_manager.play(sounds.background, true);
				});

				continue;
			}

			audio_manager.load(sounds[key]);
		}

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
					var id, mine, distance;

					function callback() {
						//"this" is the mine itself thanks to Function#call.
						level.removeEntity(this.body.GetUserData());
					}

					//check the type of the first body
					if (Math.floor(a / 100) == Types.Mine) {
						mine = level.findEntityById(a);
						mine.explode(callback);
						distance = level.player.distanceToEntity(mine);
						level.player.heardExplosion(distance);
						audio_manager.play(sounds.explosion);
					}

					//check the type of the second body
					if (Math.floor(b / 100) == Types.Mine) {
						mine = level.findEntityById(b);
						mine.explode(callback);
						distance = level.player.distanceToEntity(mine);
						level.player.heardExplosion(distance);
						audio_manager.play(sounds.explosion);
					}
				},

				'on_game_cleared': function() {
					game_cleared = true;
					cleared();
				}
				/*'end_contact': function(a, b) {}*/
			}
		});

		initListeners();

		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		requestAnimationFrame(update);
	}

	function initListeners() {
		doc.addEventListener('keydown', function(e) {
			switch(e.keyCode) {
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

		var try_again_link = doc.querySelector('#scores a.try-again');
		try_again_link.addEventListener('click', function(e) {
			scores.style.display= 'none';
			canvas.style.display = 'block';
			game_scores.style.display = 'block';
			init();
		});
	}

	function update(timestamp) {
		if (!game_cleared) requestAnimationFrame(update);
		level.updateAI();
		level.updatePhysics();
		renderer.clear();
		level.draw(renderer);
		var st = level.player.stress < 50? level.player.stress: 50;
		stress.style.width = st * 9 + 'px';
	}

	window.onload = intro;
})();