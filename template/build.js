var modCache = {};
var mods = {
{{snippets}}
}
function require(s) {
	if(modCache[s] == null) {
		modCache[s] = {exports:{}};
		mods[s](modCache[s]);
		return modCache[s].exports;
	} else {
		return modCache[s].exports;
	}
}
require("{{entry}}");
