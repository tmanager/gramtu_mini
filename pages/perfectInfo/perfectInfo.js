// pages/perfectInfo/perfectInfo.js
var config = require('../../utils/config.js')
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    major:"",
    learncountry:"",
    email:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
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
   * 获取用户信息
   */
  getUserInfo: function(){
    var that = this;
    var openid = wx.getStorageSync("openid");
    if (openid == "" || openid == null || openid == undefined) return;
    wx.showLoading({
      title: '正在加载中',
    });
    var data = {openid: openid}
    wx.request({
      url: config.serverAddress + 'login/user/perinfo',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("用户信息:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            that.setData({
              major: res.data.response.major,
              learncountry: res.data.response.learncountry,
              email: res.data.response.email
            })
          }
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  /**
   * 保存信息
   */
  saveUserInfo: function () {
    var that = this;
    if (this.data.learncountry == "") {
      wx.showToast({
        title: '毕业院校所在国家必须输入',
        icon: 'none'
      })
      return;
    }
    if (this.data.major == "") {
      wx.showToast({
        title: '专业必须输入',
        icon: 'none'
      })
      return;
    }
    if (!this.validateMail(this.data.email)){
      wx.showToast({
        title: '邮箱为空或者邮箱格式不正确！',
        icon: 'none'
      })
      return;
    }
    var openid = wx.getStorageSync("openid");
    wx.showLoading({
      title: '正在加载中',
    });
    var data = { openid: openid, major: this.data.major, learncountry: this.data.learncountry, email: this.data.email };
    wx.request({
      url: config.serverAddress + 'login/user/saveperinfo',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("用户信息:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            wx.showToast({
              title: '保存信息成功！',
              icon: 'none'
            })
          }
        }else{
          wx.showToast({
            title: '保存信息失败！',
            icon: 'none'
          })
        }
      },
      fail: function(res){
        console.info(res);
        wx.showToast({
          title: '保存信息失败！',
          icon: 'none'
        })
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  /**
   * 输入框输入事件
   */
  getInputValue(e) {
    console.log(e)// {value: "ff", cursor: 2}  
    switch (e.target.id) {
      case "major":
        this.setData({
          major: e.detail.value
        });
        break;
      case "learncountry":
        this.setData({
          learncountry: e.detail.value
        });
        break;
      case "email":
        this.setData({
          email: e.detail.value
        });
        break;
    }
  },
  //校验邮箱
  validateMail: function (mail) {
    if (mail == "") return false;
    var strRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!strRegex.test(mail)) {
      return false;
    }
    return true;
  }
})