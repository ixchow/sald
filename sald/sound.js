/* From StackOverflow user dacracot:
http://stackoverflow.com/questions/187098/cross-platform-cross-browser-way-to-play-sound-from-javascript
*/
function Sound() {
	var soundEmbed = null;

	this.play = function(which){
		if (!soundEmbed)
			{
			soundEmbed = document.createElement("embed");
			soundEmbed.setAttribute("src", "/snd/"+which+".wav");
			soundEmbed.setAttribute("hidden", true);
			soundEmbed.setAttribute("autostart", true);
			}
		else
			{
			document.body.removeChild(soundEmbed);
			soundEmbed.removed = true;
			soundEmbed = null;
			soundEmbed = document.createElement("embed");
			soundEmbed.setAttribute("src", "/snd/"+which+".wav");
			soundEmbed.setAttribute("hidden", true);
			soundEmbed.setAttribute("autostart", true);
			}
		soundEmbed.removed = false;
		document.body.appendChild(soundEmbed);
	}
}

var sound = new Sound();

module.exports = sound;