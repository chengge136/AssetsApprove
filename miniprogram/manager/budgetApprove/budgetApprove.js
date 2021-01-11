// users/userOrders/userOrders.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    budgetRequests:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    const _ = db.command;
    var userDetail = wx.getStorageSync('userDetail');

    //获取预算申请，按时间倒序
    db.collection('zh_assets_budget').where(
      {    
        status: _.eq('2')
      }
    ).orderBy('requestid', 'desc').get({
      success: function (res) {
        var arr=res.data;
        console.log('res',res.data);
        for (var i = 0; i < arr.length; i++) {
          arr[i].ctime = app.formatDate(new Date(arr[i].requestid));
          arr[i].dept = arr[i].dept;
        }
        that.setData({
          budgetRequests:arr
        })
      }
    })



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