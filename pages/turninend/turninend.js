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
    wordnum: "8001",
    price: "5",
    discount: 7,
    cdiscount: "",
    priceword: 500,
    coupon: [
      { word: 0, name: "不使用优惠券", id: "" }
    ],
    index: 0,
    couponword: 0,
    totalheight: 770
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fileSize = options.filesize;
    this.setData({
      filename: options.filename,
      filesize: fileSize,
      orderid: options.orderid,
      wordnum: options.wordnum,
      checktype: options.checktype
    });
    
    //获取折扣，计费标准，优惠券
    this.payListGet();
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
  payListGet:function(){
    wx.showLoading({
      title: '正在获取价格信息',
    });
    var that = this;
    var openid = wx.getStorageSync("openid");
    var data = { openid: openid, checktype: that.data.checktype };
    wx.request({
      url: config.serverAddress + "pay/query",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          console.info("获取获取原始价格，折扣，拥有的优惠券：");
          console.log(res.data) //获取openid
          if (res.data.retcode === config.SUCCESS) {
            var response = res.data.response;
            //response中的内容有如下字段
            //discount:折扣, price:原始价格（元）,priceword:原始价格对应的字数
            //coupon:优惠券数组，例如 [{ word: 500, name: "500字语法检测优惠券", id: 1 }]
            //计算原始价格
            that.setData({
              cdiscount: that.discountNumberChange(response.discount),
              currprice: (response.price * (response.discount / 10)).toFixed(2),
              count: Math.ceil(that.data.wordnum / response.priceword)
            });
            //计算应付总价
            that.setData({
              total: that.data.currprice * that.data.count
            });
            that.setData({
              coupon: this.data.coupon.concat(response.coupon)
            });
            var coupname = [];
            for (var i = 0; i < that.data.coupon.length; i++) {
              coupname.push(that.data.coupon[i].name);
            }
            that.setData({
              coupname: coupname
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
   * 优惠券选择框
   */
  bindPickerChange: function (e) {
    console.log('选中的优惠券为:', this.data.coupon[e.detail.value].name)
    this.setData({
      index: e.detail.value,
      couponword: this.data.coupon[e.detail.value].word
    });
    if (this.data.couponword != 0) {
      var coupcount = Math.floor(this.data.coupon[this.data.index].word / this.data.priceword);
      if (coupcount > this.data.count) {
        this.setData({
          coupcount: this.data.count
        });
      } else {
        this.setData({
          coupcount: coupcount
        });
      }
      this.setData({
        realcount: this.data.count - this.data.coupcount,
        realtotal: (this.data.count - this.data.coupcount) * this.data.currprice,
        totalheight: 940
      })
    } else {
      this.setData({
        totalheight: 770
      })
    }
  },
  /**
   * 获取支付信息
   */
  payment: function () {
    var that = this;
    wx.showLoading({
      title: '处理中',
    })
    var amount = this.data.total;
    if (this.data.couponword != 0) {
      amount = this.data.realtotal
    }
    var openid = wx.getStorageSync("openid");
    var data = { openid: openid, amount: amount, orderid: that.data.orderid, coupid: that.data.coupon[that.data.index].id};
    wx.request({
      url: config.serverAddress + 'wxPay',
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
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      success: function (event) {
        // success
        console.log(event);
        //通知后端支付成功，跳转到支付成功画面
        that.payResultNotify();
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
        console.log("pay complete")
      }
    });
  },

  /**
   * 支付成功通知
   */
  payResultNotify: function(){
    var data = { openid: openid, orderid: that.data.orderid};
    wx.request({
      url: config.serverAddress + 'pay/result',
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        if (res.statusCode == 200) {
          //跳转到支付成功页面
          wx.navigateTo({
            url: '../payend/payend',
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        //TODO:应该也要跳转到支付成功页面
      }
    })
  }
})