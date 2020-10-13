// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('zh_approval_routing').where({
    type: _.eq(event.type)
  }).update({
    // data 传入需要局部更新的数据
    data: {
      appr_setting: event.appr_setting
    }
  })
    .then(console.log)
    .catch(console.error)
}

