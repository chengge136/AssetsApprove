// users/userIndex/UserIndex.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{name:"经常领取",id:"list1",icon:"fa fa-star-o fa-2x"},{name:"日常办公用品",id:"list2",icon:"fa fa-pencil fa-2x"},{name:"低值易耗品",id:"list3",icon:"fa fa-paperclip fa-2x"},{name:"固定资产",id:"list4",icon:"fa fa-desktop fa-2x"}],
    toView: '',
    currentIndexNav:0,
    assetlists: [],
    sum:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.cloud.callFunction({
      name: "getAssets"
     
    }).then(res => {
      that.setData({
        assetlists: res.result.data
      })
      
    }).catch(err => {
      console.error('读取失败' + err)
    })

  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  clickScroll: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    this.setData({
      toView: id,
      currentIndexNav:index
    })
  },

  addNumber:function(event){
    let index=event.target.dataset.index;
    var that=this;
    var carts=that.data.assetlists;
    let num = carts[index].quantity;
    num = num + 1;
    carts[index].quantity=num;
      
    
    let sum=0;
    for(let i=0;i<carts.length;i++){
      sum=sum+carts[i].quantity;
    }
    that.setData({
      assetlists: carts,
      sum:sum
    });

  },
  deleteNumber(event){
    let index=event.target.dataset.index;
    var that=this;
    var carts=that.data.assetlists;
    let num = carts[index].quantity;
    num = num - 1;
    carts[index].quantity=num;
      
    
    let sum=0;
    for(let i=0;i<carts.length;i++){
      sum=sum+carts[i].quantity;
    }
    that.setData({
      assetlists: carts,
      sum:sum
    });

  },
  movetoCart: function (event) {
    var that = this    
    if(that.data.sum<1){
      wx.showToast({
        title: '请先选择再提交',
      })
    }else{
      //先删除原有数据库缓存
    try {
      wx.removeStorageSync('cartItems')
    } catch (e) {
      console.log(e);
    }

    var cartItems = []
    var assetlists=that.data.assetlists;

    for(let i=0;i<assetlists.length;i++){
      if(assetlists[i].quantity>0){
        cartItems.push({
          id: assetlists[i]._id,
          img:assetlists[i].img,
          name:assetlists[i].name,
          quantity: assetlists[i].quantity,
          type:assetlists[i].type
        })
      }
      
    }
      
    //存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: function (res) {
       //更新界面
       wx.navigateTo({ url: '../requestCart/requestCart' });
      }
    })
    }

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