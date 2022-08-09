const { code } = require("../api-code")

function body_data_check_middleware(req, res, next) {
  let user = req.body
  console.log(req.body)
  if (user == {} || user.account == null || user.password == null) {
    res.status(401).send({
      code: code.system.login.failAsLcData,
    })
  } else {
    user.id && (delete user.id)
    next()
  }
}

module.exports = {
  body_data_check_middleware
}