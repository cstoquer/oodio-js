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
	// TODO: check connector type.
	// there is a "Maximum call stack size exceeded" bug if we try to connect 2 EventIn Connectors
	connector.connect(this);
};
