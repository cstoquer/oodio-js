/** Mixer 1-1 A
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */

function Mix1_1A(params) {
	Module.call(this, params);
	params = params || {};

	this.input1 = ROOT.UNPLUGGED;
	this.input2 = ROOT.UNPLUGGED;
	this.out    = [0.0];
	this.volume = params.volume !== undefined ? params.volume : 0.0;
}
inherit(Mix1_1A, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Mix1_1A.prototype.description_moduleName = 'Mix1-1A';
Mix1_1A.prototype.description_moduleSize = 1;
Mix1_1A.prototype.description_rate       = 'A';
Mix1_1A.prototype.description_inputs     = {};
Mix1_1A.prototype.description_outputs    = {};
Mix1_1A.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Mix1_1A.prototype.tic = function () {
	this.out[0] = this.input1[0] + this.input2[0] * this.volume;
};