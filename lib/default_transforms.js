var path = require('path');
var fs = require('fs');

function loadJavascript(filename) {
	return fs.readFileSync(filename, 'utf8');
}

function canonicalFilepath(filepath, root) {
	return path.normalize(path.join(root, filepath));
}

function loadFileGeneric(filepath, encoding) {
	return fs.readFileSync(filepath, encoding);
}

function loadJSON(filepath) {
	return 'module.exports = ' + loadFileGeneric(filepath, 'utf8') + ';';
}

function loadImageGeneric(mimeType, encoding) {
	if (encoding == undefined) encoding = 'base64';
	return function loadImage(file) {
		var script = [
			'var img = new Image();',
			'img.src = "data:image/' + mimeType + ';' + encoding + ',' + loadFileGeneric(file, encoding) + '";',
			'module.exports = img;'
		].join('\n');
		return script;
	}
}

function loadAudioGeneric(mimeType, encoding) {
	if (encoding == undefined) encoding = 'base64';
	return function loadAudio(file) {
		return 'module.exports = new Audio("data:audio/' + mimeType + ';' + encoding + ',' + file.data + '");';
	}
}

function saldManagement(param) {
	var libPath = path.join(__dirname, "../sald/", param);
	return fs.readFileSync(libPath, 'utf8');
}

module.exports = {
	'.js': loadJavascript,
	'.jpg': loadImageGeneric('jpg'),
	'.png': loadImageGeneric('png'),
	'.ogg': loadAudioGeneric('ogg'),
	'.wav': loadAudioGeneric('vnd.wave'),
	'.json': loadJSON,
	'sald:': saldManagement
}