
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// create synthesizer

/*function SimpleSynth(params) {
	Module.call(this, params);
	this.seq    = moduleManager.add(new SeqNote({ notes: [69, 57, 60, 64, 48, 57, 52, 62] }));
	this.glide  = moduleManager.add(new FastFilter({ freq: 0.004 }));
	this.lfo    = moduleManager.add(new TriOsc({ freq: 0.03, width: 0.9 }));
	this.osc1   = moduleManager.add(new PulseOsc({ freq: 110.0 }));
	this.osc2   = moduleManager.add(new TriOsc({ freq: 110.0 }));
	this.oscMix = moduleManager.add(new Mix1_1A({ volume: 1.0 }));
	this.env    = moduleManager.add(new DecayEnvelope({ decay: 0.4, curvature: 0.1 }));
	this.fltr   = moduleManager.add(new RCFilter({ cut: 0.5, res: 0.4 }));
	this.vrb    = moduleManager.add(new FreeVerb({ wet: 0.01, dry: 0.9, size: 0.6, damp: 0.3, width: 1.0 }));
	this.gain   = moduleManager.add(new Gain({ gain: 0.3 }));
	// this.noiz  = moduleManager.add(new NesPseudoNoise({ freq: 1600.0 });

	this.glide.$input.connect(this.seq.$out);
	this.oscMix.$input1.connect(this.osc1.$out);
	this.oscMix.$input2.connect(this.osc2.$out);
	this.oscMix.$out.connect(this.env.$input);
	this.fltr.$input.connect(this.env.$out);
	this.fltr.$out.connect(this.gain.$input);
	this.vrb.$inputR.connect(this.gain.$out);
	this.vrb.$inputL.connect(this.gain.$out);
}
inherit(SimpleSynth, Module);
SimpleSynth.prototype.description_moduleName = 'SimpleSynth';
SimpleSynth.prototype.description_moduleSize = 1;
SimpleSynth.prototype.description_rate       = 'A';
SimpleSynth.prototype.description_inputs     = {};
SimpleSynth.prototype.description_outputs    = {};
SimpleSynth.prototype.description_params     = {};

SimpleSynth.prototype.tic = function () {
	// TODO: add some oscillator with note / frequency inputs
	var f = this.glide.out[0];
	this.osc1.freq = f;
	this.osc2.freq = f / 3.01;

	// TODO: add a level converter module
	var w = map(this.lfo.out[0], -1, 1, 0, 0.5);
	this.osc1.width[0] = w;
	this.osc2.width[0] = w;
};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

var clock = moduleManager.add(new ClockGen({ tempo: 180 }));
var synth = moduleManager.add(new SimpleSynth());
var out   = moduleManager.add(new Output());

clock.$out.connect(synth.seq.$clk);
// clock.$out.connect(synth.env.$trigger);
synth.env.$trigger.connect(clock.$out);

out.$inputL.connect(synth.vrb.$outL);
out.$inputR.connect(synth.vrb.$outR);*/

// new TestModule();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// create context, generator and start audio processing

var perf = (new Performance()).start();
var audioContext = new webkitAudioContext();
var mainVolume = audioContext.createGain();
var generator  = audioContext.createScriptProcessor(BUFFER_LENGTH, 1, 2);
mainVolume.gain.value = 0.1;
mainVolume.connect(audioContext.destination);
generator.connect(mainVolume);

generator.onaudioprocess = function (e) {
	var startTime = performance.now();
	moduleManager.processAudio(
		e.outputBuffer.getChannelData(0),
		e.outputBuffer.getChannelData(1)
	);
	perf.sample(startTime);
};

