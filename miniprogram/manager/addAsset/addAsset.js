// canteen/addmenu/addmenu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: '',
    name: '',
    memo: '',
    disabled:false,
    type: '1'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  selectType(event) {
    this.setData({
      type: event.detail,
    });
  },

  addAsset: function (fileId) {
    wx.cloud.callFunction({
      name: 'addAsset',
      data: {
        img: fileId,
        name: this.data.name,
        type: this.data.type,
        memo: this.data.memo
      },
      success: res => {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateBack({
                delta: 1
              })
            }, 1000) //延迟时间
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
    if(that.data.name == ''){
      wx.showToast({
        title: '请填写物品名称',
        icon: 'none',
        duration: 2000,
      })
    }else if (!that.data.imagePath == '') {

      wx.showModal({
        title: '提示',
        content: '是否添加['+that.data.name+']到物资仓库',
        success (res) {
          if (res.confirm) {
            wx.cloud.uploadFile({
              cloudPath: 'asset/' + that.data.name + '.jpg',
              filePath: that.data.imagePath, // 文件路径
              success: res => {
                console.log(res.fileID);
                that.setData({ disabled: true });
                that.addAsset(res.fileID);
              },
              fail: err => {
                // handle error
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })


    } else {
      wx.showToast({
        title: '请上传菜品照片',
        icon: 'none',
        duration: 2000,
      })
    }

  },
  //upload img
  choose_image: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths[0]
        console.log(tempFilePath);

        that.setData({
          imagePath: tempFilePath
        })
      }
    })

  },
  inputName: function (event) {
    var that = this;
    that.setData({
      name: event.detail
    })
  },
  inputMemo: function (event) {
    var that = this;
    that.setData({
      memo: event.detail
    })
  },

  //图片点击事件
  imgYu: function (event) {
    console.log(event)
    var imgArr = [];
    var src = event.currentTarget.dataset.src;//获取data-src
    imgArr[0] = src;
    //var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArr
    })
  },
  removeImage: function () {
    var that = this;
    if (!this.data.imagePath == '') {
      wx.showModal({
        title: '系统提醒',
        content: '确定要删除此图片吗？',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              imagePath: ''
            })
          } else if (res.cancel) {
            return false;
          }
        }
      })
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