/** Resistor-Capacitor Filter
 *
 * AR module
 *
 * @author Cedric Stoquer
 */

function RCFilter(params) {
	Module.call(this, params);
	this.input = ROOT.UNPLUGGED;
	this.out   = [0.0];
	this.cut   = params.cut === undefined ? [0.5] : [params.cut];
	this.res   = params.res === undefined ? [0.4] : [params.res];

	this._state = 0.0;
}
inherit(RCFilter, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
RCFilter.prototype.description_moduleName = 'RCFilter';
RCFilter.prototype.description_classNames = 'module x1';
RCFilter.prototype.description_rate       = 'A';
RCFilter.prototype.description_inputs     = {};
RCFilter.prototype.description_outputs    = {};
RCFilter.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

RCFilter.prototype.tic = function () {
	var t = 1 - this.res[0] * this.cut[0];
	this._state = t * this._state - this.cut[0] * this.out[0] + this.cut[0] * this.input[0];
	this.out[0] = t * this.out[0] + this.cut[0] * this._state;
};