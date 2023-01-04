const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser } = require('../middleware/auth')
const signController = require('../controllers/signController')
const checkController = require('../controllers/checkController')
const userController = require('../controllers/userController')
const qrcodeController = require('../controllers/qrcodeController')
const checkRecordController = require('../controllers/checkRecordController')

// 登入路由
router.route('/signin').post(signController.signIn)

// 打卡路由
router.route('/checkin').all(authenticated, authenticatedUser).post(checkController.checkIn)

// qrcode相關路由
router.route('/qrcode/findcompanydata').post(qrcodeController.findCompanyData)
router.route('/qrcode/checkin').get(qrcodeController.qrcodeCheckIn)

// 修改密碼路由
router.route('/users/changePassword').all(authenticated, authenticatedUser).post(userController.changePassword)

// 打卡記錄表路由
router.route('/checkRecord/getCheckRecord').all(authenticated, authenticatedUser).get(checkRecordController.getCheckRecord)



router.use('/', errorHandler)

module.exports = router