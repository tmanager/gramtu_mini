// pages/couplist/couplist.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['查重', '语法检测'],
    currentNavbar: '0',
    couponList: [],
    noitem: 1,
    showModal: 0,
    givenId: "",
    givenPhone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.coupListGet();
    wx.getSystemInfoSync()
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
   * 切换 navbar
   */
  swichNav(e) {
    this.setData({
      currentNavbar: e.currentTarget.dataset.idx
    });
    this.coupListGet();
  },
  /**
   * 获取优惠券记录
   */
  coupListGet: function () {
    var that = this;
    var openid = wx.getStorageSync("openid");
    if (openid == "" || openid == null || openid == undefined) return;
    wx.showLoading({
      title: '正在加载中',
    });
    var checkType = "0";
    if(that.data.currentNavbar == 1){
      checkType = "2";
    }
    var data = { openid: openid, checktype: checkType, currentpage: "0", pagesize: "10", startindex: "0", draw: 1}
    wx.request({
      url: config.serverAddress + 'coupon/query',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("优惠券记录:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            var couponlist = res.data.response.couponlist;
            for (var i = 0; i < couponlist.length; i++) {
              couponlist[i].enddate = util.formatDate(couponlist[i].enddate);
            }
            that.setData({
              couponList: res.data.response.couponlist
            })
          }
        }
      },
      complete: function (res) {
        wx.hideLoading();
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
  coupGivenDialog: function(e){
    //TODO:两个-1的不能赠送
    var id = e.currentTarget.dataset.id;
    var list = this.data.couponList;
    var coupid = "";
    for (var i = 0; i < list.length; i++){
      if (id == list[i].id){
        coupid = list[i].couponid;
        if (list[i].upfee == "-1" && list[i].amount == "-1"){
          wx.showToast({
            title: '该优惠券不能转赠！',
            icon: 'none'
          });
          return;
        }
      }
    }
    this.setData({
      givenId: id,
      coupId: coupid,
      givenPhone: ""
    });
    this.showDialogBtn();
  },

  coupGiven: function (e) {
    var that = this;
    var givenPhone = this.data.givenPhone;
    if (!util.phoneCheck(givenPhone)){
      wx.showToast({
        title: '转赠手机号码未输入或者格式不正确！',
        icon: 'none'
      })
      return;
    }
    that.hideModal();
    wx.showLoading({
      title: '正在加载中',
    });
    var openid = wx.getStorageSync("openid");
    var data = { openid: openid, phonenumber: givenPhone, id: this.data.givenId, couponid: this.data.coupId}
    wx.request({
      url: config.serverAddress + 'coupon/given',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          console.info("赠送优惠券:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            that.coupListGet();
          }else{
            wx.showToast({
              title: '优惠券转赠失败:' + res.data.retmsg,
              icon: 'none'
            })
          }
        }
      },
      fail:function(res){
        wx.hideLoading();
        wx.showToast({
          title: '优惠券转赠失败！',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 输入框输入事件
   */
  getInputValue(e) {
    console.log(e)// {value: "ff", cursor: 2}  
    switch (e.target.id) {
      case "phone":
        this.setData({
          givenPhone: e.detail.value
        });
        break;
    }
  }
})