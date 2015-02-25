/** Note Sequencer
 *
 * ER module
 *
 * @author Cedric Stoquer
 */
function SeqNote(params) {
	this._pos    = 0;
	this._steps  = [];
	this._length = 0;

	Module.call(this, params);
}
inherit(SeqNote, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SeqNote.prototype.description_moduleName = 'SeqNote';
SeqNote.prototype.description_moduleSize = 2;
SeqNote.prototype.description_rate       = 'E';
SeqNote.prototype.description_inputs     = {
	clk: { rate: 'E', x: 6, y: 0 } // TODO: positions
};
SeqNote.prototype.description_outputs    = {
	out: { rate: 'A', x: 8, y: 0, type: 'freq' }
};
SeqNote.prototype.description_params     = {
	notes: { init: [69, 69, 69, 69, 69, 69, 69, 69] }
};
library.register(SeqNote);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SeqNote.prototype.clk = function () {
	this._pos++;
	if (this._pos >= this._length) this._pos = 0;
	this.out[0] = this._steps[this._pos];
};

Object.defineProperty(SeqNote.prototype, 'notes', {
	get: function() {
		return this._steps;
	},
	set: function(notes) {
		if (!Array.isArray(notes)) return console.error('SeqNote.notes must be an array');
		this._steps = [];
		var len = this._length = notes.length;
		for (var i = 0; i < len; i++) {
			this._steps.push(noteToFreq(notes[i]));
		}
	}
});

