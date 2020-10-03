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
    var that = this;
    const _ = db.command;
    db.collection('menu').where(
      {
        type: _.eq(2)
      }
    ).get({
      success: function (res) {
        console.log(res.data)
        that.setData({
          menulists: res.data
        })
      }
    })

  },
  requestAsset: function () {
    wx.navigateTo({
      url: '../requestAsset/requestAsset',
    })
  },
  requestBudget: function () {
    wx.showToast({
      title: '预算申请模块开发中',
      icon: 'success',
      duration: 2000
    })
  },
  fixReport: function () {
    wx.showToast({
      title: '维修汇报模块开发中',
      icon: 'success',
      duration: 2000
    })
  },
  userCenter: function () {
    wx.showToast({
      title: '用户中心开发中',
      icon: 'success',
      duration: 2000
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
  onShareAppMessage() { 
    return {
       title: '你有新的物资申请审批',
       desc: '请进入小程序，审批员工的物资申请单。', 
       path: '/users/userIndex/userIndex',
       //imageUrl: '' // 图片 URL
        }
    }

  
})