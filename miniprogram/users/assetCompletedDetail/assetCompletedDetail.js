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
    active:3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var _id = options._id;
    var ctime=options.ctime;
    
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
        var steps = [{text: '审批',desc: '审批通过',},{text: '等待领取',desc: '审批完成，等待领取',},{text: '完成',desc: '已领取物资，申请流程完毕',},];
  
  
        steps.unshift({
          text: '提交物资申请',
          desc: app.formatDate(new Date(ctime))
        });

        that.setData({
          orderid: res.data[0].orderid,
          requestor: res.data[0].requestor,
          dept:res.data[0].dept,
          tag:res.data[0].assettype,
          itemsinfo: itemsinfo,
          user: res.data[0].user,
          memo: res.data[0].memo,
          ctime:app.formatDate(new Date(res.data[0].ctime)),
          comment:res.data[0].comment,
          steps:steps      

        }) 
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