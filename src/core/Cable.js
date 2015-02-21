/** Cable
 *
 * @author Cedric Stoquer
 */

function Cable(a, b, c) {
	this.endPointA = a;
	this.endPointB = b;
	this.color     = c;

	this.x = 0; // start point x
	this.y = 0; // start point y
	this.a = 0; // control point 1 x
	this.b = 0; // control point 1 y
	this.c = 0; // control point 2 x
	this.d = 0; // control point 2 y
	this.w = 0; // end point x
	this.h = 0; // end point y

	this.update();
}


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.draw = function () {
	var t = this;
	// TODO: change color

	ctx.beginPath();
	ctx.moveTo(t.x, t.y);
	ctx.bezierCurveTo(t.a, t.b, t.c, t.d, t.w, t.h);
	ctx.stroke();

	// TODO: add shadow on cable rendering
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.update = function () {
	var t = this;

	t.x = t.endPointA.module.x * MODULE_WIDTH  + t.endPointA.x * MODULE_HEIGHT + 8;
	t.y = t.endPointA.module.y * MODULE_HEIGHT + t.endPointA.y * MODULE_HEIGHT + 8;
	t.w = t.endPointB.module.x * MODULE_WIDTH  + t.endPointB.x * MODULE_HEIGHT + 8;
	t.h = t.endPointB.module.y * MODULE_HEIGHT + t.endPointB.y * MODULE_HEIGHT + 8;

	// TODO: better approach to choose control points
	var w = t.w - t.x;
	var h = t.h - t.y;

	t.a = ~~(t.x + w * Math.random());
	t.b = ~~(t.y + h * Math.random());
	t.c = ~~(t.x + w * Math.random());
	t.d = ~~(t.y + h * Math.random());
};