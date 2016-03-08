
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// create context, generator and start audio processing

var AudioContext = AudioContext || webkitAudioContext;

var perf = (new Performance()).start();
var audioContext = new AudioContext();
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

