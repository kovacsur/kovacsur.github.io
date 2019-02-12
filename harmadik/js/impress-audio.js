(function(document, $, undefined) {
	'use strict';

	var isPlaying,
		audio,
		impressObj = impress(),
		impressGoto = impressObj.goto;

	$(document).on('impress:stepenter', function(event,f) {
		var $currSlide = $(event.target);
		if(audio) {
			var prevAudio = audio;
			$(prevAudio).animate({volume: 0}, 3000, function() {prevAudio.pause(); prevAudio.currentTime = 0;});
		}
		audio = $currSlide.find('audio')[0];
		if(audio) {
			$(audio).prop("volume", 0);
			audio.play().then(function() {
				// Automatic playback started!
			}).catch(function(error) {
				console.debug(error);
				// Automatic playback failed.
				$("body").append('<button id="playbtn">Play</button>')
					.on('click', function() {audio.play(); $("#playbtn").remove()});
				// Show a UI element to let the user manually start playback.
			});
			$(audio).animate({volume: 1}, 2000);
			if(isPlaying && $currSlide[0] != $currSlide.parent().children().last()[0]) {
				$(audio).on("timeupdate", function() {
					if (this.currentTime + 3 > this.duration) {
						impressObj.goto($currSlide.next());
	/*					$(audio).animate({volume: 0}, 2000); */
						$(audio).off("timeupdate");
					}
				});

/*
				$(audio).on('ended', function() {
					impressObj.goto($currSlide.next());
					$(audio).off("ended");
				});
*/
			} else {
				isPlaying = false;
			}
			
		}
	});

	impressObj.play = function() {
		isPlaying = true;
		this.goto(0);
	};

	impressObj.goto = function($el) {
		if(isNaN($el)) {
			impressGoto($el.parent().children().index($el), $el.data('transition-duration'));
		} else {
			impressGoto($el);			
		}
	}


})(document, jQuery);