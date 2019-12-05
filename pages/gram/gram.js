// pages/gram/gram.js
var config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadfile:""
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

  choosefilefun: function() {
    let _that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log(_that, ' :this');
        console.log(res, " :res");

        _that.setData({
          uploadfile: res.tempFiles[0],
        })
      }
    })
  },
  uploadfilefun:function() {
    let { uploadfile } = this.data;
    if (uploadfile.length == 0) {
      wx.showToast({
        title: '请选择要上传的文件',
      })
      return;
    }
    let $this = this;
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: config.serverAddress.url + '/upload', // 请求服务端文件,
      filePath: uploadfile.path,
      name: uploadfile.name,
      header: {
        "content-type": "multipart/form-data;charset=UTF-8",
      },
      formData: {},
      success: function (res) {
        let data = JSON.parse(res.data)
        if (data.code == 1) {
          console.log('上传成功')
        }
      },
      fail: function (res) {
        console.log(res, " :失败res");
      },
      complete: function (res) {
        wx.hideLoading();
        //TODO判断成功还是失败，在做下一步处理。
        var para = "filename=" + uploadfile.name + "&filesize=1M&wordnum=123456";
        wx.navigateTo({ url: "../gramend/gramend?" + para });
      }
    })
  }
})