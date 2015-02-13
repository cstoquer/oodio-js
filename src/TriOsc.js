/** Naive Triangle Oscillator
 *
 * AR module
 *
 * @author Cedric Stoquer
 */
function TriOsc(params) {
	Oscillator.call(this, params);
	this.width = params.width === undefined ? 0.5 : params.width;
}
inherit(TriOsc, Oscillator);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TriOsc.prototype.description_moduleName = 'Triangle Oscillator';
TriOsc.prototype.description_moduleSize = 1;
TriOsc.prototype.description_inputs     = {};
TriOsc.prototype.description_outputs    = {};
TriOsc.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

TriOsc.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = 1 - 2 * ((this._pos < this.width) ? this._pos / this.width : 1 - (this._pos - this.width) / (1 - this.width));
};