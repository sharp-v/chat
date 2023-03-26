const express = require('express');
const router = express.Router();

router.use('/account', require('./account'));
router.use('/all', require('./all'));
router.use('/groupId', require('./group'));
router.use('/id', require('./user'));
router.use('/key-word', require('./key-word'));
module.exports = router;
