
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// create synthesizer

function SimpleSynth() {
	this.seq    = new SeqNote({ steps: [69, 57, 60, 64, 48, 57, 52, 62] });
	this.glide  = new FastFilter({ freq: 0.004 });
	this.lfo    = new TriOsc({ freq: 0.03, width: 0.9 });
	this.osc1   = new PulseOsc({ freq: 110.0 });
	this.osc2   = new TriOsc({ freq: 110.0 });
	this.oscMix = new Mix1_1A({ volume: 1.0 });
	this.env    = new DecayEnvelope({ decay: 0.4, curvature: 0.1 });
	this.fltr   = new RCFilter({ cut: 0.5, res: 0.4 });
	this.vrb    = new FreeVerb({ wet: 0.01, dry: 0.9, size: 0.6, damp: 0.3, width: 1.0 });
	this.gain   = new Gain({ gain: 0.3 });
	// this.noiz  = new NesPseudoNoise({ freq: 1600.0 });

	this.glide.$input.connect(this.seq.$out);
	this.oscMix.$input1.connect(this.osc1.$out);
	this.oscMix.$input2.connect(this.osc2.$out);
	this.oscMix.$out.connect(this.env.$input);
	this.fltr.$input.connect(this.env.$out);
	this.fltr.$out.connect(this.gain.$input);
	this.vrb.$inputR.connect(this.gain.$out);
	this.vrb.$inputL.connect(this.gain.$out);
}
SimpleSynth.prototype.description_rate = 'A';

SimpleSynth.prototype.tic = function () {
	this.glide.tic();
	var f = this.glide.out[0];

	// TODO: add some oscillator with note / frequency inputs
	this.osc1.freq = f;
	this.osc2.freq = f / 3.01;

	this.osc1.tic();
	this.osc2.tic();
	this.lfo.tic();

	var w = map(this.lfo.out[0], -1, 1, 0, 0.5); // TODO: add a level converter module
	this.osc1.width[0] = w;
	this.osc2.width[0] = w;

	this.oscMix.tic();
	this.env.tic();
	this.fltr.tic();
	this.gain.tic();
	this.vrb.tic();
};

var clock = moduleManager.add(new ClockGen({ tempo: 180 }));
var synth = moduleManager.add(new SimpleSynth());
var out   = moduleManager.add(new Output());

clock.$out.connect(synth.seq.$clk);
// clock.$out.connect(synth.env.$trigger);
synth.env.$trigger.connect(clock.$out);

out.$inputL.connect(synth.vrb.$outL);
out.$inputR.connect(synth.vrb.$outR);

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

