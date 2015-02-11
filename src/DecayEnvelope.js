/** Simple Decay Envelope with a decay rate and curvature
 *
 * KR module 
 *
 * @author Cedric Stoquer
 */

function DecayEnvelope(params) {
	this.trig  = [0.0]; // input trigger // TODO: use event signal
	this.input = [0.0]; // input signal  // TODO: remove built-in audio (to make it a KR module)
	this.out   = [0.0]; // output signal
	this.env   = [0.0]; // output signal 

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
	if (this.trig[0] > 0.8) {
		this._stopped = false;
		this._t = 0;
	}
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