var sys = require('util');
var fs = require('fs');
var exec = require('child_process').exec;

desc("This is the default task.");
task("default", function(params) {
	//Do something.
});

desc("Builds the project into a file.");
task("build", function(params){
	console.log("Building the project into a file...")
	exec("browserify src/game.js  -o game.min.js", function (error, stdout, stderr) {
		sys.print(stdout);
		if (error)
			sys.print(stderr);
		else
			console.log("The file is ready.");
	});
});
