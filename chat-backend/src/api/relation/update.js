const express = require('express');
const Redis = require('ioredis');
const redis = new Redis();

const { MESSAGE, RELATION, USER, GROUP } = require('../sql');

const { relation_check_middleware } = require('./common');
const { verToken, addSystemNotifyMessage } = require('../common');
const { code } = require('../api-code');

const update = express.Router();
update.post('/', (req, res) => {
    try {
        verToken(req.headers['token'], req).then((verifyResult) => {
            if (verifyResult.success) {
                const relation = req.body;
                delete relation.createdAt;
                delete relation.updatedAt;
                delete relation.contactId;
                delete relation.userId;
                RELATION.updateRelation(relation).then((updateRes) => {
                    const sendCode = updateRes
                        ? code.relation.update.success
                        : code.relation.update.fail;
                    res.send({
                        code: sendCode,
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

module.exports = update;
