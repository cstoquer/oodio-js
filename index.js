
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
	this.oscMix = new Mix1_1A({ volume: 1.0 });
	this.env   = new DecayEnvelope({ decay: 0.4, curvature: 0.1 });
	// this.noiz = new NesPseudoNoise({ freq: 1600.0 });
	this.fltr  = new RCFilter({ cut: 0.5, res: 0.4 });
	this.clp   = new Clipper();
	this.vrb   = new FreeVerb({ wet: 0.01, dry: 0.9, size: 0.6, damp: 0.3, width: 1.0 });

	this.env.trig = this.clk.out;
	this.glide.input = this.seq.out;
	this.oscMix.input1 = this.osc1.out;
	this.oscMix.input2 = this.osc2.out;
	this.env.input = this.oscMix.out;
	// this.fltr.cut = this.env.out;
	this.fltr.input = this.env.out;
	this.gain = [0.0];
	this.vrb.inputR = this.gain;
	this.vrb.inputL = this.gain;
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

	this.oscMix.tic();
	this.env.tic();

	// this.fltr.cut[0] = 0.2 * this.env.out[0];

	this.fltr.tic();
	this.gain[0] = this.fltr.out[0] * 0.3;
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

var perf = (new Performance()).start();

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
	perf.sample(startTime);
};

