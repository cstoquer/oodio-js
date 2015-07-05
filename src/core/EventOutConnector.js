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
	// TODO: check connector type
	Connector.prototype.connect.call(this, connector);

	this._mod.push(connector.module);
	this._func.push(connector.id);
	this._length++;
};

EventOutConnector.prototype.disconnect = function (connector) {
	var index = this._mod.indexOf(connector.module);
	if (index === -1) return console.error('Could not disconnect EventConnector', this, connector);
	this._mod.splice(index, 1);
	this._func.splice(index, 1);
	this._length--;
};

EventOutConnector.prototype.emit = function (value) {
	for (var i = 0; i < this._length; i++) {
		var mod = this._mod[i];
		mod[this._func[i]].call(mod, value);
	}
};