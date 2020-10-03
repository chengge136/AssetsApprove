// finance/finance/finance.js
const db = wx.cloud.database();
import Notify from '../../vant/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    type:'',
    imagePath:'',
    tsbutton:false,
    navList: ['物资名单','物资搜索','申请购物车'],
    currentIndexNav:1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  inputName(e) {
    this.setData({
      name: e.detail,
    });
  },
    //点击首页导航按钮
    activeNav(e) {
      console.log(e.target.dataset.index);
      this.setData(
        {
          currentIndexNav: e.target.dataset.index
        }
      )
  
      if (e.target.dataset.index==0){
        wx.redirectTo({ url: '../requestAsset/requestAsset' })
      } else if (e.target.dataset.index == 2){
        wx.redirectTo({ url: '../requestCart/requestCart' })
      }
  
    },

  onSearch() {
    let that = this;
    if(!that.data.name==''){
    const _ = db.command;
    console.log(that.data.name);    
    db.collection('zh_assets').where(
      {
        name: _.eq(that.data.name)
      }
    ).get({
      success: function (res) {
        if( res.data.length>0){
          that.setData({
            name: res.data[0].name,
            type: res.data[0].type,
            imagePath: res.data[0].img         
          })
        }else{
          Notify({ type: 'warning', duration:3000, message: '物品['+that.data.name+']不存在，请联系管理员添加' });
          that.setData({
            name: ''
          })
        }
        
      }
    })
    }
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
        type:that.data.type
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