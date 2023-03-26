const express = require('express');

const { USER } = require('../sql');
const { code } = require('../api-code');
const { body_data_check_middleware } = require('./common');

const register = express.Router();
register.post(
    '/',
    body_data_check_middleware,
    register_check_middleware,
    (req, res) => {
        let user = req.body;
        USER.addNewUser(user)
            .then((user) => {
                if (user) {
                    res.send({
                        code: code.system.register.success,
                    });
                } else {
                    res.send({
                        code: code.system.register.fail,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send({
                    code: code.system.register.error,
                });
            });
    },
);

function register_check_middleware(req, res, next) {
    let user = req.body;
    user.nickName = user.nickName ? user.nickName : user.account;
    USER.queryUserByUserAccount(user).then((queryUser) => {
        if (queryUser) {
            res.status(401).send({
                code: code.system.register.failAsAcIsRe,
            });
        } else {
            next();
        }
    });
}

module.exports = register;
