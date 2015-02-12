/** Event Connector
 *
 * @author Cedric Stoquer
 */
function EventConnector() {
	this._mod  = [];
	this._func = [];
	this._length = 0;
}

EventConnector.prototype.connect = function (mod, func) {
	this._mod.push(mod);
	this._func.push(func);
	this._length++;
};

EventConnector.prototype.emit = function (value) {
	for (var i = 0; i < this._length; i++) {
		var mod = this._mod[i];
		mod[this._func[i]].apply(mod, value);
	}
};