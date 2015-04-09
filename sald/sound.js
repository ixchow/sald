var volume = 1.0;
var isMuted_ = false;
var unmutedVolume = volume;

var playingSounds = new Set();

var isMuted = function(){
	return isMuted_;
}

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
	volume = Math.max(0, Math.min(1, volume_));

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
	unmutedVolume = Math.max(0, Math.min(1, volume_));

	setCurrentVolume(unmutedVolume);
}

var getVolume = function() {
	return volume;
}

var toggleMute = function(){
	setIsMuted(!isMuted_);
}

var setIsMuted = function(bool){
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
	setIsMuted:setIsMuted,
	isMuted:isMuted
};