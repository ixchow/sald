
function Shader(vertText, fragText) {
	this.vertText = vertText;
	this.fragText = fragText;
	if (window.sald && window.sald.gl) {
		this.compile();
	} else {
		if (typeof(window.sald) === "undefined") {
			window.sald = {};
		}
		if (typeof(window.sald.initFuncs === "undefined")) {
			window.sald.initFuncs = [];
		}
		var me = this;
		window.sald.initFuncs.push(function() {
			me.compile();
		});
	}
};

Shader.prototype.compile = function Shader_compile() {
};

module.exports = Shader;
