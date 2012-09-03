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
 @param context The context to render on.
*/
Renderer.prototype.__bindProperties = function(context) {
	context.fillStyle = this.fillColor;
	context.lineWidth = this.lineWidth;
	context.strokeStyle = this.strokeColor;
};

/**
 Fills the background with the set color.
 @param context The context to render on.
*/
Renderer.prototype.clear = function(context) {
	context.fillStyle = this.clearColor;
	context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 Draws a circle centered in the given position with the given radious.
 @param context The context to render on.
 @param position The center of the circle.
 @param radious The radious of the circle.
*/
Renderer.prototype.drawCircle = function(context, position, radious) {
	this.__bindProperties(context);
	context.beginPath();
	context.arc(position.x, position.y, radious, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
};

/**
 Draws a square centered in the given position with the given size.
 @param context The context to render on.
 @param position The center of the square.
 @param width The square's width.
 @param height The square's height.
*/
Renderer.prototype.drawSquare = function(context, position, width, height) {
	this.__bindProperties(context);
	//TODO
};

module.exports = Renderer;