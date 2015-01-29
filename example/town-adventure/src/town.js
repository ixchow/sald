
var PlayerSpeed = 4.0; //tiles per second

var heroImgs = [
	require("../img/hero1.png"),
	require("../img/hero2.png"),
	require("../img/hero3.png")
];

var Tilemap = require('sald:tilemap.js');

var tilemap = new Tilemap(require('../tilemaps/pita.json'));

//camera position (in tiles):
var camera = {
	x: 4.5,
	y: 5.5
};

//player position (in tiles):
var player = {
	x: 4.5,
	y: 5.5,
	frameAcc: 0.0,
	frame: 0,
};


function draw() {
	var ctx = sald.ctx;

	//First, clear the screen:
	ctx.setTransform(ctx.factor,0, 0,ctx.factor, 0,0);
	ctx.fillStyle = "#f0f"; //bright pink, since this *should* be drawn over

	ctx.fillRect(0, 0, 320, 240); //<--- hardcoded size. bad style!

	//don't interpolate scaled images. Let's see those crisp pixels:
	ctx.imageSmoothingEnabled = false;

	//Now transform into camera space:
	//  (units are tiles, +x is right, +y is up, camera is at the center:
	ctx.setTransform(
		//x direction:
			ctx.factor * tilemap.tilesize, 0,
		//y direction (sign is negative to make +y up):
			0,-ctx.factor * tilemap.tilesize,
		//offset (in pixels):
			ctx.factor * (320 / 2 - Math.round(camera.x * tilemap.tilesize)),
			ctx.factor * (240 / 2 + Math.round(camera.y * tilemap.tilesize)) //<-- y is added here because of sign flip
		);
	
	tilemap.draw(camera);

	//draw the player:
	(function draw_player() {
		var img = heroImgs[player.frame];
		ctx.save();
		//locally flip the 'y' axis since images draw with upper-left origins:
		ctx.transform(1,0, 0,-1,
			Math.round(player.x * tilemap.tilesize - 0.5 * img.width) / tilemap.tilesize,
			Math.round(player.y * tilemap.tilesize - 0.5 * img.height) / tilemap.tilesize + 1
			);
		ctx.drawImage(img,
			0, 0, img.width, img.height,
			0,0,1,1);
		ctx.restore();
	})();

	//rounded corners:
	ctx.setTransform(ctx.factor,0, 0,ctx.factor, 0,0);
	ctx.fillStyle = "#452267"; //background color of page
	ctx.fillRect(0,0, 1,2);
	ctx.fillRect(1,0, 1,1);

	ctx.fillRect(0,238, 1,2);
	ctx.fillRect(1,239, 1,1);

	ctx.fillRect(319,0, 1,2);
	ctx.fillRect(318,0, 1,1);

	ctx.fillRect(319,238, 1,2);
	ctx.fillRect(318,239, 1,1);
	

}

function update(elapsed) {
	var keys = sald.keys;

	var command = {
		x:0.0,
		y:0.0
	};
	//First column is 'wasd', second is arrow keys:
	if (keys[65] || keys[37]) command.x -= 1.0;
	if (keys[68] || keys[39]) command.x += 1.0;
	if (keys[83] || keys[40]) command.y -= 1.0;
	if (keys[87] || keys[38]) command.y += 1.0;
	
	if (command.x != 0.0 || command.y != 0.0) {
		var len = Math.sqrt(command.x * command.x + command.y * command.y);
		command.x /= len;
		command.y /= len;

		player.x += command.x * PlayerSpeed * elapsed;
		player.y += command.y * PlayerSpeed * elapsed;

		//alternate player frames 1 and 2 if walking:
		player.frameAcc = (player.frameAcc + (elapsed * PlayerSpeed) / 0.3) % 2;
		player.frame = 1 + Math.floor(player.frameAcc);
	} else {
		//player is stopped:
		player.frame = 0;
	}

	//pan camera if player is within 3 tiles of the edge:
	camera.x = Math.max(camera.x, player.x - (320 / tilemap.tilesize / 2 - 3));
	camera.x = Math.min(camera.x, player.x + (320 / tilemap.tilesize / 2 - 3));
	camera.y = Math.max(camera.y, player.y - (240 / tilemap.tilesize / 2 - 3));
	camera.y = Math.min(camera.y, player.y + (240 / tilemap.tilesize / 2 - 3));

}

function key(key, state) {
	//don't do anything
}


module.exports = {
	draw:draw,
	update:update,
	key:key
};
