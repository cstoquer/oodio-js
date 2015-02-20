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
ModuleManager.prototype.remove = function (module) {
	delete this.modules[module.id];

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
ModuleManager.prototype.move = function (module, x, y) {
	var row = this.grid[module.x]
	var index = row.indexOf(module);
	if (index === -1) return console.error('Module not found in grid.');
	row.splice(index, 1);
	this._addModuleInGrid(module, x, y);

	// TODO: update cables
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.startDrag = function (module, e) {
	var t = this;
	var d = document;
	var x = module.x * MODULE_WIDTH;
	var y = module.y * MODULE_HEIGHT;
	var startX = ~~e.clientX - x;
	var startY = ~~e.clientY - y;
	var dummy = createDom('dummy', null);
	dummy.style.height = (module.description_moduleSize * MODULE_HEIGHT - 8) + 'px';
	dummy.style.left   = x + 'px';
	dummy.style.top    = y + 'px';

	// TODO: allow draging several selected modules at once

	function dragMove(e) {
		e.preventDefault();
		dummy.style.left = ~~e.clientX - startX + 'px';
		dummy.style.top  = ~~e.clientY - startY + 'px';
	}

	function dragEnd(e) {
		e.preventDefault();
		d.removeEventListener('mouseup', dragEnd);
		d.removeEventListener('mousemove', dragMove);
		removeDom(dummy, null);
		var x = Math.max(0, ~~Math.round((e.clientX - startX) / MODULE_WIDTH));
		var y = Math.max(0, ~~Math.round((e.clientY - startY) / MODULE_HEIGHT));
		if (x === module.x && y === module.y) return;
		t.move(module, x, y);
	}

	d.addEventListener('mousemove', dragMove, false);
	d.addEventListener('mouseup', dragEnd, false);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.startConnection = function (connector, e) {
	var t = this;
	var d = document;
	var canvas = document.getElementById("cables");
	var ctx = canvas.getContext('2d');
	// TODO

	var startX = ~~e.clientX;
	var startY = ~~e.clientY;

	function move(e) {
		// TODO
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(~~e.clientX, ~~e.clientY);
		ctx.stroke();
	}

	function moveEnd(e) {
		e.preventDefault();
		d.removeEventListener('mousemove', move);
		d.removeEventListener('mouseup', moveEnd);
		var dom = document.elementFromPoint(e.clientX, e.clientY);
		if (!dom.connector) return;
		console.log(connector.module.__proto__.constructor.name+':'+connector.id+' >>>> '+dom.connector.module.__proto__.constructor.name+':'+dom.connector.id);
	}

	d.addEventListener('mousemove', move, false);
	d.addEventListener('mouseup', moveEnd, false);
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
