/** Mixer 1-1 A
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */

function Mix1_1A(params) {
	params = params || {};

	this.input1 = [0.0];
	this.input2 = [0.0];
	this.out    = [0.0];
	this.volume = params.volume !== undefined ? params.volume : 0.0;
}

Mix1_1A.prototype.tic = function () {
	this.out[0] = this.input1[0] + this.input2[0] * this.volume;
};