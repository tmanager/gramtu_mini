// pages/mine/mine.js
var app = getApp();
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,//定义登录弹窗,
    userInfoScope: 0,
    userInfo: app.globalData.userInfo,
    mark:5,
    mode: [
      { icon: "../../images/jiang.png", title:"修改降重", url:""},
      { icon: "../../images/runse.png", title: "母语润色", url: "" },
      { icon: "../../images/rengong1.png", title: "人工翻译", url: "" },
      { icon: "../../images/xiezuo.png", title: "Essay写作", url: "" }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var register = wx.getStorageSync("register");
    var mark = wx.getStorageSync("mark");
    this.setData({
      mark: mark
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.setData({
            userInfoScope: 1
          });
        }
      }
    })
    if (register == 1 && app.globalData.userInfo == null){
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          console.info(res.userInfo);
          this.setData({
            userInfo: res.userInfo
          });
        },
        complete:res=>{
          console.info("wx.userInfo:" + JSON.stringify(res));
        }
      })
    }else{
      this.setData({
        userInfo: app.globalData.userInfo
      });
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

  },
  bindGetUserInfo: function(e){
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.setStorageSync("userinfo", e.detail.userInfo);
      that.showDialogBtn();//调用一键获取手机号弹窗（自己写的）
    }
  },
  getUserInfoScope: function(e){
    var that = this;
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        wx.setStorageSync("userinfo", res.userInfo);
        that.showDialogBtn();//调用一键获取手机号弹窗（自己写的）
      },
      complete: res => {
        console.info("wx.userInfo:" + JSON.stringify(res));
      }
    })
  },
  // 显示一键获取手机号弹窗
  showDialogBtn: function () {
    this.setData({
      showModal: true//修改弹窗状态为true，即显示
    })
  },
  // 隐藏一键获取手机号弹窗
  hideModal: function () {
    this.setData({
      showModal: false//修改弹窗状态为false,即隐藏
    });
  },
  bindgetPhoneNumber: function (e) {
    const self = this;
    self.hideModal();
    console.info(e.detail.errMsg);
    console.info(e.detail.iv);
    console.info(e.detail.encryptedData);
    var openid = wx.getStorageSync("openid");
    var sessionKey = wx.getStorageSync('sessionKey');
    var userInfo = wx.getStorageSync('userinfo');
    var register = wx.getStorageSync("register");
    if(e.detail.errMsg == 'getPhoneNumber:ok' ) {
      var data = {
        register: register,
        openid: openid,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionkey: sessionKey,
        nickname: userInfo.nickName,
        avatarurl: userInfo.avatarUrl,
        gender: userInfo.gender,
        country: userInfo.country,
        province: userInfo.province,
        city: userInfo.city,
        language: userInfo.language
      }
      wx.request({
        url: config.serverAddress + 'login/userinfo',
        data: util.sendMessageEdit(null, data),
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: function (res) {
          if (res.statusCode == 200) {
            console.info("login/userinfo:" + JSON.stringify(res.data));
            if (res.data.retcode === config.SUCCESS) {
              wx.setStorageSync("register", "1");
              self.setData({
                userInfo: userInfo,
                mark: 0
              });
            } else {
              self.registFail();
            }
          } else {
            self.registFail();
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { 
          //后台获取手机号码
        }
      })
    }
  },
  registFail:function(){
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '登录失败',
      success: function (res) {
        //后台获取手机号码
      }
    })
  }
})