// pages/couplist/couplist.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var currentPage = 0;
var totalPage = 0;
var pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['查重', '语法检测'],
    currentNavbar: '0',
    couponList: [
      { "name": "3元优惠券", enddate: "2020/01/08", amount: 3, upfee: 10, status: 0},
      { "name": "3元优惠券", enddate: "2020/01/08", amount: 3, upfee: 10, status: 1 },
      { "name": "3元优惠券", enddate: "2020/01/08", amount: 3, upfee: 10, status: 2 },
    ],
    noitem: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.coupListGet();
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
    wx.showLoading({
      title: '正在加载中',
    });
    var checkType = "0";
    if(that.data.currentNavbar == 1){
      checkType = "2";
    }
    var openid = wx.getStorageSync("openid");
    if (openid == "" || openid == null || openid == undefined) return;
    var data = {
      openid: openid, checktype: checkType, currentpage: currentPage, pagesize: pageSize,
      startindex: currentPage * pageSize, draw: 1
    }
    wx.request({
      url: config.serverAddress + 'wxpay/couplist',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("优惠券记录:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            totalPage = Math.ceil(res.data.response.totalcount / pageSize);
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
  onReachBottom: function () {
    if ((currentPage + 1) >= totalPage) {
      this.setData({
        noitem: 1
      });
      return;
    } else {
      this.setData({
        noitem: 0
      });
    }
    currentPage++;
    var that = this;
    that.getOrderList();
  }
})