const Model = require('./model')
const { Op } = require('sequelize')
const { Sequelize } = require('../../models')

//纯粹的查询业务
async function queryByKeyWord(keyWord) {
  try {
    keyWord = '%' + keyWord + '%'
    let groups = await Model.Group.findAll({
      where: {
        [Op.or]: [
          {
            id: {
              [Op.like]: keyWord
            }
          }, {
            name: {
              [Op.like]: keyWord
            }
          }
        ]
      }
    })
    let users = await Model.User.findAll({
      where: {
        [Op.or]: [
          {
            id: {
              [Op.like]: keyWord
            }
          },
          {
            account: {
              [Op.like]: keyWord
            }
          }, {
            nickName: {
              [Op.like]: keyWord
            }
          }
        ]
      }
    })
    groups = groups ? groups.map(item => item.dataValues) : []
    users = users ? users.map(item => item.dataValues) : []
    return { groups, users }
  } catch (err) {
    throw err
  }
}

module.exports = {
  queryByKeyWord
}