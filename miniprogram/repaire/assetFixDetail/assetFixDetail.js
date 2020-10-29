// users/orderDetail/orderDetail.js
import Notify from '../../vant/notify/notify';
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
    requestor: '',
    dept: '',
    phone: '',
    assetname: '',
    addr: '',
    user: '',
    problemDetail: '',
    img: '',
    ctime: '',
    status: '',
    comment: '',
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var _id = options._id;
    
    // 获取报修单信息
    db.collection('zh_assets_fix_order').where({
      _id: _.eq(_id),
      status: _.eq('1')
    }).get().then(res => {
        console.log("red.data:",res.data[0]);   

        that.setData({
          orderid:res.data[0].orderid,
          requestor:res.data[0].requestor,
          dept:res.data[0].dept,
          phone:res.data[0].phone,
          assetname:res.data[0].assetname,
          addr:res.data[0].addr,
          user:res.data[0].user,
          problemDetail:res.data[0].problemDetail,
          img:res.data[0].img,
          ctime:res.data[0].ctime,
          status:res.data[0].status,
          comment:res.data[0].comment        
        })
    })

    
    /*
    steps.unshift({
      text: '提交物资申请',
      desc: app.formatDate(new Date(ctime))
    });

    */
  },
  makeCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  getDataBindTap: function(e) {
    var that=this;
    that.setData({
      rejReason: e.detail.value
    })
  },
  
  commentIn: function (event) {
    var that = this;
    that.setData({
      comment: event.detail
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
  reject:function(){
    var that = this;
    if(that.data.comment==''){
      Notify({ type: 'warning', duration: 2000, message: '请在下面的备注中填写驳回的原因！' });
    }else{
      wx.showModal({
        title: '提示',
        content: '确定要驳回 ' + that.data.requestor + ' 的报修 ？',
        success(res) {
          if (res.confirm) {
            that.setData({
              disabled:true
            });
            wx.showLoading({
              title: '驳回中...',
            })
            //1，更改订单状态
            wx.cloud.callFunction({
              name: 'assetFixManage',
              data: {
                orderid: that.data.orderid,
                comment:that.data.comment,
                action:'R'
              },
              success: res => {
                wx.showToast({
                  title: '已驳回',
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
    }
    
  },
  approve:function() {
    var that = this;
    if(that.data.comment==''){
      Notify({ type: 'warning', duration: 2000, message: '请在下面的备注中填写维修的内容！' });
    }else{
      wx.showModal({
        title: '提示',
        content: '确定完成 ' + that.data.requestor + ' 的报修 ？',
        success(res) {
          if (res.confirm) {
            that.setData({
              disabled:true
            });
            wx.showLoading({
              title: '提交中...',
            })
            //更新订单状态
            wx.cloud.callFunction({
              name: 'assetFixManage',
              data: {
                orderid: that.data.orderid,
                comment:that.data.comment,
                action:'C'
              },
              success: res => {
                wx.showToast({
                  title: '已完成',
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