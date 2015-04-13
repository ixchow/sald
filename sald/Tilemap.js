var Tilemap = function(img, map, tilW, tilH, tilR, tilC, defaultTile){
	this.load(img, map, tilW, tilH, tilR, tilC, defaultTile);
}
// VARIABLES
// width of one tile in pixels
Tilemap.prototype.tilewidth = 8;
// height of one tile in pixels
Tilemap.prototype.tileheight = 8;
// rows of tiles in the source image
Tilemap.prototype.tilerows = 0;
// columns of tiles in the source image
Tilemap.prototype.tilecols = 0;
// array that represents the position of the tiles in game map
Tilemap.prototype.map = [];
// URL for the tilemap source image
Tilemap.prototype.img = null;
// Col location of default tile in Tilemap
Tilemap.prototype.defaultTileX = 0;
// Row location of default tile in Tilemap
Tilemap.prototype.defaultTileY = 0;
// Column offset {x : xOffset, y : yOffset};
Tilemap.prototype.columnOffset = null;

// FUNCTIONS
// runs through tilemap, returns array of tiles with given tag
Tilemap.prototype.getTilesByTag = function(tag){
	var ret = [];
	for (var r = 0; r < this.mapheight; r++)
	{
		for (var c = 0; c < this.mapwidth; c++)
		{
			var idx = r * this.width + c;
			if (this.map[idx].tags.indexOf(tag) > -1)
			{
				ret.push({x: c, y: r, tile: this.map[idx]});
			}
		}
	}
	return ret;
}

// returns the tile { name , tags[] , xidx, yidx} at location (x,y)
Tilemap.prototype.getTile = function(x, y){
	return this.map[y][x];
}
// adds a tag to the tile at x, y in the map
Tilemap.prototype.addTag = function(x, y, tag){
	this.map[y][x].tags.push(tag);
}
// removes a tag from a tile at (x, y) in the map
Tilemap.prototype.removeTag = function(x, y, tag){
	this.map[y][x].tags = this.map[idx].tags.filter(function(element){return element != tag;});
}
// removes all tags from a tile at (x, y) in the map
Tilemap.prototype.clearTags = function(x, y){
	this.map[(y * this.mapwidth) + x].tags = [];
}
// replaces array of tags with new array of tags on the map
Tilemap.prototype.setTags = function(x, y, tags){
	this.map[y][x].tags = tags;
}

// enables isometric tile drawing mode
Tilemap.prototype.enableIso = function(x, y){
	if((x === 0 && y === 0) || x < -this.tilewidth || y > this.tileheight) {
		console.log("Incorrect isometric offsets");
	} else {
		this.columnOffset = {x:x, y:y};
		console.log(this.columnOffset);
	}
}

Tilemap.prototype.isIso = function () {
	return this.columnOffset !== null;
}

// initialization function, called on Tilemap object creation
Tilemap.prototype.load = function (img, map, tilW, tilH, tilR, tilC, defaultTile) {
    this.img = img;
    this.map = map;
    for(var r = 0; r < this.map.length; r++){
        for(var c = 0; c < this.map[r].length; c++){
            var idx = this.map[r][c];
            var x = idx % tilC;
            var y = Math.floor(idx / tilC);
            
            this.map[r][c] = {xidx:x, yidx:y};
        }
    }
    this.tilewidth = tilW;
    this.tileheight = tilH;
    this.tilerows = tilR;
    this.tilecols = tilC;
	this.defaultTileX = defaultTile % tilC;
	this.defaultTileY = Math.floor(defaultTile/tilC);
}

function roundToZero(number){
	if (number > 0){
		return Math.floor(number);
	} else {
		return Math.ceil(number);
	}
}

// Converts screen position to world position
Tilemap.prototype.getWorldPos = function(pos){
	// return [cVec rVec] * [world] = [screen]
	return {x:(pos.x * this.tilewidth) / (this.tilewidth + this.columnOffset.x), y:(pos.y * this.tileheight) / (this.tileheight + this.columnOffset.y)};
}

Tilemap.prototype.getScreenPos = function(pos){

}

// draws current tiles in view
// assume camera is in corect tile units when in iso mode
Tilemap.prototype.draw = function(camera) {
	var size = window.sald.size;

	var centerX; 
	var centerY;
	var topLeftTile;
	var numRowsOnScreen;
	var numColsOnScreen;

	// Proccess camera pos
	if (this.isIso()){
		var isoTileWidth = this.tilewidth + this.columnOffset.x;
		var isoTileHeight = this. tileheight + this.columnOffset.y;

		// convert camera units to isometric camera units
		// now assume units already converted?
		//camera.x = (camera.x * this.tilewidth) / (this.tilewidth + this.columnOffset.x);
		//camera.y = (camera.y * this.tileheight) / (this.tileheight + this.columnOffset.y);

		centerX = (camera.x * isoTileWidth);
		centerY = (camera.y * isoTileHeight);

		// get topLeftTile, which in isoMode is not directly to the left and up
		// as rows are now slanted and thus diagonal
		topLeftTile = {
			col: Math.floor(camera.x - (size.x/isoTileWidth/ 2) - 1),
			row: Math.floor(camera.y + (size.y/isoTileHeight/ 2))
		};

		numRowsOnScreen = Math.ceil(size.y / this.tileheight) + 2;
		numColsOnScreen = Math.ceil(size.x / isoTileWidth) + 4;

		// var angle = Math.atan2(this.columnOffset.y, this.columnOffset.x + this.tilewidth);

		// var sin = Math.sin(angle);

		// var vertical = this.tileheight * (1 - sin);;
		// var horizontal = isoTileWidth;
	} else {
		topLeftTile = {
			col: Math.floor(camera.x - ((size.x/this.tilewidth) / 2) - 1),
			row: Math.floor(camera.y + ((size.y/this.tileheight) / 2))
		};

		numRowsOnScreen = Math.ceil(size.y / this.tileheight) + 1;
		numColsOnScreen = Math.ceil(size.x / this.tilewidth) + 2;
	}

	// gets context
	var ctx = window.sald.ctx;

	// Starting at the topLeftTile, draw the number of tiles on screen
	for (var rowCount = 0; rowCount < numRowsOnScreen; rowCount++) {
		for (var colCount = 0; colCount < numColsOnScreen; colCount++) {
			
			var screenX = 0;
			var screenY = 0;

			// Convert rowCount,y to row,col
			var tileRow = topLeftTile.row - rowCount;
			var tileCol = topLeftTile.col + colCount;

			// Only do this if dealing with isometrism
			if (this.isIso()) {
				if (this.columnOffset.y !== 0) {
					screenY = (this.columnOffset.y * (colCount + topLeftTile.col)) / this.tileheight;
				}

				if (this.columnOffset.x !== 0) {
					screenX = (this.columnOffset.x * (colCount + topLeftTile.col)) / this.tilewidth;
				}
			}

			var xidx = null;
			var yidx = null;

			if (tileRow >= 0 && tileRow < this.map.length &&
				tileCol >= 0 && tileCol < this.map[tileRow].length) {
				// Determines tile index in tilemap
				var tile = this.getTile(tileCol, tileRow);
				xidx = tile.xidx;
				yidx = tile.yidx;
            } else {
                xidx = this.defaultTileX;
                yidx = this.defaultTileY;
            }

			ctx.save();
			ctx.transform(1, 0, 0, -1, tileCol, tileRow + 1);
			
			// Draws tile on screen
			ctx.drawImage(this.img, xidx * this.tilewidth, yidx * this.tileheight, this.tilewidth, this.tileheight, screenX, screenY, 1, 1);
			ctx.restore();
			
		}
	}
}

module.exports = Tilemap;