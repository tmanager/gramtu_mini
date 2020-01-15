// pages/couplist/couplist.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['积分列表', '积分赠送','积分兑换'],
    currentNavbar: '0',
    coupList: [],
    noitem: 1,
    noitemCoup: 1,
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
      //查询积分列表
      this.markListGet();
    }
    if(idx == 2){
      //查询可以进行兑换的优惠券后展示
      this.coupListGet();
    }
    
  },
  /**
   * 获取积分记录
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
    var data = { openid: openid, checktype: checkType, currentpage: "0", pagesize: "10", startindex: "0", draw: 1}
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
  /**
   * 输入框输入事件
   */
  getInputValue(e) {
    console.log(e)// {value: "ff", cursor: 2}  
    switch (e.target.id) {
      case "givenMark":
        this.setData({
          givenMark: e.detail.value
        });
        break;
      case "givenPhone":
        this.setData({
          givenPhone: e.detail.value
        });
        break;
    }
  },
  /**
   * 赠送积分
   */
  markGiven: function (e) {
    var that = this;
    var givenPhone = this.data.givenPhone;
    var givenMark = this.data.givenMark;
    var mark = this.data.mark;
    if (givenMark == "" || givenMark == undefined) {
      wx.showToast({
        title: '转赠积分数必须输入！',
        icon: 'none'
      })
      return;
    }
    if (isNaN(givenMark) || Number(givenMark) > Number(mark) || Number(givenMark) <= 0) {
      wx.showToast({
        title: '转赠积分必须输入数字，且应该小于总积分数大于0！',
        icon: 'none'
      })
      return;
    }
    if (!util.phoneCheck(givenPhone)) {
      wx.showToast({
        title: '转赠手机号码未输入或者格式不正确！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在加载中',
    });
    var openid = wx.getStorageSync("openid");
    var data = { openid: openid, givenphone: givenPhone, givenmark: givenMark }
    wx.request({
      url: config.serverAddress + 'mark/given',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          console.info("赠送积分:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            wx.showToast({
              title: '积分转赠成功！',
              icon: 'none'
            });
            that.markListGet();
          } else {
            wx.showToast({
              //title: '积分转赠失败！',
              title: '积分转赠失败:' + res.data.retmsg,
              icon: 'none'
            })
          }
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '积分转赠失败！',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 获取可以兑换的优惠券记录
   */
  coupListGet: function () {
    var that = this;
    var openid = wx.getStorageSync("openid");
    if (openid == "" || openid == null || openid == undefined) return;
    wx.showLoading({
      title: '正在加载中',
    });
    var data = {currentpage: "0", pagesize: "10", startindex: "0", draw: 1}
    wx.request({
      url: config.serverAddress + 'mark/coupon/query',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("优惠券记录:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            var couplist = res.data.response.couponlist;
            for (var i = 0; i < couplist.length; i++) {
              couplist[i].enddate = util.formatDate(couplist[i].enddate);
            }
            that.setData({
              coupList: res.data.response.couponlist
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
   * 优惠券兑换
   */
  coupGivenExchangeDialog: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var coupList = this.data.coupList;
    var usemark = 0;
    for(var i=0; i<coupList.length; i++){
      if(id == coupList[i].id){
        usemark = coupList[i].usemark;
      }
    }
    if (Number(usemark) > Number(this.data.mark)){
      wx.showToast({
        title: '积分不足，不能进行兑换！',
        icon: 'none'
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '需要花费' + usemark + '积分，确认要进行兑换？',
      success(res) {
        if (res.confirm) {
          this.coupGivenExchange(id);
        } else if (res.cancel) {
          
        }
      }
    })
  },
  /**
   * 积分兑换优惠券
   */
  coupGivenExchange: function(id){
    var that = this;
    var openid = wx.getStorageSync("openid");
    if (openid == "" || openid == null || openid == undefined) return;
    wx.showLoading({
      title: '正在加载中',
    });
    var data = {openid: openid, coupid: id}
    wx.request({
      url: config.serverAddress + 'coupon/exchange',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("积分兑换优惠券:" + JSON.stringify(res.data));
          if (res.data.retcode === config.SUCCESS) {
            wx.showToast({
              title: '兑换成功！',
              icon: 'none'
            });
            that.markListGet();
          }else{
            wx.showToast({
              title: '兑换失败！',
              icon: 'none'
            })
          }
        }
      },
      fail: function(res){
        wx.showToast({
          title: '兑换失败！',
          icon: 'none'
        })
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  }
})