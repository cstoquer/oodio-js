/** Fast First-Order Filter
 *
 * AR/KR module
 *
 * @author Cedric Stoquer
 */
function Output(params) {
	Module.call(this, params);
}
inherit(Output, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Output.prototype.description_moduleName = 'Output';
Output.prototype.description_moduleSize = 2;
Output.prototype.description_rate       = 'A';
Output.prototype.description_inputs     = {
	inputL: { rate: 'A', x: 0,  y: 1 },
	inputR: { rate: 'A', x: 14, y: 1 }
};
Output.prototype.description_outputs    = {};
Output.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Output.prototype.tic = function () {
	ROOT.MAIN_OUT_L[0] += this.inputL[0];
	ROOT.MAIN_OUT_R[0] += this.inputR[0];
};