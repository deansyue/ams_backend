const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Company } = require('../models')

const signController = {
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body

      // 判斷帳號是否存在
      let user = await User.findOne({ where: { account }, include: Company })
      if (!user) return res.json({ status: 'error', message: '帳號與密碼不存在' })
      // 判斷帳號是否上鎖
      if (user.lock) return res.json({ status: 'error', message: '此帳號輸入錯誤密碼已連續5次,帳號已上鎖,無法登入' })

      // 判斷密碼 及 使用者身份 是否正確
      const pasIsCorrect = await bcrypt.compare(password, user.password)
      if (!pasIsCorrect || user.role !== 1) {
        // 錯誤時，更新errTiems,並判斷錯誤次數5次以上,上鎖帳號
        const errTimes = user.errTimes += 1
        const lock = user.errTimes > 5 ? true : false
        await user.update({ errTimes, lock })
        return res.json({ status: 'error', message: '帳號與密碼不存在' })
      }

      // 帳號密碼輸入成功，將errTimes清0
      await user.update({ errTimes: 0 })

      user = user.toJSON()
      // 透過jwt簽發token
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '5d' })
      // 刪除password資料
      delete user.password

      return res.json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = signController
