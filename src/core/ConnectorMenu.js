/** Connector Menu
 *
 * @author Cedric Stoquer
 */
function ConnectorMenu() {
	this.dom = document.getElementById('connectorMenu');
	this.selected = null;
}

window.connectorMenu = new ConnectorMenu();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ConnectorMenu.prototype.show = function (e, connector) {
	var t = this;

	t.selected = connector;

	t.dom.style.left = Math.max(0, e.clientX - 10) + 'px';
	t.dom.style.top  = Math.max(0, e.clientY - 10) + 'px';
	t.dom.style.display = 'block';

	function menuOut() {
		t.dom.style.display = 'none';
		t.dom.removeEventListener('mouseout', menuOut);
		t.selected = null;
	}

	t.dom.addEventListener('mouseout', menuOut);
}