const Model = require('./model')
const { Op } = require('sequelize')

async function queryGroupOwn(groupId) {
  try {
    let result = await Model.Group.findOne({
      where: {
        id: groupId
      }
    })
    result = result ? result.dataValues : null
  } catch (err) {
    throw err
  }
}

async function queryGroupById(groupId) {
  try {
    let result = await Model.Group.findOne({
      where: {
        id: groupId
      }
    })
    return result ? result.dataValues : null
  } catch (err) {
    throw err
  }
}

async function queryGroupByKeyWord(keyWord) {
  try {
    let result = await Model.Group.findAll({
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
    return result ? result.map(item => item.dataValues) : []
  } catch (err) {
    throw err
  }
}

module.exports = {
  queryGroupOwn,
  queryGroupById,
  queryGroupByKeyWord,
}