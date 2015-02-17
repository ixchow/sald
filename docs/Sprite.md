#Sprite Library

-> Create a new sprite object in your game scene file like below

var sprite = require('sald:Sprite.js');
var heroImg = require('../img/spritesheet.png'); 

All the spritesheet objects to be animated have to be strictly defined as below: 

var heroSprite = new sprite(heroImg, {
	'walk' : {
		x:0,y:0,
		width:40,height:60,
		size:4
	},
	'run' : {
		x:0,y:60,
		width:40,height:60,
		size:4
	}
})

The first parameter is the spritesheet image, heroImg in this case is the entire spritesheet image with several different animation frames within it. The second parameter has to be a list of animations by name along with x, y, width, height and size properties.

[x,y represent the indexes in pixel coordinates of start row and column of animation from the spritesheet image]
[width,height represent the width and height of each sprite in pixel size, you can check the same in paint for image width and height in pixels]
[size is the max number of frames till which that animation needs to be played from the spritesheet image]

A note about proper sprite splicing: The x and y properties above are what the engine will ultimately use to splice the individual sprites from the sprite sheet. x is the horizontal offset, while y is the vertical offset (with 0,0 representing the top-left corner of the image). There are two things to keep in mind when dealing with pixel coordinates. One - if you truly wish to have well defined and proportional sprites, it helps if the pixel width is divisible by the number of columns and the pixel height is divisible by the number of rows. Otherwise you risk them being clipped at weird positions. Two - If you wish to start cutting from the middle of a sprite sheet and not from the far left, you'll need to make sure that you're providing the top-left corner of the sprite you wish to start at (not the center of the sprite).

-> The draw function takes the following arguments: 
  * anim: animation name
  * x: x position in world space
  * y: y position in world space
  * scalex: x scale of sprite
  * scaley: y scale of sprite
  * anchorx: x anchor value (0-1)
  * anchory: y anchor value (0-1)

  Usage: Call the draw function inside the update loop.
  			sprite.draw(anim, x, y, )

You do not need to give the frame number in draw function anymore because it is handled by a framework called Animators inside the Sprite object.
  When you initialize a Sprite object, each animation of sprite gets an animator object attached to it internally which handles the state of the animation.
  It also provides neat features like animation speed, looping functionality and stop feature.

  After creating your sprite, you can call these functions to access animators and its functions:

  	sprite.animators[<animation-name>].loop(boolean);
  		- The boolean here can be true or false depending upon whether you want to loop the animation or not 

  	sprite.animators[<animation-name>].speed(speed);
  		- The 'speed' has to be in frames/second.
  		- It is optional. Default is 60 frames/second.

  	sprite.animators[<animation-name>].stop();
  		- This function is used to stop the animation from running. And resets that animation's the state. (Can be changed, just a design decision)
