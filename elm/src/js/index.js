//样式
import '../scss/index.scss';
import '../scss/common.scss';

import $ from 'jquery';

//载入插件
import BScroll from 'better-scroll';

import api from '../api/indexApi.js';

const topCateScroll = new BScroll('.top-cate-wrapper',{
	scrollX:true,
	click:true
});
const firstCateScroll = new BScroll('.wrapper-first',{
	scrollY:true,
	click:true
});
const secondCateUl = new BScroll('.wrapper-second',{
	scrollY:true,
	click:true
});

const catagory = {
	data:[],
	firstCateIndex : 1,
	dirFirstCateIndex:1,
	secondCateIndex : 0
}

$(function(){
//ajax请求
	$.ajax({
		url:api.categoryApi,
		type:'get',
		async:false,
		dataType:'jsonp',
		jsonpCallback:'jsonp',
		success:function(data){
			catagory.data = data;


			//console.log(catagory.data);
			var allId = "";
			var idArr = catagory.data[catagory.firstCateIndex].sub_categories;
			for(let j=0;j<idArr.length;j++){
				allId += '&restaurant_category_ids[]=' + idArr[j].id;
			}
			console.log(allId);
			$.ajax({
				url:api.resCateApi,
				type:'get',
				async:false,
				data:{cate_id:allId},
				dataType:'jsonp',
				jsonpCallback:'jsonp',
				before:function(){
					$('.restaurant-list').html('加载中...');
				},
				success:function(data){
					//获取商家信息
					getResterantHtml(data.items);
				}


			//自动添加头部列表信息
			getTopCateHtml(catagory.data);
			//动态添加菜单列表信息
			getCategories(catagory.data);
		}
	})

	



//点击头部菜单获取商家信息列表
$('.top-cate-wrapper .content').delegate('a', 'click', function() {
	$(this).addClass('active').siblings('a').removeClass('active');
	catagory.secondCateIndex = $(this).attr('index');
	var id = catagory.data[catagory.firstCateIndex].sub_categories[catagory.secondCateIndex].id;
	//获取数据
	$.ajax({
		url:api.resCateApi,
		type:'get',
		data:{cate_id:'&restaurant_category_ids[]='+id},
		async:false,
		dataType:'jsonp',
		jsonpCallback:'jsonp',
		before:function(){
			$('.restaurant-list').html('加载中...');
		},
		success:function(data){
			//获取商家信息
			getResterantHtml(data.items);
		}

	})
});

//获取商家信息
function getResterantHtml(data){
	let resHtml = "";
	for(let i=0;i<data.length;i++){
		console.log(data[i]);
		//活动结构构建
		let activitesHtml = '';
		var suffixArr = ['png','jpg','jpeg','gif'];
		var img = data[i].restaurant.image_path;
		var suffix = "";
		for(let i=0;i<suffixArr.length;i++){
			var startI = img.indexOf(suffixArr[i]);
			if(startI != -1){
				suffix = '.'+img.substr(startI);
			}
		}
		var src = 'http://fuss10.elemecdn.com/'+img[0]+'/'+img[1]+img[2]+img.substr(3)+suffix+"?imageMogr/format/webp/thumbnail/!80x80r/gravity/Center/crop/80x80/";
		data[i].restaurant.activities.map(function(v,k){
			activitesHtml += `<li><span class="icon" style="background-color:#`+ v.icon_color +`">`+ v.icon_name +`</span>`+ v.name +`</li>`;
		});
		resHtml += `<div class="restaurant-item">
			<div class="thumb"><img src="`+src+`" /></div>
				<div class="info">
					<h3>`+data[i].restaurant.name+`</h3>
					<div class="data">
						<div class="d-top">
							<p>
								<span>`+data[i].restaurant.rating+`</span>
								<span>月销`+ data[i].restaurant.recent_order_num +`单</span>
							</p>
							<p>蜂鸟配送</p>
						</div>
						<div class="d-bottom">
							<p>
								<span>￥`+ data[i].restaurant.float_minimum_order_amount +`起送</span>
								<span>配送费￥9</span>
							</p>
							<p>
								<span>`+ data[i].restaurant.distance +`米</span>
								<span>`+ data[i].restaurant.order_lead_time +`分钟</span>
							</p>
						</div>
						<div class="tags">`+ data[i].restaurant.recommend.reason +`</div>
					</div>
					<div class="activites">
						<div class="act-list">
							<ul>`+activitesHtml+`</ul>
						</div>
						<div class="act-op">
							`+ data[i].restaurant.activities.length +`个活动
						</div>
					</div>
				</div>
		</div>`
	}
	$('.restaurant-list').html(resHtml);
}
//自动添加头部列表信息
function getTopCateHtml(cate){
	var cateHtml = "";
	var cateArr = cate[catagory.firstCateIndex].sub_categories;
	cateArr.map(function(val, key) {
		var curClass = "";
		if(key == catagory.secondCateIndex){
			curClass = "active";
		}
		cateHtml += "<a href='javascript:void(0)' index='"+key+"' class='"+ curClass +"'>"+val.name+"</a>";
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
		if(k == catagory.secondCateIndex && catagory.dirFirstCateIndex == catagory.firstCateIndex){
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
	catagory.dirFirstCateIndex = catagory.firstCateIndex;
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