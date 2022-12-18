// 非正式上線模式,讀取.env變數
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const methodOverride = require('method-override')
const cors = require('cors')
const passport = require('./config/passport')
const router = require('./routes')

const app = express()
const PORT = process.env.PORT

app.use(passport.initialize())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())

app.use('/api', router)

app.listen(PORT, () => console.log(`app listening on port:${PORT}`))

module.exports = app
