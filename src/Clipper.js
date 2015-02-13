/** Clipper
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */

function Clipper(params) {
	Module.call(this, params);

	this.input = ROOT.UNPLUGGED;
	this.out   = [0.0];
}
inherit(Clipper, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Clipper.prototype.description_moduleName = 'Clipper';
Clipper.prototype.description_moduleSize = 1;
Clipper.prototype.description_rate       = 'A';
Clipper.prototype.description_inputs     = {};
Clipper.prototype.description_outputs    = {};
Clipper.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Clipper.prototype.tic = function () {
	if (this.input[0] >  1.0) { this.out[0] =  1.0; return; }
	if (this.input[0] < -1.0) { this.out[0] = -1.0; return; }
	this.out[0] = this.input[0];
}