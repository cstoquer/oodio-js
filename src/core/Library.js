/** Library
 *
 * @author Cedric Stoquer
 */
function Library() {
	this.dom = document.getElementById('library');
}

var library = new Library();

Library.prototype.register = function(module) {
	var dom = createDom('menuEntry', this.dom);
	dom.textContent = module.prototype.description_moduleName;
	dom.addEventListener('mousedown', function clic(e) {
		moduleManager.add(new module());
	});
};