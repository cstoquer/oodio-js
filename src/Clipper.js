/** Clipper
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */

function Clipper() {
	this.input = ROOT.UNPLUGGED;
	this.out   = [0.0];
}

Clipper.prototype.tic = function () {
	if (this.input[0] >  1.0) { this.out[0] =  1.0; return; }
	if (this.input[0] < -1.0) { this.out[0] = -1.0; return; }
	this.out[0] = this.input[0];
}