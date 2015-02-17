#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
/* the above is a work-around for node being called 'nodejs' on debian */

var cmd = process.argv.length > 2 ? process.argv[2] : '';

var usage = [
	'sald [command] arg1,...',
	'\tcommands',
	'\t\tnew/create - create a new sald engine project',
	'\t\tbuild - build sald project in working directory'
].join('\n');

switch(cmd) {
	case "build":
		var compiler = require('../lib/build.js');
		compiler.compile();
		break;
	case "new":
	case "create":
		var dir = './';
		if(process.argv.length > 3) {
			dir = process.argv[3];
		}
		var create = require('../lib/create.js');
		create.create(dir);
		break;
	default:
		console.log(usage);
		break;
}
