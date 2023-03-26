const { code } = require('../api-code');
const { USER } = require('../sql');
const { verToken } = require('../common');

const account = require('express').Router();

account.get('/:account', (req, res) => {
    try {
        verToken(req.headers['token'], req).then((verifyResult) => {
            if (verifyResult.success) {
                USER.queryUserByUserAccount(req.params).then((user) => {
                    res.send({
                        code: code.relation.query.user.success,
                        data: user,
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

module.exports = account;
