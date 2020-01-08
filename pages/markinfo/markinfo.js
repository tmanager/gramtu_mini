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
    navbar: ['积分列表', '积分赠送','积分兑换'],
    currentNavbar: '0',
    couponList: [
      { "name": "3元优惠券", enddate: "2020/01/08", amount: 3, upfee: 10, status: 0 },
      { "name": "3元优惠券", enddate: "2020/01/08", amount: 3, upfee: 10, status: 1 },
      { "name": "3元优惠券", enddate: "2020/01/08", amount: 3, upfee: 10, status: 2 },
    ],
    noitem: 0,
    mark: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.markListGet();
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
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      currentNavbar: idx
    });
    if(idx == 0){
      this.markListGet();
    }
    
  },
  /**
   * 获取优惠券记录
   */
  markListGet: function () {
    var that = this;
    var openid = wx.getStorageSync("openid");
    if (openid == "" || openid == null || openid == undefined) return;
    wx.showLoading({
      title: '正在加载中',
    });
    var checkType = "0";
    if (that.data.currentNavbar == 1) {
      checkType = "2";
    }
    var data = {
      openid: openid, checktype: checkType, currentpage: currentPage, pagesize: pageSize,
      startindex: currentPage * pageSize, draw: 1
    }
    wx.request({
      url: config.serverAddress + 'mark/query',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("积分记录:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            totalPage = Math.ceil(res.data.response.totalcount / pageSize);
            var marklist = res.data.response.marklist;
            for (var i = 0; i < marklist.length; i++) {
              marklist[i].updtime = util.formatDateTime(marklist[i].updtime);
            }
            that.setData({
              markList: res.data.response.marklist,
              mark: res.data.response.mark
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
    that.markListGet();
  }
})