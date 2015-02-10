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

PulseOsc.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = (this._pos > this.width) ? 1 : -1;
};