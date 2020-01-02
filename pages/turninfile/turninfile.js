// pages/turninfile/turninfile.js
var config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadfile: "",
    addDocument: "添加文件",
    addDocEnglish:"Add document",
    filename:"",
    firstname:"",
    lastname:"",
    subtitle: "",
    checktype:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      checktype: options.type
    })
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
   * 输入框输入事件
   */
  getInputValue(e) {
    console.log(e)// {value: "ff", cursor: 2}  
    switch(e.target.id){
      case "firstname":
        this.setData({
          firstname: e.detail.value
        });
        break;
      case "lastname":
        this.setData({
          lastname: e.detail.value
        });
        break;
      case "subtitle":
        this.setData({
          subtitle: e.detail.value
        });
        break;
    }
  },
  /**
   * 选择文件
   */
  choosefilefun: function () {
    let _that = this;
    if (_that.data.filename == ""){
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success(res) {
          console.log(_that, ' :this');
          console.log(res, " :res");
          //合法大小。不能超过100M
          if(res.tempFiles[0].size > 100 * 1024 * 1024){
            wx.showToast({
              title: '文件不能超过100M！',
              icon: 'none'
            })
            return
          }
          //合法的扩展名
          var exname = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "wp", "wpd", "wpt", "ps","pdf", "html", ".rtf", "odt", "hwp", "txt"];
          var name = res.tempFiles[0].name;
          if (exname.indexOf(name.substr(name.lastIndexOf(".") + 1)) == -1) {
            wx.showToast({
              title: '文件类型不合法，请参照[上传文件要求]中允许的文件类型！',
              icon: 'none'
            })
            return
          }

          _that.setData({
            uploadfile: res.tempFiles[0],
            addDocument: "移除文件",
            addDocEnglish: "Remove document",
            filename: res.tempFiles[0].name
          })
          //显示按钮上显示文件名和移除文件

        }
      })
    }else{
      _that.setData({
        addDocument: "添加文件",
        addDocEnglish: "Add document",
        filename: "",
        uploadfile: "",
        filesize: 0
      })
    }
  },
  /**
   * 上传文件
   */
  uploadfilefun: function () {
    let { uploadfile } = this.data;
    if (this.data.firstname == "") {
      wx.showToast({
        title: '姓必须输入',
        icon: 'none'
      })
      return;
    }
    if (this.data.lastname == "") {
      wx.showToast({
        title: '名必须输入',
        icon: 'none'
      })
      return;
    }
    if (this.data.subtitle == "") {
      wx.showToast({
        title: '文件标题必须输入',
        icon: 'none'
      })
      return;
    }
    if (uploadfile.length == 0) {
      wx.showToast({
        title: '请先添加文件',
        icon: 'none'
      })
      return;
    }
    let $this = this;
    wx.showLoading({
      title: '正在上传文件',
    })
    var openid = wx.getStorageSync("openid");
    wx.uploadFile({
      url: config.serverAddress.url + '/upload', // 请求服务端文件,
      filePath: uploadfile.path,
      name: uploadfile.name,
      formData:{
        firstname: $this.data.firstname,
        lastname: $this.data.lastname,
        subtitle: $this.data.subtitle,
        checktype: $this.data.checktype,
        openid: openid
      },
      header: {
        "content-type": "multipart/form-data;charset=UTF-8",
      },
      success: function (res) {
        console.log("上传文件：" + res);
        if (res.statusCode == 200) {
          if (res.data.retcode === config.SUCCESS) {
            var data = { orderid: res.data.response.orderid}
            $this.fileByteGet(data);
          }else{
            wx.showToast({
              title: res.data.retmsg,
              icon: 'none'
            })
          }
        }else{
          wx.showToast({
            title: "上传文件失败",
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "上传文件失败",
          icon: 'none'
        })
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  /**
   * 解析文件字数
   */
  fileByteGet: function (data){
    let $this = this;
    wx.showLoading({
      title: '正在解析文件字数',
    });
    wx.request({
      url: config.serverAddress + "analyse",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.retcode === config.SUCCESS) {
            var response = res.data.response;
            var para = "filename=" + uploadfile.name +
              "&filesize=" + uploadfile.size + "&wordnum=" + response.wordnum +
              "&orderid=" + response.orderid + "&checktype=" + $this.data.checktype;
            wx.navigateTo({ url: "../turninend/turninend?" + para });
          } else {
            wx.showToast({
              title: res.data.retmsg,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: "解析文件字数失败",
            icon: 'none'
          })
        }
      },
      fail: function(res){
        wx.showToast({
          title: "解析文件字数失败",
          icon: 'none'
        })
      },
      complete: function(res){
        wx.hideLoading();
        //TODO:测试用。
        /*var para = "filename=" + uploadfile.name + "&filesize=1304&wordnum=123456&fileid=123456&checktype=0";
        wx.navigateTo({ url: "../turninend/turninend?" + para });*/
      }
    })
  }
})