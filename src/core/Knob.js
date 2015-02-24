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
	t.value  = 0

	var dom = t._dom = createDom('knob', module._dom);
	dom.style.left = (t.x * MODULE_HEIGHT + 2) + 'px';
	dom.style.top  = (t.y * MODULE_HEIGHT + 2) + 'px';
	var mark    = createDom('knob knobMark', dom);
	var overlay = createDom('knobOverlay',   dom);
	overlay.connector = t;

	overlay.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();

		// var startX = e.clientX;
		var startY = e.clientY;
		var startV = t.value;

		function mouseMove(e) {
			e.preventDefault();
			var delta = Math.max(-68, Math.min(68, startV + startY - e.clientY));
			mark.style.transform = 'rotate(' + (delta * 2) + 'deg)';
			t.value = delta;
			// TODO
		}

		function mouseUp(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
		}

		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mouseup', mouseUp, false);
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.getValue = function () {
	return this.module[this.id];
};