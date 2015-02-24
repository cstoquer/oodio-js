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
		// TODO
		console.log('>>>>>> KNOB')
	});
}