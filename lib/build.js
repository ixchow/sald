var dependencies = require('./dependencies.js');
var transforms = require('./transforms.js');
var path = require('path');
var fs = require('fs');

var buildParams = require(path.join(process.cwd(), 'build.js'));

function build() {
	var deps = dependencies.parse();

	var template = fs.readFileSync(path.join(__dirname, '../template/build.js'), 'utf8');
	var stringifiedDeps = [];

	for (var dep in deps) {
		if (!deps.hasOwnProperty(dep)) continue;
		stringifiedDeps.push("'" + dep + "' : function(module) {\n" + deps[dep] + "}");
	}

	template = template.replace('{{snippets}}', stringifiedDeps.join(',\n'));
	var normEntryPath = path.join(process.cwd(), buildParams.entry.js);
	template = template.replace('{{entry}}', normEntryPath);

	var html = fs.readFileSync(buildParams.entry.html, 'utf8');
	var script = "<script>\n" + template + "\n</script>"
	html = html.replace(/\<\s*scripts\s*\/\>|\<\s*scripts\s*\>\s*\<\s*\/scripts\s*\>/gm,script);
	fs.writeFileSync(buildParams.output.html,html);
}

module.exports = {
	compile: build
}