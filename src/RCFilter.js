/** Resistor-Capacitor Filter
 *
 * AR module
 *
 * @author Cedric Stoquer
 */

function RCFilter(params) {
	this.input = [0.0];
	this.out   = [0.0];
	this.cut   = params.cut === undefined ? [0.5] : [params.cut];
	this.res   = params.res === undefined ? [0.4] : [params.res];

	this._state = 0.0;
}

RCFilter.prototype.tic = function () {
	var t = 1 - this.res[0] * this.cut[0];
	this._state = t * this._state - this.cut[0] * this.out[0] + this.cut[0] * this.input[0];
	this.out[0] = t * this.out[0] + this.cut[0] * this._state;
};