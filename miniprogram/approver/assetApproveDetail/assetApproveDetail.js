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
    tag:'',
    user: '',
    memo: '',
    ctime:'',
    comment:'',
    itemsinfo:[],
    steps: [],
    active:'',
    rejReason:'',
    disabled:false,
    curnodeid:'',
    required_node:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var _id = options._id;
    var assettype = options.assettype;
    var curnodeid = options.curnodeid;
    
    //1，获取订单信息
    db.collection('zh_assets_order').where({
      _id: _.eq(_id)
    }).get().then(res => {
        console.log("red.data:",res.data[0]);   
        //分割菜单
        var itemsinfo = [];
        var items = res.data[0].itemsinfo.split(";");
        for (var i = 0; i < items.length-1; i++) {
          var item = items[i].split("-");
          itemsinfo.push({
            name: item[0],
            number: item[1]
          })
        }
        that.setData({
          orderid: res.data[0].orderid,
          requestor: res.data[0].requestor,
          dept:app.returnHanDept(res.data[0].dept),
          tag:app.returnHanAssetType(res.data[0].assettype),
          itemsinfo: itemsinfo,
          user: res.data[0].user,
          memo: res.data[0].memo,
          ctime:app.formatDate(new Date(res.data[0].ctime)),
          comment:res.data[0].comment,
          curnodeid:curnodeid,
          required_node:res.data[0].required_node
        })
        var required_node=res.data[0].required_node;
        var steps=[];
        for(var i=0;i<required_node.length;i++){
          if(curnodeid==required_node[i]){
            that.setData({
              active:i      
            })
          }
          switch(required_node[i]){
            case '1':
              steps.push({
                text: '部门领导',
              });
              break;
            case '2':
              steps.push({
                text: '综合办主任',
              });
              break;
            case '3':
              steps.push({
                text: '物资部主任',
              });
              break;
            case '4':
              steps.push({
                text: '分部分管领导',
              });
              break;
            case '5':
              steps.push({
                text: '分部主要负责人',
              });
              break;
          }
        }
        that.setData({
          steps:steps
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
        content: '确定要拒绝 ' + that.data.requestor + '的申请 ？',
        success(res) {
          if (res.confirm) {
            that.setData({
              disabled:true
            });
            wx.showLoading({
              title: '移除中...',
            })
            //1，更改订单状态
            wx.cloud.callFunction({
              name: 'assetApproveManage',
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
      content: '确定同意 ' + that.data.requestor + ' 的申请 ？',
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
          var curnodeid=that.data.curnodeid;
          var required_node=that.data.required_node;
          var len=required_node.length;

          for(var i=0;i<len;i++){
            if(curnodeid==required_node[i] && i==len-1){
              console.log('已经到最后一个节点了，变为approve');
              //如果是最后一个节点，则改变状态为approved
              that.approveAction(required_node[i],'2');

            }else if(curnodeid==required_node[i]){
              //如果不是，状态不变，且当前节点变成下一个节点
              that.approveAction(required_node[i+1],'1');

            }
          }
          //2，生成审批记录，,看后续是否需要，再添加
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  approveAction:function(curnodeid,status){
    wx.cloud.callFunction({
      name: 'assetApproveManage',
      data: {
        orderid: this.data.orderid,
        curnodeid:curnodeid,
        status:status,
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