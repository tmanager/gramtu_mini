// pages/article/article.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleAddress: config.articleAddress,
    template:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      artid: options.artid || '',
      adid: options.adid || '',
      servid: options.servid || '',
      abroadid: options.abroadid || '',
      newbornid: options.newbornid || '',
      adtype: options.adtype || '',
      servtype: options.servtype || '',
      innerurl: options.url || '',
      servlink: options.servlink || '',
      manmadeid: options.manmadeid || '',
      title: options.title || ''
    });
    if (this.data.artid != ""){
      this.setData({
        template: config.articleAddress + "?artid=" + this.data.artid
      })
    }
    if (this.data.adid != "") {
      if (this.data.adtype == 0){
        this.setData({
          template: this.data.innerurl
        })
      }else{
        this.setData({
          template: config.articleAddress + "?adid=" + this.data.adid
        })
        wx.setNavigationBarTitle({
          title: this.data.title
        })
      }

    }
    if (this.data.servid != "") {
      if (this.data.servtype == 0) {
        this.setData({
          template: this.data.servlink
        })
      } else {
        this.setData({
          template: config.articleAddress + "?servid=" + this.data.servid
        })
        wx.setNavigationBarTitle({
          title: "特色服务"
        })
      }
    }
    if (this.data.abroadid != "") {
      this.setData({
        template: config.articleAddress + "?abroadid=" + this.data.abroadid
      })
      wx.setNavigationBarTitle({
        title: "海外招募"
      })
    }
    if (this.data.newbornid != "") {
      this.setData({
        template: config.articleAddress + "?newbornid=" + this.data.newbornid
      })
      wx.setNavigationBarTitle({
        title: "新人专区"
      })
    }
    if (this.data.manmadeid != "") {
      this.setData({
        template: config.articleAddress + "?manmadeid=" + this.data.manmadeid
      })
      wx.setNavigationBarTitle({
        title: this.data.title
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})