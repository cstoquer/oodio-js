/** Event Out Connector
 *
 * @author Cedric Stoquer
 */
function EventOutConnector(module) {
	this.module = module;

	this._mod    = [];
	this._func   = [];
	this._length = 0;

	this._dom = createDom('connector eventOut', module._dom);
}

/*EventOutConnector.prototype.connect = function (mod, func) {
	this._mod.push(mod);
	this._func.push(func);
	this._length++;
};*/

EventOutConnector.prototype.connect = function (connector) {
	// TODO: check connector type

	this._mod.push(connector.module);
	this._func.push(connector.functionName);
	this._length++;
};

EventOutConnector.prototype.emit = function (value) {
	for (var i = 0; i < this._length; i++) {
		var mod = this._mod[i];
		mod[this._func[i]].apply(mod, value);
	}
};