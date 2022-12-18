const passport = require('passport')
const passportJWT = require('passport-jwt')
const { Company, User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// token的 bearer 資訊，與所設定的金鑰
const JWTOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'test'
}

// 設定jwt的登入策略
passport.use(new JWTStrategy(JWTOptions, async (jwtPayload, cb) => {
  // 使用payload的id資料尋找user資料，並關連其他model
  try {
  const user = await User.findByPk(jwtPayload.id, { include: Company })
  cb(null, user)
  } catch (err) {
    cb(err)
  }
}))

module.exports = passport