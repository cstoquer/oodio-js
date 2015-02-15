/** Audio Out Connector
 *
 * @author Cedric Stoquer
 */
function AudioOutConnector(module, id, connectorDescription) {
	Connector.call(this, module, id, connectorDescription);
}
inherit(AudioOutConnector, Connector);
AudioOutConnector.prototype.connectorClassName = 'audioOut';

AudioOutConnector.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	connector.module[connector.id] = this.module[this.id];
};