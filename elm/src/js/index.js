//样式
import '../scss/index.scss';
import '../scss/common.scss';

import $ from 'jquery';

//载入插件
import BScroll from 'better-scroll';

import api from '../api/indexApi.js';

const topCateScroll = new BScroll('.top-cate-wrapper',{
	scrollX:true
});
//点击事件失效
//const firstCateScroll = new BScroll('.wrapper-first');

const catagory = {
	data:[],
	firstCateIndex : 1,
	secondCateIndex : 0
}

$(function(){
//ajax请求
	$.ajax({
		url:api.categoryApi,
		type:'get',
		dataType:'jsonp',
		jsonpCallback:'jsonp',
		success:function(data){
			catagory.data = data;
			console.log(catagory.data);
			//自动添加头部列表信息
			getTopCateHtml(catagory.data);
			//动态添加菜单列表信息
			getCategories(catagory.data);
		}
	})


//自动添加头部列表信息
function getTopCateHtml(cate){
	var cateHtml = "";
	var cateArr = cate[catagory.firstCateIndex].sub_categories;
	cateArr.map(function(val, key) {
		var curClass = "";
		if(key == catagory.secondCateIndex){
			curClass = "active";
		}
		cateHtml += "<a href='javascript:void(0)' class='"+ curClass +"'>"+val.name+"</a>";
	})
	$(".top-cate-wrapper .content").html(cateHtml);

	//动态计算content的宽度
	var cWidth = 0;
	var a = $('.top-cate-wrapper .content a')
	a.each(function(i){
		cWidth += parseInt($(this).innerWidth());
	});
	$(".top-cate-wrapper .content").width(cWidth+"px");
}

//动态添加菜单列表信息
function getCategories(categories){
	//一级菜单
	var firHtml = "";
	for(let i=1;i<categories.length;i++){
		var curClass = "";
		if(i == catagory.firstCateIndex){
			curClass = "active";
		}
		firHtml += "<li class='"+ curClass +"' index='"+i+"'>"+categories[i].name+"<span>"+categories[i].count+"</span></li>";
	}
	$(".content-first .content").html(firHtml);

	//二级菜单
	var secHtml = "";
	var tempCateArr = categories[catagory.firstCateIndex].sub_categories;
	var suffixArr = ['png','jpg','jpeg','gif'];
	tempCateArr.map(function(val,k){
		var curClass = "";
		if(k == catagory.secondCateIndex){
			curClass = "active";
		}
		var img = val.image_url;
		var suffix = "";
		for(let i=0;i<suffixArr.length;i++){
			var startI = img.indexOf(suffixArr[i]);
			if(startI != -1){
				suffix = '.'+img.substr(startI);
			}
		}
		var src = 'http://fuss10.elemecdn.com/'+img[0]+'/'+img[1]+img[2]+img.substr(3)+suffix+"?imageMogr/format/webp/thumbnail/!80x80r/gravity/Center/crop/80x80/";
		//console.log(suffix);
		secHtml += "<li class='"+ curClass +"' index='"+k+"'><img src='"+src+"'/>"+val.name+"<span>"+val.count+"</span></li>";
	});
	$(".content-second .content").html(secHtml);
}

//菜单切换
//一级菜单切换
var firstCateUl = $('.content-first .wrapper-first .content');
firstCateUl.delegate('li', 'click', function(event) {
	catagory.firstCateIndex = $(this).attr('index');
	catagory.secondCateIndex = 0;
	getCategories(catagory.data);
});
//二级菜单
var secondCateUl = $('.content-second .wrapper .content');
secondCateUl.delegate('li', 'click', function(event) {
	_switch('close');
	catagory.secondCateIndex = $(this).attr('index');
	//自动添加头部列表信息
	getTopCateHtml(catagory.data);
	//动态添加菜单列表信息
	getCategories(catagory.data);
});


//开
$('.top-cate-op').click(function(){
	_switch('open');
})
//关
$('.categories-close').click(function(){
	_switch('close');
})
//封装开关函数
function _switch(state){
	$('.top-cate-all').attr('class','top-cate-all '+state);
}

})