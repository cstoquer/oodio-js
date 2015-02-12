/** Clock generator
 *
 * KR module
 *
 * @author Cedric Stoquer
 */
function ClockGen(params) {
	this.out    = new EventConnector();

	this._pos   = 0.0;
	this._inc   = 0.0;
	this._tempo = params.tempo || 130;

	this.tempo = this._tempo;
}

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
