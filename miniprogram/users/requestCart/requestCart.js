// users/userCart/userCart.js
const db = wx.cloud.database();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    carts: [], //数据 
    isempty: null,
    about:'',
    itemsinfo:'',
    assettype:'',
    tag:'',
    requestor:'',
    phone:'',
    dept:'',
    memo:'',
    user:'',
    required_node:'',
    curnodeid:''



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    const _ = db.command;
    // 获取购物车的物品类别
    var arr = wx.getStorageSync('cartItems') || [];
    var userDetail = wx.getStorageSync('userDetail');

    var type=arr[0].type;
    var dept=userDetail.dept;
    switch (type) {
      case '1':
        that.setData({tag:'办公用品'});
          break; 
      case '2':
        that.setData({tag:'低值易耗品'});
          break; 
      case '3':
        that.setData({tag:'固定资产'});
        break; 
    } 
    
    switch (dept) {
      case '1':
        that.setData({dept:'行政部'});
          break; 
      case '2':
        that.setData({dept:'维护部'});
          break; 
      case '3':
        that.setData({dept:'售后部'});
        break; 
    } 
   
    that.setData({
      assettype:arr[0].type,
      requestor:userDetail.name
    });

    //获取此类别的审批流
    db.collection('zh_approval_routing').where(
      {
        type: _.eq(parseInt(arr[0].type))
      }
    ).get({
      success: function (res) {
        var appr_setting=res.data[0].appr_setting;
        console.log(appr_setting,appr_setting[0]);

        that.setData({
          required_node: appr_setting,
          curnodeid:appr_setting[0]
        }) 
      }
    })

  },
  inputMemo: function (event) {
    var that = this;
    that.setData({
      memo: event.detail
    })
  },
  inputUser: function (event) {
    var that = this;
    that.setData({
      user: event.detail
    })
  },
  flash() {
    var arr = wx.getStorageSync('cartItems') || [];
    if (arr.length > 0) {

      // 更新数据  
      this.setData({
        carts: arr,
        isempty: false
      });
    }
  },
  add: function (event){
    var that=this;
    console.log("add",event.currentTarget.dataset.id);
    var cartItems = wx.getStorageSync('cartItems') || []
    var exist = cartItems.find(function (ele) {
      return ele.id === event.currentTarget.dataset.id
    })
    if (exist) {
      //如果存在，则增加该货品的购买数量
      exist.quantity += 1;
      console.log("现在的数量是:", exist.quantity)
      wx.setStorage({
        key: 'cartItems',
        data: cartItems,
        success: function (res) {
          wx.showToast({
            title: "加一份",
            icon: "success",
            durantion: 2000
          })
           //刷新页面
           that.flash();       
        }
      })
    }
  },
  bindKeyInput: function (event) {
    
    var that=this;
    console.log(event.target.dataset.itemid);
    var itemid=event.target.dataset.itemid;
    var itemname=event.target.dataset.itemname;
    var cartItems = wx.getStorageSync('cartItems') || []
    var exist = cartItems.find(function (ele) {
      return ele.id === itemid
    })
    if (exist) {
      exist.quantity = parseInt(event.detail.value);
      wx.setStorage({
        key: 'cartItems',
        data: cartItems,
        success: function (res) {
          wx.showToast({
            title: itemname+":"+event.detail.value+"个",
            icon: "success",
            durantion: 2000
          })
           //刷新页面
           that.flash();
        }
      })
    }
  },

  remove: function (event) {
    var that = this;
    var index=0;
    var goodname='';
    var arr = wx.getStorageSync('cartItems') || [];
    for (var i = 0; i < arr.length; i++) {
      // var index = arr[i].indexOf(event.currentTarget.dataset.id)           
      if (arr[i].id == event.currentTarget.dataset.id) {
        index=i;
        goodname = arr[i].name;
      }
    }
    console.log("remove")
    wx.showModal({
      title: '提示',
      content: '确认不要 ' + goodname+' 了吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          
          if (arr.length==1){
            wx.removeStorageSync('cartItems')
            setTimeout(function () {
              wx.redirectTo({
                url: '../userIndex/userIndex'
              })
            }, 1000) //延迟时间
          }else{
            
            console.log('delete the number ', index)
            arr.splice(index, 1);
            //删除现有缓存
            wx.removeStorageSync('cartItems')
            //导入新的数据包
            wx.setStorage({
              key: 'cartItems',
              data: arr,
              success: function (res) {
                wx.showToast({
                  title: "删除成功",
                  icon: "success",
                  durantion: 2000
                })
                //刷新页面     
                 that.flash();
              }
            })
          }
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
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cartItems') || [];
    console.log('物品样式有：',arr.length)
    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      var about ='';
      var itemsinfo='';
      for (var i = 0; i < arr.length; i++) {
        about += arr[i].name +' ';
        itemsinfo += arr[i].name +'-'+ arr[i].quantity+';';
      };
      // 更新数据  
      this.setData({
        carts: arr,
        isempty: false,
        about:about,
        itemsinfo: itemsinfo
      });
      console.log('itemsinfo', itemsinfo)

    } else {
      this.setData({
        isempty: true,
      });
    }
  },
  Submit(){

    var that = this
    if(that.data.assettype=='1' && that.data.user==''){
      wx.showToast({
        title: '请填写领用人',
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '确认提交申请单了吗？',
        success(res) {
          if (res.confirm) {
            that.setData({ disabled: true });
            wx.showLoading({
              title: '提交中...',
            })

            // wx.removeStorageSync('cartItems'); //下单后清空购物车
            // 1,如果是固定资产，需要判定预算
            
            //提交
            var userDetail = wx.getStorageSync('userDetail');
            wx.cloud.callFunction({
              name: 'createOrder',
              data: {
                submittype:'1',//1提交物资申请，2为提交报修
                orderid:new Date().getTime(),
                requestor: userDetail.name,
                dept:userDetail.dept,
                phone: userDetail.phone,
                assettype:that.data.assettype,
                about:that.data.about,
                itemsinfo: that.data.itemsinfo,
                memo: that.data.memo,
                user:that.data.user,
                ctime: new Date().getTime(),
                required_node:that.data.required_node,
                //当前审批角色
                curnodeid:that.data.curnodeid
              },
              complete: res => {
                console.log('createOrder success: ', res);
                wx.hideLoading();
                // wx.redirectTo({url: '../userOrders/userOrders',})

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