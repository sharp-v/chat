const Model = require('./model')
const { Op } = require('sequelize')
const { Sequelize } = require('../../models')

/**
 * 消息中的常量
 * 
 */
const STATE = {
  SERVER_REFUSED: -1,
  SERVER_RECEIVING: 0,
  TAKE_OVER: 2,
  REVOKE: 3
}

const SYS_NOTIY_SENDID = 0
const SYS_SENDID = -1

const SEND_TYPE = {
  STRANGER_MESSAGE: 0,
  FRIEND_MESSAGE: 1,
  GROUP_MESSAGE: 2,
  GROUP_ALL_MESSAGE: 3,
  SYSTEM_MESSAGE: 4,
  SYSTEM_NOTIFY_MESSAGE: 5
}

const TYPE = {
  NORMAL_MESSAGE: 0
}

/**
 * 根据用户id和消息状态查找用户消息
  */
async function queryMessageByUserId(userId, state) {
  try {
    let result = await Model.messageState.findAll({
      include: [{
        model: Model.Message,
        as: 'main',
        where: {
          id: Sequelize.col('messageState.messageId')
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt',]
        },
      }],
      // attributes: ['id', 'state', 'createdAt', 'updatedAt'],
      where: {
        [Op.and]: {
          userId, state,
        },
      },
      order: [
        ['createdAt', 'ASC']
      ],
      attributes: {
        exclude: ['MessageId',]
      }
    })
    return result.map(item => item.dataValues)
  } catch (err) {
    throw err
  }
}

async function queryById(id) {
  try {
    let result = await Model.Message.findOne({
      where: {
        id
      }
    })
    return result ? result.dataValues : null
  } catch (err) {
    throw err
  }
}

/**
 * 根据messageState.id找到messageState表中的记录,然后更新消息状态  */
async function setMessageState(id, state) {
  try {
    let userMessageState = await Model.messageState.findOne({
      where: {
        id
      }
    })
    userMessageState.update({
      state
    })
  } catch (err) {
    throw err
  }
}

/**
 * 创建新的消息
 * 
 */
async function addNewMessage(message) {
  try {
    const result = await Model.Message.create({
      sendId: message.sendId,
      receiveId: message.receiveId,
      sendType: message.sendType,
      content: message.content,
      type: message.type,
      url: message.url,
    })
    return result.dataValues
  } catch (err) {
    throw err
  }
}

/**
 * 为userId新增messagestate
 * @returns 
 */
async function addNewMessageState(userId, messageId, state = STATE.SERVER_RECEIVING) {
  try {
    const result = await Model.messageState.create({
      messageId,
      userId,
      state
    })
    return result.dataValues
  } catch (err) {
    throw err
  }
}

async function setMessageStateByMessageId(messageId, state) {
  try {
    let states = await Model.messageState.findAll({
      where: {
        messageId
      }
    })
    states.map(item => {
      item.update({
        state
      })
    })
    if (states) {
      states = states.map(item => item.dataValues)
    }
    return states
  } catch (err) {
    throw err
  }
}

module.exports = {
  STATE,
  SYS_NOTIY_SENDID,
  SYS_SENDID,
  SEND_TYPE,
  TYPE,
  queryById,
  queryMessageByUserId,
  setMessageState,
  addNewMessage,
  addNewMessageState,
  setMessageStateByMessageId,
}