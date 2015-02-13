/** Fast First-Order Filter
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */
function FastFilter(params) {
	Module.call(this, params);
	this.input = ROOT.UNPLUGGED;
	this.out   = [0.0];
	this.freq  = params.freq === undefined ? [0.1] : [params.freq];
}
inherit(FastFilter, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
FastFilter.prototype.description_moduleName = 'FastFilter';
FastFilter.prototype.description_moduleSize = 2;
FastFilter.prototype.description_rate       = 'A';
FastFilter.prototype.description_inputs     = {};
FastFilter.prototype.description_outputs    = {};
FastFilter.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

FastFilter.prototype.tic = function () {
	this.out[0] = (this.input[0]) * this.freq[0] + this.out[0] * (1 - this.freq[0]);
};