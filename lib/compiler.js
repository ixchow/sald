var fs = require('fs');
var path = require('path');
var build;

try {
	build = require(path.join(process.cwd(),'build.js'));
}
catch (err) {
	switch(err.code) {
		case 'MODULE_NOT_FOUND':
			console.log('build.js not found, please unsure build.js is in cwd');
			break;
		default:
			console.log(err);
			break;
	}
	process.exit();
}

/*
 * findDeps - Find dependencies for the specified file
 * fileName: name of file to parse
 * deps: accumulator of dependencies
 * cb: callback function with args (err,deps)
 */
function findDeps(fileName,deps,cb) {
	deps[fileName] = true;

	//If path isn't a js file, don't parse it looking for dependencies:
	if (path.extname(fileName) !== '.js') {
		cb(null,deps);
	}

	fs.readFile(fileName, {encoding:'utf8'}, function(err,src) {

		// File read error
		if(err) {
			cb(err,deps);
			return;
		}

		// Filter out comments
		src = src.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '');

		// Match `require('*')` or `require("*")`
		var reqRegExp = /require\s*\((?:\s*"[^"]*"|'[^']*'\s*)\)\s*/gm;
		var reqs = src.match(reqRegExp);

		// Exit if no requires
		if(!reqs) {
			cb(null,deps);
			return;
		}

		// Remove extract fileName
		var stringRegExp = /"(.*)"|'(.*)'/;
		var fileNames = reqs.map(function(req) {
			var res = req.match(stringRegExp);
			var file = res[1] || res[2];
			if(!file) {
				var arg = req.match(/require\s*\(\s*(.*)\s*\)\s*;/);
				cb(new Error("`" + arg[1] + "` is not a string literal."),deps);
			}
			return res[1] || res[2];
		});

		// Resolve path
		var dir = fs.statSync(fileName).isDirectory() ? fileName : path.dirname(fileName);
		fileNames = fileNames.map(function(file) {
			if (file.substr(0,5) === "sald:") {
				return path.join(__dirname, "../sald/", file.substr(5));
			} else {
				return path.join(dir,file);
			}
		});

		// Remove already found dependencies
		fileNames = fileNames.filter(function(file) {
			return !deps[file];
		});

		// Remove duplicate files
		fileNames = fileNames.filter(function(file,index) {
			return fileNames.indexOf(file) == index;
		});

		// Start recursively loading dependencies
		if(fileNames.length == 0) {
			cb(null,deps);
		} else {
			var inserted = 0;
			for(var i = 0; i < fileNames.length; i++) {
				findDeps(fileNames[i],deps,function(err,deps) {
					if(err || ++inserted == fileNames.length) {
						cb(err,deps);
					}
				});
			}
		}
	});
}

/*
 * loadDeps - load the file dependencies of the project
 * deps: object mapping required files to the value true
 * cb: callback function with args (err,files)
 */
function loadDeps(deps,cb) {
	var files = [];

	// Create array of files to load
	for(var dep in deps) {
		files.push({name: dep});
	}

	// Asynchronously load each file
	var inserted = 0;
	for(var i = 0; i < files.length; i++) {
		var ext = path.extname(files[i].name);
		var encoding = build.files[ext] ? build.files[ext].encoding || 'utf8' : 'utf8';

		// Read the file
		fs.readFile(files[i].name,encoding,function(index,err,data) {
			if(err) {
				cb(err);
			} else {
				files[index].data = data;
				// Call the callback if every dependency has been compiled
				if(++inserted == files.length) {
					cb(err,files);
				}
			}
		}.bind(null,i));
	}
}

/*
 * transformDeps - transform required files based on build.js file
 * files: list of objects with properties name and data, for the file name and payload
 * cb: callback function with args (err,files)
 */
function transformDeps(files,cb) {
	for(var i = 0; i < files.length; i++) {
		var file = files[i];
		var ext = path.extname(file.name);

		if(build.files[ext] && build.files[ext].load) {
			file.data = build.files[ext].load(file);
		}
	}
	cb(null,files);
}

/*
 * buildSnippets - transform required files into the js snippets that will be
 *  compiled into one js file
 * scripts: javascript to be turned into snippets
 * cb: callbackfunction with args (err,snippets)
 */
function buildSnippets(scripts,cb) {
	var snippets = scripts.map(function(file) {
		// Match `require('*')` or `require("*")`
		var reqRegExp = /require\s*\((?:\s*"[^"]*"|'[^']*'\s*)\)\s*/gm;
		var reqs = file.data.match(reqRegExp);

		if(reqs) {
			var dir = fs.statSync(file.name).isDirectory() ? file.name : path.dirname(file.name);
			for(var i = 0; i < reqs.length; i++) {
				var stringRegExp = /"(.*)"|'(.*)'/;
				var res = reqs[i].match(stringRegExp);
				var depName = res[1] || res[2];

				if (depName.substr(0,5) === "sald:") {
					depName = path.join(__dirname, "../sald/", depName.substr(5));
				} else {
					depName = path.join(dir,depName);
				}

				file.data = file.data.replace(reqs[i],"require('" + depName + "')");
			}
		}

		return "'" + file.name + "' : function(module) {\n" + file.data + "}"
	});
	cb(null,snippets);
}

/*
 * buildScript - combine snippets with build.js template to create final js script
 * snippets: js snippets to be combined
 * cb: callback function with args (err,js)
 */
function buildScript(snippets,cb) {

	fs.readFile(path.join(__dirname,'../template/build.js'),'utf8',function(err,js) {
		if(err) {
			cb(err);
		} else {
			snippets = snippets.map(function(code) {
				return code.split('\n').map(function(line,index) {
					if(index == 0) {
						return '  ' + line;
					} else {
						return '    ' + line;
					}
				}).join('\n');
			});
			js = js.replace("{{snippets}}",snippets.join(',\n'));
			js = js.replace("{{entry}}",build.entry.js);
			cb(err,js);
		}
	});
}

/*
 * buildHTML - inject script and write final html file
 * js: javascript to inject
 * cb: callabck with args (err)
 */
function buildHTML(js,cb) {
	fs.readFile(build.entry.html,{encoding:'utf8'},function(err,html) {
		var script = "<script>\n" + js + "\n</script>"
		html = html.replace(/\<\s*scripts\s*\/\>|\<\s*scripts\s*\>\s*\<\s*\/scripts\s*\>/gm,script);
		fs.writeFile(build.output.html,html,cb);
	});
}

/*
 * asyncChainErr - execute a chain of async functions where each passes the next
 *  a single arg, with error handling between each link in the chain
 * chain: array of async files
 */
function asyncChainErr(chain) {
	var index = 0;
	function cb(err,arg) {
		if(err) {
			throw err;
		} else if(++index < chain.length) {
			chain[index](arg,cb);
		}
	}
	chain[0](cb);
}

/*
 * buildProj - run full build
 */
function buildProj() {
	asyncChainErr([
		findDeps.bind(null,build.entry.js,{}),
		loadDeps,
		transformDeps,
		buildSnippets,
		buildScript,
		buildHTML
	]);
}

module.exports = {
	compile: buildProj,
	findDeps: findDeps,
	loadDeps: loadDeps,
	transformDeps: transformDeps,
	buildSnippets: buildSnippets,
	buildScript: buildScript,
	buildHTML: buildHTML
};
