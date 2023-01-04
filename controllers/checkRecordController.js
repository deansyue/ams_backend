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

      let checkData = await Calender.findAll({
        where: { date: { [Op.between]: [startDate, endDate] } }, include: { model: Attendance, where: { UserId: userId }, required: false }, raw: true, nest: true
      })

      // 資料數值格式化
      checkData.map(data => {
        // 行事曆工作日fg格式化
        if (data.calFg === 0) {
          data.calFg = "工作日";
        } else if (data.calFg === 2) {
          data.calFg = "非工作日";
        } else {
          data.calFg = "其他";
        }

        // 上/下班打卡時間format
        if (data.Attendances.workTime === null) {
          data.Attendances.workTime = ''
        } else {
          data.Attendances.workTime = moment(
            data.Attendances.workTime
          )
            .tz(timeZone)
            .format("YYYY/MM/DD h:mm a");
        }

        if (data.Attendances.offTime === null) {
          data.Attendances.offTime = ''
        } else {
          data.Attendances.offTime = moment(
            data.Attendances.offTime
          )
            .tz(timeZone)
            .format("YYYY/MM/DD h:mm a");
        }

        // 出缺勤格式化
        if (data.Attendances.attFg === 0) {
          data.Attendances.attFg = "正常";
        } else if (data.Attendances.attFg === 1) {
          data.Attendances.attFg = "缺勤";
        } else if (data.Attendances.attFg === 2) {
          data.Attendances.attFg = "加班";
        } else {
          data.Attendances.attFg = data.calFg === '工作日' ? "缺勤" : ''
        }
      })

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