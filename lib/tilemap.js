var Tilemap = function(){
	
}

module.exports.prototype.width = 0
module.exports.prototype.height = 0
module.exports.prototype.tilesize = 8
module.exports.prototype.tilecount = 0
module.exports.prototype.tiles = []
module.exports.prototype.img = null

module.exports.prototype.draw = function(){
	// draw to the canvas
}

module.exports.prototype.getTilesByTag = function(tag){
	return tiles.filter(function(element, index, array){
		return element.tags.indexOf(tag) > -1;
	})
}

// returns the tile { name , tags[] } at location (x,y)
module.exports.prototype.getTile = function(x, y){
	return tiles[y * width + height];
}

module.exports.prototype.addTag = function(x, y, tag){
	tiles[y * width + height].tags.push(tag);
}

module.exports.prototype.removeTag = function(x, y, tag){
	var idx = y * width + height;
	tiles[idx].tags = tiles[idx].tags.filter(function(element){return element != tag;});
}

module.exports.prototype.clearTags = function(x, y){
	tiles[y * width + height].tags = [];
}

module.exports.prototype.setTags = function(x, y, tags){
	tiles[y * width + height].tags = tags;
}

/*
	draw!!!!
	tags on tiles
	search by tags
	metadata on *tile images*
	? what image is at tile (x,y) ?

*/