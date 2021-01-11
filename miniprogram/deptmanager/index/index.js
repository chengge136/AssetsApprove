// users/userIndex/UserIndex.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    dept:'',
    avatarUrl:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userDetail = wx.getStorageSync('userDetail');
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      name: userDetail.name,
      dept: userDetail.dept,
      avatarUrl: userInfo.avatarUrl
    })


  },
  managerApprove: function () {
    wx.navigateTo({
      url: '../assetApprove/assetApprove',
    })
  },

  settings: function () {
    wx.navigateTo({
      url: '../settings/settings',
    })
  },
  assetreport: function () {
    wx.navigateTo({
      url: '../../charts/bar/index',
    })
  },
  assetFixRecords: function () {
    wx.navigateTo({
      url: '../assetFixRecords/assetFixRecords',
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