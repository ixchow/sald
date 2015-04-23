# Collision Detection Library

The collision library is used to test collisions between various shapes. The compiled collide.js can be viewed [here](../sald/collide.js)

##Usage
###Require collide.js in your code
```
var col = require('sald:collide.js');
```
Following which you can use any of the functions suported by the collision library as follows:
###Example
```
if (col.rectangleRectangle(Rect1, Rect2)) {	//Check collision between Rect1 and Rect2
				//If they collide then do something
			}
```

## Specifications

The collide.js currently supports 6 collision detection functions as follows:

* Circle vs Circle
* Rectangle vs Rectangle
* Polygon vs Polygon {Convex}
* Ray vs Circle
* Ray vs Rectangle
* Ray vs Convex Polygon

##Shapes

Circle
```javascript
{
	x: the x coordinate of the center of the circle
	y: the y coordinate of the center of the circle
	r: the radius of the circle
}
```

Rectangle
```javascript
{
	min : {
		x: the minimum x coordinate of the rectangle
		y: the minimum y coordinate of the rectangle
	},
	max: {
		x: the maximum x coordinate of the rectangle
		y: the maximum y coordinate of the rectangle
	}
}
```

Polygon
```javascript
[
	{
		x: the x coordinate of a vertex in the polygon
		y: the y coordinate of a vertex in the polygon
	}
	...
]
```

Ray
```javascript
{
	start: {
		x: x coordinate of the start of the ray
		y: y coordinate of the start of the ray
	},
	end: {
		x: x coordinate of the end of the ray
		y: y coordinate of the end of the ray
	}
}
```
##Functions

`function rectangleRectangle(r1,r2)`
###Description
Check to see if r1 and r2 overlap

###Parameters
| Param | Shape     | Description                                                         |
|-------|-----------|---------------------------------------------------------------------|
| r1    | Rectangle | First rectangle to check                                            |
| r2    | Rectangle | Second rectangle to check                                           |

###Returns
`bool` true if r1 and r2 overlap, otherwise false

`function rayRectangle(r,b)`
###Description
Check to see if r intersetcts b, and return where if it does

###Parameters
| Param | Shape     | Description                                                         |
|-------|-----------|---------------------------------------------------------------------|
| r     | Ray       | Ray to check for intersection                                       |
| b     | Rectangle | Rectangle being intersected                                         |

###Returns
`null` if there is no intersection<br>
`{t: t}` if there is an intersection at (r.start + (r.end - r.start)*t)

`function circleCircle(c1,c2)`
###Description
Check to see if c1 and c2 overlap

###Parameters
| Param | Shape     | Description                                                         |
|-------|-----------|---------------------------------------------------------------------|
| c1    | Circle    | First circle to check                                               |
| c2    | Circle    | Second circle to check                                              |

###Returns
`bool` true if c1 and c2 overlap, otherwise false

`function rayCircle(r,c)`
###Description
Check to see if r intersetcts c, and return where if it does

###Parameters
| Param | Shape     | Description                                                         |
|-------|-----------|---------------------------------------------------------------------|
| r     | Ray       | Ray to check for intersection                                       |
| c     | Circle    | Circle being intersected                                            |

###Returns
`null` if there is no intersection<br>
`{t: t}` if there is an intersection at (r.start + (r.end - r.start)*t)

`function convexConvex(p1, p2)`
###Description
Check to see if p1 and p2 (Convex Polygons) overlap

###Parameters
| Param | Shape     | Description                                                         |
|-------|-----------|---------------------------------------------------------------------|
| p1    | Polygon   | First polygon to check                                              |
| p2    | Polygon   | Second polygon to check                                             |

###Returns
`bool` true if c1 and c2 overlap, otherwise false

`function rayConvex(r,p)`
###Description
Check to see if r intersetcts p (Convex Polygon), and return where if it does

###Parameters
| Param | Shape     | Description                                                         |
|-------|-----------|---------------------------------------------------------------------|
| r     | Ray       | Ray to check for intersection                                       |
| p     | Polygon   | Polygon being intersected                                            |

###Returns
`null` if there is no intersection<br>
`{t: t}` if there is an intersection at (r.start + (r.end - r.start)*t)
