// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if(event.action=='A'){

    return await db.collection('zh_assets_fix_order').add({
      data: {
        orderid:event.orderid,
        requestor:  event.requestor,
        dept:  event.dept,
        phone:  event.phone,
        assetname:  event.assetname,
        addr:  event.addr,
        user:  event.user,
        img: event.imagePath,
        problemDetail: event.problemDetail,
        comment:'',
        ctime: event.ctime,
        status:'1'
      }
    }).then(console.log).catch(console.error)

  }else if(event.action=='U'){

    return await db.collection('zh_assets_fix_order').where({
      _id: _.eq(event.id)
    }).update({
      data: {
        comment: event.comment,
        status:event.status
      }
    }).then(console.log).catch(console.error)

  }


  
}

