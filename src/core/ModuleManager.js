var JACK_CONNECT_CURSOR = 'url(img/jack-connect.png) 3 3, auto';
var JACK_FREE_CURSOR    = 'url(img/jack-free.png) 2 3, auto';

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
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

	this.selectedModules = [];

	// this._deleteMode = false;

	this.registerKeyEvents();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.registerKeyEvents = function () {
	var t = this;

	function keyPress(e) {
		// e.preventDefault();
		// console.log(e.keyCode);
		switch (e.keyCode) {
			case 8:
			case 46:
				t.deleteSelectedModules();
				// t._deleteMode = true;
				break;
		}
	}

	/*function keyRelease(e) {
		switch (e.keyCode) {
			case 8:
			case 46:
				t._deleteMode = false;
				break;
		}
	}*/

	document.addEventListener('keydown', keyPress,   false);
	// document.addEventListener('keyup',   keyRelease, false);
};

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
/** Remove a module
 *
 * @param {Object} module - module to remove
 */
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

	// redraw cable to remove deleted ones
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.deleteSelectedModules = function () {
	console.log('delete selected modules')
	var modules = this.selectedModules;
	for (var i = 0; i < modules.length; i++) {
		this.remove(modules[i]);
	}
	this.selectedModules = [];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Move a module to a position (x, y)
 *
 * @param {Object} module - 
 * @param {number} x      - 
 * @param {number} y      - 
 */
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

	// select module
	if (t.selectedModules.indexOf(module) === -1) {
		// unselect previous modules
		for (var i = 0; i < t.selectedModules.length; i++) {
			t.selectedModules[i].deselect();
		}

		// select this module
		t.selectedModules = [module];
		module.select();
	}

	function createDummy(module) {
		var x = module.x * MODULE_WIDTH;
		var y = module.y * MODULE_HEIGHT;
		var dummy = createDiv('dummy', null);
		dummy.style.width  = (MODULE_WIDTH - 8) + 'px';
		dummy.style.height = (module.description_moduleSize * MODULE_HEIGHT - 8) + 'px';
		dummy.style.left   = x + 'px';
		dummy.style.top    = y + 'px';
		return dummy;
	}

	// TODO: allow draging several selected modules at once
	var dummy = null;

	function dragMove(e) {
		e.preventDefault();
		var x = e.clientX;
		var y = e.clientY;
		if (Math.abs(x - startX) < 4 && Math.abs(x - startX) < 4) return;
		// start dragging
		if (!dummy) dummy = createDummy(module);
		dummy.style.left = x - startX + 'px';
		dummy.style.top  = y - startY + 'px';
	}

	function dragEnd(e) {
		e.preventDefault();
		d.removeEventListener('mouseup', dragEnd);
		d.removeEventListener('mousemove', dragMove);

		//it was not a drag but a tap
		if (!dummy) return;

		// put module at position and cleanup dummy
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

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.startConnection = function (sourceConnector, e) {
	var t = this;
	var d = document;

	var mouseX = e.clientX;
	var mouseY = e.clientY;

	var startX = sourceConnector.module.x * MODULE_WIDTH  + sourceConnector.x * CONNECTOR_GRID_SIZE + 8;
	var startY = sourceConnector.module.y * MODULE_HEIGHT + sourceConnector.y * CONNECTOR_GRID_SIZE + 8;

	drag = false;

	function move(e) {
		var x = e.clientX;
		var y = e.clientY;
		e.preventDefault();
		if (!drag && Math.abs(x - mouseX) < 4 && Math.abs(y - mouseY) < 4) return;
		drag = true;

		// draw a line on overlay
		overCtx.clearRect(0, 0, overlay.width, overlay.height);
		overCtx.beginPath();
		overCtx.moveTo(startX, startY);
		overCtx.lineTo(x, y);
		overCtx.stroke();

		// check if there is a compatible connector under pointer
		var dom = d.elementFromPoint(x, y);
		var targetConnector = dom && dom.connector;
		if (targetConnector && targetConnector.isCompatible(sourceConnector)) {
			DOCUMENT_BODY.style.cursor = JACK_CONNECT_CURSOR;
		} else {
			DOCUMENT_BODY.style.cursor = JACK_FREE_CURSOR;
		}
	}

	function moveEnd(e) {
		e.preventDefault();
		d.removeEventListener('mouseup', moveEnd);
		d.removeEventListener('mousemove', move);
		DOCUMENT_BODY.style.cursor = '';
		overCtx.clearRect(0, 0, overlay.width, overlay.height);

		if (!drag) {
			// open menu with disconnection option
			window.connectorMenu.show(e, sourceConnector);
			return;
		}

		var dom = d.elementFromPoint(e.clientX, e.clientY);
		var targetConnector = dom.connector;
		if (!targetConnector) return;
		if (targetConnector === sourceConnector) return;

		// check that connection don't already exist
		var forwardId  = Cable.prototype.getId(targetConnector, sourceConnector);
		var backwardId = Cable.prototype.getId(sourceConnector, targetConnector);
		if (t.cables[forwardId] || t.cables[backwardId]) return;

		sourceConnector.connect(targetConnector);
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
ModuleManager.prototype.removeCable = function (cable) {
	if (!this.cables[cable.id]) return;
	cable.disconnect();
	delete this.cables[cable.id];
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
window.moduleManager = new ModuleManager();
