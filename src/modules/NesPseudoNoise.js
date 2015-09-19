/** 2A03 (NES sound chipset) 1-bit pseudo noise generator
 *
 * AR module
 *
 * @author Cedric Stoquer
 */
function NesPseudoNoise(params) {
	Oscillator.call(this, params);
	this._state = 1;
}
inherit(NesPseudoNoise, Oscillator);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
NesPseudoNoise.prototype.description_moduleName = 'NES Noise';
NesPseudoNoise.prototype.description_moduleSize = 1;
NesPseudoNoise.prototype.description_rate       = 'A';
NesPseudoNoise.prototype.description_inputs     = {};
NesPseudoNoise.prototype.description_outputs    = {
	out: { rate: 'A', x: 9, y: 0 }
};
NesPseudoNoise.prototype.description_params     = {};
library.register(NesPseudoNoise);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

NesPseudoNoise.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) {
		this._pos -= 1;
		var xor = !(this._state & 0x4000) ^ !(this._state & 0x2000);
		this._state = ((this._state << 1) | xor) & 0x7FFF;
		this.out[0] = (this._state & 0x4000) >> 14;
	}
};