const express = require("express");

const { USER } = require("../sql");
const { code } = require("../api-code");
const { genToken } = require("../common");
const { body_data_check_middleware } = require("./common");

const login = express.Router();
login.post("/", body_data_check_middleware, (req, res) => {
  USER.queryUserSecurityByAccount(req.body)
    .then((user) => {
      if (user) {
        genToken(user, req).then((token) => {
          if (token) {
            res.send({
              code: code.system.login.success,
              data: token,
            });
          } else {
            res.send({
              code: code.system.login.success,
            });
          }
        });
      } else {
        res.status(401).send({
          code: code.system.login.fail,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        code: code.system.login.error,
      });
    });
});

module.exports = login;
