/** Naive Pulse Oscillator
 *
 * AR module
 *
 * @author Cedric Stoquer
 */
function PulseOsc(params) {
	Oscillator.call(this, params);
	this.width = params.width === undefined ? 0.5 : params.width;
}
inherit(PulseOsc, Oscillator);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
PulseOsc.prototype.description_moduleName = 'OscPulse';
PulseOsc.prototype.description_moduleSize = 2;
PulseOsc.prototype.description_rate       = 'A';
PulseOsc.prototype.description_inputs     = {};
PulseOsc.prototype.description_outputs    = {};
PulseOsc.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

PulseOsc.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = (this._pos > this.width) ? 1 : -1;
};