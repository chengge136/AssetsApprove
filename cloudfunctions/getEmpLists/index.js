// 云函数入口文件
const cloud = require('wx-server-sdk')
	cloud.init()

	const db = cloud.database()
	const _ = db.command

	const MAX_LIMIT = 100
	// 云函数入口函数
	exports.main = async(event, context) => {
	// 先取出集合记录总数
	const countResult = await db.collection('zh_users').count()
		console.log(countResult)
		const total = countResult.total
		// 计算需分几次取
		const batchTimes = Math.ceil(total / MAX_LIMIT);
	// 承载所有读操作的 promise 的数组
	const tasks = []
	for (let i = 0; i < batchTimes; i++) {
		//get()操作返回的是Promise对象，每获取一个Promise就压栈进入tasks数组
		const promise = db.collection('zh_users').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
			tasks.push(promise)
	}
	console.log(tasks)
	console.log(await Promise.all(tasks))
	// 等待所有
	return (await Promise.all(tasks)).reduce((acc, cur) => {
		return {
			data: acc.data.concat(cur.data),
			errMsg: acc.errMsg,
		}
	})
}
