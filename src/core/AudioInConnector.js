/** Audio In Connector
 *
 * @author Cedric Stoquer
 */
function AudioInConnector(module, id, connectorDescription) {
	Connector.call(this, module, id, connectorDescription);
}
inherit(AudioInConnector, Connector);
AudioInConnector.prototype.connectorClassName = 'audioIn';
AudioInConnector.prototype.color = ROOT.COLOR.AUDIO;

AudioInConnector.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	this.module[this.id] = connector.module[connector.id];
};

