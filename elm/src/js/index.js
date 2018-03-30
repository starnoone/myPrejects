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

const catagory = {
	data:[],
	firstCateIndex : 1,
	secondCateIndex : 0
}

//ajax请求
$(function(){
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
})


//自动添加头部列表信息
function getTopCateHtml(cate){
	var cateHtml = "";
	var cateArr = cate[catagory.firstCateIndex].sub_categories;
	cateArr.map(function(val, key) {
		cateHtml += "<a href='javascript:void(0)'>"+val.name+"</a>";
	})
	$(".top-cate-wrapper .content").html(cateHtml);

	//动态计算content的宽度
	
}

//动态添加菜单列表信息
function getCategories(categories){
	//一级菜单
	var firHtml = "";
	for(let i=1;i<categories.length;i++){
		var curClass = "";
		if(i === catagory.firstCateIndex){
			curClass = "active";
		}
		firHtml += "<li class='"+ curClass +"'>"+categories[i].name+"</li>";
	}
	$(".content-first .content").html(firHtml);

	//二级菜单
	var secHtml = "";
	var tempCateArr = categories[catagory.firstCateIndex].sub_categories;
	tempCateArr.map(function(val,k){
		var curClass = "";
		if(k === catagory.secondCateIndex){
			curClass = "active";
		}
		secHtml += "<li class='"+ curClass +"'>"+val.name+"</li>";
	});
	$(".content-second .content").html(secHtml);
}