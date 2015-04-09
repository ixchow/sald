var sound = require("sald:sound.js");

var CustomAudio = function (mimeType_, encoding_, loadedFile_){
	var instances = [];
	var DEFAULT_NUM_INSTANCES = 4;
	var nextSound = -1;
	var mimeType = mimeType_;
	var encoding = encoding_;
	var loadedFile = loadedFile_;

	var volume = 1.0;

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
			instances.splice(instances.length - num, 1);
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
		volume = vol;
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
		}
	}
}

module.exports = CustomAudio;