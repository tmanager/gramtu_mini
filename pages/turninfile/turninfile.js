// pages/turninfile/turninfile.js
var config = require('../../utils/config.js')
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadfile: "",
    addDocument: "添加文件",
    filename:"",
    firstname:"",
    lastname:"",
    subtitle: "",
    checktype:"",
    type: "0",
    content: "",
    showModal: false,
    errMsg: "",
    timeout: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      checktype: options.checktype,
      type: options.type
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
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {

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
      case "content":
        this.setData({
          content: e.detail.value
        });
        break;
    }
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      content: e.detail.value
    });
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
          //合法大小。Gram不能超过4M，Turnin不能超过100M
          var filesize = 100;
          if(_that.data.checktype == 2){
            filesize = 4;
          }
          if (res.tempFiles[0].size > filesize * 1024 * 1024){
            wx.showToast({
              title: '文件不能超过' + filesize + 'M！',
              icon: 'none'
            })
            return
          }
          //合法的扩展名
          //var exname = ["doc", "docx", "ppt", "pptx", "wp", "wpd", "wpt", "ps","pdf", "html", "rtf", "odt", "hwp", "txt"];
          var exname = ["doc", "docx", "txt"];
          if (_that.data.checktype == 2){
            //exname = ["doc", "docx", "rtf", "odt", "txt"];
            exname = ["doc", "docx", "txt"];
          }
          var name = res.tempFiles[0].name;
          if (exname.indexOf(name.substr(name.lastIndexOf(".") + 1).toLowerCase()) == -1) {
            wx.showToast({
              title: '文件类型不合法，请参照[上传文件要求]中允许的文件类型！',
              icon: 'none'
            })
            return
          }

          _that.setData({
            uploadfile: res.tempFiles[0],
            addDocument: "移除文件",
            filename: res.tempFiles[0].name
          })
          //显示按钮上显示文件名和移除文件

        }
      })
    }else{
      _that.setData({
        addDocument: "添加文件",
        filename: "",
        uploadfile: "",
        filesize: 0
      })
    }
  },
  /**
   * 
   */
  uploadFileTotal: function(){
    if(this.data.type == "0"){
      this.uploadfilefun();
    }else{
      this.uploadContentfun();
    }
  },
  /**
   * 上传文件
   */
  uploadfilefun: function () {
    let { uploadfile } = this.data;
    if(this.data.checktype != 2){
      if (this.data.firstname == "") {
        wx.showToast({
          title: '名必须输入',
          icon: 'none'
        })
        return;
      }
      if (this.data.lastname == "") {
        wx.showToast({
          title: '姓必须输入',
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
      url: config.serverAddress + '/busi/upload', // 请求服务端文件,
      filePath: uploadfile.path,
      name: "file",
      formData:{
        firstname: $this.data.firstname,
        lastname: $this.data.lastname,
        subtitle: $this.data.subtitle,
        checktype: $this.data.checktype,
        openid: openid,
        filename: uploadfile.name,
        content: $this.data.content,
        type: $this.data.type
      },
      header: {
        "content-type": "multipart/form-data;charset=UTF-8",
      },
      success: function (res) {
        console.log("上传文件：");
        console.log(res);
        wx.hideLoading();
        if (res.statusCode == 200) {
          var resData = JSON.parse(res.data);
          if (resData.retcode === config.SUCCESS) {
            var data = { orderid: resData.response.orderid}
            $this.fileByteGet(data);
          }else{
            wx.showToast({
              title: resData.retmsg,
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
        console.log("上传文件失败");
        console.info(res);
        wx.hideLoading();
        wx.showToast({
          title: "上传文件失败",
          icon: 'none'
        })
      },
      complete: function (res) {
        
      }
    })
  },
  /**
   * 上传剪贴文件
   */
  uploadContentfun: function () {
    if (this.data.firstname == "") {
      wx.showToast({
        title: '名必须输入',
        icon: 'none'
      })
      return;
    }
    if (this.data.lastname == "") {
      wx.showToast({
        title: '姓必须输入',
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
    if (this.data.content == "") {
      wx.showToast({
        title: '文件内容必须输入',
        icon: 'none'
      })
      return;
    }

    let $this = this;
    wx.showLoading({
      title: '正在上传剪贴文件',
    })
    var openid = wx.getStorageSync("openid");
    var data = {
      firstname: $this.data.firstname,
      lastname: $this.data.lastname,
      subtitle: $this.data.subtitle,
      checktype: $this.data.checktype,
      openid: openid,
      filename: "",
      content: $this.data.content,
      type: $this.data.type
    }
    wx.request({
      url: config.serverAddress + '/busi/upload/content', // 请求服务端文件,
      data: util.sendMessageEdit(null, data),
      header: {
        'content-type': 'application/json',
      },
      method: "post",
      success: function (res) {
        console.log("上传剪贴文件：");
        console.log(res);
        wx.hideLoading();
        if (res.statusCode == 200) {
          var resData = res.data;
          if (resData.retcode === config.SUCCESS) {
            var data = { orderid: resData.response.orderid }
            $this.fileByteGet(data);
          } else {
            wx.showToast({
              title: resData.retmsg,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: "上传剪贴文件失败",
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log("上传剪贴文件失败");
        console.info(res);
        wx.hideLoading();
        wx.showToast({
          title: "上传剪贴文件失败",
          icon: 'none'
        })
      },
      complete: function (res) {

      }
    })
  },
  /**
   * 解析文件字数
   */
  fileByteGet: function (data){
    let { uploadfile } = this.data;
    let $this = this;
    wx.showLoading({
      title: '正在解析文件',
    });
    wx.request({
      url: config.serverAddress + "/busi/analyse",
      header: {
        'content-type': 'application/json'
      },
      data: util.sendMessageEdit(null, data),
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        console.log("解析文件>>>>>>>>>>>>");
        console.log(res);
        if (res.statusCode == 200) {
          if (res.data.retcode === config.SUCCESS) {
            var response = res.data.response;
            var filename = $this.data.subtitle; 
            var count = response.wordcount;
            //Gram文件字数最小50个，最大14000个,Turnin文件无限制
            if ($this.data.checktype == 2){
              if (isNaN(count) || Number(count) < 50){
                wx.showToast({
                  title: "文件字数不能少于50个！",
                  icon: 'none'
                })
                return;
              }
              if (isNaN(count) || Number(count) > 14000) {
                wx.showToast({
                  title: "文件字数不能大于14000个",
                  icon: 'none'
                })
                return;
              }
            }

            if($this.data.type == "0"){
              filename = uploadfile.name;
            }
            var para = "filename=" + filename +
              "&filesize=" + response.filesize + "&wordcount=" + response.wordcount +
              "&orderid=" + response.orderid + "&checktype=" + $this.data.checktype + 
              "&price=" + response.price + "&wordnum=" + response.wordnum + 
              "&discount=" + response.discount ;
            wx.navigateTo({ url: "../turninend/turninend?" + para });
          } else {
            if(res.data.retcode === "9999"){
              $this.setData({
                errMsg: res.data.retmsg,
                showModal: true
              });
            } else {
              $this.setData({
                errMsg: res.data.retmsg,
                showModal: true
              });
            }
          }
        } else {
          console.log("11111111111111111111")
          $this.setData({
            errMsg: "解析字数异常，请重新提交！",
            showModal: true
          });
        }
      },
      fail: function(res){
        wx.hideLoading();
        console.info("解析失败=========>" + res);
        if (res.errMsg == "request:fail timeout" || res.errMsg.indexOf("请求超时") > 0) {
          var type = "查重";
          if ($this.data.checktype == 2){
            type = "语法检测";
          }
          // wx.showToast({
          //   title: "解析字数结果不明，请进入" + type + "列表中查看详细信息！",
          //   icon: 'none',
          //   duration: 3000
          // })
          $this.setData({
            errMsg: "解析字数结果不明，请进入" + type + "列表中查看详细信息！",
            showModal: true,
            timeout: 1
          });
        } else {
          console.log("22222222222222222222222")
          $this.setData({
            errMsg: "解析字数异常，请重新提交！",
            showModal: true
          });
        }
      },
      complete: function(res){
        wx.hideLoading();
        //TODO:测试用。
        /*var para = "filename=" + uploadfile.name + "&filesize=1304&wordnum=123456&fileid=123456&checktype=0";
        wx.navigateTo({ url: "../turninend/turninend?" + para });*/
      }
    })
  },
  ok: function() {   
    if(this.data.timeout == 1){
      var checktype = this.data.checktype;
      wx.redirectTo({
        url: "../turninlist/turninlist?type=0&checktype=" + checktype});
    }else{
      this.setData({
        showModal: false
      });
    }
  }
})