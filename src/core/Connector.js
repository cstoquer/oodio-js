/** Connector Abstract class
 *
 * @author Cedric Stoquer
 */
function Connector(module, id, connectorDescription) {
	this.x = connectorDescription.x;
	this.y = connectorDescription.y;

	this.module = module;
	this.id     = id;

	var dom = this._dom = createDom('connector ' + this.connectorClassName, module._dom);

	if (this.x === undefined) {
		dom.style.position = 'relative'
		return;
	}

	dom.style.left = (this.x * 15 + 1) + 'px';
	dom.style.top  = (this.y * 15 + 1) + 'px';
}

Connector.prototype.connect = function (connector) {
	// TODO: save connection
};