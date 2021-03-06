// pages/facilityInfo/facilityInfo.js
//云数据库初始化
import Notify from '../../vant/notify/notify';

const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestor: '',
    dept: '',
    phone: '',
    assetname: '',
    addr: '',
    user: '',
    imagePath:'',
    problemDetail:'',
    ctime:'',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var userDetail = wx.getStorageSync('userDetail');

    that.setData({
      requestor:userDetail.name ,
      dept: userDetail.dept,
      phone: userDetail.phone,
      ctime:new Date().getTime()
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

  },
  Submit(){

    var that = this
    if(that.data.problemDetail=='' && that.data.imagePath==''){
      wx.showToast({
        title: '描述问题或照片',
      })
    }else{
      if(!that.data.assetname=='' && !that.data.addr==''){
        wx.showModal({
          title: '提示',
          content: '确认提交报修单了吗？',
          success(res) {
            if (res.confirm) {
              that.setData({ disabled: true });
              wx.showLoading({
                title: '提交中...',
              })
              //1，有图片的情况下
              if (!that.data.imagePath == '') {
                wx.cloud.uploadFile({
                  cloudPath: 'fixReport/' + that.data.ctime + '.jpg',
                  filePath: that.data.imagePath, // 文件路径
                  success: res => {
                    // get resource ID
                    console.log(res.fileID);
                    that.report(res.fileID);    
                  },
                  fail: err => {
                    // handle error
                  }
                })
              }else{
                that.report('');
              }       
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  report:function(fileId){
    var userDetail = wx.getStorageSync('userDetail');
    wx.cloud.callFunction({
      name: 'fixReport',
      data: {
        orderid:this.data.ctime,
        requestor:  this.data.requestor,
        dept:  userDetail.dept,
        phone:  this.data.phone,
        assetname:  this.data.assetname,
        addr:  this.data.addr,
        user:  this.data.user,
        imagePath: fileId,
        problemDetail: this.data.problemDetail,
        ctime: this.data.ctime,
        action:'A'
      },
      success: res => {
        console.log('调用云函数成功: ', res);
        wx.showToast({
          title: '上报成功',
          icon: 'success',
          duration: 1000,
          success: function () {
            wx.redirectTo({
              url: '../fixRecord/fixRecord'
            })
          }
        })
      },
      fail: err => {
        // handle error
        console.log(err)
      }
    })
  },


  assetnameIn: function (event) {
    var that = this;
    that.setData({
      assetname: event.detail
    })
  },
  addrIn: function (event) {
    var that = this;
    that.setData({
      addr: event.detail
    })
  },
  userIn: function (event) {
    var that = this;
    that.setData({
      user: event.detail
    })
  },


//upload img
  choose_image:function(){
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
  removeImage: function() {
   var that=this;
    if (!this.data.imagePath==''){
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
  } ,
  
  getDataBindTap: function(e) {
    var that=this;
    that.setData({
      problemDetail: e.detail.value
    })
  }


  
})