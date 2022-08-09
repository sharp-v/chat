const express = require('express')
const router = express.Router()

// 与用户账户有关的所有信息的增删改查

router.use('/query', require('./query'))
router.use('/update', require('./update'))

module.exports = router