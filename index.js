
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
function AllPassFilter(size, feedback) {
	this.feedback = feedback || 0.0;
	this._buffer  = [];
	this._size    = size;
	this._bufidx  = 0;

	this.setBuffer(size);
}

AllPassFilter.prototype.setBuffer = function (size) {
	this._buffer = [];
	this._size = size;
	for (var i = 0; i < size; i++) this._buffer.push(0.0);
};

AllPassFilter.prototype.mute = function () {
	for (var i = 0; i < this._size; i++) this._buffer[i] = 0.0;
};

AllPassFilter.prototype.tic = function (input) {
	var output;
	var bufout = this._buffer[this._bufidx];;
	
	// bufout = UNDENORMALISE(bufout);
	
	output = -input + bufout;
	this._buffer[this._bufidx] = input + (bufout * this.feedback);

	if (++this._bufidx >= this._size) this._bufidx = 0;

	return output;
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function CombFilter(size) {
	this.feedback     = 0.0;

	this._buffer      = [];
	this._filterstore = 0.0;
	this._damp1       = 0.0;
	this._damp2       = 0.0;
	this._bufsize     = 0;
	this._bufidx      = 0;

	this.setBuffer(size);
}

Object.defineProperty(DecayEnvelope.prototype, 'damp', {
	get: function() {
		return this._damp1;
	},
	set: function(value) {
		this._damp1 = value;
		this._damp2 = 1 - value;
	}
});

CombFilter.prototype.setBuffer = function (size) {
	this._buffer = [];
	this._bufsize = size;
	for (var i = 0; i < size; i++) this._buffer.push(0.0);
};

CombFilter.prototype.mute = function () {
	for (var i = 0; i < this._bufsize; i++) this._buffer[i] = 0.0;
};

CombFilter.prototype.tic = function (input) {
	var output = this._buffer[this._bufidx];
	// UNDENORMALISE(output);

	this._filterstore = (output * this._damp2) + (this._filterstore * this._damp1);
	// UNDENORMALISE(this._filterstore);

	this._buffer[this._bufidx] = input + (this._filterstore * this.feedback);

	if (++this._bufidx >= this._bufsize) this._bufidx = 0;

	return output;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var SCALE_WET     = 3.0;
var STEREO_SPREAD = 23;

var FREEVERB_TUNING = {
	numCombs:     8,
	numAllpasses: 4,
	stereoSpread: STEREO_SPREAD,

	muted:        0.0,
	fixedGain:    0.015,

	scaleWet:     SCALE_WET,
	scaleDry:     2.0,
	scaleDamp:    0.4,
	scaleRoom:    0.28,
	offsetRoom:   0.7,

	initialRoom:  0.5,
	initialDamp:  0.5,
	initialWet:   0.1 / SCALE_WET,
	initialDry:   0.0,
	initialWidth: 1.0,
	initialMode:  0.0,

	freezeMode:   0.5,

	// These values assume 44.1KHz sample rate
	// they will probably be OK for 48KHz sample rate
	// but would need scaling for 96KHz (or other) sample rates.
	// The values were obtained by listening tests.
	combTuningL1:    1116,
	combTuningR1:    1116 + STEREO_SPREAD,
	combTuningL2:    1188,
	combTuningR2:    1188 + STEREO_SPREAD,
	combTuningL3:    1277,
	combTuningR3:    1277 + STEREO_SPREAD,
	combTuningL4:    1356,
	combTuningR4:    1356 + STEREO_SPREAD,
	combTuningL5:    1422,
	combTuningR5:    1422 + STEREO_SPREAD,
	combTuningL6:    1491,
	combTuningR6:    1491 + STEREO_SPREAD,
	combTuningL7:    1557,
	combTuningR7:    1557 + STEREO_SPREAD,
	combTuningL8:    1617,
	combTuningR8:    1617 + STEREO_SPREAD,

	allpassTuningL1: 556,
	allpassTuningR1: 556 + STEREO_SPREAD,
	allpassTuningL2: 441,
	allpassTuningR2: 441 + STEREO_SPREAD,
	allpassTuningL3: 341,
	allpassTuningR3: 341 + STEREO_SPREAD,
	allpassTuningL4: 225,
	allpassTuningR4: 225 + STEREO_SPREAD
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function FreeVerb(params) {
	params = params || {};

	this.outR   = [0.0];
	this.outL   = [0.0];
	this.inputL = [0.0];
	this.inputR = [0.0];

	this._gain      = 0;
	this._roomSize  = 0;
	this._roomSize1 = 0;
	this._damp      = 0;
	this._damp1     = 0;
	this._wet       = 0;
	this._wet1      = 0;
	this._wet2      = 0;
	this._dry       = 0;
	this._width     = 0;
	this._mode      = 0;

	this.combL = [
		new CombFilter(FREEVERB_TUNING.combTuningL1),
		new CombFilter(FREEVERB_TUNING.combTuningL2),
		new CombFilter(FREEVERB_TUNING.combTuningL3),
		new CombFilter(FREEVERB_TUNING.combTuningL4),
		new CombFilter(FREEVERB_TUNING.combTuningL5),
		new CombFilter(FREEVERB_TUNING.combTuningL6),
		new CombFilter(FREEVERB_TUNING.combTuningL7),
		new CombFilter(FREEVERB_TUNING.combTuningL8)
	];

	this.combR = [
		new CombFilter(FREEVERB_TUNING.combTuningR1),
		new CombFilter(FREEVERB_TUNING.combTuningR2),
		new CombFilter(FREEVERB_TUNING.combTuningR3),
		new CombFilter(FREEVERB_TUNING.combTuningR4),
		new CombFilter(FREEVERB_TUNING.combTuningR5),
		new CombFilter(FREEVERB_TUNING.combTuningR6),
		new CombFilter(FREEVERB_TUNING.combTuningR7),
		new CombFilter(FREEVERB_TUNING.combTuningR8)
	];

	this.allpassL = [
		new AllPassFilter(FREEVERB_TUNING.allpassTuningL1, 0.5),
		new AllPassFilter(FREEVERB_TUNING.allpassTuningL2, 0.5),
		new AllPassFilter(FREEVERB_TUNING.allpassTuningL3, 0.5),
		new AllPassFilter(FREEVERB_TUNING.allpassTuningL4, 0.5),
	];

	this.allpassR = [
		new AllPassFilter(FREEVERB_TUNING.allpassTuningR1, 0.5),
		new AllPassFilter(FREEVERB_TUNING.allpassTuningR2, 0.5),
		new AllPassFilter(FREEVERB_TUNING.allpassTuningR3, 0.5),
		new AllPassFilter(FREEVERB_TUNING.allpassTuningR4, 0.5),
	];

	this.setWet(      params.wet   !== undefined ? params.wet : FREEVERB_TUNING.initialWet);
	this.setRoomSize( params.size  !== undefined ? params.wet : FREEVERB_TUNING.initialRoom);
	this.setDry(      params.dry   !== undefined ? params.wet : FREEVERB_TUNING.initialDry);
	this.setDamp(     params.damp  !== undefined ? params.wet : FREEVERB_TUNING.initialDamp);
	this.setWidth(    params.width !== undefined ? params.wet : FREEVERB_TUNING.initialWidth);
	this.setMode(     params.mode  !== undefined ? params.wet : FREEVERB_TUNING.initialMode);
}

FreeVerb.prototype.update = function () {
	this._wet1 = this._wet * (this._width / 2 + 0.5);
	this._wet2 = this._wet * ((1 - this._width) / 2);

	if (this._mode >= FREEVERB_TUNING.freezeMode) {
		this._roomSize1 = 1.0;
		this._damp1     = 0.0;
		this._gain      = FREEVERB_TUNING.muted;
	} else {
		this._roomSize1 = this._roomSize;
		this._damp1     = this._damp;
		this._gain      = FREEVERB_TUNING.fixedGain;
	}

	for (var i = 0; i < FREEVERB_TUNING.numCombs; i++) {
		this.combL[i].feedback = this._roomSize1;
		this.combR[i].feedback = this._roomSize1;
		this.combL[i].damp = this._damp1;
		this.combR[i].damp = this._damp1;
	}
};

FreeVerb.prototype.mute = function () {
	if (this._mode >= FREEVERB_TUNING.freezeMode) return;

	for (var i = 0; i < FREEVERB_TUNING.numCombs; i++) {
		this.combL[i].mute();
		this.combR[i].mute();
	}

	for (var i = 0; i < FREEVERB_TUNING.numAllpasses; i++) {
		this.allpassL[i].mute();
		this.allpassR[i].mute();
	}
};

FreeVerb.prototype.tic = function () {
	var i;

	var l = 0.0;
	var r = 0.0;

	// Accumulate comb filters in parallel
	for (i = 0; i < FREEVERB_TUNING.numCombs; i++) {
		l += this.combL[i].tic(this.inputL[0]);
		r += this.combR[i].tic(this.inputR[0]);
	}

	// Feed through allpasses in series
	for (i = 0; i < FREEVERB_TUNING.numAllpasses; i++) {
		l = this.allpassL[i].tic(l);
		r = this.allpassR[i].tic(r);
	}

	// Calculate output
	this.outL[0] = l * this._wet1 + r * this._wet2;
	this.outR[0] = r * this._wet1 + l * this._wet2;
};

FreeVerb.prototype.setWet = function (value) {
	this._wet = value * FREEVERB_TUNING.scaleWet;
	this.update();
};

FreeVerb.prototype.setRoomSize = function (value) {
	this._roomSize = (value * FREEVERB_TUNING.scaleRoom) + FREEVERB_TUNING.offsetRoom;
	this.update();
};

FreeVerb.prototype.setDry = function (value) {
	this._dry = value * FREEVERB_TUNING.scaleDry;
};

FreeVerb.prototype.setDamp = function (value) {
	this._damp = value * FREEVERB_TUNING.scaleDamp;
	this.update();
};

FreeVerb.prototype.setWidth = function (value) {
	this._width = value;
	this.update();
};

FreeVerb.prototype.setMode = function (value) {
	this._mode = value;
	this.update();
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// sequencer
function Clock(params) {
	this.out    = [0.0];
	this._pos   = 0.0;
	this._inc   = 0.0;
	this._tempo = params.tempo || 130;

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
};

Clock.prototype.setTempo = function (tempo) {
	this._tempo = tempo;
	this._inc = tempo / (30 * SAMPLE_RATE);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function FreqSeq(params) {
	this.out     = [0.0];
	this._tempo  = params.tempo || 130;
	this._pos    = 0.0;
	this._inc    = 0.0;
	this._steps  = [];
	this._length = 8;
	if (params.steps) {
		this.setSteps(params.steps);
	} else {
		this.setTempo(this._tempo);
	}
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
		this._steps.push(noteToFreq(steps[i]));
	}
	this.setTempo(this._tempo);
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// envelope

function DecayEnvelope(params) {
	this.trig  = [0.0]; // input trigger
	this.input = [0.0]; // input signal
	this.env   = [0.0]; // output signal
	this.out   = [0.0]; // output signal

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
	this.out   = [0.0];
	this.freq  = params.freq === undefined ? [0.1] : [params.freq];
}

FastFilter.prototype.tic = function () {
	this.out[0] = (this.input[0]) * this.freq[0] + this.out[0] * (1 - this.freq[0]);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function RCFilter(params) {
	this.input = [0.0];
	this.out   = [0.0];
	this.cut   = params.cut === undefined ? [0.5] : [params.cut];
	this.res   = params.res === undefined ? [0.4] : [params.res];

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
	var TEMPO = 88;
	this.seq   = new FreqSeq({ tempo: TEMPO, steps: [69, 57, 60, 64, 48, 57, 52, 62] });
	this.clk   = new Clock({ tempo: TEMPO });
	this.glide = new FastFilter({ freq: 0.004 });
	this.lfo   = new TriOsc({ freq: 0.03, width: 0.9 });
	this.osc1  = new PulseOsc({ freq: 110.0 });
	this.osc2  = new TriOsc({ freq: 110.0 });
	this.env   = new DecayEnvelope({ decay: 0.4, curvature: 0.1 });
	// this.noiz = new NesPseudoNoise({ freq: 1600.0 });
	this.fltr  = new RCFilter({ cut: 0.5, res: 0.4 });
	this.clp   = new Clipper();
	this.vrb   = new FreeVerb(/*{ size: 0.3, damp: 0.3 }*/);

	this.env.trig = this.clk.out;
	this.glide.input = this.seq.out;
	this.oscMix = [0.0];
	this.env.input = this.oscMix;
	// this.fltr.cut = this.env.out;
	this.fltr.input = this.env.out;
	this.vrb.inputR = this.fltr.out;
	this.vrb.inputL = this.fltr.out;
	this.clp.input = this.vrb.outR;

	this.out = this.clp.out;
}

SimpleSynth.prototype.tic = function () {
	this.clk.tic();
	this.seq.tic();
	this.glide.tic();
	var f = this.glide.out[0];
	this.osc1.freq = f;
	this.osc2.freq = f / 3.01;

	this.osc1.tic();
	this.osc2.tic();
	this.lfo.tic();

	var w = map(this.lfo.out[0], -1, 1, 0, 0.5);
	this.osc1.width = w;
	this.osc2.width = w;

	this.oscMix[0] = this.osc1.out[0] + this.osc2.out[0];

	this.env.tic();

	// this.fltr.cut[0] = 0.2 * this.env.out[0];

	this.fltr.tic();
	this.vrb.tic();
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

var perf = {
	started: performance.now(),
	now:     performance.now(),
	cycles:  0,
	total:   0,
	average: function () {
		this.now = performance.now();
		var average = this.total / this.cycles;
		var elapsed = this.now - this.started;
		console.log('----------------------------');
		console.log('elapsed:  ' + elapsed + ' ms');
		console.log('computed: ' + this.total + ' ms');
		console.log('load:     ' + (100 * this.total / elapsed) + ' %');
		console.log('cycles:   ' + this.cycles);
		console.log('average:  ' + average + ' ms/cycle');
	}
};


generator.onaudioprocess = function (e) {
	var startTime = performance.now();
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
	perf.cycles++;
	perf.total += performance.now() - startTime;
};

window.setInterval(function () { perf.average(); }, 10000);


