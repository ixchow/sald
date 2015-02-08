#sald
##Installation
Fork this repo into desired location then from command line run
```
npm link
```
Note: sudo may be required on Mac or Linux, or the command prompt may need to be
run as administrator on Windows.

Note: The current version of node.js for windows has a bug. If you receive an
ENOENT error, check [here](http://stackoverflow.com/questions/25093276/node-js-windows-error-enoent-stat-c-users-rt-appdata-roaming-npm)
##
##Usage
```
sald [command] args
  commands
    new/create [dir] - create a new sald project
    build - build sald project in cwd based on build.js
```
You will want to use `sald create myProjName` to create a starter project. It is not
recommended to do this in the sald directory.
##build.js
The build.js file must be in the current working directory when calling sald build.
This file should export an object which specifies the output location, entry point, and the method for handling custom file types.

###Example build.js
```
// Load an image file from file = {name,data}
function loadImage(file) {
  var script = [
    'var img = new Image();',
    'img.src = "data:' + this.mime + ';' + this.encoding + ',' + file.data + '";',
    'module.exports = img;'
  ].join('\n');
  return script;
}

// Load an audio file from file = {name,data}
function loadAudio(file) {
  return 'module.exports = new Audio("data:' + this.mime + ';' + this.encoding + ',' + file.data + '");';
}

// Export build options
module.exports = {
  // Entry point for build
  entry :  {
    js : 'src/main.js',       //the script to be called
    html : 'src/main.html'    //will be used as template for final output
  },
  // Output options
  output : {
    html : 'build.html'  //location to output final built project
  },
  // Options for each file type
  files : {
    '.jpg' : {
      mime : 'image/jpg',   // mime type, used by loadImage
      encoding : 'base64',  // encode type, used by sald, defaults to utf8
      load: loadImage       // function which translates to node-style javascript
                            // should be of type {name,data} -> string
    },
    '.png' : {
      mime : 'image/png',
      encoding : 'base64',
      load: loadImage
    },
    '.ogg' : {
      mime : 'audio/ogg',
      encoding : 'base64',
      load: loadAudio
    },
    '.wav' : {
      mime : 'audio/vnd.wave',
      encoding : 'base64',
      load: loadAudio
    }
  }
};
```

This build.js file will translate png and jpg images using loadImage and wav and ogg files using loadAudio.


##mainloop.js
SALD provides a basic mainloop. To use, attach to a canvas with `mainloop.start( )`:
```
var mainloop = require('sald:mainloop.js');

//configure size and callbacks:
sald.size = {x:320, y:240, mode:"exact"};
sald.scene = myScene;

//call this once the page has loaded:
mainloop.start(document.getElementById("canvas"));
```

The mainloop module uses the following properties in the `sald` namespace:

###Canvas

`sald.size` configures the desired canvas size and resizing behavior:

If `mode` is not specified, or is `"exact"`, size is set exactly in pixels:
```
sald.size = {x:320, y:240}; 
sald.size = {x:320, y:240, mode:"exact"};
```

If `mode` is `"multiple"`, canvas size will be an integer multiple of the given size.
This is good for pixel-art games, or games that want an exact aspect ratio:
```
sald.size = {x:320, y:240, mode:"multiple"}; //pixel art game with 320x240 canvas
sald.size = {x:16, y:9, mode:"multiple"}; //game wants to be exactly 16x9 aspect
```

If `mode` is `"ratio"`, canvas size will be an rounded, non-integer multiple of the size.
This is good for games that just want an approximate aspect ratio:
```
sald.size = {x:1, y:1, mode:"ratio"}; //square canvas
sald.size = {x:16, y:9, mode:"ratio"}; //16x9-ish, might not be exact due to rounding
```

<hr />

`sald.ctx` is the drawing context associated with the canvas. SALD adds some extra properties:

```
sald.ctx.width //current width
sald.ctx.height //current height
sald.ctx.factor //scaling factor relative to sald.size
```

One generally uses `ctx.factor` to set the `ctx`'s transform to allow working in "virtual pixels":
```
sald.size = {x:320, y:240, mode:"multiple"}; //canvas will be some multiple of 320x240
function draw() {
	var ctx = sald.ctx;

	//scale to account for pixel size:
	ctx.setTransform(ctx.factor,0, 0,ctx.factor, 0,0);

	//draw full-screen pink rectangle:
	ctx.fillStyle = "#f0f"; //bright pink
	ctx.fillRect(0, 0, 320, 240); //<-- working in pixel units

}
```

###Input

`sald.keys` contains the names of every held-down key. (Key names are specified in mainloop.js .)
```
function update(elapsed) {
	var keys = sald.keys;
	if (keys.LEFT) player.x -= 10.0 * elapsed;
	if (keys.RIGHT) player.x += 10.0 * elapsed;
}
```

<hr />

`sald.mouse` contains the position (in pixels from the upper-left corner of the canvas) and held-down buttons for the mouse. NOTE: `mouse === null` if no mouse events have happened yet.
```
function update(elapsed) {
	var mouse = sald.mouse;
	if (mouse && mouse.buttons.LEFT) {
		console.log("Left button held down; currently at " + mouse.x + ", " + mouse.y + ".");
	}
}
```

###Callbacks

The `sald.scene` object holds callbacks used by the mainloop to define custom update, draw, and event handlers. You can package handlers together and assign to scene all at once, or assign each function individually.

The `sald.scene.update` function is called with the current elapsed time. You can use it to update game state.
The `sald.scene.draw` function is called once per frame. It should draw the current game state into `sald.ctx`.

Considering the Model-View-Controller paradigm, the update function should update the model, while the draw function should update the view.

```
function update(elapsed){
  // elapsed is a float measure of how many seconds have passed since the last update
}

sald.scene.update = update;

function draw(){
  // draw whatever should be on the screen, using sald.ctx
}

sald.scene.draw = draw;
```

<hr />

The `sald.scene.key` function is called every time a key is pressed or released:

```
function key(keyName, isPressed){
	if (keyName === "SPACE" && isPressed) {
		console.log("You pressed space.");
	}
}

window.sald.scene.key = key;
```
NOTE: On a Mac, `sald.keys.WINDOWS` is the "Command" key.

<hr />

The `sald.scene.mouse` function is called whenever a mouse button is pressed or the mouse moves:
```
function mouse(position, buttonName, isPressed) {
	if (buttonName === undefined) {
		//just movement
	} else {
		if (buttonName === "MIDDLE") {
			console.log("Middle button " + (isPressed ? "down" : "up") + ".");
		}
	}
}
sald.scene.mouse = mouse;
```
NOTE: when the mouse is moved, this function will be called with `buttonName` and `isPressed` undefined.

NOTE 2: `sald.takeRightClickInput` (default: true) can be set to false to allow right click events to open the context menu as expected.

<hr />

The `sald.scene.wheel` function handles scroll wheel events:
```
function wheel(delta) {
}
sald.scene.wheel = wheel;
```
NOTE: if not defined, scroll events will scroll the page as usual.
