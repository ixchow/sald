var Tilemap = function(img, map, tilW, tilH, tilR, tilC, mapW, mapH, defaultTile){
	this.load(img, map, tilW, tilH, tilR, tilC, mapW, mapH, defaultTile);
}
// VARIABLES
// width of the onscreen map in tiles
Tilemap.prototype.mapwidth = 0;
// height of the onscreen map in tiles
Tilemap.prototype.mapheight = 0;
// width of one tile in pixels
Tilemap.prototype.tilewidth = 8;
// height of one tile in pixels
Tilemap.prototype.tileheight = 8;
// rows of tiles in the source image
Tilemap.prototype.tilerows = 0;
// columns of tiles in the source image
Tilemap.prototype.tilecols = 0;
// array that represents the position of the tiles in game map takes in a 2D array
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
	return this.map[(y * this.mapwidth) + x];
}
// adds a tag to the tile at x, y in the map
Tilemap.prototype.addTag = function(x, y, tag){
	this.map[(y * this.mapwidth) + x].tags.push(tag);
}
// removes a tag from a tile at (x, y) in the map
Tilemap.prototype.removeTag = function(x, y, tag){
	var idx = (y * this.mapwidth) + x;
	this.map[idx].tags = this.map[idx].tags.filter(function(element){return element != tag;});
}
// removes all tags from a tile at (x, y) in the map
Tilemap.prototype.clearTags = function(x, y){
	this.map[(y * this.mapwidth) + x].tags = [];
}
// replaces array of tags with new array of tags on the map
Tilemap.prototype.setTags = function(x, y, tags){
	this.tiles[(y * this.width) + x].tags = tags;
}

// initialization function, called on Tilemap object creation
Tilemap.prototype.load = function (img, map, tilW, tilH, tilR, tilC, mapW, mapH, defaultTile) {
    this.img = img;
    for(var i = 0; i < mapH; i++){
        for(var j = 0; j < mapW; j++){
            //given map should be 2D array with format for mapW=4, mapH=4
            /*[[1, 2, 3, 4],
               [5, 6, 7, 8]
               [9,10,11,12]
               [13,14,15,16]]*/
            var idx = map[i][j];
            var x = idx % tilC;
            var y = Math.floor(idx / tilR);
            
            this.map[(i * mapW) + j] = {xidx:x, yidx:y};
        }
    }
    this.tilewidth = tilW;
    this.tileheight = tilH;
    this.tilerows = tilR;
    this.tilecols = tilC;
    this.mapwidth = mapW;
    this.mapheight = mapH;
	this.defaultTileX = defaultTile % tilC;
	this.defaultTileY = Math.floor(defaultTile/tilR);
}

function roundToZero(number){
	if (number > 0){
		return Math.floor(number);
	} else {
		return Math.ceil(number);
	}
}

// draws current tiles in view
Tilemap.prototype.draw = function(camera) {
	var size = window.sald.size;

	function hasCustomColumnOffset(columnOffset){
		if (columnOffset === null
			|| (columnOffset.x === 0 
			 && columnOffset.y === 0)) return false;
		
		return true;
	}

	var topLeftTile;

	// Correct camera units to isometric dimensions
	if (this.columnOffset !== null
		&& this.columnOffset.x !== -this.tilewidth 
		&& this.columnOffset.y !== -this.tileheight){
		camera.x = (camera.x * this.tilewidth) / (this.tilewidth + this.columnOffset.x);


		topLeftTile = {
			col: Math.floor(camera.x - ((size.x/(this.tilewidth + this.columnOffset.x)) / 2) - 1),
			row: Math.floor(camera.y + ((size.y/this.tileheight) / 2))
		};
		// Converting the units breaks the bounding box, keep this commented out
		camera.y = (camera.y * this.tileheight) / (this.tileheight + this.columnOffset.y);
	} else {
		topLeftTile = {
			col: Math.floor(camera.x - ((size.x/this.tilewidth) / 2) - 1),
			row: Math.floor(camera.y + ((size.y/this.tileheight) / 2))
		};
	}
	// TODO probably need isometric specific code for this
	var maxPixel = {
		x: Math.ceil(camera.x + (size.x / 2)),
		y: Math.ceil(camera.y + (size.y / 2))
	};

	var numRowsOnScreen;
	var numColsOnScreen;
	var yOffset;

	var switchRowsAndCols = false;

	if (this.columnOffset !== null && !(this.columnOffset.x === 0 && this.columnOffset.y === 0)){
		yOffset = this.columnOffset.y;

		var numColsDenom = this.columnOffset.x + this.tilewidth;

		numRowsOnScreen = Math.ceil(size.y / this.tileheight) + 2;
		numColsOnScreen = Math.ceil(size.x / numColsDenom) + 4;

		var angle = Math.atan2(this.columnOffset.y, this.columnOffset.x + this.tilewidth);

		var sin = Math.sin(angle);

		var vertical = this.tileheight * (1 - sin);;
		var horizontal = this.columnOffset.x + this.tilewidth;

	} else {
		yOffset = 0;

		numRowsOnScreen = Math.ceil(size.y / this.tileheight) + 1;
		numColsOnScreen = Math.ceil(size.x / this.tilewidth) + 2;
	}

	// gets context
	var ctx = window.sald.ctx;
	var perspectiveDelta;

	var startingRow;

	if (this.columnOffset != null){

		/* cols have an expected tilewidth offset in the x direction, 
		 * and an expected 0 offset vertically
		*/
		var xDelta = this.columnOffset.x;
		var yDelta = this.columnOffset.y;

		perspectiveDelta = {x: xDelta, y: yDelta};

		startingRow = -1;
	} else {
		perspectiveDelta = {x: 0, y: 0};
		startingRow = 0;
	}

	/* Starting at the topLeftTile, draw the number of tiles on screen in a green
	 */
	for (var row = startingRow; row < numRowsOnScreen; row++){
		for (var col = 0; col < numColsOnScreen; col++){
			var dRow;

			var dRowF = 0;
			var dColF = 0;

			/* Only do this if dealing with isometrism
			 */
			if (hasCustomColumnOffset(this.columnOffset)){
				if (this.tileheight === 0){
					dRow = 0;
				} else {
					dRowF = (yOffset * (col + topLeftTile.col)) / this.tileheight;
					dRow = roundToZero(dRowF);

					if (this.columnOffset.x === 0){
						dColF = 0;
					} else {
						dColF = (this.columnOffset.x * (col + topLeftTile.col)) / this.tilewidth;
					}
				}
			} else {
				dRow = 0;
			}

			var tileRow = topLeftTile.row - row + dRow;
			var tileCol = topLeftTile.col + col;

			var xidx = null;
			var yidx = null;

			if (tileRow >= 0 && tileRow < this.mapheight &&
				tileCol >= 0 && tileCol < this.mapwidth)
			{
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
			ctx.drawImage(this.img, xidx * this.tilewidth, yidx * this.tileheight, this.tilewidth, this.tileheight, dColF, dRowF, 1, 1);
			ctx.restore();
			
		}
	}
}

module.exports = Tilemap;