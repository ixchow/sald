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


##Libraries

- [mainloop.js](sald/mainloop.js) [docs](docs/mainloop.md) provides a basic mainloop.
- [benchmark.js](sald/benchmark.js) [docs](docs/benchmark.md) contains utility functions for benchmarking.
- [collide.js](sald/collide.js) [docs](docs/collide.md) contains collision checking functions.
- [Sprite.js](sald/Sprite.js) [docs](docs/Sprite.md) is a class that wraps spritesheets and makes it easy to select frames and animations.
- [Tilemap.js](sald/Tilemap.js) [docs](docs/Tilemap.md) is a class that wraps maps made of image tiles.
