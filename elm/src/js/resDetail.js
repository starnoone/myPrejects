//样式
import '../scss/common.scss';
import '../scss/resDetail.scss';

import $ from 'jquery';

//载入插件
import BScroll from 'better-scroll';
$(function(){
	//shop-tab tab选项卡
	$('.shop-tab-nav').delegate('a','click',function(){
		$(this).addClass('on').siblings('a').removeClass('on');
		var index = $(this).attr('index');
		$('.shop-tab-content').eq(index).addClass('on').siblings('div').removeClass('on');
	})
})
