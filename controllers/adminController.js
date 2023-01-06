const { Company } = require('../models')
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
    

  }
}

module.exports = adminController