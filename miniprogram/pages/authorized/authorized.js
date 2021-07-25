// pages/authorized/authorized.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var myopenid="";
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: function (res) {
        myopenid = res.result.openid;
        that.setData({
          openid: res.result.openid
        })
        console.log('openid',res.result.openid);
      }
    })

    if (wx.getStorageSync('userInfo')) {
      wx.redirectTo({
        url: '../login/login'
      })
    }

  },

  getUserProfile(e) {

    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('nickName',res.userInfo.nickName);
        console.log('avatarUrl',res.userInfo.avatarUrl);

        var userInfo=[];
        userInfo.push({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
        //重新加入用户数据，存入缓存
        wx.setStorage({
          key: 'userInfo',
          data: userInfo[0],
            success: function (res) {
              setTimeout(function () {
                  wx.redirectTo({
                  url: '../login/login'
                })
              }, 1000);
            }
          })
      },
      fail() {
        console.log("用户拒绝授权")
      }
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