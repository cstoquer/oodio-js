/** Gain
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */

function Gain(params) {
	Module.call(this, params);
	params = params || {};
	this.gain = params.gain !== undefined ? params.gain : 1.0;
}
inherit(Gain, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Gain.prototype.description_moduleName = 'Gain';
Gain.prototype.description_moduleSize = 1;
Gain.prototype.description_rate       = 'A';
Gain.prototype.description_inputs     = {
	input: { rate: 'A', x: 14, y: 0 }
};
Gain.prototype.description_outputs    = {
	out:   { rate: 'A', x: 16, y: 0 }
};
Gain.prototype.description_params     = {
	gain:  {} // TODO
};
library.register(Gain);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Gain.prototype.tic = function () {
	this.out[0] = this.input[0] * this.gain;
}