const { code } = require('../api-code');
const { RELATION, USER } = require('../sql');
const { verToken } = require('../common');

const all = require('express').Router();

all.post('/', (req, res) => {
    try {
        verToken(req.headers['token'], req).then((verifyResult) => {
            if (verifyResult.success) {
                const user = verifyResult.user;
                RELATION.queryUserAllRelation(user.id).then((relations) => {
                    res.send({
                        code: code.relation.query.all.success,
                        data: relations,
                    });
                });
            } else {
                res.status(401).send({
                    code: verifyResult.code,
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            code: -999,
        });
        throw err;
    }
});

module.exports = all;
