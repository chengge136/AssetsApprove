// manager/assetRecords/assetRecords.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear:new Date().getFullYear(),
    fileUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

  },


  getExcel:function(){


    var begin=new Date(this.data.currentYear,1,1).getTime();
    var end=new Date().getTime();

    var that = this;
      if (!that.data.fileUrl == ''){
        wx.showToast({
          title: '已经导出，请点击复制下载链接',
          icon: 'none',
          duration: 3000
        })
      }else{
        wx.showModal({
          title: '导出数据',
          content: '确定导出[ ' + that.data.currentYear + ' ]年的物品报修报表吗？',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '正在导出',
              })
              wx.cloud.callFunction({
                name: "getFixRecords",
                data: {
                  begin: begin,
                  end: end
                }
               
              }).then(res => {
                console.log(res.result);
                var assetsdata=res.result.data;

                for(var i=0;i<assetsdata.length;i++){
                  assetsdata[i].ctime = app.formatDate(new Date(assetsdata[i].ctime));
                  assetsdata[i].dept = app.returnHanDept(assetsdata[i].dept);
                }
                that.savaExcel(assetsdata);
              }).catch(err => {
                console.error('读取失败' + err)
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }

  },
    //把数据保存到excel里，并把excel保存到云存储
    savaExcel: function (userdata) {
      let that = this
      wx.cloud.callFunction({
        name: "excel",
        data: {
          type:'fix',
          userdata: userdata,
          year:that.data.currentYear
        },
        success(res) {
          console.log("保存成功", res);
          that.getFileUrl(res.result.fileID);
          wx.hideLoading();
        },
        fail(res) {
          console.log("保存失败", res)
        }
      })
    },

      //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl: function (fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL);
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },
  copyFileUrl:function() {
    let that = this
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
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

  }
})