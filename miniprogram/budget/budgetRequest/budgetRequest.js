// stationmanager/batchBooking/batchBooking.js
import Notify from '../../vant/notify/notify';
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    assets: [],
    submited: false,
    username:'',
    dept:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userDetail = wx.getStorageSync('userDetail');
    const _ = db.command;
    var assets = [];

    db.collection('zh_assets').where(
      {
        type: _.eq('3')
      }
    ).get({
      success: function (res) {
        console.log(res.data);

        for (var i = 0; i < res.data.length; i++) {
          
          assets.push({
            value: res.data[i]._id,
            name: res.data[i].name,
            checked:false,
            quantity:0
          })
        }
        console.log('assets',assets);

        that.setData({
          assets: assets,
          username:userDetail.name,
          deptHan:userDetail.dept,
          dept:userDetail.dept
        })
      }
    })


    db.collection('zh_assets_budget').orderBy('ctime','desc').where(
      {
        dept: _.eq(userDetail.dept) //根据部门来查询
      }
    ).get({
      success: function (res) {
        console.log(res.data);
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].requestid));
          res.data[index].dept = app.res.data[index].dept;

        }
        that.setData({
          budgetorders: res.data
        })
      }
    })


  },
  bindKeyInput(e){ 
    var that=this;
    
    if(e.detail.value.length==0){
      e.detail.value='0';
    }
    var quantity=e.detail.value;
    var assets=that.data.assets;
    var name=e.currentTarget.dataset.name;
    console.log(name +'的预算数量改成了'+quantity+'个');

    for (let i = 0;i < assets.length; i++) {
      if(assets[i].name==name){
        assets[i].quantity=parseInt(quantity);
      }
    }
    that.setData({
      assets: assets
    });
    
  },

  checkAll(e){
    var that = this;
    var assets=that.data.assets;
    console.log('length',assets.length);
    //全选
    if(e.detail.value.length==1){ 
      for (let i = 0;i < assets.length; i++) {
        assets[i].checked = true;
      }
      console.log('assets',assets);
    }else{ 
      for (let i = 0;i < assets.length; i++) {
        assets[i].checked = false;
      }
      console.log('assets',assets);
    }
    that.setData({
      assets:assets
    });
  },
  checkboxChange(e) {
    var that = this;
    var assets=that.data.assets;
    console.log('checkbox携带value值为：', e.detail.value);
    var name=e.currentTarget.dataset.name;
    for (let i = 0;i < assets.length; i++) {
      if(assets[i].name==name){
        console.log('点击的是第'+i+'个，名称是'+name);
        assets[i].checked=!assets[i].checked;
      }
    }
    that.setData({
      assets: assets
    });
  },

  sortprice(a,b){ 
    　　return a.age-b.age  
    　　},

 
  submitBudget() {

    var that = this;
    var assets=that.data.assets;
    var budgetorders=that.data.budgetorders;

    var count=0;
    var empty=false;
    var number=0;

    for (let i = 0;i < assets.length; i++) {
      if(assets[i].checked){
        if(assets[i].quantity==0){
          empty=true;
          number=i;
        }
        count+=1;
      }
    }
    var currentYear=new Date().getFullYear();
    var submited=false;
    for (let i = 0;i < budgetorders.length; i++) {
      if(budgetorders[i].activeYear==currentYear && budgetorders[i].status!='-1'){
        submited=true;
      }
    }
    if(empty){
      Notify({ type: 'warning', duration:4000, message: assets[number].name+'的预算数量为0，请除去选中或者填入正确的数量' });

    }else if(submited){
      Notify({ type: 'warning', duration:4000, message: '你已提交过本年度的预算，不可重复提交!' });
    }else if(count>0){
      wx.showModal({
        title: '提示', 
        content: '确定要提交这 ' + count + ' 种固定资产的预算？',
        success(res) {
          if (res.confirm) {
            that.setData({ 
              //按钮变灰
              submited: true
            });
            wx.showLoading({
              title: '提交中',
            })
            // 生成预算记录
            that.createBudgetRecord(that.data.assets);
            wx.hideLoading(); 
            Notify({ type: 'success', duration:4000, message: '可在提交记录内查看本年度的预算' });

           
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  createBudgetRecord: function (assets) {
    var that=this;
    var count=0;
    var budgetDetails='';
    for (let i = 0;i < assets.length; i++) {
      if(assets[i].checked){
        count+=1;
        budgetDetails+=assets[i].name+'-'+assets[i].quantity.toString()+';  ';
      }
    }
    console.log(that.data.username);
    
    wx.cloud.callFunction({
      name: 'createBudgetRecord',
      data: {
	      requestid: new Date().getTime(),
	      dept: that.data.dept,
	      createdby: that.data.username,
	      count: count,
        budgetDetails: budgetDetails,
        activeYear:new Date().getFullYear(),
        type:'c'
      },
      complete: res => {
        console.log('batch update balance success: ', res);
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
    return {
      title: this.data.username+'的预算申请',
      desc: '点击进入小程序，审批员工的预算申请单', 
      path: '/approver/assetApprove1/assetApprove1',
      //imageUrl: '' // 图片 URL
       }
  }
})