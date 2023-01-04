const { Calender, Attendance } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')
const helpers = require('../helpers/auth-helper')

const checkRecordController = {
  getCheckRecord: async (req, res, next) => {
    try {
      let { startDate, endDate, timeZone } = req.query
      startDate = moment(Number(startDate)).tz(timeZone).format('YYYY/MM/DD')
      endDate = moment(Number(endDate)).tz(timeZone).format('YYYY/MM/DD')
      const userId = helpers.getUser(req).id

      const checkData = await Calender.findAll({ where: { date: { [Op.between]: [startDate, endDate] } }, include: { model: Attendance, where: { UserId: userId } } })

      return res.json({
        status: 'success',
        data: {
          checkData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = checkRecordController