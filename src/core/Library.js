/** Library
 *
 * @author Cedric Stoquer
 */
function Library() {
	this.dom = document.getElementById('library');
}

window.library = new Library();

Library.prototype.register = function(module) {
	var dom = createDom('menuEntry', this.dom);
	dom.textContent = module.prototype.description_moduleName;
	dom.addEventListener('mousedown', function clic(e) {
		window.moduleManager.add(new module());
	});
};