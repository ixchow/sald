#Tilemap.js Usage

##Require Tilemap.js in your code
```
var Tilemap = require('sald:Tilemap.js');
```  

##Initilize Tilemap library using load
Initilize Tilemap with correct parameters.
```
Tilemap(img, map, tilW, tilH, tilR, tilC, mapW, mapH, )
  img  = tilemap image
  map  = 2d map of which location to draw which tile
  tilW = pixel width of individual tile
  tilH = pixel height of individual tile 
  tilR = Width of tilemap in terms of tiles
  tilC = Height of tilemap in terms of tiles
  mapW = Width of world map
  mapH = Height of world map
  defaultTile = Number of tile to be draw when outside of map
```

##Drawing
Tilemap.draw(camera) takes in a object that has properties x & y which defines the center of the map to draw from. Call it after updates to tilemap or camera for redraw.
```
camera = {x : 0, y : 0}
  x = x index location in the 2d world map that was pased to Tilemap
  y = y index location in the 2d world map that was pased to Tilemap
```

##Isometric
To draw isometric tiles, developers will have to provide a tilemap with skewed tiles. Then set the columnOffset paramter of Tilemap. 
```
Tilemap.columnOffset = {x : xOffset, y : yOffset}
  x = pixels to offset to the right
  y = pixels to offset down
```

