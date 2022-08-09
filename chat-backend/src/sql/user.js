const Model = require('./model')
const { Op } = require('sequelize')
const { Sequelize } = require('../../models')

const ACCOUNT = {
  SHOW: 0,
  HIDE: 1,
  DEFAULT: 0,
}

const PHONE = {
  SHOW: 0,
  HIDE: 1,
  DEFAULT: 0,
}

const RELATION = {
  ADD_FRIEND: 0,
  NOT_ADD_FRIEND: 1,
  DEFAULT: 0
}

const DYNAMIC = {
  EVERYONE_CAN_ACCESS: 0,
  JUST_FRIEND_CAN_ACCESS: 1,
  JUST_MYSELF: 2,
  DEFAULT: 0
}


async function queryUserByUserAccount(user) {
  try {
    const result = await Model.User.findOne({
      where: {
        account: user.account
      }
    })
    return result ? result.dataValues : null
  } catch (err) {
    console.log(err)
  }
}

async function queryUserSecurityByAccount(user, securityAttrs, userAttrs) {
  try {
    securityAttrs = securityAttrs ? securityAttrs : []
    userAttrs = userAttrs ? userAttrs : ['id', 'account', 'nickName']
    let result = await Model.User.findOne({
      include: [{
        model: Model.userSecurity,
        where: {
          id: Sequelize.col('User.id'),
          password: user.password
        },
        attributes: securityAttrs
      }],
      where: {
        account: user.account
      },
      attributes: userAttrs
    })
    return result ? result.dataValues : null
  } catch (err) {
    throw err
  }
}

async function queryUserPrivacy(userId) {
  try {
    let result = await Model.userPrivacy.findOne({
      where: {
        id: userId
      }
    })
    return result ? result.dataValues : null
  } catch (err) {
    throw err
  }
}

async function queryAllUser() {
  try {
    let result = await Model.User.findAll()
    result = result.map(item => item.dataValues)
    return result
  } catch (err) {
    throw err
  }
}

/**
 * 新增用户需要注意：
 * User,userSecurity,userPrivacy表同时新增一同id字段
  */
async function addNewUser(user) {
  try {
    let newuser = await Model.User.create(user)
    await Model.userSecurity.create({
      id: newuser.dataValues.id,
      password: user.password
    })
    await Model.userPrivacy.create({
      id: newuser.dataValues.id,
    })
    return newuser ? newuser.dataValues : null
  } catch (err) {
    throw err
  }
}

async function queryUserById(id) {
  try {
    let result = await Model.User.findOne({
      where: {
        id
      },
    })
    return result ? result.dataValues : null
  } catch (err) {
    throw err
  }
}

async function updateUser(user) {
  try {
    delete user.type
    delete user.createdAt
    delete user.updatedAt
    delete user.account
    let result = await Model.User.update(user, {
      where: {
        id: user.id
      }
    })
    return result[0]
  } catch (err) {
    throw err
  }
}
async function queryUserByKeyWord(keyWord) {
  try {
    let result = await Model.User.findAll({
      where: {
        [Op.or]: [
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
    return result
  } catch (err) {
    throw err
  }
}

module.exports = {
  ACCOUNT,
  PHONE,
  RELATION,
  DYNAMIC,
  queryUserById,
  queryUserByUserAccount,
  queryAllUser,
  queryUserSecurityByAccount,
  addNewUser,
  queryUserPrivacy,
  updateUser,
}