const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middleware/error-handler')
const signController = require('../controllers/signController')

// 登入路由
router.route('/signin').post(signController.signIn)

router.use('/', errorHandler)

module.exports = router