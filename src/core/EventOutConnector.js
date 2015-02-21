/** Event Out Connector
 *
 * @author Cedric Stoquer
 */
function EventOutConnector(module, id, connectorDescription) {
	Connector.call(this, module, id, connectorDescription);

	this._mod    = [];
	this._func   = [];
	this._length = 0;
}
inherit(EventOutConnector, Connector);
EventOutConnector.prototype.connectorClassName = 'eventOut';
EventOutConnector.prototype.color = ROOT.COLOR.EVENT;

EventOutConnector.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	// TODO: check connector type

	this._mod.push(connector.module);
	this._func.push(connector.id);
	this._length++;
};

EventOutConnector.prototype.emit = function (value) {
	for (var i = 0; i < this._length; i++) {
		var mod = this._mod[i];
		mod[this._func[i]].apply(mod, value);
	}
};