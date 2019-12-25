//index.js
//获取应用实例
const app = getApp();
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');

var bannerList = ['../../images/banner_01.jpg', '../../images/banner_02.jpg', '../../images/banner_03.jpg', '../../images/banner_04.jpg'];
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

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banner_url: bannerList,
    tsfwList: tsfwList,
    tsContentHeight: Math.ceil(tsfwList.length / 3) * 230,
    tsHeight: Math.ceil(tsfwList.length / 3) * 230 + 100,
    galleryList: galleryList,
    abroadList:[],
    newbornList: [{ id: "1", title: "新人福利" }, { id: "2", title: "成为GramTu会员送免费查重" }]
  },
  onLoad: function () {
    this.adListGet();
    this.servListGet();
    this.articleListGet();
    this.abroadListGet();
    this.newbornListGet();
  },
  //获取广告图片列表
  adListGet:function(){
    var that = this;
    var data = { title: "", currentpage: "1", pagesize: "10", startindex: "0", draw: 1 };
    wx.request({
      url: config.serverAddress + "advert/query",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取广告信息：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS){
            var adList = res.data.response.adlist;
            var adTemp = [];
            for(var i=0; i<adList.length; i++){
              adTemp.push(adList[i].adimage);
            }
            that.setData({
              banner_url: adTemp
            })
          }  
        }
      }
    })
  },
  //获取特色服务列表
  servListGet: function () {
    var that = this;
    var data = { title: "", currentpage: "1", pagesize: "10", startindex: "0", draw: 1 };
    wx.request({
      url: config.serverAddress + "feature/query",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取特色服务信息：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS) {
            var servList = res.data.response.servlist;
            that.setData({
              tsfwList: servList,
              tsContentHeight: Math.ceil(servList.length / 3) * 230,
              tsHeight: Math.ceil(servList.length / 3) * 230 + 100,
            })
          }
        }
      }
    })
  },
  //获取文章列表
  articleListGet: function () {
    var that = this;
    var data = { title: "", currentpage: "1", pagesize: "10", startindex: "0", draw: 1 };
    wx.request({
      url: config.serverAddress + "article/query",
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
            var artList = res.data.response.artlist;
            that.setData({
              galleryList: artList
            })
          }
        }
      }
    })
  },
  //获取海外招募
  abroadListGet: function () {
    var that = this;
    var data = { title: "", currentpage: "1", pagesize: "10", startindex: "0", draw: 1 };
    wx.request({
      url: config.serverAddress + "abroad/query",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取海外招募信息：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS) {
            var abroadList = res.data.response.abroadlist;
            that.setData({
              abroadList: abroadList
            })
          }
        }
      }
    })
  },
  //获取海外招募
  newbornListGet: function () {
    var that = this;
    var data = { title: "", currentpage: "1", pagesize: "10", startindex: "0", draw: 1 };
    wx.request({
      url: config.serverAddress + "newborn/query",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取新人专区信息：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS) {
            var newbornList = res.data.response.newbornlist;
            that.setData({
              newbornList: newbornList
            })
          }
        }
      }
    })
  }
})
