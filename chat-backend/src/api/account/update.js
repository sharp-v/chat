const update = require('express').Router()

const { code } = require('../api-code')
const { RELATION, USER } = require('../sql')
const { verToken } = require('../common')

update.post('/', (req, res) => {
  try {
    verToken(req.headers['token'], req)
      .then(verifyResult => {
        if (verifyResult.success) {
          const user = verifyResult.user
          const data = req.body
          data.id = user.id
          USER.updateUser(data)
            .then(updateRes => {
              const update = code.account.update
              const sendCode = updateRes ? update.success : update.fail
              res.send({
                code: sendCode
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

module.exports = update