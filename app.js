//app.js
var config = require('utils/config.js');
var util = require('utils/util.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.setStorageSync('openid',"");
    wx.setStorageSync('registre', "0");
    wx.setStorageSync('mark', "0");
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var data = { code: res.code};
        wx.request({
          url: config.serverAddress + 'login',
          data: util.sendMessageEdit(null, data),
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            const self = this
            if (res.statusCode == 200) {
              if (res.data.retcode === config.SUCCESS) {
                var json = JSON.parse(res.data.response)
                wx.setStorageSync('openid', json.openid);
                wx.setStorageSync('register', json.registe);
                wx.setStorageSync('mark', json.mark);
                if(json.register == 1){
                  this.getUserInfo();
                }
              }
            }
          }
        }) 
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          
        }
      }
    })
  },
  getUserInfo: function(){
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})