// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if(event.action=='R'){

    return await db.collection('zh_assets_budget').where({
      requestid: _.eq(event.orderid)
    }).update({
      data: {
        comment: event.rejReason,
        status:'-1'
      }
    }).then(console.log).catch(console.error)

  }else if(event.action=='A'){

    return await db.collection('zh_assets_budget').where({
      requestid: _.eq(event.orderid)
    }).update({
      data: {
        status:event.status
      }
    }).then(console.log).catch(console.error)

  }
  
}

