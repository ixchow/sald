var volume = 1.0;
var isMuted = false;
var unmutedVolume = volume;

var playingSounds = new Set();

var removeInactiveSounds = function (){
	var replaceSet = new Set();

	// Remove sounds that aren't being played
	playingSounds.forEach(function(sound) {
		if (!sound.ended){
			replaceSet.add(sound);
		}
	});

	playingSounds = replaceSet;
}

var setCurrentVolume = function(volume_){
	volume = volume_;

	var replaceSet = new Set();

	// Remove sounds that aren't being played
	playingSounds.forEach(function(sound) {
		if (!sound.ended){

			sound.volume = volume;

			replaceSet.add(sound);
		}
	});

	playingSounds = replaceSet;
}

var setVolume = function(volume_){
	unmutedVolume = volume_;

	setCurrentVolume(volume_);
}

var getVolume = function() {
	return volume;
}

var toggleMute = function(){
	isMuted = !isMuted;
	setMute(isMuted);
}

var setMute = function(bool){
	isMuted = bool;

	if (isMuted){
		setCurrentVolume(0);
	} else {
		setCurrentVolume(unmutedVolume);
	}
}

var soundsAddedTicker = 0;

var addPlayingSound = function(audio){
	playingSounds.add(audio);

	soundsAddedTicker++;

	if (soundsAddedTicker > 32){
		removeInactiveSounds();
		soundsAddedTicker = 0;
	}
}

module.exports = {
	setVolume:setVolume,
	getVolume:getVolume,
	addPlayingSound:addPlayingSound,
	toggleMute:toggleMute,
	setMute:setMute,
};