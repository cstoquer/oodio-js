/** Event Out Connector
 *
 * @author Cedric Stoquer
 */
function EventInConnector(module, functionName) {
	this.module       = module;
	this.functionName = functionName;

	this._dom = createDom('connector eventIn', module._dom);
}

EventInConnector.prototype.connect = function (connector) {
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	connector.connect(this);
};
