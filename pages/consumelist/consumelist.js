// pages/consumelist/consumelist.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consumeList: [],
    noitem: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.consumeListGet();
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

  },
  /**
   * 获取消费记录
   */
  consumeListGet: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载中',
    });
    var openid = wx.getStorageSync("openid");
    if (openid == "" || openid == null || openid == undefined) return;
    var data = {openid: openid}
    wx.request({
      url: config.serverAddress + 'wxpay/consumelist',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("消费记录:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            var consumelist = res.data.response.consumelist;
            for(var i=0; i<consumelist.length; i++){
              consumelist[i].timeend = util.formatDateTime(consumelist[i].timeend);
              consumelist[i].totalfee = Number(consumelist[i].totalfee).toFixed(2);
            }
            that.setData({
              consumeList: res.data.response.consumelist
            })
          }
        }
      },
      complete: function(res){
        wx.hideLoading();
      }
    })
  }
})