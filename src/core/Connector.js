/** Connector Abstract class
 *
 * @author Cedric Stoquer
 */
function Connector(module, id, connectorDescription) {
	var t = this;
	t.x = connectorDescription.x;
	t.y = connectorDescription.y;

	t.module = module;
	t.id     = id;

	var dom = t._dom = createDom('connector ' + t.connectorClassName, module._dom);

	if (t.x === undefined) {
		// TODO: remove this
		dom.style.position = 'relative'
	} else {
		dom.style.left = (t.x * MODULE_HEIGHT + 1) + 'px';
		dom.style.top  = (t.y * MODULE_HEIGHT + 1) + 'px';
	}

	var overlay = createDom('connectorOverlay', dom);
	overlay.connector = t;

	overlay.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();
		moduleManager.startConnection(t, e);
	});
}

Connector.prototype.color = ROOT.COLOR.NONE;

Connector.prototype.connect = function (connector) {
	moduleManager.addCable(this, connector, this.color);
};

Connector.prototype.disconnect = function () {
	// TODO: remove all connections from this connector
	console.log('DISCONNECT')
};