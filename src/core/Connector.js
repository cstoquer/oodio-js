/** Connector Abstract class
 *
 * @author Cedric Stoquer
 */
function Connector(module, name, connector) {
	this.x = connector.x;
	this.y = connector.y;

	this.module = module;
	this.name   = name;

	var dom = this._dom = createDom('connector ' + this.connectorClassName, module._dom);

	if (this.x === undefined) {
		dom.style.position = 'relative'
		return;
	}

	dom.style.left = (this.x * 15 + 1) + 'px';
	dom.style.top  = (this.y * 15 + 1) + 'px';
}