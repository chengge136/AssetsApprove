// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('zh_assets').add({
    data: {
      name: event.name,
      type:event.type,
      memo: event.memo,
      img: event.img,
    }
  })
    .then(console.log)
    .catch(console.error)

}

