//app.js
var app = getApp();
// 初始化 cloud
wx.cloud.init();
//1、引用数据库
const db = wx.cloud.database({
  //这个是环境ID,不是环境名称
  env: 'yxk-kappa-hlb24'
})
  
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'yxk-kappa-hlb24',
        traceUser: true,
      })
    }

    this.globalData = {}
  },

  // 时间戳转为日期时间
  formatDate: function (now) {

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
  },
  formatmd: function (now) {

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    return year + "/" + month + "/" + date;
  },

  getDate: function (now) {

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    return year + "/" + month + "/" + date;
  },
  getcurrentDate:function(now){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return Y + '年' + M + '月' + D + '日'  
  },

  getApprStepByNodeid:function(curnodeid){
    if(curnodeid=='1'){
      return '部门领导';
    }else if(curnodeid=='2'){
      return '综合办主任';
    }else if(curnodeid=='3'){
      return '物资部主任';
    }else if(curnodeid=='4'){
      return '分部分管领导';
    }else{
      return '分部主要负责人';
    }
    
  },

})
