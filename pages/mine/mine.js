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
      { icon: "", title: "投诉建议", url: "" }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var register = wx.getStorageSync("register");
    var mark = wx.getStorageSync("mark");
    this.setData({
      mark: mark
    });
    if (register == 1 && app.globalData.userInfo == null){
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          this.setData({
            userInfo: res.userInfo
          });
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
  getPhoneNumber: function (e) {
    const self = this;
    console.info(e.detail.errMsg);
    console.info(e.detail.iv);
    console.info(e.detail.encryptedData);
    var openid = wx.getStorageSync("openid");
    var data = {
      openid: openid,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    if(e.detail.errMsg == 'getPhoneNumber:ok' ) {
      wx.request({
        url: config.serverAddress + 'decodephone',
        data: util.sendMessageEdit(null, data),
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.retcode === config.SUCCESS) {
              wx.setStorageSync('register', 1);
              var json = JSON.parse(res.data.response)
              //获取昵称
              wx.getUserInfo({
                success: res => {
                  //注册
                  var data = {
                    openid: openid,
                    nickname: res.userInfo.nickName,
                    avatar: res.userInfo.avatarUrl
                  }
                  wx.request({
                    url: config.serverAddress + 'userinfo',
                    data: util.sendMessageEdit(null, data),
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      if (res.statusCode == 200) {
                        if (res.data.retcode === config.SUCCESS) {
                          self.setData({
                            userInfo: res.userInfo,
                            mark: 0
                          });
                        } else {
                          self.registFail();
                        }
                      }else{
                        self.registFail();
                      }
                    }
                  })
                }
              })               
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