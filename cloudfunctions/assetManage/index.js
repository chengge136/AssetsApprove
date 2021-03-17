// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if(event.action=='A'){

    return await db.collection('zh_assets').add({
      data: {
        name: event.name,
        type:event.type,
        img: event.img,
        popular:false
      }
    }).then(console.log).catch(console.error)

  }else if(event.action=='U'){

    return await db.collection('zh_assets').where({
      _id: _.eq(event.id)
    }).update({
      data: {
        name: event.name,
        type:event.type,
        popular:event.popular
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

