var mainloop = require('sald:mainloop.js');

sald.size = {x:320, y:240, mode:"ratio"};
sald.scene = {
	update:function(elapsed) {
		this.fade = (this.fade + elapsed) % 1.0;
		this.blink *= Math.pow(0.5, elapsed / 0.7);
	},
	draw:function() {
		var ctx = sald.ctx;
		ctx.setTransform(1,0, 0,1, 0,0);

		var amt = Math.sin(this.fade * Math.PI * 2.0) * 0.5 + 0.5;
		var r = amt * 0.2 + 0.2;
		var g = 0.1 + 0.9 * this.blink;
		var b = amt * 0.4 + 0.3;
		ctx.fillStyle = 'rgb(' + ((r * 256.0) | 0) + ', ' + ((g * 256.0) | 0) + ', ' + ((b * 256.0) | 0) + ')';
		ctx.fillRect(0,0, ctx.width, ctx.height);
	},
	key:function(key, down) {
		if (key === "SPACE" && down) {
			this.blink = 1.0;
		}
	},
	mouse:function(pos, button, down) {
		//Mouse handling.
	},
	fade:0.0,
	blink:0.0
};

window.main = function main() {
	mainloop.start(document.getElementById("canvas"));
};
