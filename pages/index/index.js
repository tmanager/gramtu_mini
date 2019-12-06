//index.js
//获取应用实例
const app = getApp();
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');

var bannerList = ['../../images/banner_01.jpg', '../../images/banner_02.jpg', '../../images/banner_03.jpg', '../../images/banner_04.jpg'];
var tsfwList = [
  { title: "Essay修改降重", image: "../../images/ts.png" },
  { title: "英语母语润色", image: "../../images/ts.png" },
  { title: "专业人工翻译", image: "../../images/ts.png" },
  { title: "签证翻译盖章", image: "../../images/ts.png" },
  { title: "留学文书", image: "../../images/ts.png" },
  { title: "Essay写作", image: "../../images/ts.png" }
];

var galleryList = [
  {
    image: '../../images/ts.png',
    title: '论文重复率越查越高？知网、万方、维普等查重原理揭晓',
    read: '20378'
  }, {
    image: '../../images/ts.png',
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
    galleryList: galleryList
  },
  onLoad: function () {
    //获取用户
    var that= this;
    var data = { userid: "", username: "", organid: "", currentpage: "", pagesize: "10", startindex: "0", draw: 1 }
    wx.request({
      url: config.serverAddress + "userquery",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        console.info("获取用户信息：")
        console.log(res.data) //获取openid 
      }
    })
  }
})
