**DEPRECATED** This project is based on webAudio [ScriptProcessorNode](https://www.w3.org/TR/webaudio/#the-scriptprocessornode-interface---deprecated) that has been deprecated.

Please have a look at [Modular](https://github.com/cstoquer/modular) which implements the same functionnalities and more using plain webAudio.

# oodio-js

Modular synthesizer. Based on WebAudio's `createScriptProcessor` for audio rendering.

Demo is [here](http://cstoquer.github.io/oodio-js).

## Modules

### Oscillator
 - OscSaw: simple sawtooth wave generator.
 - OscRamp-B: sawtooth wave generator. 
 - OscPulse: pulse wave generator with PWM.
 - OscTri: triangle wave generator.
 - NES Noise: 1-bit pseudo noise generator. Based on NES's 2A03 chipset noise channel.

### Filter
 - FastFilter: simple one pole 6db/oct filter
 - RCFilter: Resistor-Capacitor type filter.

### Enveloppe
 - EnvDecay: Simple logarithmic decay enveloppe.

### Amplification
 - Gain
 - Clipper
 - Mix1-1A

### Effect
 - FreeVerb: reverberation based on FreeVerb implementation.

### Sequencer
 - ClockGen: Clock pulse generator
 - SeqNote: Simple note sequencer
