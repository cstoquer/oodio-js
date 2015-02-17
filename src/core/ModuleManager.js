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

	this.grid = [[]];
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.add = function (module, x, y) {
	var id = this._idCount++;
	module.id = id;
	this.modules[id] = module;

	if      (module.description_rate === 'A') this.AR.push(module);
	else if (module.description_rate === 'K') this.KR.push(module);

	this._addModuleInGrid(module, x, y);

	return module;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype._addModuleInGrid = function (module, x, y) {
	// set module position inside grid
	x = x || 0;
	y = y || 0;

	if (!this.grid[x]) this.grid[x] = [];
	var row = this.grid[x];
	var size = module.description_moduleSize;

	// move y cursor to next available position
	var index = 0;
	var pos = y;
	for (; index < row.length; index++) {
		var m = row[index];
		if (m.y < y && m.y + m.description_moduleSize >= y) {
			pos = m.y + m.description_moduleSize;
			index++;
			break;
		} else if (m.y >= y) {
			break;
		}
	}

	// insert module
	module.setPosition(x, pos);
	row.splice(index, 0, module);
	pos += module.description_moduleSize;

	// move all modules below if needed
	for (var i = index + 1; i < row.length; i++) {
		var m = row[i];
		if (m.y >= pos) break;
		m.setPosition(m.x, pos);
		pos += m.description_moduleSize;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.remove = function (id) {
	var module = this.modules[id];
	if (!module) return console.error('Invalid module id.');
	delete this.modules[id];

	function removeFromArray(array) {
		var index = array.indexOf(module);
		if (index === -1) return console.error('Module not found.');
		array.splice(index, 1);
	}

	if      (module.description_rate === 'A') removeFromArray(this.AR);
	else if (module.description_rate === 'K') removeFromArray(this.KR);

	// remove UI object from grid and html
	removeFromArray(this.grid[module.x]);
	module.remove();

	// TODO: disconnect module connector
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.move = function (id, x, y) {
	var module = this.modules[id];
	if (!module) return console.error('Invalid module id.');

	var row = this.grid[module.x]

	var index = row.indexOf(module);
	if (index === -1) return console.error('Module not found in grid.');
	row.splice(index, 1);

	this._addModuleInGrid(module, x, y);

	// TODO: update cables
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
