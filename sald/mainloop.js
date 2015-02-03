// TODO
// Add keymapping json object
// Add parameter file
// Resizing code
// Determine best place to put files

if (typeof(window.sald) === "undefined") {
	window.sald = {};
}

//Just 'require'-ing this file installs several useful global properties:
window.sald.scene = {}; //the current scene; update, draw, and key functions will be called.
window.sald.ctx = null; //the drawing context, call canvas 2d functions here
window.sald.size = {x:320, y:240, mode:"exact"}; //set your desired size here
window.sald.keys = {}; //all keys currently held down
window.sald.mouse = null; //null -> no mouse event has happened yet

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
			sald.ctx.width = width;
			sald.ctx.height = height;
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

	window.addEventListener('mousemove', function(evt){
		var rect = canvas.getBoundingClientRect();

		//The '0.5' additions here seem to align a '+' drawn at the cursor
		//  position to the cursor better, but I'm not sure why:
		var x = (evt.clientX - 0.5 - rect.left);
		var y = (evt.clientY + 0.5 - rect.top);

		sald.mouse = {x:x, y:y};

		evt.preventDefault();
		return false;
	});

	window.requestAnimationFrame(render);

};


module.exports = {
	start:start
};
