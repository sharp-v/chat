const express = require('express');
const { code } = require('../api-code');
const { verToken } = require('../common');
const { QUERY } = require('../sql');
const keyWord = express.Router();

keyWord.post('/', (req, res) => {
    try {
        verToken(req.headers['token'], req).then((verifyResult) => {
            if (verifyResult.success) {
                const keyWord = req.body.keyWord;
                QUERY.queryByKeyWord(keyWord).then((data) => {
                    res.send({
                        code: code.default.success,
                        data: data,
                    });
                });
            } else {
                res.status(401).send({
                    code: verifyResult.code,
                });
            }
        });
    } catch (err) {
        throw err;
    }
});

module.exports = keyWord;
