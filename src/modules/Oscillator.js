/** Naive Ramp Oscillator
 *
 * AR module
 *
 * @author Cedric Stoquer
 */
function Oscillator(params) {
	Module.call(this, params);
	this.out   = [0.0];
	this._pos  = 0.0;
	this._freq = params.freq  === undefined ? 440.0 : params.freq;
	this._pinc = this._freq / SAMPLE_RATE;
}
inherit(Oscillator, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Oscillator.prototype.description_moduleName = 'OscSaw';
Oscillator.prototype.description_moduleSize = 2;
Oscillator.prototype.description_rate       = 'A';
Oscillator.prototype.description_inputs     = {};
Oscillator.prototype.description_outputs    = {};
Oscillator.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Object.defineProperty(Oscillator.prototype, 'freq', {
	get: function() {
		return this._freq;
	},
	set: function(value) {
		this._freq = value;
		this._pinc = this._freq / SAMPLE_RATE;
	}
});

Oscillator.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = this._pos;
};