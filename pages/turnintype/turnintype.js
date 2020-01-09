// pages/turnintype/turnintype.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checktype: "0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      checktype: options.checktype
    })
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
   * 按钮事件
   */
  turninTypeChoose: function(e){
    //type:"0"：国际查重， "1":UK查重，"2"：语法检测
    var that = this;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../turninfile/turninfile?checktype=' + that.data.checktype + "&type=" + type
    })
  }

})