// TODO
// Add keymapping json object
// Add parameter file
// Resizing code
// Determine best place to put files

// Usage ...
// Input ...
function sald(update, draw, key){
	// Assign functions
	var update = update;
	var draw = draw;
	var key = key;

	// Get canvas from doc
	this.canvas=document.getElementById('mainCanvas'); // <-- need to confirm id name, maybe save in parameter file
	this.ctx=canvas.getContext('2d');

	// -----------------------
	// ----- Main Loop -------
	// -----------------------
	var previous = NaN;
	this.render = function(elapsed){
		if (isNaN(previous)) {
			previous = timestamp;
		}
		var elapsed = (timestamp - previous) / 1000.0;
		previous = timestamp;

		if(elapsed > .1) elapsed = .1;
		
		update && update(elapsed);
		draw && draw();

		window.requestAnimationFrame(render);
	};

	window.addEventListener('keydown', function(evt){
		keys[evt.keyCode] = true;
		key && key(evt.keyCode, true);
		evt.preventDefault();
		return false;
	});

	window.addEventListener('keyup', function(evt){
		delete keys[evt.keyCode];
		key && key(evt.keyCode, false);
		evt.preventDefault();
		return false;
	});

	this.setup = function(){
		render();
	};
};
