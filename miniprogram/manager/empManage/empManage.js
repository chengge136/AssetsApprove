// canteen/menu/menu.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    emplists: [],
    activeName:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  onClickLeft() {
    wx.reLaunch({
      url: '../settings/settings',
    })
  },
  onClickRight() {
    wx.navigateTo({
      url: '../empAdd/empAdd',
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
    var that=this;
    wx.cloud.callFunction({
      name: "getEmpLists"
     
    }).then(res => {
      console.log('res',res.result);
      that.setData({
        emplists: res.result.data
      })
      
    }).catch(err => {
      console.error('读取失败' + err)
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