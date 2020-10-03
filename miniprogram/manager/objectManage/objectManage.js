// canteen/menu/menu.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    assetlists: [],
    activeName:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    db.collection('zh_assets').orderBy('type', 'asc').get({
      success: function (res) {
        for (var index in res.data) {
          switch (res.data[index].type) {
            case '1':
              res.data[index].type='办公用品';
              break;
            case '2':
              res.data[index].type='低值易耗品';
              break;
            case '3':
              res.data[index].type='固定资产';
              break;
          }
        }
        that.setData({
          assetlists: res.data
        })
      }
    })
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  onClickLeft() {
    wx.reLaunch({
      url: '../canteenIndex/canteenIndex',
    })
  },
  onClickRight() {
    wx.navigateTo({
      url: '../addAsset/addAsset',
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