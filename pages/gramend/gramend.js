// pages/gramend/gramend.js
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filename:"",
    filesize:"",
    wordnum:"8001",
    price:"5",
    discount: "0.7",
    cdiscount: "",
    priceword:500,
    coupon: [
      { word: 0, name: "不使用优惠券", id: 0 }
      ],
    index: 0,
    couponword: 0,
    totalheight: 770
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      filename: options.filename,
      filesize: options.filesize,
      //wordnum: options.wordnum
    });
    //计算折扣，当前计费标准，应付件数
    this.setData({
      cdiscount: this.discountNumberChange(this.data.discount),
      currprice: this.data.price * this.data.discount,
      count: Math.ceil(this.data.wordnum / this.data.priceword)
    });
    //计算应付总价
    this.setData({
      total: this.data.currprice * this.data.count
    });
    //计算优惠券
    var coupon = [
      { word: 500, name: "500字语法检测优惠券", id: 1 },
      { word: 1000, name: "1000字语法检测优惠券", id: 2 },
      { word: 2000, name: "2000字语法检测优惠券", id: 3 },
      { word: 4000, name: "4000字语法检测优惠券", id: 4 },
      { word: 6000, name: "6000字语法检测优惠券", id: 5 },
      { word: 8000, name: "8000字语法检测优惠券", id: 6 },
    ];
    this.setData({
      coupon: this.data.coupon.concat(coupon)
    });
    var coupname = [];
    for (var i = 0; i < this.data.coupon.length; i++){
      coupname.push(this.data.coupon[i].name);
    }
    this.setData({
      coupname: coupname
    });

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

  discountNumberChange: function(data) {
    var chword = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    data = data.replace(/[0.]/g, "");
    var str = "";
    if(data !== "") {
      for (var i = 0; i < data.length; i++) {
        str += chword[data.charAt(i)]
      }
      str += "折";
    }else {
      str = "无折扣";
    }
    return str;
  },
  bindPickerChange: function (e) {
    console.log('选中的优惠券为:', this.data.coupon[e.detail.value].name)
    this.setData({
      index: e.detail.value,
      couponword: this.data.coupon[e.detail.value].word
    });
    if(this.data.couponword != 0){
      var coupcount = Math.floor(this.data.coupon[this.data.index].word / this.data.priceword);
      if (coupcount > this.data.count){
        this.setData({
          coupcount: this.data.count
        });
      }else{
        this.setData({
          coupcount: coupcount
        });
      }
      this.setData({
        realcount: this.data.count - this.data.coupcount,
        realtotal: (this.data.count - this.data.coupcount) * this.data.currprice,
        totalheight: 940
      })
    }else{
      this.setData({
        totalheight: 770
      })
    }
  },
  payment:function(){
    var that = this;
    wx.showLoading({
      title: '处理中',
    })
    var amount = this.data.total;
    if(this.data.couponword != 0){
      amount = this.data.realtotal
    }
    wx.request({
      url: config.serverAddress.url + 'wxPay',
      data: {
        openId: "",
        amount: amount
      },

      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值

      },
      method: "POST",
      success: function (res) {
        console.log(res);
        that.doWxPay(res.data);
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          icon: "none",
          title: '服务器异常，清稍候再试'
        })
      },
    });
  },
  doWxPay: function(param) {
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',
      paySign: param.data.paySign,
      success: function (event) {
        // success
        console.log(event);
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (error) {
        // fail
        console.log("支付失败")
        console.log(error)
      },
      complete: function () {
        // complete
        wx.hideLoading();
        console.log("pay complete")
      }
    });
  }
})