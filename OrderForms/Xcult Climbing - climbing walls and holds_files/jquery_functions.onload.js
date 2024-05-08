// On Load functions ============================================================================
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
var isMobile = window.matchMedia("only screen and (min-width: 240px) and (max-width: 1200px)").matches;

$(window).ready(function() {
    //var initialSliderHeight = $('.slideshow').height();
    //var lowHeaderHeight = 128;

    // display message
    $('.display_message').animate({height: 'show'}, 400).delay(3000).fadeOut(1000);


	//$(document).scroll(function(e){
	//	//if(isMobile){}
	//	scrollHandler(initialSliderHeight,lowHeaderHeight);
	//});

	carousel.init();
	//parallax home

    $(window).on('scroll resize orientationchange touchmove', function(){
        scrollHandler();
    }).trigger('scroll');

	//setInterval(scrollHandler, 100);

	//$('.mobileLink').on({
	//	click: function() {
	//		$('.links').toggleClass('mobile');
	//	}
	//});
	$('.scrollTop').on({
		click: function() {
            $('html, body').animate({scrollTop: '0px'}, 450, 'swing');
		}
	});
	$('.arrowDown').on({
		click: function() {
            $('html, body').animate({scrollTop: initialSliderHeight}, 450, 'swing');
		}
	});
	$('.menu-activator').click(function(){$('.mobile-menu').addClass('active')});
	$('.mobile-menu').click(function(){$('.mobile-menu').removeClass('active')});
	$('.mobile-menu .content').click(function(e){e.stopImmediatePropagation()});

    //$('#slider').nivoSlider({
    //    //effect: 'boxRain,boxRainReverse,boxRainGrow,boxRainGrowReverse,boxRandom',
    //    effect: 'fade',
    //    directionNav: true,
    //    controlNav	: true,
    //    animSpeed   : 500,
    //    pauseTime   : 6000,
    //    startSlide  : 0,
    //    prevText    : "",
    //    nextText    : "",
    //    pauseOnHover: false
    //});

    $("a.productImage").fancybox({
        'transitionIn'	:	'elastic',
        'transitionOut'	:	'elastic',
        'speedIn'		:	600,
        'speedOut'		:	200,
        'overlayShow'	:	false,
		'loop'          :    false,
    });
});


//scroll handler
function scrollHandler(initialSliderHeight,lowHeaderHeight){
	var scrollTop = $(window).scrollTop();
	//console.log('asdf');
    //var sliderHeight = initialSliderHeight-scrollTop;
	//if (scrollTop <= (initialSliderHeight-lowHeaderHeight) && scrollTop > 0) {
     //   $('.header').addClass('compaq');
       // $('.slideshow').addClass('compaq');
       // $('.arrowDown').addClass('hideArrow');
       // $('.nivo-caption').addClass('hideCaption');
        //$('#slider').data('nivoslider').stop();
	//} else if (scrollTop > (initialSliderHeight-lowHeaderHeight)){
     //   $('.header').addClass('compaq');
     //   $('.slideshow').addClass('compaq');
     //   sliderHeight=lowHeaderHeight;
	//} else {
     //   $('.slideshow').removeClass('compaq');
     //   $('.header').removeClass('compaq');
        //$('#slider').data('nivoslider').start();
    //}
   // $('.slideshow').css('height',sliderHeight );
	if( scrollTop > $('.header-threshold').outerHeight() )
		$('.header').addClass('compaq');
	else
		$('.header').removeClass('compaq');

	if( scrollTop  + $('.header-threshold').outerHeight() > $('.slideshow-container').outerHeight() )
		$('.slideshow-container').addClass('compaq');
	else
		$('.slideshow-container').removeClass('compaq');

	if( scrollTop > $(window).outerHeight() ){
		$('.scrollTop').addClass('active');
	}else{
		$('.scrollTop').removeClass('active');
	}
}

var carousel = {
	items: null,
	interval: 5000,
	refreshPills: function(){
		$('.slideshow-pills div').removeClass('active').eq($('.slideshow > .active').index()).addClass('active');
	},
	activate: function(index){
		var active = $('.slideshow > .active');
		active.removeClass('active');
		$('.slideshow > .slideshow-item').eq(index).addClass('active');
		carousel.refreshPills();

		if( carousel.intervalId ){
			clearInterval(carousel.intervalId);
		}
		carousel.intervalId = setInterval(carousel.next, carousel.interval);
	},
	next: function(){
		var active = $('.slideshow > div.active');
		active.removeClass('active');
		if( active.next().length > 0 ){
			active.next().addClass('active');
		}else{
			carousel.items.eq(0).addClass('active');
		}
		if( carousel.intervalId ){
			clearInterval(carousel.intervalId);
		}
		carousel.intervalId = setInterval(carousel.next, carousel.interval);
		carousel.refreshPills();
	},
	prev: function(){
		var active = $('.slideshow > div.active');
		active.removeClass('active');
		if( active.prev().length > 0  ){
			active.prev().addClass('active');
		}else{
			carousel.items.eq(carousel.items.length - 1).addClass('active');
		}
		if( carousel.intervalId ){
			clearInterval(carousel.intervalId);
		}
		carousel.intervalId = setInterval(carousel.next, carousel.interval);
		carousel.refreshPills();
	},
	init: function(){
		carousel.items = $('.slideshow > div');
		carousel.next();
	}
};
