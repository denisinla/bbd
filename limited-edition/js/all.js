/* Beats by Dre Functionality */
$(document).ready(function(){
	$("#watch-interview").click(function(){
		var embedId = '<iframe src="https://player.vimeo.com/video/73348227?wmode=opaque&rel=0&autoplay=1&modestbranding=1&showinfo=0&autohide=1&enablejsapi=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
		event.preventDefault();
		$(".interview-video").append(embedId).css("display","block");
		$(".overlay-close").css('display','block');
	});
	$(".overlay-close").click(function(){
		$('.interview-video').css('display','none');
	});
	$({limitValue: 200}).animate({limitValue: 0}, {
		duration: 8000,
		easing:'easeInOutCirc',
		step: function() {
			$('#rotate').text(Math.ceil(this.limitValue));
		}
	});
});