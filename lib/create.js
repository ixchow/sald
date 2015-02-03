var fs = require('fs');
var path = require('path');


function createProj(dir) {
	var src = path.join(__dirname, '../template/proj');
	copyDir(src,dir);
}

function handleFile(file,srcDir,destDir) {
	var src = path.join(srcDir,file);
	var dest = path.join(destDir,file);

	fs.stat(src,function(err,stat) {
		if(err) {
			throw err;
		} else {
			if(stat.isDirectory()) {
				copyDir(src,dest);
			} else {
				copyFile(src,dest);
			}
		}
	});
}

function copyDir(src,dest) {
	fs.mkdir(dest,function(err,res) {
		if(err && err.errno != 47) { // dir already exists
			throw err;
		} else {
			fs.readdir(src,function(err,files) {
				if(err) {
					throw err;
				} else {
					for(var i = 0; i < files.length; i++) {
						handleFile(files[i],src,dest);
					}
				}
			});
		}
	});
}

function copyFile(src,dest) {
	fs.readFile(src,'utf8',function(err,data) {
		if(err) {
			throw err;
		} else {
			fs.writeFile(dest,data,'utf8',function(err) {
				if(err) throw err;
			});
		}
	});
}

module.exports = {
	create: createProj
};
