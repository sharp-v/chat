const { code } = require('../api-code')
const { GROUP } = require('../sql')
const { verToken } = require('../common')

const groupId = require('express').Router()

groupId.get('/:groupId', (req, res) => {
  try {
    verToken(req.headers['token'], req)
      .then(verifyResult => {
        if (verifyResult.success) {
          const groupId = req.params.groupId
          GROUP.queryGroupById(groupId)
            .then(group => {
              res.send({
                data: group,
                code: code.relation.query.all.success
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

module.exports = groupId