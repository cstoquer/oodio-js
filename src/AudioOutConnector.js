/** Audio Out Connector
 *
 * @author Cedric Stoquer
 */
function AudioOutConnector(module, name, connector) {
	this.module = module;
	this.name   = name;

	var dom = this._dom = createDom('connector audioOut', module._dom);
	if (connector.x === undefined) {
		dom.style.position = 'relative'
		return;
	}
	dom.style.left = connector.x + 'px';
	dom.style.top  = connector.y + 'px';
}

AudioOutConnector.prototype.connect = function (connector) {
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	connector.module[connector.name] = this.module[name];
};