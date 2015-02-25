/** Module manager
 *
 * @author Cedric Stoquer
 */
function ModuleManager() {
	this._idCount = 0;
	this.modules = {};
	this.cables  = {};

	this.AR = [];
	this.KR = [];

	this.frame = 64;

	this.grid = [[]];
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.add = function (module, x, y) {
	var id = this._idCount++;
	while (this.modules[this._idCount]) this._idCount++;

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
	if (module.id < this._idCount) this._idCount = module.id;

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
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.startDrag = function (module, e) {
	var t = this;
	var d = document;
	var x = module.x * MODULE_WIDTH;
	var y = module.y * MODULE_HEIGHT;
	var startX = e.clientX - x;
	var startY = e.clientY - y;
	var dummy = createDom('dummy', null);
	dummy.style.height = (module.description_moduleSize * MODULE_HEIGHT - 8) + 'px';
	dummy.style.left   = x + 'px';
	dummy.style.top    = y + 'px';

	// TODO: allow draging several selected modules at once

	function dragMove(e) {
		e.preventDefault();
		dummy.style.left = e.clientX - startX + 'px';
		dummy.style.top  = e.clientY - startY + 'px';
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
		t.drawCables();
	}

	d.addEventListener('mousemove', dragMove, false);
	d.addEventListener('mouseup', dragEnd, false);
};

var connectorMenu = document.getElementById('connectorMenu');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.startConnection = function (connector, e) {
	var t = this;
	var d = document;
	
	var mouseX = e.clientX;
	var mouseY = e.clientY;

	var startX = connector.module.x * MODULE_WIDTH  + connector.x * MODULE_HEIGHT + 8;
	var startY = connector.module.y * MODULE_HEIGHT + connector.y * MODULE_HEIGHT + 8;

	drag = false;

	function move(e) {
		e.preventDefault();
		if (Math.abs(e.clientX - mouseX) < 4 && Math.abs(e.clientY - mouseY) < 4) return;
		drag = true;
		d.removeEventListener('mousemove', move);
	}

	function moveEnd(e) {
		e.preventDefault();
		d.removeEventListener('mouseup', moveEnd);

		if (!drag) {
			// TODO: open menu with disconnection option
			connectorMenu.style.left = Math.max(0, e.clientX - 10) + 'px';
			connectorMenu.style.top  = Math.max(0, e.clientY - 10) + 'px';
			connectorMenu.style.display = 'block';

			function menuOut() {
				connectorMenu.style.display = 'none';
				connectorMenu.removeEventListener('mouseout', menuOut);
			}

			connectorMenu.addEventListener('mouseout', menuOut);
			return;
		}

		d.removeEventListener('mousemove', move);

		var dom = document.elementFromPoint(e.clientX, e.clientY);
		var c = dom.connector;
		if (!c) return;
		if (c === connector) return;

		// check that connection don't already exist
		var forwardId  = Cable.prototype.getId(c, connector);
		var backwardId = Cable.prototype.getId(connector, c);
		if (t.cables[forwardId] || t.cables[backwardId]) return;

		connector.connect(dom.connector);
	}

	d.addEventListener('mousemove', move, false);
	d.addEventListener('mouseup', moveEnd, false);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.addCable = function (connectorA, connectorB, color) {
	var cable = new Cable(connectorA, connectorB, color);
	this.cables[cable.id] = cable;
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.removeCable = function (connectorA, connectorB) {
	// TODO
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.drawCables = function () {
	var cables = this.cables;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var id in cables) cables[id].draw();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.shakeCables = function () {
	var cables = this.cables;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var id in cables) {
		cables[id].update();
		cables[id].draw();
	}
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
ModuleManager.prototype.getPatch = function () {
	var patch = {
		modules: [],
		cables:  []
	};
	for (var id in this.modules) {
		patch.modules.push(this.modules[id].getState());
		// TODO
	}

	return patch;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var moduleManager = new ModuleManager();
