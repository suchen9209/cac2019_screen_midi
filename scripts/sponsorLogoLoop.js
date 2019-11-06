var logoOffset = 0;
var logoDouble = 0;
function logoLoop(){
	if (logoDouble == 0 & logoOffset <= 1) {
		$('.sponsorLogoes>img:eq(' + logoOffset +')').fadeIn(1000);
		$('.sponsorLogoes>img:eq(' + logoOffset +')').delay(8000);
		logoDouble ++;
		logoOffset --;
	}
	else{
		logoDouble = 0;
		$('.sponsorLogoes>img:eq(' + logoOffset +')').fadeIn(1000);
		$('.sponsorLogoes>img:eq(' + logoOffset +')').delay(8000).fadeOut(1000);
	}
	if (logoOffset < 8) {
		logoOffset ++;
	}
	else {
		logoOffset = 0;
	};
}
logoLoop();
setInterval(function(){logoLoop()},10000)