#Sound.js Usage
SALD provides a sound support. To use:

###Require sound.js in your code
```
var soundController = require('sald:sound.js');
```

###Require individual sound files, then play
```
var explosionSound = require('./data/sounds/explosion.ogg');
explosionSound.play();

```

Currently, the sound module only supports .ogg files. Here is an online file converter:
http://audio.online-convert.com/convert-to-ogg

###Sound Controller

Use sound controller to control the master volume.

```
soundController.setVolume(float from 0.0 to 1.0);
soundController.getVolume() // returns float from 0.0 to 1.0
soundController.toggleMute();
soundController.setIsMuted(boolean);
soundController.isMuted(); // returns boolean
```

<hr />

###CustomAudio Class

The CustomAudio class is used as a wrapper to the Audio html tag. It allows you to play multiple instances of a single sound at the same time.

```
var explosionSound = require('./data/sound/explosion.ogg');

// The default number of instances is 4
explosionSound.setNumInstances(number of instances);

explosionSound.getVolume(); // returns float between 0.0 and 1.0
explosionSound.setVolume(float between 0.0 and 1.0);
explosionSound.play();
explosionSound.setShouldLoop(boolean);
explosionSound.doesLoop(); // returns boolean
explosionSound.getNumberOfLiveInstances() // How many of this sound is playing right now
explosionSound.pause(); // pauses all instances of this sound, allowing you to resume at any point
explosionSound.resume(); // resumes paused audio
explosionSound.stop(); // Stops all instances of this sounds audio, with no ability to resume
```
