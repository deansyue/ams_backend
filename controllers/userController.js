const { User } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../helpers/auth-helper')

const userController = {
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body
      const userId = helpers.getUser(req).id

      // 確認欄位沒有空白
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.json({
          status: 'error',
          message: '欄位不可空白'
        })
      }

      // 確認新密碼與密碼確認是否一致
      if (newPassword !== confirmPassword) {
        return res.json({
          status: 'error',
          message: '新密碼與密碼確認不一致，請重新輸入'
        })
      }

      const user = await User.findByPk(userId)

      // 確認是否有該使用者
      if (!user) {
        return res.json({
          status: 'error',
          message: '無此使用者,請重新輸入'
        })
      }

      const pasIsCorrect = await bcrypt.compare(oldPassword, user.password)

      // 確認舊密碼是否輸入正確
      if (!pasIsCorrect) {
        return res.json({
          status: 'error',
          message: '舊密碼輸入錯誤,請重新確認'
        })
      }

      await user.update({ password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)) })

      return res.json({
        status: 'success',
        message: '密碼變更成功,請重新登入'
      })
    } catch (err) {
      next(err)
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      let user = await User.findByPk(userId, { include: 'Company' })

      if (!user) {
        return res.json({
          status: 'error',
          message: '找不到使用者!'
        })
      }

      user = user.toJSON()
      delete user.password

      return res.json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController