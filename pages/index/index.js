//index.js
//获取应用实例
const app = getApp();
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');

var bannerList = [
  {
    "adtype": "0",
    "adid": "2",
    "adimage": "http://www.gramtu.com/group1/M00/00/00/rBBVI136KKKAQSSPAABaO2gQgo0198.png",
    "sort": 2,
    "innerurl": "https://mq.weixin.qq.com",
    "title": "www"
  },
  {
    "adtype": "1",
    "adid": "1",
    "adimage": "http://www.gramtu.com/group1/M00/00/00/rBBVI136KKKAQSSPAABaO2gQgo0198.png",
    "sort": 3,
    "innerurl": "",
    "title": "sdf"
  },
  {
    "adtype": "0",
    "adid": "2eaee66e3d074e3fbb1627be83acd76c",
    "adimage": "http://www.gramtu.com/group1/M00/00/00/rBBVI14AWqiAGVluAAEOsUeF3mA281.jpg",
    "sort": 22,
    "innerurl": "https://www.baidu.com",
    "title": "22"
  },
  {
    "adtype": "0",
    "adid": "f32c90a62d8f4be7bd692de2bfca1a7a",
    "adimage": "http://www.gramtu.com/group1/M00/00/00/rBBVI14AW-6AbSxpAAEOsUeF3mA388.jpg",
    "sort": 4444,
    "innerurl": "https://www.baidu.com",
    "title": "4444"
  }
];
var tsfwList = [
  { servname: "Essay修改降重", servimage: "../../images/ts.png", servlink: "" },
  { servname: "英语母语润色", servimage: "../../images/ts.png", servlink: ""  },
  { servname: "专业人工翻译", servimage: "../../images/ts.png", servlink: ""  },
  { servname: "签证翻译盖章", servimage: "../../images/ts.png", servlink: ""  },
  { servname: "留学文书", servimage: "../../images/ts.png", servlink: ""  },
  { servname: "Essay写作", servimage: "../../images/ts.png", servlink: ""  }
];

var galleryList = [
  {
    id: 1,
    coverimage: '../../images/ts.png',
    title: '论文重复率越查越高？知网、万方、维普等查重原理揭晓',
    read: '20378'
  }, {
    id: 2,
    coverimage: '../../images/ts.png',
    title: '论文查重前解决这些问题，合格几率将大大增加',
    read: '2022'
  }
];

var currentPage = 0;
var totalPage = 0;
var pageSize = 5;
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banner_url: bannerList,
    tsfwList: tsfwList,
    tsContentHeight: Math.ceil(tsfwList.length / 3) * 250,
    tsHeight: Math.ceil(tsfwList.length / 3) * 250 + 100,
    galleryList: galleryList,
    abroadList:[],
    newbornList: [{ id: "1", title: "新人福利新人福利" }, { id: "2", title: "成为GramTu会员送免费查重" }],
    noitem:0
  },
  onLoad: function () {
    this.indexListGet();
    this.articleListGet();
  },
  //获取广告图片列表
  indexListGet:function(){
    var that = this;
    var data = { title: "", currentpage: "1", pagesize: "10", startindex: "0", draw: 1 };
    wx.request({
      url: config.serverAddress + "index/query",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取首页信息：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS){
            var response = res.data.response;
            that.setData({
              banner_url: response.adlist,
              tsfwList: response.servlist,
              tsContentHeight: Math.ceil(response.servlist.length / 3) * 230,
              tsHeight: Math.ceil(response.servlist.length / 3) * 230 + 100,
              abroadList: response.abroadlist,
              newbornList: response.newbornlist
            })
          }  
        }
      }
    })
  },
  //获取文章列表
  articleListGet: function () {
    var that = this;
    var data = { title: "", currentpage: currentPage, pagesize: pageSize, 
      startindex: currentPage * pageSize, draw: 1 };
    wx.request({
      url: config.serverAddress + "index/article/query",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取文章信息：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS) {
            totalPage = Math.ceil(res.data.response.totalcount / pageSize);
            var artList = res.data.response.artlist;
            that.setData({
              galleryList: artList
            })
          }
        }
      },
      complete:function(res){
        wx.hideLoading();
      }
    })
  },
  onReachBottom: function () {
    if((currentPage + 1) >= totalPage){
      this.setData({
        noitem: 1
      });
      return;
    }else{
      this.setData({
        noitem: 0
      });
    }
    currentPage ++;
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '正在加载中',
    });
    that.articleListGet();
  }
})
