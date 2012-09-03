/**
 Renderer contructor.
 @param canvas The canvas to render on.
 @param clear_color The color to clear the screen with.
 @param fill_color The color to use to fill the drawn elements.
 @param stroke_color The color to use for the strokes.
 @param line_width The width of the line to be drawn.
*/
var Renderer = function(canvas, clear_color, fill_color, stroke_color, line_width) {
	if (!canvas) throw "Canvas is required to create the renderer.";
	
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.clearColor = clear_color || "#000";
	this.fillColor = fill_color || "#000";
	this.strokeColor = stroke_color || "#fff";
	this.lineWidth = line_width || 2;
};

/**
 Binds the draw properties, color, line width etc.
*/
Renderer.prototype.__bindProperties = function() {
	this.context.fillStyle = this.fillColor;
	this.context.lineWidth = this.lineWidth;
	this.context.strokeStyle = this.strokeColor;
};

/**
 Fills the background with the set color.
*/
Renderer.prototype.clear = function() {
	this.context.fillStyle = this.clearColor;
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 Draws a circle centered in the given position with the given radious.
 @param position The center of the circle.
 @param radious The radious of the circle.
*/
Renderer.prototype.drawCircle = function(position, radious) {
	this.__bindProperties();
	this.context.beginPath();
	this.context.arc(position.x, position.y, radious, 0, 2 * Math.PI, false);
	this.context.fill();
	this.context.stroke();
};

/**
 Draws a square centered in the given position with the given size.
 @param position The center of the square.
 @param width The square's width.
 @param height The square's height.
*/
Renderer.prototype.drawSquare = function( position, width, height) {
	this.__bindProperties();
	//TODO
};

module.exports = Renderer;