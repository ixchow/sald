var masterVolume = 1.0;
var musicVolume = 1.0;
var soundEffectVolume = 1.0;

var isMuted_ = false;
var isPaused_ = false;
var unmutedMasterVolume = masterVolume;

var playingSFX = new Set();
var playingMusic = new Set();

var isMuted = function(){
	return isMuted_;
}

var updateLiveSounds = function(func){
	var replaceSet = new Set();

	playingSFX.forEach(function(audio) {
		if (!audio.ended){
			func(audio);
			replaceSet.add(audio);
		}
	});

	playingSFX = replaceSet;

	replaceSet = new Set();

	playingMusic.forEach(function(audio) {
		if (!audio.ended){
			func(audio);
			replaceSet.add(audio);
		}
	});

	playingMusic = replaceSet;
}

var removeInactiveSFX = function (){
	var replaceSet = new Set();

	// Remove sounds that aren't being played
	playingSFX.forEach(function(sound) {
		if (!sound.ended){
			replaceSet.add(sound);
		}
	});

	playingSFX = replaceSet;
}

var pause = function(){
	isPaused_ = true;

	var func = function(audio){
		audio.pause();
	}

	updateLiveSounds(func);
}

var resume = function(){
	isPaused_ = false;

	var func = function(audio){
		audio.play();
	}

	updateLiveSounds(func);
}

var isPaused = function(){
	return isPaused_;
}

var removeInactiveMusic = function (){
	var replaceSet = new Set();

	// Remove sounds that aren't being played
	playingMusic.forEach(function(sound) {
		if (!sound.ended){
			replaceSet.add(sound);
		}
	});

	playingMusic = replaceSet;
}

var setCurrentVolume = function(volume_){
	volume = Math.max(0, Math.min(1, volume_));

	var replaceSet = new Set();

	// Remove sounds that aren't being played
	playingSFX.forEach(function(sound) {
		if (!sound.ended){
			sound.volume = volume;

			replaceSet.add(sound);
		}
	});

	playingSFX = replaceSet;

	replaceSet = new Set();

	// Remove sounds that aren't being played
	playingMusic.forEach(function(sound) {
		if (!sound.ended){
			sound.volume = volume;

			replaceSet.add(sound);
		}
	});

	playingMusic = replaceSet;
}

var setMasterVolume = function(volume_){
	unmutedMasterVolume = Math.max(0, Math.min(1, volume_));

	setCurrentVolume(unmutedMasterVolume);
}

var getMasterVolume = function() {
	return masterVolume;
}

var setSoundEffectVolume = function(volume_){
	soundEffectVolume = Math.max(0, Math.min(1, volume_));
}

var getSoundEffectVolume = function() {
	return soundEffectVolume;
}

var setMusicVolume = function(volume_){
	musicVolume = Math.max(0, Math.min(1, volume_));
}

var getMusicVolume = function() {
	return masterVolume;
}

var mute = function(){
	isMuted_ = true;
	setCurrentVolume(0);
}

var unmute = function(){
	isMuted_ = false;
	setCurrentVolume(unmutedMasterVolume);
}

var sfxAddedTicker = 0;
var musicAddedTicker = 0;

var addPlayingInstance = function(audio){
	if (audio.isMusic){
		playingMusic.add(audio);

		musicAddedTicker++;

		if (musicAddedTicker > 32){
			removeInactiveMusic();
			musicAddedTicker = 0;
		}
	} else {
		playingSFX.add(audio);

		sfxAddedTicker++;

		if (sfxAddedTicker > 32){
			removeInactiveSFX();
			sfxAddedTicker = 0;
		}
	}
}



var SaldAudio = function (audioParamString){
	// Private Variables/Functions
	var instances = [];
	var liveInstances = new Set();
	var DEFAULT_NUM_INSTANCES = 4;
	var nextSound = -1;
	var isPaused_ = false;
	var isMusic = false;

	var loops = false;

	var volume = 1.0;

	// Accounts for Master and Music or Sound Effect
	var getModifiedVolume = function(){
		var vol = volume * getMasterVolume();

		if (isMusic){
			vol *= getMusicVolume();
		} else {
			vol *= getSoundEffectVolume();
		}

		return vol;
	}

	var updateLiveInstances = function(func){
		var replaceSet = new Set();

		if (func === undefined){
			liveInstances.forEach(function(audio) {
				if (!audio.ended){
					replaceSet.add(audio);
				}
			});
		} else {
			liveInstances.forEach(function(audio) {
				if (!audio.ended){
					func(audio);
					replaceSet.add(audio);
				}
			});
		}

		liveInstances = replaceSet;
	}

	var addInstance = function(){
		var temp = new Audio(audioParamString);

		instances.push(temp);
	}

	for (var i = 0; i < DEFAULT_NUM_INSTANCES; i++){
		addInstance();
	}

	// Public Variables/Functions

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

		var setVol = function(audio){
			audio.volume = getModifiedVolume();
		}

		updateLiveInstances(setVol);
	}

	// Plays a new instance of this sound, does not resume paused sound
	this.play = function(){
		if (instances.length > 0 && !isPaused() && !isMuted()){
			nextSound = (nextSound + 1) % instances.length;

			audio = instances[nextSound];

			addPlayingInstance(audio);

			audio.gain = volume;

			var vol = getModifiedVolume();

			audio.volume = vol;
			audio.currentTime = 0;
			audio.play();
			audio.loop = loops;
			liveInstances.add(audio);
		}
	}

	this.setShouldLoop = function(bool){
		loops = bool;

		var setLoop = function(audio){
			audio.loop = loops;
		}

		updateLiveInstances(setLoop);
	}

	this.doesLoop = function(){
		return loops;
	}

	this.getNumberOfLiveInstances = function(){
		updateLiveInstances();
		return liveInstances.size;
	}

	this.pause = function(){
		isPaused_ = true;
		if (!isPaused()){
			var pause = function(audio){
				audio.pause();
			}

			updateLiveInstances(pause);
		}
	}

	this.resume = function(){
		isPaused_ = false;
		if (!isPaused()){
			var resume = function(audio){
				audio.play();
			}

			updateLiveInstances(resume);
		}
	}

	this.isPaused = function(){
		return isPaused_;
	}

	// Stops all instances of this sound from playing
	this.stop = function(){
		liveInstances.forEach(function(audio) {
			audio.pause();
			audio.currentTime = 0;
		});

		liveInstances.clear();
	}

	this.setIsMusic = function(boolean){
		isMusic = boolean;
	}

	this.isMusic = function(){
		return isMusic;
	}
}

module.exports = {
	setMasterVolume:setMasterVolume,
	getMasterVolume:getMasterVolume,

	setSoundEffectVolume:setSoundEffectVolume,
	getSoundEffectVolume:getSoundEffectVolume,

	setMusicVolume:setMusicVolume,
	getMusicVolume:getMusicVolume,

	pause:pause,
	resume:resume,
	isPaused:isPaused,
	mute:mute,
	unmute:unmute,
	isMuted:isMuted,

	SaldAudio:SaldAudio
};