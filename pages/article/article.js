// pages/article/article.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    articleAddress: config.articleAddress
    /*title: "1",
    editor: "1",
    time: "201912160000",
    content: "123456"*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    /*var that = this;
    var data = { id: that.data.id };
    wx.request({
      url: config.serverAddress + "artdetail",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.status == 200) {
          console.info("获取文章信息：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS)
            that.setData({
              title: res.data.response.title,
              editor: res.data.response.editor,
              time: res.data.response.time,
              content: res.data.response.content
            })
        }
      }
    })*/
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