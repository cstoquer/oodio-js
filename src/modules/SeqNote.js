/** Note Sequencer
 *
 * ER module
 *
 * @author Cedric Stoquer
 */
function SeqNote(params) {
	params = params || {};
	Module.call(this, params);

	this._pos    = 0;
	this._steps  = [];
	this._length = 8;

	params.steps && this.setNotes(params.steps);
}
inherit(SeqNote, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SeqNote.prototype.description_moduleName = 'SeqNote';
SeqNote.prototype.description_moduleSize = 2;
SeqNote.prototype.description_rate       = 'E';
SeqNote.prototype.description_inputs     = {
	clk: { rate: 'E' } // TODO: positions
};
SeqNote.prototype.description_outputs    = {
	out: { rate: 'A', type: 'freq' }
};
SeqNote.prototype.description_params     = {
	setNotes: {} // TODO
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