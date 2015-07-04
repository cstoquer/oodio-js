# oodio-js

Modular synthesizer. Based on WebAudio's `createScriptProcessor` for audio rendering.
This project is a work in progress. Demo is [here](http://cstoquer.github.io/oodio-js).

## Modules

### Effect
 - FreeVerb: reverberation based on FreeVerb implementation.

### Enveloppe
 - EnvDecay: Simple logarithmic decay enveloppe.

### Oscillator
 - OscSaw: simple sawtooth wave generator.
 - OscRamp-B: sawtooth wave generator. 
 - OscPulse: pulse wave generator with PWM.
 - OscTri: triangle wave generator.
 - NES Noise: 1-bit pseudo noise generator. Based on NES's 2A03 chipset noise channel.

### Filter
 - FastFilter: simple one pole 6db/oct filter
 - RCFilter: Resistor-Capacitor type filter.

### Amplification
 - Gain
 - Clipper
 - Mix1-1A

### Sequencer
 - ClockGen: Clock pulse generator
 - SeqNote: Simple note sequencer
