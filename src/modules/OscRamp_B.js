/** Naive Ramp Oscillator
 *
 * AR module
 *
 * @author Cedric Stoquer
 */
function OscRamp_B(params) {
	params = params || {};
	this._pos    = 0.0;
	this._note   = 69;
	this._pitch  = 0;
	this._detune = 0.0;
	this._pinc   = 0.0;

	Module.call(this, params);
}
inherit(OscRamp_B, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// MODULE DESCRIPTION

OscRamp_B.prototype.description_moduleName = 'OscRamp-B';
OscRamp_B.prototype.description_moduleSize = 2;
OscRamp_B.prototype.description_rate       = 'A';
OscRamp_B.prototype.description_inputs     = {
	note: { rate: 'E', x: 0, y: 1 }
};
OscRamp_B.prototype.description_outputs    = {
	out: { rate: 'A', x: 16, y: 0.5 }
};
OscRamp_B.prototype.description_params     = {
	pitch:  { type: 'knob', x: 4, y: 0, min: -48, max: 48, int: true,  init: 0 },
	detune: { type: 'knob', x: 6, y: 0, min: -1,  max: 1,  int: false, init: 0.0 }
};
library.register(OscRamp_B);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// PARAMETERS

Object.defineProperty(OscRamp_B.prototype, 'pitch', {
	get: function() {
		return this._pitch;
	},
	set: function(value) {
		this._pitch = value;
		this._pinc = noteToFreqLin(this._note + this._pitch + this._detune) / SAMPLE_RATE;
	}
});

Object.defineProperty(OscRamp_B.prototype, 'detune', {
	get: function() {
		return this._detune;
	},
	set: function(value) {
		this._detune = value;
		this._pinc = noteToFreqLin(this._note + this._pitch + this._detune) / SAMPLE_RATE;
	}
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// EVENT INPUTS

OscRamp_B.prototype.note = function (value) {
	this._note = ~~value + 69;
	this._pinc = noteToFreqLin(this._note + this._pitch + this._detune) / SAMPLE_RATE;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// AUDIO PROCESS

OscRamp_B.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = this._pos;
};

