/** Main abstract class for modules. Handle UI display.
 *
 * @author Cedric Stoquer
 */

function Module(params) {
	var t = this;
	t.cables = {};

	var dom = createDom('module x' + t.description_moduleSize, null);
	dom.textContent = t.description_moduleName;
	t._dom = dom;

	for (var id in t.description_inputs) {
		var input = t.description_inputs[id];
		switch (input.rate) {
			case 'E': t['$' + id] = new EventInConnector(t, id, input); break;
			case 'K': // TODO
			case 'A': t[id] = ROOT.UNPLUGGED; t['$' + id] = new AudioInConnector(t, id, input); break;
		}
	}

	for (var id in t.description_outputs) {
		var output = t.description_outputs[id];
		switch (output.rate) {
			case 'E': t['$' + id] = t[id] = new EventOutConnector(t, id, output); break;
			case 'K': // TODO
			case 'A': t[id] = [0.0]; t['$' + id] = new AudioOutConnector(t, id, output); break;
		}
	}

	for (var id in t.description_params) {
		var param = t.description_params[id];
		switch (param.type) {
			case 'knob': t['$$' + id] = new Knob(t, id, param); break;
		}
	}

	var overlay = createDom('moduleOverlay x' + t.description_moduleSize, dom);
	overlay.module = t;

	overlay.addEventListener('mousedown', function mouseStart(e) {
		moduleManager.startDrag(t, e);
	});
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

	for (id in this.cables) this.cables[id].update();
};

Module.prototype.remove = function () {
	removeDom(this._dom, null);
};


Module.prototype.addCable = function (cable) {
	this.cables[cable.id] = cable;
};

Module.prototype.removeCable = function (cable) {
	delete this.cables[cable.id];
};
