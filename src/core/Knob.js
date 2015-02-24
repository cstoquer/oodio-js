/** Knob
 *
 * @author Cedric Stoquer
 */
function Knob(module, id, description) {
	var t = this;
	t.x = description.x;
	t.y = description.y;

	t.module = module;
	t.id     = id;

	var dom = t._dom = createDom('knob', module._dom);

	dom.style.left = (t.x * MODULE_HEIGHT + 2) + 'px';
	dom.style.top  = (t.y * MODULE_HEIGHT + 2) + 'px';

	var overlay = createDom('knobOverlay', dom);
	overlay.connector = t;

	overlay.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();

		// var startX = e.clientX;
		var startY = e.clientY;

		function mouseMove(e) {
			e.preventDefault();
			var delta = Math.max(0, Math.min(128, startY - e.clientY));
			// dom.style.transform = 'rotate(' + delta + 'deg)';
			console.log('MOUSE MOVE', delta)
		}

		function mouseUp(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			console.log('END')
		}

		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mouseup', mouseUp, false);
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.getValue = function () {
	return this.module[this.id];
};