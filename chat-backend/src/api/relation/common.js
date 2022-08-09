const { code } = require('../api-code')
// const { RELATION, GROUP, USER } = require('../sql')

function relation_check_middleware(req, res, next) {
  let relation = req.body
  if (!relation || !relation.type || !relation.contactId) {
    res.status(401).send({
      code: code.relation.base.noData
    })
  } else {
    next()
  }
}

module.exports = {
  relation_check_middleware
}