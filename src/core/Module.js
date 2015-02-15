/** Main abstract class for modules. Handle UI display.
 *
 * @author Cedric Stoquer
 */

function Module(params) {
	var dom = createDom('module x' + this.description_moduleSize);
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
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.description_moduleName = 'Abstract Module';
Module.prototype.description_moduleSize = 1;
Module.prototype.description_rate       = 'E';
Module.prototype.description_inputs     = {};
Module.prototype.description_outputs    = {};
Module.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

