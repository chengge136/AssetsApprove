// users/userOrders/userOrders.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    activeName:'1',
    pendingOrders:[],
    approvedOrders:[],
    rejectedOrders:[],
    completedorders: [],
    pendingOrdersLen:0,
    approvedOrdersLen:0,
    rejectedOrdersLen:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var userDetail = wx.getStorageSync('userDetail');

    //获取申请单，按时间倒序
    db.collection('zh_assets_order').where(
      {    
        phone: _.eq(userDetail.phone)
      }
    ).orderBy('ctime', 'desc').get({
      success: function (res) {
        var arr=res.data;
        console.log('res',res.data);

        var pendingOrders=[];
        var approvedOrders=[];
        var rejectedOrders=[];
        var completedorders=[];


        for (var i = 0; i < arr.length; i++) {
          arr[i].ctime = app.formatDate(new Date(arr[i].ctime));
          switch(arr[i].status){
            case '3':
              completedorders.push(arr[i]);
              break;
            case '1':
              pendingOrders.push(arr[i]);
              break;
            case '2':
              approvedOrders.push(arr[i]);
              break;
            case '-1':
              rejectedOrders.push(arr[i]);
              break;
          }
        }

        
        that.setData({
          pendingOrders:pendingOrders,
          approvedOrders:approvedOrders,
          rejectedOrders:rejectedOrders,
          completedorders: completedorders,
          pendingOrdersLen:pendingOrders.length,
          approvedOrdersLen:approvedOrders.length,
          rejectedOrdersLen:rejectedOrders.length
        })
      }
    })



  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
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