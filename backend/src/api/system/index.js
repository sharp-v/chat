/**
 * system文件下面暴露那些不需要token认证的api
 */

const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/register', require('./register'));

module.exports = router;
