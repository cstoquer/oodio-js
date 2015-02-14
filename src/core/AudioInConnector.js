/** Audio In Connector
 *
 * @author Cedric Stoquer
 */
function AudioInConnector(module, id, connectorDescription) {
	Connector.call(this, module, id, connectorDescription);
}
inherit(AudioInConnector, Connector);
AudioInConnector.prototype.connectorClassName = 'audioIn';

AudioInConnector.prototype.connect = function (connector) {
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	this.module[id] = connector.module[connector.id];
};

