/** Performances
 *
 * @author Cedric Stoquer
 */
function Performance() {
	this.started = performance.now();
	this.now     = performance.now();
	this.cycles  = 0;
	this.total   = 0;
	this.id      = null;

	var dom  = document.createElement('div');
	document.getElementsByTagName('body')[0].appendChild(dom);
	dom.className = 'module performance';
	dom.textContent = 'CPU: ----';
	this.dom = dom;
}

Performance.prototype.sample = function (startTime) {
	this.cycles++;
	this.total += performance.now() - startTime;
};

Performance.prototype.start = function (interval) {
	var t = this;
	t.started = performance.now();
	t.now     = performance.now();
	t.cycles  = 0;
	t.total   = 0;
	if (t.id !== null) return;
	interval = interval || 2000;
	t.id  = window.setInterval(function () {
		t.now = performance.now();
		var elapsed = t.now - t.started;
		var load = 100 * t.total / elapsed;
		t.dom.textContent = 'CPU:' + load.toFixed(2) + '%';
		// var average = t.total / t.cycles;
		// console.log('----------------------------');
		// console.log('elapsed:  ' + elapsed + ' ms');
		// console.log('computed: ' + t.total + ' ms');
		// console.log('load:     ' + (100 * t.total / elapsed) + ' %');
		// console.log('cycles:   ' + t.cycles);
		// console.log('average:  ' + average + ' ms/cycle');
	}, interval);
	return t;
};

Performance.prototype.stop = function () {
	if (this.id === null) return console.error('Performance is not running.');
	window.clearInterval(this.id);
	this.id = null;
};
