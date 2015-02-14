/** Audio In Connector
 *
 * @author Cedric Stoquer
 */
function AudioInConnector(module, name, connector) {
	Connector.call(this, module, name, connector);
}
inherit(AudioInConnector, Connector);
AudioInConnector.prototype.connectorClassName = 'audioIn';

AudioInConnector.prototype.connect = function (connector) {
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	this.module[name] = connector.module[connector.name];
};

