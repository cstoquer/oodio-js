var ROOT = {
	UNPLUGGED:  [0.0],
	MAIN_OUT_L: [0.0],
	MAIN_OUT_R: [0.0],
	COLOR: {
		NONE:    '#777E81',
		AUDIO:   '#ED4A4A',
		KONTROL: '#4257E7',
		EVENT:   '#E0D133'
	}
};

function resizeCanvas(canvas) {
	canvas.height = window.innerHeight; 
	canvas.width  = window.innerWidth;
	canvas.style.width  = canvas.width  + 'px';
	canvas.style.height = canvas.height + 'px';
}

var canvas  = document.getElementById('cableCanvas');
var overlay = document.getElementById('overlayCanvas');
var ctx     = canvas.getContext('2d');
var overCtx = overlay.getContext('2d');

resizeCanvas(canvas);
resizeCanvas(overlay);

ctx.lineCap         = 'round';
ctx.shadowColor     = '#000';
ctx.shadowBlur      = 3;
ctx.lineWidth       = 3;
ctx.shadowOffsetX   = 1; 
ctx.shadowOffsetY   = 1;

overCtx.lineWidth   = 1;
overCtx.strokeStyle = '#444';
overCtx.lineCap     = 'butt';
overCtx.setLineDash([2, 2]);

