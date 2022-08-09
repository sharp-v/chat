const Model = require('./model')
const { Op } = require('sequelize')

const TYPE = {
  STRANGER: 0,
  FRIEND: 1,
  GROUP: 2
}
const REMINDER_LEVEL = {
  RECEIVE_AND_NOTIFY: 0,
  RECEIVE_AND_NOT_NOTIFY: 1,
  REJECT: 2
}

/**
 * 查询用户与用户contactId的关系，
 * 若没有关系则新增关系，
  */
async function queryUserRelation(userId, contactId) {
  try {
    let result = await Model.Relation.findOne({
      where: {
        [Op.and]: {
          userId, contactId,
          [Op.or]:
            [
              { type: TYPE.FRIEND },
              { type: TYPE.STRANGER }
            ]
        }
      }
    })
    if (!result) {
      // 新增陌生关系
      result = await Model.Relation.create({
        userId, contactId,
        type: TYPE.STRANGER,
        reminderLevel: REMINDER_LEVEL.RECEIVE_AND_NOTIFY
      })
    }
    return result ? result.dataValues : null
  } catch (err) {
    throw err
  }
}

async function queryUserAllRelation(userId) {
  try {
    let result = await Model.Relation.findAll({
      where: {
        userId
      },
      order: [
        ['remark', 'ASC']
      ]
    })
    if (result) {
      result = result.map(item => item.dataValues)
    }
    return result
  } catch (err) {
    throw err
  }
}
async function queryInGroupRelation(userId, contactId) {
  try {
    let result = await Model.Relation.findOne({
      where: {
        [Op.and]: {
          userId, contactId, type: TYPE.GROUP
        }
      }
    })
    return result ? result.dataValues : null
  } catch (err) {
    throw err
  }
}

async function queryGroupRelation(contactId) {
  try {
    let result = await Model.Relation.findAll({
      where: {
        [Op.and]: {
          contactId, type: TYPE.GROUP,
          [Op.or]: [
            { reminderLevel: REMINDER_LEVEL.RECEIVE_AND_NOTIFY },
            { reminderLevel: REMINDER_LEVEL.RECEIVE_AND_NOT_NOTIFY }
          ]

        }
      }
    })
    if (result) {
      result = result.map(item => item.dataValues)
    }
    return result
  } catch (err) {
    throw err
  }
}

/**
 * 查找用户的所有关系,将type和contactId重复的关系删除
  */
async function queryAndUpdateUserRelation(userId) {
  try {
    let relations = await Model.Relation.findAll({
      where: {
        userId
      }
    })
    const rMap = new Map()
    relations = relations.map(item => {
      const relation = item.dataValues
      // 群组关系
      if (relation.type == TYPE.GROUP) {
        const value = rMap.get('g' + relation.contactId)
        if (value) {
          item.destroy()
        }
        else {
          rMap.set('g' + relation.contactId, relation)
          return relation
        }
      } else {//用户关系
        const value = rMap.get('p' + relation.contactId)
        if (value) {
          item.destroy()
        }
        else {
          rMap.set('p' + relation.contactId, relation)
          return relation
        }
      }
    })
    return relations
  } catch (err) {
    throw err
  }
}

async function queryByUserId(userId, type) {
  try {
    let result = await Model.Relation.findAll({
      where: {
        [Op.and]: {
          userId, type
        }
      }
    })
    result = result.map(item => item.dataValues)
    return result

  } catch (err) {
    console.log(err)
    throw new Error('select relation err')
  }
}

async function addNewUserRelation(relation) {
  try {
    // 查询user和contactId的关系
    let result = await Model.Relation.findOne({
      where: {
        [Op.and]: {
          userId: relation.userId,
          contactId: relation.contactId,
          [Op.or]:
            [
              { type: TYPE.FRIEND },
              { type: TYPE.STRANGER }
            ]
        }
      }
    })
    if (!result) {
      relation.type = TYPE.STRANGER
      relation.reminderLevel = REMINDER_LEVEL.RECEIVE_AND_NOTIFY
      result = await Model.Relation.create(relation)
    }
    await queryUserRelation(relation.contactId, relation.userId)
      .then(result2 => {
        return (result && result2) ? [result.dataValues, result2] : null
      })
  } catch (err) {
    throw err
  }
}

async function verNewUserRelation(friRelation) {
  try {

  } catch (err) {
    throw err
  }
}

async function updateRelation(relation) {
  try {
    if (!relation.id) return null
    let result = await Model.Relation.update(relation, {
      where: {
        id: relation.id
      }
    })
    return result[0]
  } catch (err) {
    throw err
  }
}

module.exports = {
  TYPE,
  REMINDER_LEVEL,
  queryByUserId,
  queryUserRelation,
  queryUserAllRelation,
  queryInGroupRelation,
  queryGroupRelation,
  queryAndUpdateUserRelation,
  addNewUserRelation,
  updateRelation
}