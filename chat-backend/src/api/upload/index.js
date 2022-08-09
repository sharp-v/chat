const express = require('express')

const router = express.Router()
router.use('/avatar', require('./avatar'))
router.use('/back-image', require('./back-image'))

module.exports = router