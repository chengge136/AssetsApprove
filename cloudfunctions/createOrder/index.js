// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if(event.submittype=='1'){
    return await db.collection('zh_assets_order').add({
      data: {
        orderid:event.orderid,
        requestor: event.requestor,
        dept:event.dept,
        phone: event.phone,
        assettype:event.assettype,
        about: event.about,
        itemsinfo: event.itemsinfo,
        memo: event.memo,
        user:event.user,
        ctime: event.ctime,
        required_node:event.required_node,
        curnodeid:event.curnodeid,
        status:'1',
        comment:''
      }
    }).then(console.log).catch(console.error)
  }
  

}

