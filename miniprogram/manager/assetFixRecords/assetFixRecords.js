// manager/assetRecords/assetRecords.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear:new Date().getFullYear(),
    goodsUrl:'',
    fixUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onChange(event) {
    // event.detail 为当前输入的值
    // console.log(parseInt(event.detail)+1);
    this.setData({
      currentYear:parseInt(event.detail)
    });
  },

  
  getGoodsExcel:function(){

    var begin=new Date(this.data.currentYear,1,1).getTime();
    var end=new Date().getTime();

    var that = this;
      if (!that.data.goodsUrl == ''){
        wx.showToast({
          title: '已经导出，请点击复制下载链接',
          icon: 'none',
          duration: 3000
        })
      }else{
        wx.showModal({
          title: '导出数据',
          content: '确定导出[ ' + that.data.currentYear + ' ]年的物资申领数据吗？',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '正在导出',
              })
              wx.cloud.callFunction({
                name: "getAssetRecords",
                data: {
                  begin: begin,
                  end: end
                }
               
              }).then(res => {
                console.log(res.result);
                var assetsdata=res.result.data;

                for(var i=0;i<assetsdata.length;i++){
                  assetsdata[i].ctime = app.formatDate(new Date(assetsdata[i].ctime));
                }
                that.savaGoodsExcel(assetsdata);
              }).catch(err => {
                console.error('读取失败' + err);
              })
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      }

  },
  //把数据保存到excel里，并把excel保存到云存储
  savaGoodsExcel: function (userdata) {
  let that = this
  wx.cloud.callFunction({
    name: "excel",
    data: {
      type:'request',
      userdata: userdata,
      year:that.data.currentYear
    },
    success(res) {
      console.log("保存成功", res);
      that.getGoodsUrl(res.result.fileID);
      wx.hideLoading();
    },
    fail(res) {
      console.log("保存失败", res)
    }
  })
  },

  //获取云存储文件下载地址，这个地址有效期一天
  getGoodsUrl: function (fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL);
        that.setData({
          goodsUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },


  copyGoodsUrl:function() {
    let that = this
    wx.setClipboardData({
      data: that.data.goodsUrl,
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

    
  getFixExcel:function(){
    var begin=new Date(this.data.currentYear,1,1).getTime();
    var end=new Date().getTime();

    var that = this;
      if (!that.data.fixUrl == ''){
        wx.showToast({
          title: '已经导出，请点击复制下载链接',
          icon: 'none',
          duration: 3000
        })
      }else{
        wx.showModal({
          title: '导出数据',
          content: '确定导出[ ' + that.data.currentYear + ' ]年的报修数据吗？',
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
                }
                that.savaFixExcel(assetsdata);
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
  savaFixExcel: function (userdata) {
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
        that.getFixUrl(res.result.fileID);
        wx.hideLoading();
      },
      fail(res) {
        console.log("保存失败", res)
      }
    })
  },

  //获取云存储文件下载地址，这个地址有效期一天
  getFixUrl: function (fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL);
        that.setData({
          fixUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },

  copyFixUrl:function() {
    let that = this
    wx.setClipboardData({
      data: that.data.fixUrl,
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