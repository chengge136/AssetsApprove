// canteen/addmenu/addmenu.js
import Notify from '../../vant/notify/notify';
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    imagePath: '',
    name: '',
    type: '',
    disabled:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          type: res.data[0].type,
          memo: res.data[0].memo,
          imagePath: res.data[0].img,
          id:res.data[0]._id
        })
      })
  },
  cusServer() {
    wx.showToast({
      title: '暂不支持',
      icon: 'none',
      duration: 2000,

    })
  },
  requestCart(){
    wx.redirectTo({
      url: '../requestCart/requestCart'
    })
  },

  addToCart: function (event) {

    //将购物车数据添加到缓存
    var that = this
    //获取缓存中的已添加购物车信息
    var cartItems = wx.getStorageSync('cartItems') || []
    console.info("缓存数据：" + cartItems);
    //判断购物车缓存中是否已存在该货品
    var exist = cartItems.find(function (ele) {
      return ele.id === that.data.id
    })

    var typeExit = cartItems.find(function (ele) {
      return ele.type != that.data.type
    })
    if(typeExit){
      Notify({ type: 'warning', message: '一次只能提交同一类型的物资\n若选择错误类别，请于申请购物车内删除',duration: 3000});
    }else if (exist) {
      //如果存在，则增加该货品的购买数量
      exist.quantity = parseInt(exist.quantity) + 1;
          //加入购物车数据，存入缓存
      wx.setStorage({
        key: 'cartItems',
        data: cartItems,
        success: function (res) {
          //添加购物车的消息提示框
          wx.showToast({
            title: "添加到申请清单",
            icon: "success",
            durantion: 2000
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000) //延迟时间
        }
      })
    } else {
      //如果不存在，传入该货品信息
      cartItems.push({
        id: that.data.id,
        quantity: 1,
        name: that.data.name,
        imagePath: that.data.imagePath,
        type:that.data.type,
        memo:that.data.memo
      })

          //加入购物车数据，存入缓存
      wx.setStorage({
        key: 'cartItems',
        data: cartItems,
        success: function (res) {
          //添加购物车的消息提示框
          wx.showToast({
            title: "添加到申请清单",
            icon: "success",
            durantion: 2000
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000) //延迟时间
        }
      })
    }

  },
  buyNow() {
    wx.showToast({
      title: '正在开发',
    })

  },
  //图片点击事件
  imgYu: function (event) {
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