/** Clock generator
 *
 * KR module
 *
 * @author Cedric Stoquer
 */

// TODO: Change output signal type to event.

function Clock(params) {
	this.out    = [0.0];
	this._pos   = 0.0;
	this._inc   = 0.0;
	this._tempo = params.tempo || 130;

	this.setTempo(this._tempo);
}

Clock.prototype.tic = function () {
	this._pos += this._inc;
	if (this._pos >= 1) {
		this.out[0] = 1;
		this._pos--;
	} else {
		this.out[0] = 0;
	}
};

Clock.prototype.setTempo = function (tempo) {
	this._tempo = tempo;
	this._inc = tempo / (30 * SAMPLE_RATE);
};