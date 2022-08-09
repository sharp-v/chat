const query = require('express').Router()

const { code } = require('../api-code')
const { RELATION, USER } = require('../sql')
const { verToken } = require('../common')

query.post('/', (req, res) => {
  try {
    verToken(req.headers['token'], req)
      .then(verifyResult => {
        if (verifyResult.success) {
          const user = verifyResult.user
          USER.queryUserById(user.id)
            .then(user => {
              const query = code.account.query
              const sendCode = user ? query.success : query.fail
              res.send({
                code: sendCode,
                data: user
              })
            })
        } else {
          res.status(401).send({
            code: verifyResult.code
          })
        }
      })
  } catch (err) {
    throw err
  }
})

module.exports = query