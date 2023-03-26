const express = require('express');
const Redis = require('ioredis');
const redis = new Redis();

const { MESSAGE, RELATION, USER, GROUP } = require('../sql');

const { relation_check_middleware } = require('./common');
const { verToken, addSystemNotifyMessage } = require('../common');
const { code } = require('../api-code');

const add = express.Router();
add.post('/', relation_check_middleware, (req, res) => {
    verToken(req.headers['token'], req).then((verifyResult) => {
        if (verifyResult.success) {
            const user = verifyResult.user;
            let relation = req.body;
            relation.userId = user.id;
            switch (relation.type) {
                case RELATION.TYPE.STRANGER:
                case RELATION.TYPE.FRIEND:
                    addUserRelation(relation, res);
                    break;
                case RELATION.TYPE.GROUP:
                    addGroupRelation(relation, res);
                    break;
                default:
                    res.status(401).send({
                        code: code.relation.add.error.param,
                    });
            }
        } else {
            res.status(401).send({
                code: verifyResult.code,
            });
        }
    });
});

function addUserRelation(relation, res) {
    // 验证contactId的配置，如果contactId允许添加才能添加
    RELATION.addNewUserRelation(relation).then((relation) => {
        if (relation) {
            switch (relation[0].type + '' + relation[1].type) {
                case RELATION.TYPE.FRIEND + '' + RELATION.TYPE.STRANGER:
                case RELATION.TYPE.STRANGER + '' + RELATION.TYPE.STRANGER:
                    addRelationByReminderLevel(relation[1], res);
                    break;
                case RELATION.TYPE.STRANGER + '' + RELATION.TYPE.FRIEND:
                    relation[0].type = RELATION.TYPE.FRIEND;
                    RELATION.updateRelation(relation[0]).then((newRelation) => {
                        res.send({
                            code: code.relation.add.success.friend,
                            data: newRelation,
                        });
                    });
                    break;
                case RELATION.TYPE.FRIEND + '' + RELATION.TYPE.FRIEND:
                    res.send({
                        code: code.relation.add.fail.already,
                    });
                    break;
                default:
                    res.state(500).send({
                        code: code.relation.add.error.param,
                    });
            }
        } else {
            res.state(500).send({
                code: code.relation.add.error.serverErr,
            });
        }
    });
}

function addRelationByReminderLevel(relation, res) {
    switch (relation.reminderLevel) {
        case RELATION.REMINDER_LEVEL.RECEIVE_AND_NOTIFY:
        case RELATION.REMINDER_LEVEL.RECEIVE_AND_NOT_NOTIFY:
            addSystemNotifyMessage(
                relation.contactId,
                relation,
                code.system.notify.newFriend,
            ).then((flag) => {
                let resCode = code.relation.add.success.friend;
                resCode = flag ? resCode : code.relation.add.error.serverErr;
                res.send({
                    code: resCode,
                });
            });
            break;
        case RELATION.REMINDER_LEVEL.REJECT:
            res.send({
                code: code.relation.add.fail.undone,
            });
            break;
        default:
            res.state(500).send({
                code: code.relation.add.error.serverErr,
            });
    }
}

function addGroupRelation(relation, res) {
    GROUP.queryGroupOwn(relation.contactId).then((group) => {
        addSystemNotifyMessage(
            group.ownId,
            relation,
            code.system.notify.newGroupMember,
        ).then((flag) => {
            let resCode = code.relation.add.success.group;
            resCode = flag ? resCode : code.relation.add.fail.undoneGroup;
            res.send({
                code: resCode,
            });
        });
    });
}

module.exports = add;
