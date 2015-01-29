var Tilemap = function(srcJson){
	this.load(srcJson);
}

Tilemap.prototype.width = 0
Tilemap.prototype.height = 0
Tilemap.prototype.tilesize = 8
Tilemap.prototype.tilecount = 0
Tilemap.prototype.tiles = []
Tilemap.prototype.img = null

Tilemap.prototype.getTilesByTag = function(tag){
	var ret = [];
	for (var r = 0; r < height; r++)
	{
		for (var c = 0; c < width; c++)
		{
			var idx = r * width + c;
			if (tiles[idx].tags.indexOf(tag) > -1)
			{
				ret.push({x: c, y: r, tile: tiles[idx]});
			}
		}
	}
	return ret;
}

// returns the tile { name , tags[] } at location (x,y)
Tilemap.prototype.getTile = function(x, y){
	return tiles[y * width + x];
}

Tilemap.prototype.addTag = function(x, y, tag){
	tiles[y * width + x].tags.push(tag);
}

Tilemap.prototype.removeTag = function(x, y, tag){
	var idx = y * width + x;
	tiles[idx].tags = tiles[idx].tags.filter(function(element){return element != tag;});
}

Tilemap.prototype.clearTags = function(x, y){
	tiles[y * width + x].tags = [];
}

Tilemap.prototype.setTags = function(x, y, tags){
	tiles[y * width + x].tags = tags;
}

Tilemap.prototype.load = function (srcJson) {
	var fields = ["width", "height", "tilesize", "tilecount", "tiles", "img"];
	for (var i = 0; i < fields.length; i++) {
		this[fields[i]] = srcJson[fields[i]];
	}
}

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
			ctx.drawImage(this.img, tileIdx * this.tilesize, 0, this.tilesize, this.tilesize, 0, 0, 1, 1);
			ctx.restore();
		}
	}
}

module.exports = Tilemap;