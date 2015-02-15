/** Naive Triangle Oscillator
 *
 * AR module
 *
 * @author Cedric Stoquer
 */
function TriOsc(params) {
	Oscillator.call(this, params);
	params = params || {};
	this.width = [0.0]; // TODO: combine a param and an input
	this.width[0] = params.width !== undefined ? params.width : 0.5;
}
inherit(TriOsc, Oscillator);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TriOsc.prototype.description_moduleName = 'OscTri';
TriOsc.prototype.description_moduleSize = 1;
TriOsc.prototype.description_rate       = 'A';
TriOsc.prototype.description_inputs     = {
	width: { rate: 'A', x: 8,  y: 0}
};
TriOsc.prototype.description_outputs    = {
	out:   { rate: 'A', x: 16, y: 0 }
};
TriOsc.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

TriOsc.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = 1 - 2 * ((this._pos < this.width[0]) ? this._pos / this.width[0] : 1 - (this._pos - this.width[0]) / (1 - this.width[0]));
};