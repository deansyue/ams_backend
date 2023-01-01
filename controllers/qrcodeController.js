const jwt = require('jsonwebtoken')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { User, Attendance, Calender } = require('../models')

const qrcodeController = {
  // 回傳要產生qrcode帳號的公司地理資料
  findCompanyData: async (req, res, next) => {
    try {
      const { userAccount } = req.body
      if (!userAccount) {
        return res.json({
          status: 'error',
          message: '必填欄位未輸入,請重新確認'
        })
      }

      let user = await User.findOne({ where: { account: userAccount }, include: 'Company' })
      if (!user) {
        return res.json({
          status: 'error',
          message: '無此帳號,請重新輸入'
        })
      }

      user = user.toJSON()
      return res.json({
        statsu: 'success',
        data: {
          company: {
            id: user.Company.id,
            latitude: user.Company.latitude,
            longitude: user.Company.longitude,
            area: user.Company.area
          }
        }
      })
    } catch (err) {
      next(err)
    }
  },

  // qrcode用打卡路由
  qrcodeCheckIn: async (req, res, next) => {
    //取得url夾帶的資料
    const account = req.query.account
    const date = req.query.date

    const gps = ''

    let user = await User.findOne({ where: { account }, include: 'Company' })

    // 查詢不到該使用者時
    if (!user) {
      return res.json({
        status: 'error',
        message: '帳號不存在,請重新確認'
      })
    }

    user = user.toJSON()
    const timeZone = user.Company.area || 'Asia/Taipei'
    const checkTime = moment().tz(timeZone)

    // qrcode只能用於產生當日, 判斷掃描日期與qrcode的日期是否同一天
    const isToday = bcrypt.compareSync(checkTime.format('YYYY/MM/DD'), date)
    if (!isToday) {
      return res.json({
        status: 'error',
        message: '掃描的二維條碼非當日產生,若要使用該功能,請重新產生二維條碼'
      })
    }

    // 打卡邏輯
    let checkDate = ''
    const checkHour = Number(checkTime.format('H'))
    // 當打卡時間為5點以前，打卡登入的日期為前一天
    // 打卡時間為 當天5:00 ~ 隔天4:59為一天
    if (checkHour < 5) {
      checkDate = checkTime.subtract(1, 'd').format('YYYY/MM/DD')
    } else {
      checkDate = checkTime.format('YYYY/MM/DD')
    }

    const attData = await Attendance.findOne({ where: { UserId: user.id, date: checkDate } })
    const todayCalFg = await Calender.findByPk(checkDate, { attributes: ['calFg'] })

    // 當查詢不到打卡資料時，視為上班>新增一筆資料
    if (!attData) {
      const workData = await Attendance.create({
        UserId: user.id,
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
      compareMinutes = (compareMinutes * 60) + Number(checkTime.format('mm'))
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
  }
}

module.exports = qrcodeController