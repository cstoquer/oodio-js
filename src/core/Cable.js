/** Cable
 *  Render one cable between two connectors
 *
 * @author Cedric Stoquer
 */

function Cable(a, b, c) {
	this.endPointA = a;
	this.endPointB = b;
	this.color     = c || ROOT.COLOR.A;
	this.id        = this.getId(a, b);

	this.x = 0; // start point x
	this.y = 0; // start point y
	this.a = 0; // control point 1 x
	this.b = 0; // control point 1 y
	this.c = 0; // control point 2 x
	this.d = 0; // control point 2 y
	this.w = 0; // end point x
	this.h = 0; // end point y

	this.update();

	a.module.addCable(this);
	b.module.addCable(this);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.getId = function (a, b) {
	return a.module.id + ':' + a.id + '--' + b.module.id + ':' + b.id;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.draw = function () {
	var t = this;

	ctx.strokeStyle = t.color;
	ctx.beginPath();
	ctx.moveTo(t.x, t.y);
	ctx.bezierCurveTo(t.a, t.b, t.c, t.d, t.w, t.h);
	ctx.stroke();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.update = function () {
	var t = this;

	t.x = t.endPointA.module.x * MODULE_WIDTH  + t.endPointA.x * CONNECTOR_GRID_SIZE + 7;
	t.y = t.endPointA.module.y * MODULE_HEIGHT + t.endPointA.y * CONNECTOR_GRID_SIZE + 7;
	t.w = t.endPointB.module.x * MODULE_WIDTH  + t.endPointB.x * CONNECTOR_GRID_SIZE + 7;
	t.h = t.endPointB.module.y * MODULE_HEIGHT + t.endPointB.y * CONNECTOR_GRID_SIZE + 7;

	var w = (t.w - t.x) / 2;
	var h = (t.h - t.y) / 2;

	t.a = ~~(t.x + w *  Math.random()      + 10 * Math.random() - 5);
	t.b = ~~(t.y + h *  Math.random()      + 10 * Math.random() - 5);
	t.c = ~~(t.x + w * (Math.random() + 1) + 10 * Math.random() - 5);
	t.d = ~~(t.y + h * (Math.random() + 1) + 10 * Math.random() - 5);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.disconnect = function () {
	var t = this;
	if (t.endPointA) {
		// remove connections
		t.endPointA.disconnect(t.endPointB);
		t.endPointB.disconnect(t.endPointA);
		// remove cables references from modules
		t.endPointA.module.removeCable(t);
		t.endPointB.module.removeCable(t);
	}
	t.endPointA = null;
	t.endPointB = null;
};
