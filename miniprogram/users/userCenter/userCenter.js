// users/myInfo/myInfo.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    dept:'',
    avatarUrl:'',
    assetPending:0,
    assetFixing:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const _ = db.command;
    var userDetail = wx.getStorageSync('userDetail');
    var userInfo = wx.getStorageSync('userInfo');

    db.collection('zh_assets_order').where({
      phone: _.eq(userDetail.phone),
      status: _.eq('1')
    }).count({
      success: function (res) {
        console.log('已经完成订单', res.total)
        that.setData({
          assetPending: res.total
        })
      }
    })

    db.collection('zh_assets_fix_order').where({
      phone: _.eq(userDetail.phone),
      status: _.eq('1')
    }).count({
      success: function (res) {
        console.log('已经完成订单', res.total)
        that.setData({
          assetFixing: res.total
        })
      }
    })

    that.setData({
      name: userDetail.name,
      dept:userDetail.dept,
      avatarUrl: userInfo.avatarUrl
    })
  },
  assetRequest_record(){
    wx.navigateTo({ url: '../assetRecord/assetRecord' })
  },
  repaire_record(){
    wx.navigateTo({ url: '../fixRecord/fixRecord' })
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