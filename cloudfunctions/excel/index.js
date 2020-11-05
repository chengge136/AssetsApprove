const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init()
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.type=='request'){
    try {

      let userdata = event.userdata;
      let year = event.year;
  
        //1,定义excel表格名
      let dataCVS = 'excel/requestRecords_'+year+'.xlsx'
      //2，定义存储数据的
      let alldata = [];
      let row = ['编号', '申请人', '部门', '联系电话', '物资类型','使用人','创建时间','申请的物资及数量']; //表属性
      alldata.push(row);
      for (let key in userdata) {
        let arr = [];
        arr.push(userdata[key].orderid);
        arr.push(userdata[key].requestor);
        arr.push(userdata[key].dept);
        
        arr.push(userdata[key].phone);
        arr.push(userdata[key].assettype);
        arr.push(userdata[key].user);
  
        arr.push(userdata[key].ctime);
        arr.push(userdata[key].itemsinfo);
        alldata.push(arr);
      }
  
      //3，把数据保存到excel里
      var buffer = await xlsx.build([{
        name: "mySheetName",
        data: alldata
      }]);
      //4，把excel文件保存到云存储里
      return await cloud.uploadFile({
        cloudPath: dataCVS,
        fileContent: buffer, //excel二进制文件
      })
  
    } catch (e) {
      console.error(e)
      return e
    }
  }else if(event.type=='fix'){
    try {

      let userdata = event.userdata;
      let year = event.year;
  
        //1,定义excel表格名
        let dataCVS = 'excelFix/assetsFix_'+year+'.xlsx'
        //2，定义存储数据的
      let alldata = [];
      let row = ['编号', '提交人', '部门', '联系电话', '设备名称','所在位置','使用人','问题描述','解决方案','提交时间']; //表属性
      alldata.push(row);
      for (let key in userdata) {
        let arr = [];
        arr.push(userdata[key].orderid);
        arr.push(userdata[key].requestor);
        arr.push(userdata[key].dept);
        
        arr.push(userdata[key].phone);
        arr.push(userdata[key].assetname);
        arr.push(userdata[key].addr);
  
        arr.push(userdata[key].user);
        arr.push(userdata[key].problemDetail);
  
        arr.push(userdata[key].comment);
        arr.push(userdata[key].ctime);
  
        alldata.push(arr);
      }
  
      //3，把数据保存到excel里
      var buffer = await xlsx.build([{
        name: "mySheetName",
        data: alldata
      }]);
      //4，把excel文件保存到云存储里
      return await cloud.uploadFile({
        cloudPath: dataCVS,
        fileContent: buffer, //excel二进制文件
      })
  
    } catch (e) {
      console.error(e)
      return e
    }
  }

}
