// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if(event.action=='R'){

    return await db.collection('zh_assets_order').where({
      orderid: _.eq(event.orderid)
    }).update({
      data: {
        comment: event.rejReason,
        status:'-1'
      }
    }).then(console.log).catch(console.error)

  }else if(event.action=='A'){

    return await db.collection('zh_assets_order').where({
      orderid: _.eq(event.orderid)
    }).update({
      data: {
        curnodeid: event.curnodeid,
        status:event.status
      }
    }).then(console.log).catch(console.error)

  }else{
    try {
      return await db.collection('zh_assets').where({
        _id: _.eq(event.id)
      }).remove()
    } catch (e) {
      console.error(e)
    }
  }


  
}

