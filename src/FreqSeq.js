/** Frequency Sequencer
 *
 * ER module
 *
 * @author Cedric Stoquer
 */

// TODO: make this an ER module

function FreqSeq(params) {
	this.out     = [0.0];
	this._tempo  = params.tempo || 130;
	this._pos    = 0.0;
	this._inc    = 0.0;
	this._steps  = [];
	this._length = 8;
	if (params.steps) {
		this.setSteps(params.steps);
	} else {
		this.setTempo(this._tempo);
	}
}

FreqSeq.prototype.tic = function () {
	this._pos += this._inc;
	if (this._pos > this._length) this._pos -= this._length;
	var p = ~~this._pos;
	// if (p < 0) p = 0;
	// if (p > 7) p = 7;
	this.out[0] = this._steps[p];
};

FreqSeq.prototype.setTempo = function (tempo) {
	this._tempo = tempo;
	this._inc = this._length * tempo / (120 * SAMPLE_RATE);
};

FreqSeq.prototype.setSteps = function (steps) {
	this._steps = [];
	var len = this._length = steps.length;
	for (var i = 0; i < len; i++) {
		this._steps.push(noteToFreq(steps[i]));
	}
	this.setTempo(this._tempo);
};