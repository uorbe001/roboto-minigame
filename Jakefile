var sys = require('util');
var fs = require('fs');
var exec = require('child_process').exec;

desc("Builds the project into a file.");
task("default", function(params) {
	console.log("Building the project into a file...")
	exec("browserify src/game.js  -o game.min.js", function (error, stdout, stderr) {
		sys.print(stdout);
		if (error)
			sys.print(stderr);
		else
			console.log("The file is ready.");
	});
});
