if (typeof(window.sald) === "undefined") {
	window.sald = {};
}

//Just 'require'-ing this file installs several useful global properties:
window.sald.scene = {}; //the current scene; update, draw, scrollWheel,  and key functions will be called.
window.sald.ctx = null; //the drawing context, call canvas 2d functions here
window.sald.size = {x:320, y:240, mode:"exact"}; //set your desired size here
window.sald.keys = {}; //all keys currently held down (named by strings below)
window.sald.mouse = null; //mouse information {x:, y:, buttons:}
window.sald.takeRightClickInput = true; //should right mouse button trigger events?

var keyNameToCode = {
	"BACKSPACE": 8,
	"TAB": 9,
	"ENTER": 13,
	"SHIFT": 16,
	"CONTROL": 17,
	"ALT": 18,
	"PAUSE": 19,
	"CAPS_LOCK": 20,
	"ESCAPE": 27,
	"SPACE": 32,
	"PAGE_UP": 33,
	"PAGE_DOWN": 34,
	"END": 35,
	"HOME": 36,
	"LEFT": 37,
	"UP": 38,
	"RIGHT": 39,
	"DOWN": 40,
	"INSERT": 45,
	"DELETE": 46,
	"ZERO": 48,
	"ONE": 49,
	"TWO": 50,
	"THREE": 51,
	"FOUR": 52,
	"FIVE": 53,
	"SIX": 54,
	"SEVEN": 55,
	"EIGHT": 56,
	"NINE": 57,
	"A": 65,
	"B": 66,
	"C": 67,
	"D": 68,
	"E": 69,
	"F": 70,
	"G": 71,
	"H": 72,
	"I": 73,
	"J": 74,
	"K": 75,
	"L": 76,
	"M": 77,
	"N": 78,
	"O": 79,
	"P": 80,
	"Q": 81,
	"R": 82,
	"S": 83,
	"T": 84,
	"U": 85,
	"V": 86,
	"W": 87,
	"X": 88,
	"Y": 89,
	"Z": 90,
	"WINDOWS": 91,
	"NUMPAD_0": 96,
	"NUMPAD_1": 97,
	"NUMPAD_2": 98,
	"NUMPAD_3": 99,
	"NUMPAD_4": 100,
	"NUMPAD_5": 101,
	"NUMPAD_6": 102,
	"NUMPAD_7": 103,
	"NUMPAD_8": 104,
	"NUMPAD_9": 105,
	"NUMPAD_ASTERISK": 106,
	"NUMPAD_MULTIPLY": 107,
	"NUMPAD_MINUS": 109,
	"NUMPAD_PERIOD": 110,
	"NUMPAD_DIVIDE": 111,
	"F1": 112,
	"F2": 113,
	"F3": 114,
	"F4": 115,
	"F5": 116,
	"F6": 117,
	"F7": 118,
	"F8": 119,
	"F9": 120,
	"F10": 121,
	"F11": 122,
	"F12": 123,
	"NUM_LOCK": 144,
	"SCROLL_LOCK": 145,
	"MY_COMPUTER": 182,
	"MY_CALCULATOR": 183,
	"SEMICOLON": 186,
	"EQUALS": 187,
	"COMMA": 188,
	"MINUS": 189,
	"PERIOD": 190,
	"FORWARD_SLASH": 191,
	"TILDE": 192,
	"OPEN_BRACKET": 219,
	"BACK_SLASH": 220,
	"CLOSE_BRACKET": 221,
	"APOSTROPHE": 222
};

var buttonNameToCode = {
	//there is also -1 === 'no button'
	"LEFT" : 0,
	"MIDDLE" : 1,
	"RIGHT" : 2,
	"BACK" : 3,
	"FORWARD" : 4
};

function generateCodeToName(nameToCode){
	// stringToCode maps from strings to integer values
	var array = [];

	for (var name in nameToCode){
		array[nameToCode[name]] = name;
	}

	return function (i) {
		return array[i];
	}
}

var keyCodeToName = generateCodeToName(keyNameToCode);

var buttonToName = generateCodeToName(buttonNameToCode);

//This function sets up the main loop:
function start(canvas, options) {

	if (typeof(options) === "undefined") {
		options = {};
	}
	
	var sald = window.sald; //redundant, probably

	//------------ create context --------------

	if (options.gl) {
		window.sald.gl = canvas.getContext('webgl', options.gl) || canvas.getContext("experimental-webgl", options.gl);
	} else {
		window.sald.ctx = canvas.getContext('2d');
	}

	//----------- handle init --------------
	//  (used by meshes and shaders that require a gl context to load)
	if (window.sald.initFuncs) {
		window.sald.initFuncs.forEach(function(f){ f(); });
	}

	//------------ handle canvas sizing --------------

	var currentFactor = -1;

	function resized() {
		var parent = canvas.parentNode;
		var parentStyle = getComputedStyle(parent);
		var maxSize = {width:parent.clientWidth, height:parent.clientHeight};
		maxSize.width -= parseInt(parentStyle.getPropertyValue("padding-left")) + parseInt(parentStyle.getPropertyValue("padding-right"));
		maxSize.height -= parseInt(parentStyle.getPropertyValue("padding-top")) + parseInt(parentStyle.getPropertyValue("padding-bottom"));

		var factor;

		if (typeof(sald.size.mode) === "undefined" || sald.size.mode === "exact") {
			factor = 1;
		} else if (sald.size.mode === "multiple") {
			factor = Math.floor(Math.min(maxSize.width / sald.size.x, maxSize.height / sald.size.y)) | 0;
			factor = Math.max(1, factor);
		} else if (sald.size.mode === "ratio") {
			factor = Math.min(maxSize.width / sald.size.x, maxSize.height / sald.size.y);
			factor = Math.max(1, factor);
		}

		if (factor != currentFactor) {
			currentFactor = factor;

			var width = Math.round(sald.size.x * factor);
			var height = Math.round(sald.size.y * factor);

			//actually set canvas size:
			//   ...both the display size:
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
			//   ...and the actual pixel count:
			canvas.width = width;
			canvas.height = height;

			//store the information into the drawing context for other code:
			if (sald.ctx) {
				sald.ctx.width = width;
				sald.ctx.height = height;
				sald.ctx.factor = factor;
			} else {
				sald.gl.width = width;
				sald.gl.height = height;
				sald.gl.factor = factor;
			}
		}
	}

	//install 'resized' to handle window resize events:
	window.addEventListener('resize', resized);
	//also call it now to set up a good initial size:
	resized();

	window.addEventListener('resize', function(){
		resized();
		
		sald.scene && sald.scene.resize && sald.scene.resize();

		return false;
	});


	// -----------------------
	// ----- Main Loop -------
	// -----------------------
	var previous = NaN;
	function render(timestamp) {
		if (isNaN(previous)) {
			previous = timestamp;
		}
		var elapsed = (timestamp - previous) / 1000.0;
		previous = timestamp;

		if(elapsed > .1) elapsed = .1;
		
		sald.scene && sald.scene.update && sald.scene.update(elapsed);
		sald.scene && sald.scene.draw && sald.scene.draw();

		window.requestAnimationFrame(render);
	};

	window.requestAnimationFrame(render);


	//------- key handlers -------

	window.addEventListener('keydown', function(evt){
		var keyName =  keyCodeToName(evt.keyCode);

		var keydownsToIgnorePreventingDefault = {
			 "WINDOWS" : true,
			 "CONTROL" : true
			};

		if (sald.keys.hasOwnProperty(keyName)) {
			//already handled this keydown
		} else {
			sald.keys[keyName] = true;
			sald.scene && sald.scene.key && sald.scene.key(keyName, true);
		}

		// TODO figure out which keys to prevent default, and when
		if (!(keyName in keydownsToIgnorePreventingDefault)){
			if (!(("WINDOWS" in sald.keys && sald.keys["WINDOWS"]) ||
					"CONTROL" in sald.keys && sald.keys["CONTROL"])){
				evt.preventDefault();
			}
		}
		return false;
	});
	
	window.addEventListener('keyup', function(evt){
		var keyName =  keyCodeToName(evt.keyCode);

		if (sald.keys.hasOwnProperty(keyName)) {
			delete sald.keys[keyName];
			sald.scene && sald.scene.key && sald.scene.key(keyName, false);
		}
		
		evt.preventDefault();
		return false;
	});


	//------- mouse handlers -------
	
	// suppress context menu on right click:
	window.addEventListener('contextmenu', function(evt) {
		if (window.sald.takeRightClickInput){
	    	evt.preventDefault();
			return false;
		}
	});

	//helper: update mouse object
	function setMouse(evt) {
		var rect = canvas.getBoundingClientRect();

		//The '0.5' additions here seem to align a '+' drawn at the cursor
		//  position to the cursor better, but I'm not sure why:
		var x = (evt.clientX + 0.5 - rect.left);
		var y = (evt.clientY + 0.5 - rect.top);

		var buttons = {};
		for (var name in buttonNameToCode) {
			if (name === "RIGHT" && !window.sald.takeRightClickInput) {
				//skip right button, if flag isn't set
			} else {
				if (evt.buttons & (1 << buttonNameToCode[name])) {
					buttons[name] = true;
				}
			}
		}

		window.sald.mouse = {x:x, y:y, buttons:buttons};
	}

	window.addEventListener('mousedown', function(evt) {
		setMouse(evt);

		var buttonName = buttonToName(evt.button);

		//if we don't have a name for this button, don't handle it:
		if (buttonName === undefined) {
			return;
		}

		//if this is a right click, and we're not set to handle those, don't handle it:
		if (buttonName === "RIGHT" && !window.sald.takeRightClickInput){
			return;
		}

		sald.scene && sald.scene.mouse && sald.scene.mouse({x:sald.mouse.x, y:sald.mouse.y}, buttonName, true);

		evt.preventDefault();
		return false;
	});


	window.addEventListener('mouseup', function (evt) {
		setMouse(evt);

		var buttonName = buttonToName(evt.button);

		//if we don't have a name for this button, don't handle it:
		if (buttonName === undefined) {
			return;
		}

		//if this is a right click, and we're not set to handle those, don't handle it:
		if (buttonName === "RIGHT" && !window.sald.takeRightClickInput){
			return;
		}

		sald.scene && sald.scene.mouse && sald.scene.mouse({x:sald.mouse.x, y:sald.mouse.y}, buttonName, false);

		evt.preventDefault();
		return false;
	});

	window.addEventListener('mousemove', function (evt) {
		setMouse(evt);

		sald.scene && sald.scene.mouse && sald.scene.mouse({x:sald.mouse.x, y:sald.mouse.y});

		evt.preventDefault();
		return false;		
	});
	
	//------- wheel handler -------

	window.addEventListener('wheel', function (evt) {
		if (!(sald.scene && sald.scene.wheel)) return;

		var delta = {
			x:evt.deltaX,
			y:evt.deltaY,
			z:evt.deltaZ
		};

		//At some point, we should figure out how to adjust the delta based on its mode:
		if (evt.deltaMode === 0) { //"pixels"
		} else if (evt.deltaMode === 1) { //"lines"
		} else if (evt.deltaMode === 2) { //"pages"
		}

		sald.scene && sald.scene.wheel && sald.scene.wheel(delta);

		evt.preventDefault();
		return false;
	});

	//---------------------------------
};


module.exports = {
	start:start
};
