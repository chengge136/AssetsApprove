// users/orderDetail/orderDetail.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
    requestor: '',
    dept:'',
    ctime:'',
    comment:'',
    itemsinfo:[],
    rejReason:'',
    disabled:false,
    steps: [
      {
        text: '提交预算申请',
      },
      {
        text: '等待部门领导审批',
      },
      {
        text: '综合办综合员审批',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var _id = options._id;

    //1，获取订单信息
    db.collection('zh_assets_budget').where({
      _id: _.eq(_id)
    }).get().then(res => {
        console.log("red.data:",res.data[0]);   
        //分割菜单
        var itemsinfo = [];
        var items = res.data[0].budgetDetails.split(";");
        for (var i = 0; i < items.length-1; i++) {
          var item = items[i].split("-");
          itemsinfo.push({
            name: item[0],
            number: item[1]
          })
        }
        that.setData({
          orderid: res.data[0].requestid,
          requestor: res.data[0].createdby,
          dept:app.returnHanDept(res.data[0].dept),
          itemsinfo: itemsinfo,
          ctime:app.formatDate(new Date(res.data[0].requestid)),
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
  getDataBindTap: function(e) {
    var that=this;
    that.setData({
      rejReason: e.detail.value
    })
  },
  reject:function(){
    var user
    var that = this;
    if(!that.data.rejReason==''){
      wx.showModal({
        title: '提示',
        content: '确定要拒绝 ' + that.data.requestor + '的预算申请 ？',
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
              name: 'budgetApproveManage',
              data: {
                orderid: that.data.orderid,
                rejReason:that.data.rejReason,
                action:'R'
              },
              success: res => {
                wx.showToast({
                  title: '已拒绝',
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

            //2，生成审批记录,看后续是否需要，再添加
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  approve: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定同意 ' + that.data.requestor + ' 的预算申请 ？',
      success(res) {
        if (res.confirm) {
          that.setData({
            disabled:true
          });
          wx.showLoading({
            title: '提交中...',
          })
          //1，更新订单状态
          // 更改节点，状态？
          wx.cloud.callFunction({
            name: 'budgetApproveManage',
            data: {
              orderid: that.data.orderid,
              status:'3',
              action:'A'
            },
            success: res => {
              wx.showToast({
                title: '已同意',
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

          //2，生成审批记录，,看后续是否需要，再添加
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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