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
    nickName:'',
    avatarUrl: '',
    phone: '',
    pwd: ''
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    console.log('login page of the openid:', userInfo.openid)
    this.setData({
      openid: userInfo.openid,
      avatarUrl:userInfo.avatarUrl,
      nickName:userInfo.nickName
    })
  },
  login: function (e) {
    var that = this;
    that.setData({ disabled: true });
    wx.showLoading({
      title: '登录中...',
    })

    const _ = db.command;
    console.log(that.data.phone);
    db.collection('zh_users').where({
      phone: _.eq(that.data.phone)
    })
      .get().then(res => {
        if (res.data.length == 0) {
          Notify({ type: 'warning', duration: 4000, message: '账户不存在，请联系管理员添加！' });
          wx.hideLoading();
          that.setData({ disabled: false });
        } else {
          if (that.data.phone == res.data[0].phone && that.data.pwd == res.data[0].phone.substring(7,11)) {
            wx.hideLoading();
            console.log('login success!')

            var userDetail = [];
            userDetail.push({
              name: res.data[0].name,
              phone: res.data[0].phone,
              dept: res.data[0].dept,
              roletype: res.data[0].roletype,
              approver: res.data[0].approver            
            })

            wx.setStorage({
              key: 'userDetail',
              data: userDetail[0],
              success: function (res) {
                var userDetail = wx.getStorageSync('userDetail');
                console.log('用户类型:', userDetail.roletype);
                console.log('dept:', userDetail.dept);
                if (userDetail.roletype == '0') {
                  wx.redirectTo({
                    url: '../../manager/index/index'
                  })
                }else if (userDetail.roletype=='1'){
                  wx.redirectTo({
                    url: '../../users/userIndex/userIndex'
                  })
                } else if (userDetail.roletype == '2'){
                  if(userDetail.approver=='1'){
                    wx.redirectTo({
                      url: '../../deptmanager/index/index'//部门领导
                    })
                  }else{
                    wx.redirectTo({
                      url: '../../approver/index/index' //其他审批者可审批自己角色的申请单
                    })
                  }

                } else if (userDetail.roletype == '3'){
                  wx.redirectTo({
                    url: '../../repaire/assetFix/assetFix'
                  })
                } else if (userDetail.roletype == '4') {
                  wx.redirectTo({
                    url: '../../budget/budgetRequest/budgetRequest'
                  })
                }
                
              }
            })

          }
          else {
            wx.hideLoading();
            Notify({ type: 'warning', duration: 2000, message: '密码不正确！' });
            that.setData({ disabled: false });
          }
        }

      })


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