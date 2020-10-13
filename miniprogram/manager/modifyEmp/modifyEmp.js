// canteen/addmenu/addmenu.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    name: '',
    phone: '',
    dept: '',
    roletype:'',
    approver:'',
    approveflag:false,
    disabled:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('id:' + options.id)
    var id = options.id;
    var that = this;
    const _ = db.command;
    db.collection('zh_users').where({
        _id: _.eq(id)
      })
      .get().then(res => {
        console.log(res.data[0]);
        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone,
          dept: res.data[0].dept,
          roletype: res.data[0].roletype,
          approver: res.data[0].approver,
          id: options.id
        })

        if(res.data[0].roletype=='2'){
          this.setData({
            approveflag: true
          });
        }else{
          this.setData({
            approveflag: false
          });
        }
        
      })
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
    console.log(event.detail);
    this.setData({
      approver: event.detail
    });
  },

  remove:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '移除员工 ' + that.data.name + ' ？',
      success(res) {
        if (res.confirm) {
          that.setData({
            disabled:true
          });
          console.log('id', that.data.id)
          wx.showLoading({
            title: '移除中...',
          })
          wx.cloud.callFunction({
            name: 'empManage',
            data: {
              id: that.data.id,
              action:'R'
            },
            success: res => {
              wx.showToast({
                title: '移除成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            },
            fail: err => {
              // handle error
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  update: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定修改员工信息？',
      success(res) {
        if (res.confirm) {
          that.setData({
            disabled:true
          });
          wx.showLoading({
            title: '更新中...',
          })
          console.log('id', that.data.id)
          wx.cloud.callFunction({
            name: 'empManage',
            data: {
              id: that.data.id,
              phone: that.data.phone,
              dept:that.data.dept,
              roletype:that.data.roletype,
              approver:that.data.approver,
              action:'U'
            },
            success: res => {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            },
            fail: err => {
              // handle error
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  inputPhone: function(event) {
    var that = this;
    that.setData({
      phone: event.detail
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})