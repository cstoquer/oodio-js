/** Fast First-Order Filter
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */
function FastFilter(params) {
	this.input = [0.0];
	this.out   = [0.0];
	this.freq  = params.freq === undefined ? [0.1] : [params.freq];
}

FastFilter.prototype.tic = function () {
	this.out[0] = (this.input[0]) * this.freq[0] + this.out[0] * (1 - this.freq[0]);
};