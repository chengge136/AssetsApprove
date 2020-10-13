// canteen/addmenu/addmenu.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    imagePath: '',
    name: '',
    memo: '',
    type:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('id:' + options.id)
    var id = options.id;
    var that = this;
    const _ = db.command;
    db.collection('zh_assets').where({
        _id: _.eq(id)
      })
      .get().then(res => {
        console.log(res.data[0]);
        that.setData({
          name: res.data[0].name,
          memo: res.data[0].memo,
          imagePath: res.data[0].img,
          type:res.data[0].type,
          id: options.id
        })
      })
  },

  remove:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '从仓库中移除 ' + that.data.name + ' ？',
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
            name: 'assetManage',
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
      content: '确定修改物品信息？',
      success(res) {
        if (res.confirm) {
          that.setData({
            disabled:true
          });
          wx.showLoading({
            title: '更新中...',
          })
          wx.cloud.callFunction({
            name: 'assetManage',
            data: {
              id: that.data.id,
              name: that.data.name,
              type:that.data.type,
              memo:that.data.memo,
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
  inputName: function(event) {
    var that = this;
    that.setData({
      name: event.detail
    })
  },
  inputMemo: function(event) {
    var that = this;
    that.setData({
      memo: event.detail
    })
  },
  selectType(event) {
    this.setData({
      type: event.detail,
    });
  },
  //图片点击事件
  imgYu: function(event) {
    console.log(event)
    var imgArr = [];
    var src = event.currentTarget.dataset.src; //获取data-src
    imgArr[0] = src;
    //var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArr
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