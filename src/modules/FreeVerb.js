/** FreeVerb
 *
 * Free, studio-quality reverb SOURCE CODE in the public domain
 * Written by Jezar at Dreampoint - http://www.dreampoint.co.uk
 *
 * Javascript implementation and modifications by Cedric Stoquer
 *
 * AR module
 */


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// All Pass Filter
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
// Comb Filter
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

Object.defineProperty(CombFilter.prototype, 'damp', {
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
// Reverberation tuning

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
// FreeVerb

function FreeVerb(params) {
	Module.call(this, params);
	params = params || {};

	this.inputL = ROOT.UNPLUGGED;
	this.inputR = ROOT.UNPLUGGED;
	this.outR   = [0.0];
	this.outL   = [0.0];

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

	this.setWet(      params.wet   !== undefined ? params.wet   : FREEVERB_TUNING.initialWet);
	this.setRoomSize( params.size  !== undefined ? params.size  : FREEVERB_TUNING.initialRoom);
	this.setDry(      params.dry   !== undefined ? params.dry   : FREEVERB_TUNING.initialDry);
	this.setDamp(     params.damp  !== undefined ? params.damp  : FREEVERB_TUNING.initialDamp);
	this.setWidth(    params.width !== undefined ? params.width : FREEVERB_TUNING.initialWidth);
}
inherit(FreeVerb, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
FreeVerb.prototype.description_moduleName = 'FreeVerb';
FreeVerb.prototype.description_moduleSize = 2;
FreeVerb.prototype.description_rate       = 'A';
FreeVerb.prototype.description_inputs     = {};
FreeVerb.prototype.description_outputs    = {};
FreeVerb.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

FreeVerb.prototype.update = function () {
	this._wet1 = this._wet * (this._width / 2 + 0.5);
	this._wet2 = this._wet * ((1 - this._width) / 2);

	this._roomSize1 = this._roomSize;
	this._damp1     = this._damp;
	this._gain      = FREEVERB_TUNING.fixedGain;

	for (var i = 0; i < FREEVERB_TUNING.numCombs; i++) {
		this.combL[i].feedback = this._roomSize1;
		this.combR[i].feedback = this._roomSize1;
		this.combL[i].damp = this._damp1;
		this.combR[i].damp = this._damp1;
	}
};

FreeVerb.prototype.mute = function () {
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
	this.outL[0] = l * this._wet1 + r * this._wet2 + this.inputL[0] * this._dry;
	this.outR[0] = r * this._wet1 + l * this._wet2 + this.inputR[0] * this._dry;
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
