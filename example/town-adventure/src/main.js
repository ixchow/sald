
var mainloop = require('sald:mainloop.js');

sald.size = {x:320, y:240, mode:"multiple"};
sald.scene = require('town.js');

window.main = function main() {
	mainloop.start(document.getElementById("canvas"));
	// window.Tilemap = Tilemap;
};
