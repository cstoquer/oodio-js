
var BUFFER_LENGTH = 4096;
var SAMPLE_RATE   = 44100;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function inherit(Child, Parent) {
	Child.prototype = Object.create(Parent.prototype, {
		constructor: {
			value: Child,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// utils
function map(value, iMin, iMax, oMin, oMax) {
	return oMin + (oMax - oMin) * (value - iMin) / (iMax - iMin);
}

function noteToFreq(midiNoteNumber) {
	return 440 * Math.pow(2, (midiNoteNumber - 69) / 12);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// freeverb


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// sequencer
function Clock(params) {
	this._tempo = params.tempo || 130;
	this.out    = [0.0];
	this._pos   = 0.0;
	this._inc   = 0.0;
	this.setTempo(this._tempo);
}

Clock.prototype.tic = function () {
	this._pos += this._inc;
	if (this._pos >= 1) {
		this.out[0] = 1;
		this._pos--;
	} else {
		this.out[0] = 0;
	}
}

Clock.prototype.setTempo = function (tempo) {
	this._tempo = tempo;
	this._inc = tempo / (30 * SAMPLE_RATE);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function FreqSeq(params) {
	this._tempo  = params.tempo || 130;
	this._pos    = 0.0;
	this._inc    = 0.0;
	this._steps  = [];
	this._length = 8;
	this.setTempo(this._tempo);
}

FreqSeq.prototype.tic = function () {
	this._pos += this._inc;
	if (this._pos > this._length) this._pos -= this._length;
	var p = ~~this._pos;
	// if (p < 0) p = 0;
	// if (p > 7) p = 7;
	this.out[0] = this._steps[p];
};

FreqSeq.prototype.setTempo = function (tempo) {
	this._tempo = tempo;
	this._inc = this._length * tempo / (120 * SAMPLE_RATE);
};

FreqSeq.prototype.setSteps = function (steps) {
	this._steps = [];
	var len = this._length = steps.length;
	for (var i = 0; i < len; i++) {
		this._steps.push(noteToFreq(steps[i]););
	}
	this.setTempo(this._tempo);
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// envelope

function DecayEnvelope(params) {
	this.input = [0.0]; // trigger envelope
	this.out   = [0.0]; // output signal

	this._decay     = params.decay     === undefined ? 0.5 : params.decay;
	this._curvature = params.curvature === undefined ? 0.3 : params.curvature;
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
	this.a = (2 - 4 * this._curvature) / (d * d);
	this.b = (4 * this._curvature - 3) / d;
};

var DECAY_SMOOTH     = 0.02;
var DECAY_SMOOTH_INV = 1 - DECAY_SMOOTH;

DecayEnvelope.prototype.tic = function () {
	if (this.input[0] > 0.8) {
		this._stopped = false;
		this.t = 0;
	}
	if (this._stopped) return;
	if (this.t++ > _duration) {
		this._stopped = true;
		this._out[0]  = 0.0;
		this.raw      = 0.0;
		return;
	}
	this.raw = this.a * (this.t * this.t) + this.b * this.t + 1;

	// built-in smoothing filter
	this._out[0] = this.raw * DECAY_SMOOTH + this.out[0] * DECAY_SMOOTH_INV;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// oscillators
function Oscillator(params) {
	this.out   = [0.0];
	this._pos  = 0.0;
	this._freq = params.freq  === undefined ? 440.0 : params.freq;
	this._pinc = this._freq / SAMPLE_RATE;
}

Object.defineProperty(Oscillator.prototype, 'freq', {
	get: function() {
		return this._freq;
	},
	set: function(value) {
		this._freq = value;
		this._pinc = this._freq / SAMPLE_RATE;
	}
});

Oscillator.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = this._pos;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

function PulseOsc(params) {
	Oscillator.call(this, params);
	this.width = params.width === undefined ? 0.5 : params.width;
}
inherit(PulseOsc, Oscillator);

PulseOsc.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = (this._pos > this.width) ? 1 : -1;
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function TriOsc(params) {
	Oscillator.call(this, params);
	this.width = params.width === undefined ? 0.5 : params.width;
}
inherit(TriOsc, Oscillator);

TriOsc.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) this._pos -= 1;
	this.out[0] = 1 - 2 * ((this._pos < this.width) ? this._pos / this.width : 1 - (this._pos - this.width) / (1 - this.width));
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function NesPseudoNoise(params) {
	Oscillator.call(this, params);
	this._state = 1;
}
inherit(NesPseudoNoise, Oscillator);

NesPseudoNoise.prototype.tic = function () {
	this._pos += this._pinc;
	if (this._pos > 1) {
		this._pos -= 1;
		var xor = !(this._state & 0x4000) ^ !(this._state & 0x2000);
		this._state = ((this._state << 1) | xor) & 0x7FFF;
		this.out[0] = (this._state & 0x4000) >> 14;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// filter
function FastFilter(params) {
	this.input = [0.0];
	this.freq  = [0.1];
	this.out   = [0.0];
}

FastFilter.prototype.tic = function () {
	this.out[0] = (this.input[0]) * this.freq[0] + this.out[0] * (1 - this.freq[0]);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function RCFilter(params) {
	this.input = [0.0];
	this.out   = [0.0];
	this.cut   = [0.5];
	this.res   = [0.4];

	this._state = 0.0;
}

RCFilter.prototype.tic = function () {
	var t = 1 - this.res[0] * this.cut[0];
	this._state = t * this._state - this.cut[0] * this.out[0] + this.cut[0] * this.input[0];
	this.out[0] = t * this.out[0] + this.cut[0] * this._state;
};



//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// clipper
function Clipper() {
	this.input = [0.0];
	this.out   = [0.0];
}

Clipper.prototype.tic = function () {
	if (this.input[0] >  1.0) { this.out[0] =  1.0; return; }
	if (this.input[0] < -1.0) { this.out[0] = -1.0; return; }
	this.out[0] = this.input[0];
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// create synthesizer

var audioNodes   = [];
var controlNodes = [];
var mainNode     = null;

/*function createSynth() {
	var osc = new PulseOsc({ freq: 110.0 });
	audioNodes.push(osc);

	var lfo = new TriOsc({ freq: 1.0 });
	audioNodes.push(lfo); // TODO: push this in controlNodes

	var flt = new RCFilter();
	flt.input = osc.out;
	flt.cut   = lfo.out;
	audioNodes.push(flt);

	mainNode = flt;
}

createSynth();*/

function SimpleSynth() {
	this.lfo = new TriOsc({ freq: 0.3 });
	// this.osc = new PulseOsc({ freq: 110.0 });
	this.osc = new NesPseudoNoise({ freq: 1600.0 });
	this.flt = new RCFilter();
	this.clp = new Clipper();

	this.flt.input = this.osc.out;
	this.clp.input = this.flt.out;

	this.out = this.clp.out;
}

SimpleSynth.prototype.tic = function () {
	this.osc.tic();
	this.lfo.tic();
	this.flt.cut[0] = this.lfo.out[0] * 0.2 + 0.4;
	this.flt.tic();
	this.clp.tic();
};

var synth = new SimpleSynth();
audioNodes.push(synth);
mainNode = synth;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// create context, generator and start audio processing

var context = new webkitAudioContext();
var mainVolume = context.createGain();
mainVolume.gain.value = 0.1;
mainVolume.connect(context.destination);

var generator = context.createScriptProcessor(BUFFER_LENGTH, 1, 1);
generator.connect(mainVolume);

generator.onaudioprocess = function (e) {
	var outBuffer = e.outputBuffer.getChannelData(0);
	for (var i = 0; i < BUFFER_LENGTH; i++) {
		for (var j = 0; j < audioNodes.length; j++) {
			audioNodes[j].tic();
		}
		// clip main output
		var out = mainNode.out[0];
		if (out >  1) out =  1;
		if (out < -1) out = -1;
		outBuffer[i] = out;
	}
};


