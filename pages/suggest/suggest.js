// pages/suggest/suggest.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 输入框输入事件
   */
  getInputValue(e) {
    console.log(e)
    switch (e.target.id) {
      case "phone":
        this.setData({
          phone: e.detail.value
        });
        break;
      case "question":
        this.setData({
          question: e.detail.value
        });
        break;
    }
  },
  /**
   * 投诉建议提交
   */
  suggestSubmit: function (e) {
    var that = this;
    var phone = this.data.phone;
    var question = this.data.question;
    if (question == "" || question == undefined) {
      wx.showToast({
        title: '问题详情必须输入！',
        icon: 'none'
      })
      return;
    }
    if (!util.phoneCheck(phone)) {
      wx.showToast({
        title: '联系方式未输入或者格式不正确！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在加载中',
    });
    var openid = wx.getStorageSync("openid");
    var data = { openid: openid, question: question, phone: phone }
    wx.request({
      url: config.serverAddress + 'suggest/send',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          console.info("投诉建议:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            wx.showToast({
              title: '投诉建议提交成功！',
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: '投诉建议提交失败！',
              icon: 'none'
            })
          }
        }
      },
      fail: function (res) {
        wx.hideLoading();
        console.info(res);
        wx.showToast({
          title: '投诉建议提交失败！',
          icon: 'none'
        })
      }
    })
  },
})