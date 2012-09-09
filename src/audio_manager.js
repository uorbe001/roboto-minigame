/**
 This class is used to abstract the audio control.
*/
function AudioManager() {
	try {
		this.context = new webkitAudioContext();
	} catch(e) {
		this.context = null;
	}
	
	this.audio_buffers = {};
}

/**
 Fetches the audio from the server and decodes the buffer.
 @param url to load the sound from.
 @param [callback] if provided, it will be called when the sound is loaded.
*/
AudioManager.prototype.load = function(url, callback) {
	//Early-out in case audio context is not available
	if (!this.context) return;
	//No need to load the same buffer twice, is there?
	if (this.audio_buffers[url]) return;

	var request = new XMLHttpRequest(), self = this;
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function() {
		self.context.decodeAudioData(request.response, function(buffer) {
			self.audio_buffers[url] = buffer;
			if (callback) callback.call(null, url);
		});
	};

	request.send();
};

/**
 Plays a sound if it is loaded.
*/
AudioManager.prototype.play = function(url, loop) {
	//Early-out in case audio context is not available
	if (!this.context) return;
	//The buffer isn't ready
	if (!this.audio_buffers[url]) { console.log("Not ready yet!"); return; }

	var source = this.context.createBufferSource();
	source.buffer = this.audio_buffers[url];
	source.loop = loop;
	source.connect(this.context.destination);
	source.noteOn(0);
};

module.exports = AudioManager;