// canteen/addmenu/addmenu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    disabled:false,
    dept: '1',
    roletype:'1',
    approver:'a',
    approveflag:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  selectDept(event) {
    this.setData({
      dept: event.detail,
    });
  },

  selectRole(event) {
    this.setData({
      roletype: event.detail
    });
    if(event.detail=='2'){
      this.setData({
        approveflag: true
      });
    }else{
      this.setData({
        approveflag: false
      });
    }
  },
  selectApprover(event) {
    this.setData({
      approver: event.detail
    });
  },

  addEmployee: function () {
    wx.showLoading({
      title: '添加中...',
    })
    
    wx.cloud.callFunction({
      name: 'empManage',
      data: {
        name: this.data.name,
        phone: this.data.phone,
        dept: this.data.dept,
        roletype:this.data.roletype,
        approver:this.data.approver,
        action:'A'
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          disabled:false
        });
        wx.showModal({
          title: '添加成功',
          content: '是否添加下一个？',
          success (res) {
            if (res.confirm) {   
              console.log("ok"); 
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
        
      },
      fail: err => {
        // handle error
        console.log(err)
      }
    })
  },
  add() {
    var that = this;
    if(!that.data.name == '' && !that.data.phone==''){
      
      wx.showModal({
        title: '提示',
        content: '添加 '+that.data.name+' 到员工名录？',
        success (res) {
          if (res.confirm) {
            that.setData({
              disabled:true
            });
            that.addEmployee();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  inputName: function (event) {
    var that = this;
    that.setData({
      name: event.detail
    })
  },
  inputPhone: function (event) {
    var that = this;
    that.setData({
      phone: event.detail
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