const confirmAdd = require('express').Router()
const { relation_check_middleware } = require('./common')
const { code } = require('../api-code')
const { RELATION, GROUP, USER } = require('../sql')
const { verToken, addSystemNotifyMessage } = require('../common')

confirmAdd.post('/confirm-add',
  relation_check_middleware,
  relation_id_check_middleware,
  (req, res) => {
    try {
      verToken(req.headers['token'], req)
        .then(verfiyResult => {
          if (verfiyResult.success) {
            const user = verfiyResult.user
            let relation = req.body
            switch (relation.type) {
              case RELATION.TYPE.STRANGER:
              case RELATION.TYPE.FRIEND:
                relation.userId = user.id
                agreeBeUserFriend(relation, res)
                break
              case RELATION.TYPE.GROUP:
                agreeBeGroupMember(relation, res)
                break
              default:
                res.status(401).send({
                  code: code.relation.confirmAdd.error.param
                })
            }
          } else {
            res.status(401).send({
              code: verfiyResult.code
            })
          }
        })
    } catch (err) {
      res.status(500).send({
        code: code.relation.confirmAdd.error.serverErr
      })
    }
  })

function agreeBeUserFriend(relation, res) {
  RELATION.updateRelation(relation)
    .then(newRelation => {
      if (newRelation) {
        addSystemNotifyMessage(newRelation.contactId, newRelation, code.system.notify.newFriendNotify)
        addSystemNotifyMessage(newRelation.userId, newRelation, code.system.notify.newFriendNotify)
        res.send({
          code: code.relation.confirmAdd.success.agreeFriend
        })
      } else {
        res.send({
          code: code.relation.confirmAdd.fail.friend
        })
      }
    })
}

function agreeBeGroupMember(relation, res) {
  GROUP.queryGroupOwn(relation.contactId)
    .then(group => {
      if (group.ownId == user.id) {
        RELATION.queryGroupRelation(user.id, group.id)
          .then(relations => {
            relations = relations ? relations : []
            relations.map(item => {
              addSystemNotifyMessage(item.userId, relation, 
                code.system.notify.newGroupMeberNotify)
            })
            res.send({
              code: code.relation.confirmAdd.success.agreeGroup
            })
          })
      } else {
        res.status(403).send({
          code: code.relation.confirmAdd.error.noPermission
        })
      }
    })
}

function relation_id_check_middleware(req, res, next) {
  let relation = req.body
  if (relation.id) {
    next()
  } else {
    res.status(401).send({
      code: code.relation.base.noData
    })
  }
}
module.exports = confirmAdd