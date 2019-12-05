// pages/mine/mine.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    mark:5,
    mode: [
      { icon: "", title:"修改降重", url:""},
      { icon: "", title: "母语润色", url: "" },
      { icon: "", title: "人工翻译", url: "" },
      { icon: "", title: "Essay写作", url: "" },
      { icon: "", title: "在线客服", url: "" },
      { icon: "", title: "投诉建议", url: "" }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
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
  getPhoneNumber: function (e) {
    console.info(e.detail.errMsg);
    console.info(e.detail.iv);
    console.info(e.detail.encryptedData);
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || 
      e.detail.errMsg == 'getPhoneNumber:fail Error: 该 appid 没有权限' ) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { 
          //输入手机号码
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) { 
          //后台获取手机号码
        }
      })
    }
  }
})