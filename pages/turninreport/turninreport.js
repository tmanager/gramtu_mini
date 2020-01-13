// pages/turninreport/turninreport.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      filename: options.filename,
      filesize: options.filesize,
      repetrate: options.repetrate,
      pdfreporturl: options.pdfreporturl,
      htmlreporturl: options.htmlreporturl,
      status: options.status,
      updtime: options.updtime,
      wordcnt: this.format(options.wordcnt),
      email: options.email,
      orderid: options.orderid,
      checktype: options.checktype,
      title: options.title,
      openid: options.openid
    })
  },
  format: function (num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&,');
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
   * 下载文件到本地
   */
  OpenFile: function(){
    var report = this.data.pdfreporturl; 
    //"https://www.gramtu.com/group1/M00/00/03/rBBVI14cCTKAUrRGABwb-o-7Ns0997.pdf";
    wx.showLoading({
      title: '正在加载中',
    });
    wx.downloadFile({
      url: report, 
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容  
        console.info(res);
        if (res.statusCode === 200) {
          wx.openDocument({
            filePath: res.tempFilePath,
            fileType: 'pdf',
            success(res) {
              wx.hideLoading();
              console.info(res);
            },
            fail(res){
              wx.hideLoading();
              console.info(res);
              wx.showToast({
                title: '打开文件失败！',
                icon: 'none'
              })
            }
          })
        }
      },
      fail(res){
        wx.hideLoading();
        console.info(res);
        wx.showToast({
          title: '下载文件失败！',
          icon: 'none'
        })
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
  /**
   * 确认邮箱
   */
  sendMailDialog: function(){
    this.showDialogBtn();
  },
   /**
   * 输入框输入事件
   */
  getInputValue(e) {
    console.log(e)// {value: "ff", cursor: 2}  
    switch (e.target.id) {
      case "email":
        this.setData({
          email: e.detail.value
        });
        break;
    }
  },
  /**
   * 发送邮件
   */
  sendMail: function () {
    if(!this.validateMail(this.data.email)){
      wx.showToast({
        title: '邮箱为空或者邮箱格式不正确！',
        icon: 'none'
      })
      return;
    }
    this.hideModal();
    wx.showLoading({
      title: '正在加载中',
    });
    var data = { orderid: this.data.orderid, email: this.data.email, pdfreporturl: this.data.pdfreporturl, title: this.data.title, checktype: this.data.checktype, openid: this.data.openid }
    wx.request({
      url: config.serverAddress + 'email/send',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          wx.hideLoading();
          console.info("发送邮件:" + JSON.stringify(res.data));
          wx.showToast({
            title: '邮件发送成功！',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '邮件发送失败，请重试！',
          icon: 'none'
        })
      }
    })
  },
  //校验邮箱
  validateMail: function (mail){
    if(mail == "") return false;
    var strRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!strRegex.test(mail)) {
      return false;
    }
    return true;
  }
})