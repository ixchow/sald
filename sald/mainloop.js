if (typeof(window.sald) === "undefined") {
	window.sald = {};
}

//Just 'require'-ing this file installs several useful global properties:
window.sald.scene = {}; //the current scene; update, draw, scrollWheel,  and key functions will be called.
window.sald.ctx = null; //the drawing context, call canvas 2d functions here
window.sald.size = {x:320, y:240, mode:"exact"}; //set your desired size here
window.sald.keys = {}; //all keys currently held down
window.sald.mouseCoords = {x:null, y:null};

window.sald.keyCode = {
	"BACKSPACE": 8,
	"TAB": 9,
	"ENTER": 13,
	"SHIFT": 16,
	"CONTROL": 17,
	"ALT": 18,
	"PAUSE": 19,
	"CAPS_LOCK": 20,
	"ESCAPE": 27,
	"SPACEBAR": 32,
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

function generateIntToKeyCode(json){
	// json must be keys that are strings, integer values
	var max_i = Number.MIN_VALUE;

	var array = [];

	for (var key in json){
		if (json.hasOwnProperty(key)){
			var i = json[key];

			array[i] = key;
		}
	}

	return function (i) {
		return array[i];
	}
}

window.sald.intToKeyCode = generateIntToKeyCode(window.sald.keyCode);

//This function sets up the main loop:
function start(canvas) {
	
	var sald = window.sald; //redundant, probably

	window.sald.ctx = canvas.getContext('2d');

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
			sald.ctx.width = width;
			sald.ctx.hight = height;
			sald.ctx.factor = factor;
		}
	}

	//install 'resized' to handle window resize events:
	window.addEventListener('resize', resized);
	//also call it now to set up a good initial size:
	resized();


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

	window.addEventListener('keydown', function(evt){
		if (sald.keys[evt.keyCode]) {
			//already handled this keydown
		} else {
			sald.keys[evt.keyCode] = true;
			
			sald.scene && sald.scene.key && sald.scene.key(evt.keyCode, true);
		}
		evt.preventDefault();
		return false;
	});
	
	window.addEventListener('keyup', function(evt){
		delete sald.keys[evt.keyCode];
		
		sald.scene && sald.scene.key && sald.scene.key(evt.keyCode, false);
		evt.preventDefault();
		return false;
	});
	
	var getMousePos = function() {
		var xPos = MouseEvent.clientX;
		var yPos = MouseEvent.clientY;
	
		window.sald.mouseCoords = {x: xPos, y: yPos};
		return window.sald.mouseCoords;
	};
	
	canvas.addEventListener('onmousedown', function () {
		window.onmousedown();
        
        if(window.MouseEvent.button === 0)
        {
            sald.scene && sald.scene.onLeftMouseDown && sald.onLeftMouseDown();
        }
        else if(window.MouseEvent.button === 2)
        {
            sald.scene && sald.scene.onRightMouseDown && sald.onRightMouseDown();
        }

		var temp = window.sald.mouseCoords;
		return temp;
	});
	
	canvas.addEventListener('onmouseup', function () {
		window.onmouseup();
        
        if(window.MouseEvent.button === 0)
        {
            sald.scene && sald.scene.onLeftMouseUp && sald.onLeftMouseUp();
        }
        else if(window.MouseEvent.button === 2)
        {
            sald.scene && sald.scene.onRightMouseUp && sald.onRightMouseUp();
        }

		var temp = window.sald.mouseCoords;
		return temp;
	});
	
	canvas.addEventListener('onclick', function () {
		window.onclick();
        
        if(window.MouseEvent.button === 0)
        {
            sald.scene && sald.scene.leftMouseClick && sald.leftMouseClick();
        }
        else if(window.MouseEvent.button === 2)
        {
            sald.scene && sald.scene.rightMouseClick && sald.rightMouseClick();
        }

		var temp = window.sald.mouseCoords;
		return temp;
	});
	
	canvas.addEventListener('onmousemove', function () {
		window.onmousemove();

		getMousePos();

		sald.scene && sald.scene.onMouseMove && sald.onMouseMove();
	});
	
	if(canvas.addEventListener){
		//chrome/ie9/safari/opera
		canvas.addEventListener("mousewheel", mouseWheel, false);
		//firefox
		canvas.addEventListener("DOMMouseScroll", mouseWheel, false);
	}
	else{
		canvas.attachEvent("onmousewheel", mouseWheel);
	}
	function mouseWheel(e){
		var e = window.event || e;
		//1 for up, -1 for down
		var delta =  Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		sald.scene && sald.scene.scrollWheel && sald.scene.scrollWheel(delta);
		return false;
	};
	window.requestAnimationFrame(render);

};


module.exports = {
	start:start
};