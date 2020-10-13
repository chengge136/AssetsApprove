// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if(event.action=='A'){

    return await db.collection('zh_users').add({
      data: {
        name: event.name,
        phone:event.phone,
        dept: event.dept,
        roletype: event.roletype,
        approver: event.approver
      }
    }).then(console.log).catch(console.error)

  }else if(event.action=='U'){

    return await db.collection('zh_users').where({
      _id: _.eq(event.id)
    }).update({
      data: {
        phone: event.phone,
        dept:event.dept,
        roletype:event.roletype,
        approver:event.approver
      }
    }).then(console.log).catch(console.error)

  }else{
    try {
      return await db.collection('zh_users').where({
        _id: _.eq(event.id)
      }).remove()
    } catch (e) {
      console.error(e)
    }
  }


  
}

