var Tilemap = function(img, map, tilW, tilH, tilR, tilC, mapW, mapH){
	this.load(img, map, tilW, tilH, tilR, tilC, mapW, mapH);
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
	return this.map[y * this.mapwidth + x];
}
// adds a tag to the tile at x, y in the map
Tilemap.prototype.addTag = function(x, y, tag){
	this.map[y * this.mapwidth + x].tags.push(tag);
}
// removes a tag from a tile at (x, y) in the map
Tilemap.prototype.removeTag = function(x, y, tag){
	var idx = y * this.mapwidth + x;
	this.map[idx].tags = this.map[idx].tags.filter(function(element){return element != tag;});
}
// removes all tags from a tile at (x, y) in the map
Tilemap.prototype.clearTags = function(x, y){
	this.map[y * this.mapwidth + x].tags = [];
}
// replaces array of tags with new array of tags on the map
Tilemap.prototype.setTags = function(x, y, tags){
	this.tiles[y * this.width + x].tags = tags;
}

// initialization function, called on Tilemap object creation
Tilemap.prototype.load = function (img, map, tilW, tilH, tilR, tilC, mapW, mapH) {
	this.img = img;
	var imgSrc = this.img;
	this.img = new Image();
	this.img.src = imgSrc;
	for(var i = 0; i < mapH; i++){
		for(var j = 0; j < mapW; j++){
			//given map should be 2D array with format for mapW=4, mapH=4
			/*[[1, 2, 3, 4],
			   [5, 6, 7, 8]
			   [9,10,11,12]
			   [13,14,15,16]]*/
			this.map[(i * mapW) + j] = map[i][j];
		}
	}
	this.tilewidth = tilW;
	this.tileheight = tilH;
	this.tilerows = tilR;
	this.tilecols = tilC;
	this.mapwidth = mapW;
	this.mapheight = mapH;
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

	var minPixel = {
		x: Math.floor(camera.x - (size.x / 2)),
		y: Math.floor(camera.y - (size.y / 2))
	};
	var maxPixel = {
		x: Math.ceil(camera.x + (size.x / 2)),
		y: Math.ceil(camera.y + (size.y / 2))
	};

 //	//calculates minimum tile to show
	// var minTile = {
	// 	x: Math.floor(camera.x - (size.x / 2 / this.tilewidth)) | 0,
	// 	y: Math.floor(camera.y - (size.y / 2 / this.tileheight)) | 0
	// };
 //	// calculates maximum tile to show
	// var maxTile = {
	// 	x: Math.floor(camera.x + (size.x / 2 / this.tilewidth)) | 0,
	// 	y: Math.floor(camera.y + (size.y / 2 / this.tileheight)) | 0
	// };

	var numRows;
	var numCols;

	var minTile;

	var yOffset;

	var switchRowsAndCols = false;

	if (this.columnOffset != null){
		yOffset = this.columnOffset.y;

		numRows = ceil(size.y / yOffset);
		numCols = ceil(size.x / this.columnOffset.x);

		var angle = Math.atan2(this.columnOffset.y, this.columnOffset.x);

		var sin = Math.sin(angle);

		var vertical;
		var horizontal;

		if (abs(sin) > 0.5){
			// invert rows and cols in way to draw
			sin = 1 - sin;
			switchRowsAndCols = true;

			vertical = this.columnOffset.y;
			horizontal = this.tilewidth * (1 - sin);
		} else {
			vertical = this.tileheight * (1 - sin);
			horizontal = this.columnOffset.x;
		}

		// var horizontal = this.tilewidth * sin;

		minTile = {
			row: floor(minPixel.y / vertical,
			col: floor(minPixel.x / horizontal)
		};

	} else {
		yOffset = 0;

		numRows = ceil(size.y / this.tileheight);
		numCols = ceil(size.x / this.tilewidth);

		minTile = {
			row: floor(minPixel.x / this.tilewidth),
			col: floor(minPixel.y / this.tileheight)
		};
	}

	// gets context
	var ctx = window.sald.ctx;

	var perspectiveDelta;

	if (this.columnOffset != null){
		/* cols have an expected tilewidth offset in the x direction, 
		 * and an expected 0 offset vertically
		*/
		var xDelta = this.columnOffset.x - this.tilewidth;
		var yDelta = this.columnOffset.y;

		perspectiveDelta = {x: xDelta, y: yDelta};
	} else {
		perspectiveDelta = {x: 0, y: 0};
	}

	for (var row = 0; row < numRows; row++){
		for (var col = 0; col < numCols; col++){
			var dRow;
			var dCol;

			if (switchRowsAndCols){
				dRow = 0;
				dCol = roundToZero((yOffset*col) / this.tileheight);
			} else {
				dRow = roundToZero((yOffset*col) / this.tileheight);
				dCol = 0;
			}

			var tileRow = minTile.row + row + dRow;
			var tileCol = minTile.col + col + dCol;

			var xidx = null;
			var yidx = null;

			if (tileRow >= 0 && tileRow < this.mapheight &&
				tileCol >= 0 && tileCol < this.mapwidth)
			{
				// determines tile index in tilemap
				xidx = this.getTile(tx, ty).xidx;
				yidx = this.getTile(tx, ty).yidx;

				ctx.save();
				ctx.transform(1, 0, 0, -1, tx, ty + 1);
				// draws tile on screen
				var x;
				var y;

				x = xidx * (this.tilewidth + perspectiveDelta.x);
				y = yidx * (this.tileheight + perspectiveDelta.y);
				
				ctx.drawImage(this.img, x, y, this.tilewidth, this.tileheight, 0, 0, 1, 1);
				ctx.restore();
			}
		}
	}
}

module.exports = Tilemap;