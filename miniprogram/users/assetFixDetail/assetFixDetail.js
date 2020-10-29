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
    assetname:'',
    addr:'',
    user: '',
    problemDetail: '',
    img:'',
    ctime:'',
    comment:'',
    status:'',
    steps: [],
    active:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var _id = options._id;
    
    db.collection('zh_assets_fix_order').where({
      _id: _.eq(_id)
    }).get().then(res => {
        console.log("red.data:",res.data[0]);   

        that.setData({
          orderid: res.data[0].orderid,
          requestor: res.data[0].requestor,
          dept:app.returnHanDept(res.data[0].dept),
          assetname:res.data[0].assetname,
          addr:res.data[0].addr,
          user: res.data[0].user,
          problemDetail: res.data[0].problemDetail,
          img:res.data[0].img,
          ctime:app.formatDate(new Date(res.data[0].ctime)),
          comment:res.data[0].comment,
          status:res.data[0].status
        }) 

        if(res.data[0].status=='1'){
          //pending
          var steps = [{text: '等待维修',desc: '专员已接收，等待上门维修',},{text: '完成',desc: '已完成维修，报修流程完毕',},];
          steps.unshift({
            text: '提交设备维修',
            desc: app.formatDate(new Date(res.data[0].ctime))
          });
    
          that.setData({
            steps:steps,
            active:1
        
          })
  
        }else if(res.data[0].status=='2'){
          //completed
          var steps = [{text: '等待维修',desc: '专员已接收，等待上门维修',},{text: '完成维修',desc: '内容：'+res.data[0].comment,},];
          steps.unshift({
            text: '提交设备维修',
            desc: app.formatDate(new Date(res.data[0].ctime))
          });
  
          that.setData({
            steps:steps,
            active:2
        
          })
        }else{
          //rejected
          var steps = [{text: '完成',desc: '已完成维修，报修流程完毕',},];
          steps.unshift({
            text: '报修被驳回',
            desc: '原因：'+res.data[0].comment
          });
  
          steps.unshift({
            text: '提交设备维修',
            desc: app.formatDate(new Date(res.data[0].ctime))
          });
  
          that.setData({
            steps:steps,
            active:1
        
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