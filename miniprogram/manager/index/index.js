// users/userIndex/UserIndex.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

  },
  requestRecords: function () {
    wx.showToast({
      title: '审批模块开发中',
      icon: 'success',
      duration: 2000
    })
  },
  assetManage: function () {
    wx.navigateTo({
      url: '../objectManage/objectManage',
    })
  },
  employeeManage: function () {
    wx.showToast({
      title: '人员管理模块开发中',
      icon: 'success',
      duration: 2000
    })
  },
  accessHub: function () {
    wx.showToast({
      title: '权限模块开发中',
      icon: 'success',
      duration: 2000
    })
  },
  tableQuery: function () {
    wx.showToast({
      title: '报表模块开发中',
      icon: 'success',
      duration: 2000
    })
  },
  dataAnalyze: function () {
    wx.showToast({
      title: '数据分析模块开发中',
      icon: 'success',
      duration: 2000
    })
  },
  settings: function () {
    wx.navigateTo({
      url: '../settings/settings',
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