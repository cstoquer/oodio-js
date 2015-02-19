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
		dom.style.position = 'relative'
		return;
	}

	dom.style.left = (t.x * MODULE_HEIGHT + 1) + 'px';
	dom.style.top  = (t.y * MODULE_HEIGHT + 1) + 'px';

	dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();
		moduleManager.startConnection(t, e);
	});
}

Connector.prototype.connect = function (connector) {
	// TODO: save connection
};

Connector.prototype.disconnect = function () {
	// TODO: remove connection from this connector and connected ones
};