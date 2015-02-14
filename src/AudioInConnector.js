/** Audio In Connector
 *
 * @author Cedric Stoquer
 */
function AudioInConnector(module, name, connector) {
	this.module = module;
	this.name   = name;

	var dom = this._dom = createDom('connector audioIn', module._dom);
	if (connector.x === undefined) {
		dom.style.position = 'relative'
		return;
	}
	dom.style.left = connector.x + 'px';
	dom.style.top  = connector.y + 'px';
}

AudioInConnector.prototype.connect = function (connector) {
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	this.module[name] = connector.module[connector.name];
};