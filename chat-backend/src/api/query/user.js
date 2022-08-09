const { code } = require('../api-code')
const { USER } = require('../sql')
const { verToken } = require('../common')

const user = require('express').Router()

user.post('/', (req, res) => {
  try {
    verToken(req.headers['token'], req)
      .then(verifyResult => {
        if (verifyResult.success) {
          const id = req.body.id
          USER.queryUserById(id)
            .then(user => {
              res.send({
                code: code.relation.query.user.success,
                data: user
              })
            })
        } else {
          res.status(401).send({
            code: verifyResult.code,
          })
        }
      })
  } catch (err) {
    throw err
  }
})

module.exports = user