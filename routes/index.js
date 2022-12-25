const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser } = require('../middleware/auth')
const signController = require('../controllers/signController')
const checkController = require('../controllers/checkController')
const userController = require('../controllers/userController')

// 登入路由
router.route('/signin').post(signController.signIn)

// 打卡路由
router.route('/checkin/:attMode').all(authenticated, authenticatedUser).post(checkController.checkIn)

// 修改密碼路由
router.route('/users/changePassword').all(authenticated, authenticatedUser).post(userController.changePassword)

router.use('/', errorHandler)

module.exports = router