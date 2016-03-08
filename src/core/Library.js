/** Library
 *
 * @author Cedric Stoquer
 */
function Library() {
	this.dom  = document.getElementById('library');
	this.menu = createDiv('libraryHeader', this.dom);
	this.modules = createDiv('libraryList', this.dom);
}

window.library = new Library();

Library.prototype.register = function(module) {
	var button = createDiv('moduleEntry', this.modules);
	button.textContent = module.prototype.description_moduleName;
	button.addEventListener('mousedown', function clic(e) {
		window.moduleManager.add(new module());
	});
};