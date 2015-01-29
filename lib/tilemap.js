var Tilemap = function(){
	
}

Tilemap.prototype.width = 0
Tilemap.prototype.height = 0
Tilemap.prototype.tilesize = 8
Tilemap.prototype.tilecount = 0
Tilemap.prototype.tiles = []
Tilemap.prototype.img = null

Tilemap.prototype.draw = function(){
	// draw to the canvas
}

Tilemap.prototype.getTilesByTag = function(tag){
	return tiles.filter(function(element, index, array){
		return element.tags.indexOf(tag) > -1;
	})
}

// returns the tile { name , tags[] } at location (x,y)
Tilemap.prototype.getTile = function(x, y){
	return tiles[y * width + height];
}

Tilemap.prototype.addTag = function(x, y, tag){
	tiles[y * width + height].tags.push(tag);
}

Tilemap.prototype.removeTag = function(x, y, tag){
	var idx = y * width + height;
	tiles[idx].tags = tiles[idx].tags.filter(function(element){return element != tag;});
}

Tilemap.prototype.clearTags = function(x, y){
	tiles[y * width + height].tags = [];
}

Tilemap.prototype.setTags = function(x, y, tags){
	tiles[y * width + height].tags = tags;
}

Tilemap.prototype.load = function (srcJson) {
	
}

/*
	draw!!!!
	tags on tiles
	search by tags
	metadata on *tile images*
	? what image is at tile (x,y) ?

*/

Tilemap.prototype.draw = function(camera) {
	var size = window.sald.size;
	var minTile = {
		x: Math.floor(camera.x - (size.x / 2 / this.tilesize)) | 0,
		y: Math.floor(camera.y - (size.y / 2 / this.tilesize)) | 0
	};
	var maxTile = {
		x: Math.floor(camera.x + (size.x / 2 / this.tilesize)) | 0,
		y: Math.floor(camera.y + (size.y / 2 / this.tilesize)) | 0
	};

	for (var ty = minTile.y; ty <= maxTile.y; ++ty) {
		for (var tx = minTile.x; tx <= maxTile.x; ++tx) {
			var tileIdx = this.getTile(tx, ty);
			var ctx = window.sald.ctx;
			ctx.save();
			ctx.transform(1, 0, 0, -1, tx, ty + 1);
			ctx.drawImage(this.srcImage, tileIdx * this.tilesize, 0, this.tilesize, this.tilesize, 0, 0, 1, 1);
			ctx.restore();
		}
	}
}

module.exports = Tilemap;