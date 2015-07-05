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

	var dom = t._dom = createDiv('connector ' + t.connectorClassName, module._dom);

	if (t.x === undefined) {
		// TODO: remove this
		dom.style.position = 'relative'
	} else {
		dom.style.left = (t.x * CONNECTOR_GRID_SIZE + 1) + 'px';
		dom.style.top  = (t.y * CONNECTOR_GRID_SIZE + 1) + 'px';
	}

	dom.connector = t;

	dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();
		window.moduleManager.startConnection(t, e);
	});
}

Connector.prototype.color = ROOT.COLOR.NONE;

Connector.prototype.connect = function (connector) {
	window.moduleManager.addCable(this, connector, this.color);
};

Connector.prototype.disconnect = function (connector) {
	// TODO: remove all connections from this connector
	console.log('TODO >> connector.disconnect', this, connector)
};

Connector.prototype.isCompatible = function (connector) {
	if (connector === this) return false;
	// TODO
	return true;
};