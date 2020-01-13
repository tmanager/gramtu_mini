// pages/turninlist/turninlist.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var currentPage = 0;
var totalPage = 0;
var pageSize = 5;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['待付款', '已付款'],
    currentNavbar: '0',
    orderList:[],
    realtotal: "0.00",
    select_all: false,
    checkedList:{
      orderid:[],
      price: "0.00"
    },
    coupon: [],
    coupname: [{ id: "1", filename: "111", disable: '0' }, { id: "2", filename: "222", disable: '1' }],
    chooseindex: -1,
    coupamount: "0.00",
    couptitle: "不使用优惠券",
    //价格信息
    price:"0.00",       //单价
    wordnum:"0",        //单价对应的字数
    discount:"10.0",     //折扣
    checkType: "0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //TODO:测试
    this.setData({
      currentNavbar: options.type,
      checkType: options.checktype
    })
    if(this.data.checkType == "2"){
      wx.setNavigationBarTitle({
        title: '语法检测列表'
      })
    }
    this.getOrderList();
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
    this.getOrderList();
    if (e.currentTarget.dataset.idx == 0){
      this.coupListGet();
    }  
  },
  /**
   * checkbox按下后的变化
   */
  checkboxChange: function(e){
    console.info(e);
    var that = this;
    var price = 0;
    var list = this.data.orderList;
    for(var i=0 ;i<e.detail.value.length; i++){
      for(var j=0; j<list.length; j++){
        if (e.detail.value[i] == list[j].orderid){
          price += Number(list[j].price);
        }
      }
    }
    if (price == 0) {
      this.setData({
        select_all: false
      })
    } else {
      this.setData({
        select_all: (e.detail.value.length == list.length)
      })
    }
    var checkOrder = e.detail.value;
    var orderList = that.data.orderList;
    var priceList = [];
    //获取价格表
    for (var i = 0; i < checkOrder.length; i++) {
      for (var j = 0; j < orderList.length; j++) {
        if (checkOrder[i] == orderList[j].orderid) {
          priceList.push(orderList[j].price);
        }
      }
    }
    //价格排序
    priceList.sort(that.sortNumber);
    //如果checkbox选中的金额小于优惠券的最低金额时
    if(this.data.chooseindex != -1 && this.data.coupon.length > 0){
      var upfee = this.data.coupon[this.data.chooseindex].upfee;
      if(upfee == -1){
        if(price == 0){
          this.setData({
            chooseindex: -1,
            coupamount: "0.00",
            couptitle: "不使用优惠券"
          })
        }else{
          var amount = priceList[0];
          this.setData({
            coupamount: amount
          })
        }
      }else{
        if (price < Number(this.data.coupon[this.data.chooseindex].upfee)) {
          this.setData({
            chooseindex: -1,
            coupamount: "0.00",
            couptitle: "不使用优惠券"
          })
        }
      }
    }
    var checkedlist = { orderid: [], price: 0 }; 
    checkedlist.orderid = e.detail.value;
    checkedlist.price = price.toFixed(2);
    this.setData({
      checkedList: checkedlist,
      realtotal: (checkedlist.price - that.data.coupamount).toFixed(2)
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
      realtotal: (checkedlist.price - that.data.coupamount).toFixed(2)
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
    var coupid = "";
    if (that.data.chooseindex != -1 && that.data.coupon.length > 0) {
      coupid = that.data.coupon[that.data.chooseindex].id;
    }
    var data = { openid: openid, amount: amount, orderidlist: this.data.checkedList.orderid, coupid: coupid};
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
        //暂不做通知，直接跳转
        wx.redirectTo({
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
    var data = {
      openid: openid, checktype: this.data.checkType, type: nav, currentpage: currentPage, pagesize: pageSize,
      startindex: currentPage * pageSize, draw: 1 };
    var url = 'torder/query';
    if(this.data.checkType == "2"){
      url = 'gorder/query';
    }
    wx.request({
      url: config.serverAddress + url,
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        if (res.statusCode == 200) {
          //跳转到支付成功页面
          wx.hideLoading();
          console.info("获取订单信息");
          console.info(res);
          if(res.data.retcode == config.SUCCESS){
            var orderlist = [];
            totalPage = Math.ceil(res.data.response.totalcount / pageSize);
            if(that.data.currentNavbar == "0"){
              orderlist = res.data.response.orderlist;
              var currprice = (res.data.response.price * (res.data.response.discount / 10)).toFixed(2);
              for (var i = 0; i < orderlist.length; i++) {
                var count = Math.ceil(orderlist[i].wordcnt / res.data.response.wordnum);
                orderlist[i].price = (currprice * count).toFixed(2);
                orderlist[i].updtime = util.formatDateTime(orderlist[i].updtime);
              }
            }else{
              orderlist = res.data.response.paylist;
              for (var i = 0; i < orderlist.length; i++) {
                orderlist[i].updtime = util.formatDateTime(orderlist[i].updtime);
              }
            }
            that.setData({
              price: res.data.response.price,
              wordnum: res.data.response.wordnum,
              discount: res.data.response.discount,
              orderList: orderlist
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
    var data = { openid: openid, checktype: this.data.checkType };
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
      if (couponlist[i].upfee == -1 || Number(that.data.checkedList.price) >= couponlist[i].upfee) {
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
    var checkOrder = that.data.checkedList.orderid;
    var orderList = that.data.orderList;
    var priceList = [];
    //获取价格表
    for (var i = 0; i < checkOrder.length; i++){
      for(var j=0; j<orderList.length; j++){
        if(checkOrder[i] == orderList[j].orderid){
          priceList.push(orderList[j].price);
        }
      }
    }
    //价格排序
    priceList.sort(that.sortNumber);
    for (var i = 0; i < that.data.coupon.length; i++) {
      if (that.data.coupon[i].id == e.detail) {
        var amount = that.data.coupon[i].amount;
        if (amount == -1) amount = priceList[0];
        if (priceList.length == 0) amount = "0.00";
        that.setData({
          chooseindex: i,
          coupamount: Number(amount).toFixed(2),
          realtotal: (Number(that.data.checkedList.price) - Number(amount)).toFixed(2),
          isOpened: 0,
          couptitle: that.data.coupon[i].name
        });
      }
    }

  },
  cancelAction: function () {
    var that = this;
    that.setData({
      chooseindex: -1,
      coupamount: "0.00",
      realtotal: (that.data.checkedList.price - 0).toFixed(2),
      couptitle: "不使用优惠券"
    });
  },
  orderDetail:function(e){
    console.info(e);
    var i = e.currentTarget.dataset.index;
    var orderlist = this.data.orderList;
    var para = "filename=" + orderlist[i].filename +
      "&filesize=" + orderlist[i].filesize + "&wordcount=" + orderlist[i].wordcnt +
      "&orderid=" + orderlist[i].orderid + "&checktype=" + this.data.checkType + 
      "&price=" + this.data.price + "&wordnum=" + this.data.wordnum +
      "&discount=" + this.data.discount;
    wx.navigateTo({ url: "../turninend/turninend?" + para });
  },
  payDetail:function(e){
    var i = e.currentTarget.dataset.index;
    var orderlist = this.data.orderList;
    var para = "filename=" + orderlist[i].filename +
      "&filesize=" + orderlist[i].filesize + "&repetrate=" + orderlist[i].repetrate +
      "&orderid=" + orderlist[i].orderid + "&pdfreporturl=" + orderlist[i].pdfreporturl + 
      "&htmlreporturl=" + orderlist[i].htmlreporturl + "&status=" + orderlist[i].status + 
      "&updtime=" + orderlist[i].updtime + "&wordcnt=" + orderlist[i].wordcnt + 
      "&email=" + orderlist[i].email + "&title=" + orderlist[i].titile + "&checktype=" + orderlist[i].checktype + 
      "&openid=" + orderlist[i].openid;
    wx.navigateTo({ url: "../turninreport/turninreport?" + para });
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
    // 显示加载图标
    wx.showLoading({
      title: '正在加载中',
    });
    that.getOrderList();
    if (e.currentTarget.dataset.idx == 0) {
      this.coupListGet();
    } 
  },
  sortNumber: function (a, b)
  {
    return a - b;
  }
})