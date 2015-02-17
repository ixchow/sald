var path = require('path');
var defaults = require('./default_transforms');
var build;

try {
	build = require(path.join(process.cwd(), 'build.js'));
} catch (err) {
	switch(err.code) {
		case 'MODULE_NOT_FOUND':
			console.err('build.js not found, please ensure build.js is in cwd');
			break;
		default:
			console.error(err); break;
	}
	process.exit(1);
}

var transforms = defaults;

function canonicalString(s) {
	return s;
}

function canonicalFilepath(f, root) {
	return path.normalize(path.join(path.dirname(root), f));
}

var overrides = build.transforms;

for (var prop in overrides) {
	if (overrides.hasOwnProperty(prop)) {
		transforms[prop] = overrides[prop];
	}

}

for (var prop in transforms) {
	if (typeof({}) != typeof(transforms[prop])) {
		canonicalFunc = prop.match(/.*:.*/) ? canonicalString : canonicalFilepath;
		transforms[prop] = {
			transformFunc: transforms[prop],
			canonicalFunc: canonicalFunc
		}
	}
}

module.exports = transforms;