/** Event In Connector
 *
 * @author Cedric Stoquer
 */
function EventInConnector(module, id, connectorDescription) {
	Connector.call(this, module, id, connectorDescription);
}
inherit(EventInConnector, Connector);
EventInConnector.prototype.connectorClassName = 'eventIn';
EventInConnector.prototype.color = ROOT.COLOR.EVENT;

EventInConnector.prototype.connect = function (connector) {
	// Connector.prototype.connect.call(this, connector);
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	connector.connect(this);
};
