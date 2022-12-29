const moment = require('moment')
const { Attendance, Company, Calender } = require('../models')
const helpers = require('../helpers/auth-helper')

const checkController = {
  checkIn: async (req, res, next) => {
    try {
      let { checkTime }  = req.body 
      const gps = checkTime.gps || ''
      checkTime = checkTime.checkTime // 前端回傳毫秒數
      const userData = helpers.getUser(req)
      const userCompany = await Company.findByPk(userData.CompanyId)
      const userId = userData.id 
      const timeZone = userCompany.area || 'Asia/Taipei'

      // 將前端傳回的字串，轉為moment格式進行計算
      checkTime = moment.tz(checkTime, timeZone)
      const checkHour = Number(checkTime.format('H'))
      let checkDate = moment.tz(checkTime, timeZone)

      // 當打卡時間為5點以前，打卡登入的日期為前一天
      // 打卡時間為 當天5:00 ~ 隔天4:59為一天
      if (checkHour < 5) {
        checkDate = checkDate.subtract(1, 'd').format('YYYY/MM/DD')
      } else {
        checkDate = checkDate.format('YYYY/MM/DD')
      }

      const attData = await Attendance.findOne({ where: { UserId: userId, date: checkDate } })
      const todayCalFg = await Calender.findByPk(checkDate, { attributes: ['calFg'] })

      // 當查詢不到打卡資料時，視為上班>新增一筆資料
      if (!attData) {
        const workData = await Attendance.create({
          UserId: userId,
          date: checkDate,
          workTime: checkTime,
          workGps: gps,
          attFg: todayCalFg.dataValues.calFg === 2 ? 2 : 1 // 打卡日期為非工作日(calFg=2)時，attFg = 2(加班)，否則為1(缺勤)
        })

        return res.json({
          status: "success",
          message: '上班打卡成功',
          date: {
            attData: workData
          }
        })

        // 有打卡資料時，視為下班>判斷工作時數是否達到8小時，並更新下班時間及出缺勤fg
      } else {
        const workTime = moment.tz(attData.workTime, timeZone)

        //判斷與上班日期相比，若下班打卡日期為隔天，下班打卡時數要加24小時
        // 將上班時間與下班時間 換算成分鐘
        let compareMinutes = workTime.format('YYYYMMDD') === checkTime.format('YYYYMMDD') ? checkHour : checkHour + 24
        compareMinutes = (compareMinutes*60) + Number(checkTime.format('mm'))
        const workMinutes = (Number(workTime.format('H')) * 60) + Number(workTime.format('mm'))

        // 打卡日期為非工作日(calFg=2)時，attFg = 2(加班)
        // 打卡日期為工作日(calFg=0)，判斷下班時間-上班間 >= 480分，出缺勤fg=1(缺勤), 否則為0(正常)
        const attFg = todayCalFg.dataValues.calFg === 2 ? 2 : (compareMinutes - workMinutes) >= (8 * 60) ? 0 : 1

        await attData.update({ offTime: checkTime, offGps: gps, attFg })

        return res.json({
          status: "success",
          message: '下班打卡成功',
          date: {
            attData
          }
        })
      }
    } catch (err) {
      next(err)
    }

  }
}

module.exports = checkController