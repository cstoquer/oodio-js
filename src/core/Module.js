/** Main abstract class for modules. Handle UI display.
 *
 * @author Cedric Stoquer
 */

function Module(params) {
	var t = this;

	var dom = createDom('module x' + t.description_moduleSize, null);
	dom.textContent = t.description_moduleName;
	t._dom = dom;

	for (var id in t.description_inputs) {
		var input = t.description_inputs[id];
		switch (input.rate) {
			case 'E': t['$' + id] = new EventInConnector(t, id, input); break;
			case 'K': 
			case 'A':
				t[id] = ROOT.UNPLUGGED;
				t['$' + id] = new AudioInConnector(t, id, input);
				break;
			default: break;
		}
	}

	for (var id in t.description_outputs) {
		var output = t.description_outputs[id];
		switch (output.rate) {
			case 'E': t['$' + id] = t[id] = new EventOutConnector(t, id, output); break;
			case 'K':
			case 'A':
				t[id] = [0.0];
				t['$' + id] = new AudioOutConnector(t, id, output);
				break;
			default: break;
		}
	}

	dom.addEventListener('mousedown', function mouseStart(e) {
		moduleManager.startDrag(t, e);
	});
	// dom.addEventListener('mousemove', function mouseMove(e) {});
	// dom.addEventListener('mouseup',   function mouseEnd(e) {});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.description_moduleName = 'Abstract Module';
Module.prototype.description_moduleSize = 1;
Module.prototype.description_rate       = 'E';
Module.prototype.description_inputs     = {};
Module.prototype.description_outputs    = {};
Module.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄


Module.prototype.setPosition = function (x, y) {
	var style = this._dom.style;
	this.x = x;
	this.y = y;
	style.left = (MODULE_WIDTH  * x) + 'px';
	style.top  = (MODULE_HEIGHT * y) + 'px';
}

Module.prototype.remove = function () {
	removeDom(this._dom, null);
}
