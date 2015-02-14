/** Event In Connector
 *
 * @author Cedric Stoquer
 */
function EventInConnector(module, id, connectorDescription) {
	Connector.call(this, module, id, connectorDescription);

	this.functionName = connectorDescription.func;
}
inherit(EventInConnector, Connector);
EventInConnector.prototype.connectorClassName = 'eventIn';

EventInConnector.prototype.connect = function (connector) {
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	connector.connect(this);
};
