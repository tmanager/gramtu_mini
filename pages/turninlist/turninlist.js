// pages/turninlist/turninlist.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var orderList = [
  { orderid: "1", subtitle: "name1", time: "20191216101010", price: "9.90" },
  { orderid: "2", subtitle: "name2", time: "20201216101010", price: "10.90" },
  { orderid: "3", subtitle: "name3", time: "20211216101010", price: "11.00" }
];
var payList = [
  { orderid: "1", subtitle: "name3", time: "20191216101010", status: "0" },
  { orderid: "2", subtitle: "name4", time: "20201216101010", status: "1", repeat: "30%" },
  { orderid: "3", subtitle: "name5", time: "20211216101010", status: "1", repeat: "50%" }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['待付款', '已付款'],
    currentNavbar: '0',
    orderList:[
      { orderid: "1", subtitle: "name1", time: "20191216101010", price: "9.90" },
      { orderid: "2", subtitle: "name2", time: "20201216101010", price: "10.90"  },
      { orderid: "3", subtitle: "name3", time: "20211216101010", price: "11.00" }
    ],
    realtotal: "0.00",
    select_all: false,
    checkedList:{
      orderid:[],
      price: "0.00"
    },
    coupon: [],
    coupname: [{ id: "1", name: "111", disable: '0' }, { id: "2", name: "222", disable: '1' }],
    chooseindex: -1,
    coupamount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //TODO:测试
    if(this.data.currentNavbar == 0){
      this.setData({
        orderList: orderList
      })
    }else{
      this.setData({
        orderList: payList
      })
    }
    //this.getOrderList();
    var list = this.data.orderList;
    for(var i=0; i<list.length; i++){
      list[i].time = util.formatDateTime(list[i].time);
    }
    this.setData({
      orderList: list
    })
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
    if (this.data.currentNavbar == 0) {
      this.setData({
        orderList: orderList
      })
    } else {
      this.setData({
        orderList: payList
      })
    }
    //this.getOrderList();
  },
  /**
   * checkbox按下后的变化
   */
  checkboxChange: function(e){
    console.info(e);
    var price = 0;
    var list = this.data.orderList;
    for(var i=0 ;i<e.detail.value.length; i++){
      for(var j=0; j<list.length; j++){
        if (e.detail.value[i] == list[j].orderid){
          price += Number(list[j].price);
        }
      }
    }
    var checkedlist = { orderid: [], price: 0 }; 
    checkedlist.orderid = e.detail.value;
    checkedlist.price = price.toFixed(2);
    this.setData({
      checkedList: checkedlist,
      realtotal: checkedlist.price
    })
  },
  /**
   * 全选
   */
  allCheck: function(e){
    var that = this;
    var list = this.data.orderList;
    var checkedlist = { orderid: [], price: 0 };    
    for(var i=0; i<list.length; i++){
      list[i].checked = !that.data.select_all;
      if (!that.data.select_all){
        checkedlist.orderid.push(list[i].orderid);
        checkedlist.price += Number(list[i].price)
      }
    }
    checkedlist.price = (checkedlist.price).toFixed(2);
    that.setData({
      orderList: list,
      select_all: (!that.data.select_all),
      checkedList: checkedlist,
      realtotal: checkedlist.price
    })
  },
  /**
   * 获取支付信息
   */
  payment: function () {
    var that = this;
    if (this.data.checkedList.orderid.length == 0){
      wx.showToast({
        icon: "none",
        title: '请先选中订单'
      })
      return;
    }
    wx.showLoading({
      title: '正在获取支付信息',
    })
    var amount = this.data.realtotal;
    var openid = wx.getStorageSync("openid");
    var data = { openid: openid, amount: amount, orderidlist: this.data.checkedList.orderid, coupid: ""};
    wx.request({
      url: config.serverAddress + 'wxpay/unifiedorder',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取支付需要的信息：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS) {
            wx.hideLoading();
            that.doWxPay(res.data.response);
          } else {
            wx.showToast({
              icon: "none",
              title: res.data.retmsg
            })
          }
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          icon: "none",
          title: '服务器异常，清稍候再试'
        })
      }
    });
  },
  /**
   * 支付处理
   */
  doWxPay: function (param) {
    //小程序发起微信支付
    wx.showLoading({
      title: '正在发起支付',
    })
    wx.requestPayment({
      timeStamp: param.timestamp,
      nonceStr: param.noncestr,
      package: param.paypackage,
      signType: "MD5",
      paySign: param.paysign,
      success: function (event) {
        // success
        console.log(event);
        //通知后端支付成功，跳转到支付成功画面
        //that.payResultNotify();
        //暂不做通知，直接跳转
        wx.navigateTo({
          url: '../payend/payend',
        })
      },
      fail: function (error) {
        // fail
        wx.hideLoading();
        console.log("支付失败")
        console.log(error)
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        });
      },
      complete: function () {
        // complete
        wx.hideLoading();
        console.log("pay complete")
      }
    });
  },
  /**
   * 获取订单列表
   */
  getOrderList: function(){
    var that = this;
    wx.showLoading({
      title: '正在获取订单信息',
    })
    var nav = this.data.currentNavbar;  //0：未付款，1：已付款
    var openid = wx.getStorageSync("openid");
    var data = { openid: openid, checktype: "0", type: nav};
    wx.request({
      url: config.serverAddress + 'order/query',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        if (res.statusCode == 200) {
          //跳转到支付成功页面
          wx.hideLoading();
          if(res.data.retcode == config.SUCCESS){
            that.setData({
              orderList: res.data.response.orderlist
            })
          }else{
            wx.showToast({
              title: res.data.retmsg,
              icon: 'none'
            });
          }
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取订单信息失败！",
          icon: 'none'
        });
      }
    })
  },
  /**
  * 获取拥有的优惠券
  */
  coupListGet: function () {
    wx.showLoading({
      title: '正在获取优惠券信息',
    });
    var that = this;
    var openid = wx.getStorageSync("openid");
    var data = { openid: openid, checktype: that.data.checktype };
    wx.request({
      url: config.serverAddress + "coupon/query",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取拥有的优惠券：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS) {
            var response = res.data.response;
            that.setData({
              coupon: response.couponlist
            });
          }
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  coupShow: function () {
    var that = this;
    var couponlist = this.data.coupon;
    var coupname = [];
    for (var i = 0; i < couponlist.length; i++) {
      var disable = 1;
      if (couponlist[i].upfee == -1 || Number(that.data.total) >= couponlist[i].upfee) {
        disable = 0;
      }
      var obj = { id: couponlist[i].id, name: couponlist[i].name, disable: disable };
      coupname.push(obj);
    }
    if (coupname.length == 0) {
      return;
    }
    that.setData({
      isOpened: 1,
      sheetList: coupname,
      title: "选择优惠券"
    });
  },
  selectAction: function (e) {
    var that = this;
    for (var i = 0; i < that.data.coupon.length; i++) {
      if (that.data.coupon[i].id == e.detail) {
        var amount = that.data.coupon[i].amount;
        if (amount == -1) amount = that.data.total;
        that.setData({
          chooseindex: i,
          coupamount: (that.data.coupon[i].amount).toFixed(2),
          realtotal: (that.data.total - amount).toFixed(2)
        });
      }
    }

  },
  cancelAction: function () {
    var that = this;
    that.setData({
      chooseindex: -1,
      coupamount: "0.00",
      realtotal: (that.data.total - 0).toFixed(2)
    });
  }
})