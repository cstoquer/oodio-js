var BUFFER_LENGTH = 4096;
var SAMPLE_RATE   = 44100;
var CONTROL_RATE  = SAMPLE_RATE / 64;

var MODULE_WIDTH  = 152;
var MODULE_HEIGHT = 16;
var CONNECTOR_GRID_SIZE = 15;

// creating CSS class for module size accordingly to constants
(function createModuleSizeStyle() {
	var cssStyle = document.createElement('style');
	cssStyle.type = 'text/css';
	var w = MODULE_WIDTH - 2; // border is 1px, hence the -2
	for (var i = 1; i < 10; i++) {
		var h = MODULE_HEIGHT * i - 2;
		var rules = document.createTextNode('.x' + i + ' { width: ' + w + 'px; height: ' + h + 'px; }');
		cssStyle.appendChild(rules);
		document.getElementsByTagName('head')[0].appendChild(cssStyle);
	}
})()
