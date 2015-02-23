/** Clock generator
 *
 * KR module
 *
 * @author Cedric Stoquer
 */
function ClockGen(params) {
	Module.call(this, params);
	params = params || {};

	this._pos   = 0.0;
	this._inc   = 0.0;
	this._tempo = params.tempo || 130;

	this.tempo = this._tempo;
}
inherit(ClockGen, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ClockGen.prototype.description_moduleName = 'ClockGen';
ClockGen.prototype.description_moduleSize = 1;
ClockGen.prototype.description_rate       = 'K';
ClockGen.prototype.description_inputs     = {};
ClockGen.prototype.description_outputs    = {
	out: { rate: 'E', x: 8, y: 0, type: null }
};
ClockGen.prototype.description_params     = {
	tempo: {}, // TODO
	swing: {}  // TODO
};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Object.defineProperty(ClockGen.prototype, 'tempo', {
	get: function() {
		return this._tempo;
	},
	set: function(tempo) {
		this._tempo = tempo;
		this._inc   = tempo / (30 * CONTROL_RATE);
	}
});

ClockGen.prototype.tic = function () {
	this._pos += this._inc;
	if (this._pos >= 1) {
		this._pos -= 1;
		this.out.emit();
	}
};
