var path = require('path');
var fs = require('fs');

function loadJavascript(filename) {
	return fs.readFileSync(filename, 'utf8');
}

function loadFileGeneric(filepath, encoding) {
	return fs.readFileSync(filepath, encoding);
}

function loadJSON(filepath) {
	return 'module.exports = ' + loadFileGeneric(filepath, 'utf8') + ';';
}

function loadShader(filename) {
	//hack-y "make this a valid js string literal for use between single quotes":
	function escapeString(str) {
		str = str.replace(/\\/g, '\\\\');
		str = str.replace(/\n/g, '\\n');
		str = str.replace(/'/g, "\\'");
		return str;
	}

	var vertexFilename = filename.substr(0, filename.length - 5) + ".vs.glsl";
	var fragmentFilename = filename.substr(0, filename.length - 5) + ".fs.glsl";

	var vertexText = fs.readFileSync(vertexFilename, 'utf8');
	var fragmentText = fs.readFileSync(fragmentFilename, 'utf8');
	if (typeof(vertexText) !== "string") {
		throw new Error("Missing vertex shader file (" + vertexFilename + ") for shader " + filename);
	} else if (typeof(fragmentText) !== "string") {
		throw new Error("Missing fragment shader file (" + fragmentFilename + ") for shader " + filename);
	}

	var ret = "Shader = require('sald:Shader.js');\n"
		+ "module.exports = new Shader('" + escapeString(vertexText) + "', '" + escapeString(fragmentText) + "');";
	return ret;
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
		return 'module.exports = new Audio("data:audio/' + mimeType + ';' + encoding + ',' + loadFileGeneric(file, encoding) + '");';
	}
}

function saldManagement(param) {
	var libPath = path.join(__dirname, "../sald/", param);
	return fs.readFileSync(libPath, 'utf8');
}

module.exports = {
	'.js': loadJavascript,
	'.glsl': loadShader,
	'.jpg': loadImageGeneric('jpg'),
	'.png': loadImageGeneric('png'),
	'.ogg': loadAudioGeneric('ogg'),
	'.wav': loadAudioGeneric('vnd.wave'),
	'.json': loadJSON,
	'sald:': saldManagement
}
