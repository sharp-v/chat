const express = require('express')
const router = express.Router()

router.use('/add', require('./add'))
router.use('/confirm-add', require('./confirm-add'))
router.use('/update', require('./update'))

module.exports = router