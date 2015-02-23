/** Clipper
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */

function Clipper(params) {
	Module.call(this, params);
}
inherit(Clipper, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Clipper.prototype.description_moduleName = 'Clipper';
Clipper.prototype.description_moduleSize = 2;
Clipper.prototype.description_rate       = 'A';
Clipper.prototype.description_inputs     = {
	input: { rate: 'A', x: 14, y: 1 }
};
Clipper.prototype.description_outputs    = {
	out:   { rate: 'A', x: 16, y: 1 }
};
Clipper.prototype.description_params     = {};
library.register(Clipper);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Clipper.prototype.tic = function () {
	if (this.input[0] >  1.0) { this.out[0] =  1.0; return; }
	if (this.input[0] < -1.0) { this.out[0] = -1.0; return; }
	this.out[0] = this.input[0];
};

