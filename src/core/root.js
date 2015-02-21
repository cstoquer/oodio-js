var ROOT = {
	UNPLUGGED:  [0.0],
	MAIN_OUT_L: [0.0],
	MAIN_OUT_R: [0.0]
};

var canvas = document.getElementById('cableCanvas');
canvas.height = window.innerHeight; 
canvas.width  = window.innerWidth;
canvas.style.width  = canvas.width  + 'px';
canvas.style.height = canvas.height + 'px';
var ctx = canvas.getContext('2d');

ctx.lineCap       = 'round';
ctx.shadowColor   = '#000';
ctx.shadowBlur    = 4;
ctx.lineWidth     = 3;
ctx.shadowOffsetX = 2; 
ctx.shadowOffsetY = 2;