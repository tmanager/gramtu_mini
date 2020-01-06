// pages/turninend/turninend.js
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filename: "",
    filesize: "",
    fileurl: "",
    wordcount: "",
    price: "",
    discount: "",
    cdiscount: "",
    wordnum: 0,
    coupon: [],
    coupname: [{ id: "1", name: "111", disable: '0' }, { id: "2", name: "222", disable: '1' }],
    chooseindex: -1,
    coupamount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      filename: options.filename,
      filesize: options.filesize,
      orderid: options.orderid,
      wordcount: options.wordcount,
      checktype: options.checktype,
      wordnum: options.wordnum,
      discount: options.discount,
      price: options.price,
      cwordcount: that.format(options.wordcount)
    });
    
    this.setData({
      cdiscount: this.discountNumberChange(this.data.discount),
      currprice: (this.data.price * (this.data.discount / 10)).toFixed(2),
      count: Math.ceil(this.data.wordcount / this.data.wordnum)
    });
    //计算应付总价
    this.setData({
      total: (this.data.currprice * this.data.count).toFixed(2),
      realtotal: (this.data.currprice * this.data.count).toFixed(2)
    });

    //优惠券
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
   * 获取原始价格，折扣，拥有的优惠券
   */
  coupListGet:function(){
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
      complete:function(res){
        wx.hideLoading();
      }
    })
  },
  /**
   * 折扣显示
   */
  discountNumberChange: function (data) {
    if (data == "10" || data == "") {
      return "无折扣";
    }
    if (data == "0") {
      return "0折";
    }
    return data + "折";
  },

  /**
   * 获取支付信息
   */
  payment: function () {
    var that = this;
    wx.showLoading({
      title: '正在获取支付信息',
    })
    var amount = this.data.total;
    if (this.data.couponword != 0) {
      amount = this.data.realtotal
    }
    var openid = wx.getStorageSync("openid");
    var coupid = "";
    if (that.data.chooseindex != -1 && that.data.coupon.length > 0){
      coupid = that.data.coupon[that.data.chooseindex].id;
    }
    var data = { openid: openid, amount: amount, orderidlist: [that.data.orderid], coupid: coupid};
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
          }else{
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
  format :function(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return(num + '').replace(reg, '$&,');  
  },
  coupShow: function(){
    var that = this;
    var couponlist = this.data.coupon;
    var coupname = [];
    for (var i = 0; i < couponlist.length; i++) {
      var disable = 1;     
      if (couponlist[i].upfee == -1 || Number(that.data.total) >= couponlist[i].upfee){
        disable = 0;
      }
      var obj = { id: couponlist[i].id, name: couponlist[i].name, disable: disable };
      coupname.push(obj);
    }
    if (coupname.length == 0){
      return;
    }
    that.setData({
      isOpened: 1,
      sheetList: coupname,
      title: "选择优惠券"
    });
  },
  selectAction: function(e){
    var that= this;
    for(var i=0; i<that.data.coupon.length; i++){
      if (that.data.coupon[i].id == e.detail){
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
  cancelAction: function(){
    var that = this;
    that.setData({
      chooseindex: -1,
      coupamount: "0.00",
      realtotal: (that.data.total - 0).toFixed(2)
    });
  }
})