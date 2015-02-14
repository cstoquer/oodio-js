/** Audio Out Connector
 *
 * @author Cedric Stoquer
 */
function AudioOutConnector(module, name, connector) {
	Connector.call(this, module, name, connector);
}
inherit(AudioOutConnector, Connector);
AudioOutConnector.prototype.connectorClassName = 'audioOut';

AudioOutConnector.prototype.connect = function (connector) {
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	connector.module[connector.name] = this.module[name];
};