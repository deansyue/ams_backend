const { Company, User } = require('../models')
const { Op } = require('sequelize')
const helper = require('../helpers/auth-helper')

const adminController = {
  editCompany: async (req, res, next) => {
    try {
      const { name, useGps, area } = req.body
      // 判斷欄位輸入的正確性
      if (!name || !area || (useGps !== 'true' && useGps !== 'false')) {
        return res.json({
          status: 'error',
          message: '有欄位填寫錯誤,請重新填寫!'
        })
      }

      const companyId = helper.getUser(req).Company.id
      let companyData = await Company.findByPk(companyId)
      if (!companyData) {
        return res.json({
          status: 'error',
          message: '公司不存在,請重新確認!'
        })
      }

      // 更新公司資料
      await companyData.update({ name, useGps, area })

      return res.json({
        status: 'success',
        message: '公司資料更新成功!'
      })
    } catch(err) {
      next(err)
    }
  },

  getLockedUser: async (req, res, next) => {
    try {
      // 查詢所有公司lock為true的員工
      const lockedUser = await User.findAll({ where: { lock: true }, attributes: ['id', 'name', 'account', 'lock'], include: { model: Company, attributes: ['name'] }, raw: true, nest: true })

      return res.json({
        status: 'success',
        data: {
          lockedUser
        }
      })
    } catch(err) {
      next(err)
    }
  },

  putUserLocked: async (req, res, next) => {
    try {
      const { unlockedUsersId } = req.body // 傳入陣列欄位

      // 查詢傳入陣列的id的user
      let usersData = await User.findAll({ where: { id: { [Op.in]: unlockedUsersId } }, attributes: ['id', 'name', 'lock', 'errTimes'] })

      // 若傳入的id沒有查到任何資料,視為已更新完成
      if (usersData.length < 1) {
        return res.json({
          status: 'success',
          message: '選擇的員工上鎖狀態已更新!!'
        })
      }

      // 將查詢出的員工,lock=false, 且errTimes=0
      for (let i = 0; i < usersData.length; i++) {
        await usersData[i].update({ lock: false, errTimes: 0 })
      }

      return res.json({
        status: 'success',
        message: '選擇的員工上鎖狀態已更新!!'
      })
    } catch(err) {
      next(err)
    }
    
  }
}

module.exports = adminController