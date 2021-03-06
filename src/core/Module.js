/** Main abstract class for modules. Handle UI display.
 *
 * @author Cedric Stoquer
 */

function Module(params) {
	var t = this;
	params = params || {};

	t.cables = {};

	var dom = createDiv('module x' + t.description_moduleSize, null);
	t._title = createDom('span', '', dom);
	t._title.textContent = t.description_moduleName;
	// dom.textContent = t.description_moduleName;
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
		var control = t.description_params[id];
		t[id] = params[id] !== undefined ? params[id] : control.init || 0.0;
		switch (control.type) {
			case 'knob': t['$$' + id] = new Knob(t, id, control); break;
		}
	}

	dom.module = t;

	dom.addEventListener('mousedown', function mouseStart(e) {
		window.moduleManager.startDrag(t, e);
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

/** Set module position in UI surface */
Module.prototype.setPosition = function (x, y) {
	var style = this._dom.style;
	this.x = x;
	this.y = y;
	style.left = (MODULE_WIDTH  * x) + 'px';
	style.top  = (MODULE_HEIGHT * y) + 'px';

	for (id in this.cables) this.cables[id].update();
};

/** Remove module */
Module.prototype.remove = function () {
	// disconnect all connectors
	for (var id in this.cables) {
		window.moduleManager.removeCable(this.cables[id]);
	}
	removeDom(this._dom, null);
};

Module.prototype.addCable = function (cable) {
	this.cables[cable.id] = cable;
};

Module.prototype.removeCable = function (cable) {
	delete this.cables[cable.id];
};

/** Get module state for patch saving */
Module.prototype.getState = function () {
	var state = {
		_mod: this.constructor.name,
		id:   this.id,
		x:    this.x,
		y:    this.y
	};
	for (var id in this.description_params) {
		state[id] = this[id];
	}
	return state;
};

Module.prototype.select = function () {
	// TODO
	this._title.className = 'selected';
};

Module.prototype.deselect = function () {
	// TODO
	this._title.className = '';
};