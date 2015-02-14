/** Simple Decay Envelope with a decay rate and curvature
 *
 * KR module 
 *
 * @author Cedric Stoquer
 */
function DecayEnvelope(params) {
	Module.call(this, params);
	// this.trigger = new EventInConnector(this, '_trigger');
	// this.input   = ROOT.UNPLUGGED; // input signal  // TODO: remove built-in audio (to make it a KR module)
	// this.out     = [0.0]; // output signal
	// this.env     = [0.0]; // output signal 

	this._decay     = params.decay     === undefined ? 0.5 : params.decay;
	this._curvature = params.curvature === undefined ? 0.5 : map(params.curvature, 0, 1, 0.3, 0.7);
	this._stopped   = true;
	this._raw       = 0.0;
	this._a         = 0;
	this._b         = 0;
	this._t         = 0;
	this._duration  = 0; 

	this.update();
}
inherit(DecayEnvelope, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
DecayEnvelope.prototype.description_moduleName = 'EnvDecay';
DecayEnvelope.prototype.description_moduleSize = 3;
DecayEnvelope.prototype.description_rate       = 'A';
DecayEnvelope.prototype.description_inputs     = {
	trigger: { rate: 'E', func: '_trigger', x: 0,  y: 1 }, // TODO: positions
	input:   { rate: 'A',                   x: 14, y: 1 }, // TODO: remove built-in audio

	a0_00:  { rate: 'E', x:0,  y:0 }, a1_00:  { rate: 'E', x:0,  y:1 }, a2_00:  { rate: 'E', x:0,  y:2 },
	a0_01:  { rate: 'E', x:1,  y:0 }, a1_01:  { rate: 'E', x:1,  y:1 }, a2_01:  { rate: 'E', x:1,  y:2 },
	a0_02:  { rate: 'E', x:2,  y:0 }, a1_02:  { rate: 'E', x:2,  y:1 }, a2_02:  { rate: 'E', x:2,  y:2 },
	a0_03:  { rate: 'E', x:3,  y:0 }, a1_03:  { rate: 'E', x:3,  y:1 }, a2_03:  { rate: 'E', x:3,  y:2 },
	a0_04:  { rate: 'E', x:4,  y:0 }, a1_04:  { rate: 'E', x:4,  y:1 }, a2_04:  { rate: 'E', x:4,  y:2 },
	a0_05:  { rate: 'E', x:5,  y:0 }, a1_05:  { rate: 'E', x:5,  y:1 }, a2_05:  { rate: 'E', x:5,  y:2 },
	a0_06:  { rate: 'E', x:6,  y:0 }, a1_06:  { rate: 'E', x:6,  y:1 }, a2_06:  { rate: 'E', x:6,  y:2 },
	a0_07:  { rate: 'E', x:7,  y:0 }, a1_07:  { rate: 'E', x:7,  y:1 }, a2_07:  { rate: 'E', x:7,  y:2 },
	a0_08:  { rate: 'E', x:8,  y:0 }, a1_08:  { rate: 'E', x:8,  y:1 }, a2_08:  { rate: 'E', x:8,  y:2 },
	a0_09:  { rate: 'E', x:9,  y:0 }, a1_09:  { rate: 'E', x:9,  y:1 }, a2_09:  { rate: 'E', x:9,  y:2 },
	a0_10:  { rate: 'E', x:10, y:0 }, a1_10:  { rate: 'E', x:10, y:1 }, a2_10:  { rate: 'E', x:10, y:2 },
	a0_11:  { rate: 'E', x:11, y:0 }, a1_11:  { rate: 'E', x:11, y:1 }, a2_11:  { rate: 'E', x:11, y:2 },
	a0_12:  { rate: 'E', x:12, y:0 }, a1_12:  { rate: 'E', x:12, y:1 }, a2_12:  { rate: 'E', x:12, y:2 },
	a0_13:  { rate: 'E', x:13, y:0 }, a1_13:  { rate: 'E', x:13, y:1 }, a2_13:  { rate: 'E', x:13, y:2 },
	a0_14:  { rate: 'E', x:14, y:0 }, a1_14:  { rate: 'E', x:14, y:1 }, a2_14:  { rate: 'E', x:14, y:2 },
	a0_15:  { rate: 'E', x:15, y:0 }, a1_15:  { rate: 'E', x:15, y:1 }, a2_15:  { rate: 'E', x:15, y:2 },
	a0_16:  { rate: 'E', x:16, y:0 }, a1_16:  { rate: 'E', x:16, y:1 }, a2_16:  { rate: 'E', x:16, y:2 },


};
DecayEnvelope.prototype.description_outputs    = {
	out:     { rate: 'A', x: 16, y: 1                   }, // TODO: remove built-in audio
	env:     { rate: 'K', x: 16, y: 0                   }
};
DecayEnvelope.prototype.description_params     = {
	decay:     {},
	curvature: {}
};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Object.defineProperty(DecayEnvelope.prototype, 'curvature', {
	get: function() {
		return this._curvature;
	},
	set: function(value) {
		this._curvature = map(value, 0, 1, 0.3, 0.7);
		this.update();
	}
});

Object.defineProperty(DecayEnvelope.prototype, 'decay', {
	get: function() {
		return this._decay;
	},
	set: function(value) {
		this._decay = value;
		this.update();
	}
});

DecayEnvelope.prototype.update = function () {
	var d = 3000 + this._decay * 47000;
	this._duration = ~~d - 1;
	this._a = (2 - 4 * this._curvature) / (d * d);
	this._b = (4 * this._curvature - 3) / d;
};

var DECAY_SMOOTH     = 0.02;
var DECAY_SMOOTH_INV = 1 - DECAY_SMOOTH;

DecayEnvelope.prototype.tic = function () {
	if (this._stopped) return;
	if (this._t++ > this._duration) {
		this._stopped = true;
		this._raw     = 0.0;
		this.env[0]   = 0.0;
		this.out[0]   = 0.0;
		return;
	}
	this._raw = this._a * (this._t * this._t) + this._b * this._t + 1;

	// built-in smoothing filter
	this.env[0] = this._raw * DECAY_SMOOTH + this.env[0] * DECAY_SMOOTH_INV;
	this.out[0] = this.input[0] * this.env[0];
};

DecayEnvelope.prototype._trigger = function () {
	this._stopped = false;
	this._t = 0;
};
