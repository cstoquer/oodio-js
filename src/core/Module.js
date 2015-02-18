/** Main abstract class for modules. Handle UI display.
 *
 * @author Cedric Stoquer
 */

function Module(params) {
	var t = this;

	var dom = createDom('module x' + this.description_moduleSize, null);
	dom.textContent = this.description_moduleName;
	this._dom = dom;

	for (var id in this.description_inputs) {
		var input = this.description_inputs[id];
		switch (input.rate) {
			case 'E': this['$' + id] = new EventInConnector(this, id, input); break;
			case 'K': 
			case 'A':
				this[id] = ROOT.UNPLUGGED;
				this['$' + id] = new AudioInConnector(this, id, input);
				break;
			default: break;
		}
	}

	for (var id in this.description_outputs) {
		var output = this.description_outputs[id];
		switch (output.rate) {
			case 'E': this['$' + id] = this[id] = new EventOutConnector(this, id, output); break;
			case 'K':
			case 'A':
				this[id] = [0.0];
				this['$' + id] = new AudioOutConnector(this, id, output);
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
