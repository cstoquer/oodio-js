/** Module manager
 *
 * @author Cedric Stoquer
 */
function ModuleManager() {
	this._idCount = 0;
	this.modules = {};

	this.AR = [];
	this.KR = [];

	this.frame = 64;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.add = function (module, params) {
	var id = this._idCount++;
	module.id = id;
	this.modules[id] = module;

	if      (module.description_rate === 'A') this.AR.push(module);
	else if (module.description_rate === 'K') this.KR.push(module);

	// TODO: module position inside grid

	return module;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.remove = function (id) {
	var module = this.modules.id;
	if (!module) return console.error('Invalid module id.');
	delete this.modules[id];

	function removeFromArray(array) {
		var index = array.indexOf(module);
		if (index === -1) return console.error('Module not found.');
		array.splice(index, 1);
	}

	if      (module.description_rate === 'A') removeFromArray(this.AR);
	else if (module.description_rate === 'K') removeFromArray(this.KR);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.processAudio = function (outBufferL, outBufferR) {
	for (var i = 0; i < BUFFER_LENGTH; i++) {
		ROOT.MAIN_OUT_L[0] = 0.0;
		ROOT.MAIN_OUT_R[0] = 0.0;
		if (64 === this.frame++) {
			this.frame = 0;
			for (var j = 0; j < this.KR.length; j++) {
				this.KR[j].tic();
			}
		}
		for (var j = 0; j < this.AR.length; j++) {
			this.AR[j].tic();
		}
		// clip main output
		var outL = ROOT.MAIN_OUT_L[0];
		var outR = ROOT.MAIN_OUT_R[0];
		if      (outL >  1) outL =  1;
		else if (outL < -1) outL = -1;
		if      (outR >  1) outR =  1;
		else if (outR < -1) outR = -1;
		outBufferL[i] = outL;
		outBufferR[i] = outR;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var moduleManager = new ModuleManager();
