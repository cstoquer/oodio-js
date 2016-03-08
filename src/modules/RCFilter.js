/** Resistor-Capacitor Filter
 *
 * AR module
 *
 * @author Cedric Stoquer
 */

function RCFilter(params) {
	Module.call(this, params);
	params = params || {};
	this.cut   = params.cut === undefined ? [0.5] : [params.cut];
	this.res   = params.res === undefined ? [0.4] : [params.res];

	this._state = 0.0;
}
inherit(RCFilter, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
RCFilter.prototype.description_moduleName = 'RCFilter';
RCFilter.prototype.description_moduleSize = 1;
RCFilter.prototype.description_rate       = 'A';
RCFilter.prototype.description_inputs     = {
	input: { rate: 'A', x: 6, y: 0 }
};
RCFilter.prototype.description_outputs    = {
	out:   { rate: 'A', x: 9, y: 0 }
};
RCFilter.prototype.description_params     = {};
library.register(RCFilter);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

RCFilter.prototype.tic = function () {
	var t = 1 - this.res[0] * this.cut[0];
	this._state = t * this._state - this.cut[0] * this.out[0] + this.cut[0] * this.input[0];
	this.out[0] = t * this.out[0] + this.cut[0] * this._state;
};