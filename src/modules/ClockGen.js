/** Clock generator
 *
 * KR module
 *
 * @author Cedric Stoquer
 */
function ClockGen(params) {
	this._pos = 0.0;
	this._inc = 0.0;
	Module.call(this, params);
}
inherit(ClockGen, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ClockGen.prototype.description_moduleName = 'ClockGen';
ClockGen.prototype.description_moduleSize = 2;
ClockGen.prototype.description_rate       = 'K';
ClockGen.prototype.description_inputs     = {};
ClockGen.prototype.description_outputs    = {
	out: { rate: 'E', x: 8, y: 0, type: null }
};
ClockGen.prototype.description_params     = {
	tempo: { type: 'knob', x: 4, y: 0, min: 24, max: 214, int: true, init: 120 },
	swing: {}  // TODO
};
library.register(ClockGen);
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
