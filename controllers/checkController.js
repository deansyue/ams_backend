const { Attendance } = require('../models')
const helpers = require('../helpers/auth-helper')

const checkController = {
  checkIn: async (req, res, next) => {
    try {
      const attMode = Number(req.params.attMode)
      let { checkTime } = req.body
      const userId = helpers.getUser(req).id
      // 將前端傳來的毫秒時間轉換為日期格式
      checkTime = new Date(Number(checkTime))
      const checkHour = checkTime.getHours()
      let checkDate = new Date(checkTime)

      // 當打卡時間為5點以前，打卡登入的日期為前一天
      // 打卡時間為 當天5:00 ~ 隔天4:59為一天
      if (checkHour < 5) {
        checkDate = checkDate.setDate(checkDate.getDate() - 1)
        checkDate = new Date(checkDate)
        checkDate = checkDate.toLocaleDateString()
      } else {
        checkDate = checkDate.toLocaleDateString()
      }

      const attData = await Attendance.findOne({ where: { UserId: userId, date: checkDate } })

      // 當查詢不到打卡資料時，視為上班>新增一筆資料
      if (!attData) {
        const workData = await Attendance.create({
          UserId: userId,
          date: checkDate,
          workTime: checkTime,
          attMode,
          attFg: 1
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
        //判斷與上班日期相比，若下班打卡日期為隔天，下班打卡時數要加24小時
        const compareHour = attData.workTime.toLocaleDateString() === checkTime.toLocaleDateString() ? checkHour : checkHour + 24
        // 下班小時-上班小時 > 8小時，出缺勤fg=1, 否則為0
        const attFg = (compareHour - attData.workTime.getHours()) >= 8 ? 0 : 1

        await attData.update({ offTime: checkTime, attFg })

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