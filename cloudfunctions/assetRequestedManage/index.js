// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if(event.action=='A'){

    return await db.collection('zh_assets_requested').add({
      data: {
        dept: event.dept,
        itemsinfo:event.itemsinfo
      }
    }).then(console.log).catch(console.error)

  }else if(event.action=='U'){

    return await db.collection('zh_assets_requested').where({
      dept: _.eq(event.dept)
    }).update({
      data: {
        itemsinfo: event.itemsinfo
      }
    }).then(console.log).catch(console.error)

  }  
}

