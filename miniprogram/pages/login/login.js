// pages/authorized/authorized.js
import Notify from '../../vant/notify/notify';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    openid: '',
    avatarUrl: '',
    phone: '',
    pwd: ''
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    console.log('login page of the nickName:', userInfo.nickName)
    this.setData({
      openid: userInfo.openid,
      avatarUrl:userInfo.avatarUrl
    })
  },
  loginaction: function (e) {
    var that = this;
    if (that.data.phone == 'admin' && that.data.pwd == 'admin') {
      wx.redirectTo({
        url: '../../manager/index/index'
      })
    }else if(that.data.phone == 'user' && that.data.pwd == 'user'){
      wx.redirectTo({
        url: '../../users/userIndex/userIndex'
      })
    }else{
      wx.showToast({
        title: '账号不存在',
      })
    }

  },
  noinput: function (e) {
    this.setData({ phone: e.detail.value });
    this.setData({ noinput: true });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({ disabled: false });
    }

  },
  pwdinput: function (e) {
    this.setData({ pwd: e.detail.value });
    this.setData({ pwdinput: true });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({ disabled: false });
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
    if (this.data.no == '' || this.data.pwd == '') {
      this.setData({ disabled: true });
    } else {
      this.setData({ disabled: false });
    }
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