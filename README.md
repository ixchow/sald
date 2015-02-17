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
By default, Sald handles transformations for common types, like `.js`, `.json`, `.png`, `.jpg`, `.wav`, `.ogg`. You may override these with your own handlers if you wish. All other filetypes will need a handler implemented in this `build.js`.

Sald can also handle `colon`ical transforms, specified like `gradient:#000-#fff`, for which you must specify a function which generates a JS block that exports the expected return value.

Each transform can also take the object form `{canonicalFunc: aFunc, tranformFunc: bFunc}`, where `bFunc` is what you used before, and `aFunc` is used to determine the canonical name of the parameter. This is used to ensure there is no duplication of resolved `require`s in the final output html file. If the transform is not in this object form, then a default canonical function is assumed (direct string comparison for `colon`icals, and normalized path comparison for file extension types).

###Example build.js
```
function gradientCanon(param) {
  // some conversion here
  // ex: 'black-white' will be converted to '#000-#fff'
  return convertedString;
}

function gradientTransform(param) {
  // some external imagemagick call
  return 'var img = new Image(); img.src = ' + base64Data + '; module.exports = img;';
}

function unownCanon(filepath, rootpath) {
  // rootpath is the name of the folder where the require is called. Useful for relative require parsing, using _path.join_
  canonicalName = someTransformation();
  return canonicalName;
}

function unownLoader(filepath) {
  // filepath passed is the resule of unownCanon
  var someJsTxt = something //your loader
  return 'module.exports = ' + someJsTxt;
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
  transforms : {
    'gradient:': {
      canonicalFunc: gradientCanon,
      transformFunc: gradientTransform
    },
    '.unown': { // If a custom canonicalization is needed
      canonicalFunc: unownCanon,
      transformFunc: unownLoader
    },
    '.unown': unownLoader // If no custom canonicalization is needed for this type
};
```

This build.js file now knows what to do with a `require('../pokedex/pokemon87.unown');` or `require('gradient:black-white')`.


##Libraries

- [mainloop.js](sald/mainloop.js) [docs](docs/mainloop.md) provides a basic mainloop.
- [benchmark.js](sald/benchmark.js) [docs](docs/benchmark.md) contains utility functions for benchmarking.
- [collide.js](sald/collide.js) [docs](docs/collide.md) contains collision checking functions.
- [Sprite.js](sald/Sprite.js) [docs](docs/Sprite.md) is a class that wraps spritesheets and makes it easy to select frames and animations.
- [Tilemap.js](sald/Tilemap.js) [docs](docs/Tilemap.md) is a class that wraps maps made of image tiles.
