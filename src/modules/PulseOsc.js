/** Naive Pulse Oscillator
 *
 * AR module
 *
 * @author Cedric Stoquer
 */
function PulseOsc(params) {
	Oscillator.call(this, params);
	params = params || {};
	this.width = [0.0]; // TODO: combine a param and an input
	this.width[0] = params.width !== undefined ? params.width : 0.5;
}
inherit(PulseOsc, Oscillator);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
PulseOsc.prototype.description_moduleName = 'OscPulse';
PulseOsc.prototype.description_moduleSize = 1;
PulseOsc.prototype.description_rate       = 'A';
PulseOsc.prototype.description_inputs     = {
	width: { rate: 'A', x: 8,  y: 0}
};
PulseOsc.prototype.description_outputs    = {
	out: { rate: 'A', x: 16, y: 0 }
};
PulseOsc.prototype.description_params     = {};
library.register(PulseOsc);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

PulseOsc.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = (this._pos > this.width[0]) ? 1 : -1;
};