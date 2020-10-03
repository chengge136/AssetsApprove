// users/userIndex/UserIndex.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    //首页导航栏数据
    navList: ['物资名单','物资搜索','申请购物车'],
    currentIndexNav:0,
    assetlists: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    db.collection('zh_assets').orderBy('type', 'asc').get({
      success: function (res) {
        that.setData({
          assetlists: res.data
        })
      }
    })
  },
  //点击首页导航按钮
  activeNav(e) {
    console.log(e.target.dataset.index);
    this.setData(
      {
        currentIndexNav: e.target.dataset.index
      }
    )

    if (e.target.dataset.index==1){
      wx.navigateTo({ url: '../assetSearch/assetSearch' })
    } else if (e.target.dataset.index == 2){
      wx.navigateTo({ url: '../requestCart/requestCart' })
    }

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