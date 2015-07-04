/** Knob
 *
 * @author Cedric Stoquer
 */
function Knob(module, id, description) {
	var t = this;

	t.x      = description.x;
	t.y      = description.y;
	t.module = module;
	t.id     = id;
	t.value  = 0;
	t.min    = description.min || 0;
	t.max    = description.max !== undefined ? description.max : 1;
	t.int    = description.int || false;

	var dom = t._dom = createDom('knob', module._dom);
	dom.style.left = (t.x * MODULE_HEIGHT + 2) + 'px';
	dom.style.top  = (t.y * MODULE_HEIGHT + 2) + 'px';
	t._mark     = createDom('knob knobMark', dom);
	dom.connector = t;

	t.setValue(description.init);

	dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();

		// var startX = e.clientX;
		var startY = e.clientY;
		var startV = t.value;

		function mouseMove(e) {
			e.preventDefault();
			var delta = Math.max(-68, Math.min(68, startV + startY - e.clientY));
			t._mark.style.transform = 'rotate(' + (delta * 2) + 'deg)';
			t.value = delta;
			// TODO: update value in real time ?
		}

		function mouseUp(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			var value = map(t.value, -68, 68, t.min, t.max);
			if (t.int) value = ~~Math.round(value);
			t.module[t.id] = value;
		}

		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mouseup', mouseUp, false);
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.getValue = function () {
	return this.module[this.id];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.setValue = function () {
	var t = this;
	t.value = map(t.module[t.id], t.min, t.max, -68, 68);
	t._mark.style.transform = 'rotate(' + (t.value * 2) + 'deg)';
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.updateValue = function () {
	var value = map(this.value, -68, 68, this.min, this.max);
	if (this.int) value = ~~Math.round(value);
	this.module[this.id] = value;
};


