const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser } = require('../middleware/auth')
const signController = require('../controllers/signController')
const checkController = require('../controllers/checkController')

// 登入路由
router.route('/signin').post(signController.signIn)

// 打卡路由
router.route('/checkin/:attMode').all(authenticated, authenticatedUser).post(checkController.checkIn)

router.use('/', errorHandler)

module.exports = router