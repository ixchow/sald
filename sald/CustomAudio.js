var sound = require("sald:sound.js");

var CustomAudio = function (mimeType_, encoding_, loadedFile_){
	var instances = [];
	var liveInstances = new Set();
	var DEFAULT_NUM_INSTANCES = 4;
	var nextSound = -1;
	var mimeType = mimeType_;
	var encoding = encoding_;
	var loadedFile = loadedFile_;

	var loops = false;

	var volume = 1.0;

	var updateLiveInstances = function(){
		var replaceSet = new Set();

		liveInstances.forEach(function(audio) {
			if (!audio.ended){
				audio.loop = loops;
				replaceSet.add(audio);
			}
		});

		liveInstances = replaceSet;
	}

	var addInstance = function(){
		var temp = new Audio('data:audio/' + mimeType + ';' + encoding + ',' + loadedFile);

		instances.push(temp);
	}

	for (var i = 0; i < DEFAULT_NUM_INSTANCES; i++){
		addInstance();
	}

	/* This is used to control the number of instances of
	 the sound file that can be playing at the same time */
	this.setNumInstances = function(num){
		if (numInstances < 0){
			return false;
		} else if (num < instances.length){
			var toRemove = instances.length - num;

			for (var i = 0; i < toRemove; i++){
				instances[i].pause();
			}

			instances.splice(toRemove, 1);
		} else {
			for (var i = instances.length; i < num; i++){
				addInstance();
			}
		}
	}

	this.getVolume = function(){
		return volume;
	}

	this.setVolume = function(vol){
		volume = Math.max(0, Math.min(1, vol));

		var replaceSet = new Set();

		var volToSet = volume * sound.getVolume();

		liveInstances.forEach(function(audio) {
			if (!audio.ended){
				audio.volume = volToSet;
				replaceSet.add(audio);
			}
		});

		liveInstances = replaceSet;
	}

	this.play = function(){
		if (instances.length > 0){
			nextSound = (nextSound + 1) % instances.length;

			audio = instances[nextSound];

			sound.addPlayingSound(audio);

			audio.gain = volume;

			var vol = sound.getVolume() * volume;

			audio.volume = vol;
			audio.currentTime = 0;
			audio.play();
			audio.loop = loops;
		}
	}

	this.shouldLoop = function(bool){
		loops = bool;
		var replaceSet = new Set();

		liveInstances.forEach(function(audio) {
			if (!audio.ended){
				audio.loop = loops;
				replaceSet.add(audio);
			}
		});

		liveInstances = replaceSet;
	}

	this.getNumberOfLiveInstances = function(){
		updateLiveInstances();
		return liveInstances.size;
	}

	// Stops all instances of this sound from playing
	this.stop = function(){
		liveInstances.forEach(function(audio) {
			audio.pause();
			audio.currentTime = 0;
		});

		liveInstances.clear();
	}
}

module.exports = CustomAudio;