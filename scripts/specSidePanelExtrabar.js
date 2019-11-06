
var ipc = require('electron').ipcRenderer;
function extraBarShow(){
	$(".specSidePanel-extraPanel-Left").animate({left:'0px'},400,'easeInOutQuad');
	$(".specSidePanel-extraPanelAnimateFade").fadeIn(400).css("display","inline-block");
	$(".specSidePanel-mainWeapon").animate({left:'80px'},400,'easeInOutQuad');
	$(".specSidePanel-Bottom-ExtraPanel").animate({top:'5px'},400,'easeInOutQuad');
	$(".specTopPanelRound-wins").attr('style','height:30px;');
	$(".specSideExtraTopPanel-animate").attr('style','top:0px;opacity:1;');
	$(".teamEconomyPanel-Content").attr('style','top:0px;opacity:1;');
	$(".eventLogo").attr('style','top:0px;');
}
function extraBarHide(){
	$(".specSidePanel-extraPanel-Left").animate({left:'-80px'},400,'easeInOutQuad');
	$(".specSidePanel-extraPanelAnimateFade").fadeOut(400);
	$(".specSidePanel-mainWeapon").animate({left:'0px'},400,'easeInOutQuad');
	$(".specSidePanel-Bottom-ExtraPanel").animate({top:'-48px'},400,'easeInOutQuad');
	$(".specTopPanelRound-wins").attr('style','height:0;');
	// $(".specSideExtraTopPanel-animate").attr('style','top:80px;opacity:0;');
	$(".teamEconomyPanel-Content").attr('style','top:50px;opacity:0;');
	$(".eventLogo").attr('style','top:50px;');
}
function grenadeCountPanelShow(){
	$(".specSideExtraTopPanel-animate").attr('style','top:0px;opacity:1;');
}
function grenadeCountPanelHide(){
	$(".specSideExtraTopPanel-animate").attr('style','top:80px;opacity:1;');
}		
var extraBarStatusInit = 0;
var grenadeCountPanelInit = 0;
// $(document).keydown(function(e){
// if(e.which == 77) {
// 	if (extraBarStatusInit == 0) {
// 		extraBarShow();
// 		extraBarStatusInit = 1;
// 	}
// 	else if (extraBarStatusInit == 1) {
// 		extraBarHide();
// 		extraBarStatusInit = 0;
// 	}
// }

// });
ipc.on('grenadeCountPanelToggle',function grenadeCountPanelToggle(test){
	if (grenadeCountPanelInit == 0) {
		grenadeCountPanelShow();
		grenadeCountPanelInit = 1;
	}
	else if (grenadeCountPanelInit == 1) {
		grenadeCountPanelHide();
		grenadeCountPanelInit = 0;
	}
})

ipc.on('extraBarToggle',function extraBarToggle(test){
	if (extraBarStatusInit == 0) {
		extraBarShow();
		extraBarStatusInit = 1;
		grenadeCountPanelInit = 1;
	}
	else if (extraBarStatusInit == 1) {
		extraBarHide();
		extraBarStatusInit = 0;
	}
})

ipc.on('freezetimeExtraBarShow',function freezetimeExtraBarShow(test){
		extraBarShow();
		extraBarStatusInit = 1;
		grenadeCountPanelInit = 1;
})
ipc.on('freezetimeExtraBarHide',function freezetimeExtraBarHide(test){
		extraBarHide();
		extraBarStatusInit = 0;
})