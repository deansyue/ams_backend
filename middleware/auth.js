const passport = require('../config/passport')
const authHelper = require('../helpers/auth-helper')

// 使用passport jwt格式驗証方法，驗証傳入的token是否有登入
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    // 錯誤或user沒資料，回傳錯誤訊息
    if (err || !user) return res.status(401).json({ status: 'error', message: '帳號不存在!' })

    req.user = user
    next()
  })(req, res, next)
}

// 驗証是否是user
const authenticatedUser = (req, res, next) => {
  const currentUser = authHelper.getUser(req)

  // 若有currentUser且 該user.role=1， 進行下一步驟
  if (currentUser && currentUser.role === 1) return next()

  // 若為否，回傳狀態碼403，且回傳錯誤json資料
  return res.status(403).json({ status: 'error', message: '帳號不存在' })
}

const authenticatedAdmin = (req, res, next) => {
  const currentUser = authHelper.getUser(req)

  // 若有currentUser且 該user.role=0， 進行下一步驟
  if (currentUser && currentUser.role === 0) return next()

  // 若為否，回傳狀態碼403，且回傳錯誤json資料
  return res.status(403).json({ status: 'error', message: '帳號不存在' })
}

module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}