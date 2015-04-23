# GameObject Usage

GameObjects can be used to define characters and objects in the game world which can collide. GameObject.js can be viewed [here](../sald/GameObject.js)

##Usage
###Require GameObject.js in your code
```
var GameObject = require('sald:GameObject.js');
```
Following which you, you can create new instances of GameObject.
Note, by default a game object has a rectangular collider from its top left corner (x, y) to the bottom right corner (x + width, y + height).

If you want to override this default behavior, pass 0 for width or 0 for height on initialization.

Use GameObject as follows:

###Example
```
var x = 0;
var y = 0;
var width = 20;
var height = 60;
var anchor = { x : 0, y : 0 }; // this is the top left corner, which happens by default {x : 1, y : 1} is the bottom right corner

var player = new GameObject(x, y, width, height);

// is the same as

var player2 = new GameObject(x, y, width, height, { x : 0, y : 0 });
```

##Custom Collision Shapes

If you want the collision shape to be different, you can change it. For example:

```
...

var player1 = new GameObject(x, y, width, height, anchor);

...


// A circle with radius 20, 120 pixels in on the x axis, 40 pixels in on the y axis from the anchor
// r : radius, x : x position of center, y : y position of center
var circle = {
	r : 20,
	x : 120,
	y : 40,
};

// A circle at the center of the defined GameObject which will, if the anchor is at {x : 0, y : 0} (which is the default behavior)
var relativeCircle = {
	r : 0.5, // r is relative to the GameObject's width
	x : 0.5,
	y : 0.5
}

// min : top left corner, max : bottom right corner
var rectangle = {
	min : {
		x : 20,
		y : 20
	},
	max : {
		x : 80,
		y : 60
	}
};

var relativeRectangle = {
	min : {
		x : 0,
		y : 0
	},
	max : {
		x : 0.5,
		y : 0.5
	}
}

// a list of {x, y} points listed in Counter Clockwise order which form a convex polygon.
var convexPolygon = [
	{x : 20, y : 20},
	{x : 10, y : 30},
	{x : 20, y : 40},
	{x : 30, y : 30}
];

player1.setCollisionRect(rectangle, false);

player2.setCollisionRect(relativeRectangle, true);

player3.setCollisionCircle(circle, false);

player4.setCollisionCircle(relativeCircle, true);

player5.setCollisionConvex(convexPolygon, false);
```

## Specifications

GameObject.js supports collisions between Convex Polygons, Circles, and Rectangles.
Any two of the listed shapes can collide with each other. (circle/circle, rectangle/circle, etc.)

```
if (player.isColliding(ball)){
	// decide what happens when the objects are colliding
}
```

You can also retrieve the collision shape as follows:

```
var shape = player.collisionShape();
```

Shape will be null if there is no collider, otherwise it will be a json object containing a key that is either "rect", "circle", or "convex", and the value will be the collision object.

The returned object will not be relative to the objects width and height, but rather absolute, in order to compute collisions with the collision library should you want to add extra functionality (see ray collisions).
