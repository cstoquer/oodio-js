/** Mixer 1-1 A
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */

function Mix1_1A(params) {
	Module.call(this, params);
}
inherit(Mix1_1A, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Mix1_1A.prototype.description_moduleName = 'Mix1-1A';
Mix1_1A.prototype.description_moduleSize = 2;
Mix1_1A.prototype.description_rate       = 'A';
Mix1_1A.prototype.description_inputs     = {
	input1: { rate: 'A', x: 0,  y: 1 },
	input2: { rate: 'A', x: 8, y: 1 }
};
Mix1_1A.prototype.description_outputs    = {
	out:    { rate: 'A', x: 9, y: 1 }
};
Mix1_1A.prototype.description_params     = {
	volume: { type: 'knob', x: 5, y: 0, min: 0, max: 1, int: false, init: 0.0 }
};
library.register(Mix1_1A);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Mix1_1A.prototype.tic = function () {
	this.out[0] = this.input1[0] + this.input2[0] * this.volume;
};