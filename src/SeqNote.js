/** Note Sequencer
 *
 * ER module
 *
 * @author Cedric Stoquer
 */
function SeqNote(params) {
	this.out     = [0.0];
	this._pos    = 0;
	this._steps  = [];
	this._length = 8;

	params.steps && this.setNotes(params.steps);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SeqNote.prototype.description = {
	rate: 'E',
	inputs: {
		'clk': { rate: 'E' }
	},
	outputs: {
		'out': { rate: 'A', type: 'freq' }
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SeqNote.prototype.clk = function () {
	this._pos++;
	if (this._pos >= this._length) this._pos = 0;
	this.out[0] = this._steps[this._pos];
};

SeqNote.prototype.setNotes = function (steps) {
	this._steps = [];
	var len = this._length = steps.length;
	for (var i = 0; i < len; i++) {
		this._steps.push(noteToFreq(steps[i]));
	}
};