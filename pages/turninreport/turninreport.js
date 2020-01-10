// pages/turninreport/turninreport.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      filename: options.filename,
      filesize: options.filesize,
      repetrate: options.repetrate,
      pdfreporturl: options.pdfreporturl,
      htmlreporturl: options.htmlreporturl,
      status: options.status,
      updtime: options.updtime,
      wordcnt: options.wordcnt
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
   * 下载文件到本地
   */
  downloadFile: function(){
    var report = "https://www.gramtu.com/public/manager/assets/global/img/loading-spinner-grey.gif";//this.data.pdfreporturl;
    wx.downloadFile({
      url: report, 
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          var savePath = wx.env.USER_DATA_PATH + "/1.gif";
          console.info(savePath);
          wx.getFileSystemManager().saveFile({
            tempFilePath: res.tempFilePath,
            filePath: savePath,
            success(res) {
              console.info(res);
              //手机\内部存储\tencent\MicroMsg\wxanewfiles\xxxx\
              const savedFilePath = res.savedFilePath
            },
            fail(res){
              console.info(res);
            }
          })
          /*wx.playVoice({
            filePath: res.tempFilePath
          })*/
        }
      }
    })
  }
})