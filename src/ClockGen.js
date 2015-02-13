/** Clock generator
 *
 * KR module
 *
 * @author Cedric Stoquer
 */
function ClockGen(params) {
	Module.call(this, params);

	this.out    = new EventOutConnector(this);

	this._pos   = 0.0;
	this._inc   = 0.0;
	this._tempo = params.tempo || 130;

	this.tempo = this._tempo;
}
inherit(ClockGen, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ClockGen.prototype.description_moduleName = 'Clock Generator';
ClockGen.prototype.description_moduleSize = 2;
ClockGen.prototype.description_rate       = 'E';
ClockGen.prototype.description_inputs     = {};
ClockGen.prototype.description_outputs    = {
	'out': { rate: 'E', type: null }
};
ClockGen.prototype.description_params     = {
	'tempo': {} // TODO
};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Object.defineProperty(ClockGen.prototype, 'tempo', {
	get: function() {
		return this._tempo;
	},
	set: function(value) {
		this._tempo = value;
		// this._inc = value * 64 / (30 * CONTROL_RATE);
		this._inc = value / (30 * SAMPLE_RATE);
	}
});

ClockGen.prototype.tic = function () {
	this._pos += this._inc;
	if (this._pos >= 1) {
		this._pos--;
		this.out.emit();
	}
};
