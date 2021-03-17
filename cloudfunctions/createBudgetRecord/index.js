// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if(event.type=='c'){
    return await db.collection('zh_assets_budget').add({
      data: {
        requestid: event.requestid,
        dept: event.dept,
        phone:event.phone,
	      createdby: event.createdby,
	      count: event.count,
        budgetDetails: event.budgetDetails,
        activeYear:event.activeYear,
        status:'1',
        comment:''
      }
    }).then(console.log).catch(console.error)
  }
  

}

