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
