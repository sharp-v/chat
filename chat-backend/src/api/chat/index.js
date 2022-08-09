const Redis = require('ioredis')
const redis = new Redis()
const express = require('express')

const chat = express.Router()

const { USER_DATA_CACHE_TIME, USER_TYPE, GROUP_TYPE } = require('../../config')
const { code } = require('../api-code')

const { MESSAGE, USER, RELATION } = require('../sql')
const {
  WS_TYPE, verToken, setUserWsAlive,
  setUserWsDead, clearUser, saveState,
  setState, updateMessages, setMessageTimeOut
} = require('../common')
// 做一个定时器，超过指定时间,清除redis中的user
const timerMap = new Map()

chat.ws('/chat',
  (ws, req) => {
    try {
      ws.send(JSON.stringify({
        code: code.chat.open.openMessage,
        data: (new Date()).toLocaleString(),
      }))
      ws.on('error', (event) => {
        console.log('error in connect')
        console.log(event)
      })
      ws.on('message', (data) => {
        data = JSON.parse(data)
        console.log(data)
        verToken(data.token, req).then(verifyResult => {
          if (verifyResult.success) {
            const user = verifyResult.user
            // user.data = data
            switch (data.type) {
              case WS_TYPE.FIRST_CONNECT:
                fisrtConnect(user, ws)
                break
              case WS_TYPE.HEARTBEAT_MESSAGE:
                sendNewMessage(user, ws)
                // updateMessages(user)
                clearUserTimeOut(user)
                break
              case WS_TYPE.SEND_MESSAGE:
                data.data.sendId = user.id
                saveMessage(data.data, ws)
                break
              case WS_TYPE.CLOSE_CONNECT:
                clearUserData(user, ws)
                break
              case WS_TYPE.REVOKE_MESSAGE:
                revokeMessage(data.data, ws)
                updateMessages(user)
                break
              case WS_TYPE.RECEVICE_MESSAGE:
                receiveMessage(user.id, data.data)
                break
              default:
                ws.send(JSON.stringify({
                  code: code.chat.error.type
                }))
                return
            }
          } else {
            ws.send(JSON.stringify({
              code: verifyResult.code,
            }))
          }
        })
      })
    } catch (err) {
      console.log(err)
      ws.send(JSON.stringify({
        code: code.chat.error.catchErr
      }))
    }
  }
)
/**
 * 1. redis存储user alive， 
 * 2. 找到未接受的消息
 * */
function fisrtConnect(user, ws) {
  setUserWsAlive(user)
  firstSendMessage(user, ws)
}



/**
 *  发送unread message 
 * */
function firstSendMessage(user, ws) {
  MESSAGE.queryMessageByUserId(user.id, MESSAGE.STATE.SERVER_RECEIVING)
    .then(messages => {
      const messageString = JSON.stringify(messages)
      messages.length > 0 && console.log('send:', messages[0].state)
      ws.send(JSON.stringify({
        code: code.chat.open.sendMessage,
        data: messages,
      }))
      redis.set('msuid' + user.id, messageString)
        .then(res => {
          console.log(res)
        })
    })
}


function sendNewMessage(user, ws) {
  redis.get('msuid' + user.id)
    .then(messages => {
      messages = messages ? JSON.parse(messages) : []
      messages = messages.filter(item => item.state == MESSAGE.STATE.REVOKE || item.state == MESSAGE.STATE.SERVER_RECEIVING)
      ws.send(JSON.stringify({
        code: code.chat.message.heartBeat,
        data: messages,
      }))
    })
}

function receiveMessage(userId, messages) {
  if (messages.length > 0) {
    const messageSet = new Set(messages)
    redis.get('msuid' + userId)
      .then(redisMessages => {
        console.log('revice --------------------------------- receive')
        redisMessages = JSON.parse(redisMessages)
        let storeArr = []
        redisMessages.map(item => {
          if (messageSet.has(item.messageId)) {
            item.state = MESSAGE.STATE.TAKE_OVER
          }
          if (Date.now() - Date.parse(item.createdAt) > USER_DATA_CACHE_TIME) {
            MESSAGE.setMessageState(item.id, item.state)
          } else {
            storeArr.push(item)
            console.log('push', 'id', item.id, 'state', item.state, 'messageId', item.messageId, 'main.id', item.main.id)
          }
        })
        redis.set('msuid' + userId, JSON.stringify(storeArr))
      })
  }
}



/**
 *  重置清除redis中user的定时器 */
function clearUserTimeOut(user) {
  // updateMessages(user)
  // 1.clearTimeout(timerMap.get(user.id))
  if (timerMap.get(user.id)) {
    clearTimeout(timerMap.get(user.id))
  }
  // 2.timerMap.set(user.id,setTimerout())
  timerMap.set(user.id, setTimeout(() => {
    const id = user.id
    setUserWsDead({ id: id })
  }, USER_DATA_CACHE_TIME))
}


function saveMessage(message, ws) {
  MESSAGE.addNewMessage(message)
    .then(message => {
      // 0,1:用户消息,2:群组消息,3:系统消息
      switch (message.sendType) {
        case MESSAGE.SEND_TYPE.STRANGER_MESSAGE:
        case MESSAGE.SEND_TYPE.FRIEND_MESSAGE:
          setUserMessage(message, ws)
          break
        case MESSAGE.SEND_TYPE.GROUP_MESSAGE:
          setGroupMessage(message, ws)
          break
        case MESSAGE.SEND_TYPE.SYSTEM_MESSAGE:
          setSystemMessage(message, ws)
          break
        default:
          ws.send(JSON.stringify({
            code: code.chat.error.messageType
          }))
      }
    })
}

function clearUserData(user, ws) {
  clearUser(user.id)
    .then(flag => {
      if (flag) {
        ws.send(JSON.stringify({
          code: code.chat.close.success
        }))
      } else {
        ws.send(JSON.stringify({
          code: code.chat.error.closeErr
        }))
      }
    })
}

function revokeMessage(message, ws) {
  MESSAGE.queryById(message.id)
    .then(message => {
      message = message ? JSON.parse(message) : false
      // 1. 判断当前撤回时间和发送时间间隔，是否在keepDateTime内
      if (message && Date.now() - Date.parse(message.createdAt) < USER_DATA_CACHE_TIME) {
        // 找到该消息的所有接收者
        MESSAGE.setMessageStateByMessageId(message.id, MESSAGE.STATE.REVOKE)
          .then(states => {
            if (states) {
              states.map(item => {
                setState(item)
              })
            }
          })
        ws.send(JSON.stringify({
          data: {
            state: MESSAGE.STATE.REVOKE,
            id: message.id,
            key: {
              id: message.receiveId,
              type: message.sendType > MESSAGE.SEND_TYPE.FRIEND_MESSAGE
                ? RELATION.TYPE.GROUP : message.sendType
            }
          },
          code: code.chat.message.revoke.success
        }))
      } else {
        ws.send(JSON.stringify({
          data: {
            state: MESSAGE.STATE.TAKE_OVER,
            id: message.id,
            key: {
              id: message.receiveId,
              type: message.sendType > MESSAGE.SEND_TYPE.FRIEND_MESSAGE
                ? RELATION.TYPE.GROUP : message.sendType
            }
          },
          code: code.chat.message.revoke.fail
        }))
      }
    })
}

/**
 * 
 *  设置用户消息 */
function setUserMessage(message, ws) {
  // 找到消息的所有接收者与发送者的关系
  RELATION.queryUserRelation(message.receiveId, message.sendId, message.sendType)
    .then(relation => {
      MESSAGE.addNewMessageState(message.sendId, message.id)
      saveMessageAndState(message.receiveId, relation, message, ws)
    })
}
/**
 * 设置群组消息
  */
function setGroupMessage(message, ws) {
  RELATION.queryInGroupRelation(message.sendId, message.receiveId)
    .then(relation => {
      if (relation) {
        MESSAGE.addNewMessageState(message.sendId, message.id)
        RELATION.queryGroupRelation(message.receiveId)
          .then(relations => {
            relations = relations ? relations : []
            relations.map(item => {
              item.userId != message.sendId
                ? saveMessageAndState(item.userId, item, message)
                : null
            })
            ws.send(JSON.stringify({
              data: {
                state: MESSAGE.STATE.SERVER_RECEIVING, id: message.id,
                key: { id: message.receiveId, type: GROUP_TYPE }
              },
              code: code.chat.message.send.success.toGroup
            }))
          })
      } else {
        ws.send(JSON.stringify({
          code: code.chat.error.noPermission
        }))
      }
    })
}
/**
 * 设置系统消息
  */
function setSystemMessage(message, ws) {
  USER.queryUserById(message.sendId)
    .then(user => {
      if (user.type == 0) {
        USER.queryAllUser()
          .then(users => {
            users.map(user => {
              MESSAGE.addNewMessageState(user.id, message.id)
                .then(state => {
                  saveState(state, message)
                })
            })
            ws.send(JSON.stringify({
              data: {
                state: MESSAGE.STATE.SERVER_RECEIVING,
                id: message.id,
              },
              code: code.chat.message.send.success.toSystem,
            }))
          })
      } else {
        ws.send(JSON.stringify({
          code: code.chat.error.noPermission
        }))
      }
    })
}
/**
 * 保存消息
 */
function saveMessageAndState(userId, relation, message, ws) {
  // 0:及时提醒,1:接收不提醒,2:拒收
  switch (relation.reminderLevel) {
    case RELATION.REMINDER_LEVEL.RECEIVE_AND_NOTIFY:
    case RELATION.REMINDER_LEVEL.RECEIVE_AND_NOT_NOTIFY:
      setMessageTimeOut(message.id)
      MESSAGE.addNewMessageState(userId, message.id)
        .then(state => {
          saveState(state, message)
          ws && ws.send(JSON.stringify({
            data: {
              state: MESSAGE.STATE.SERVER_RECEIVING,
              id: message.id,
              key: {
                id: message.receiveId,
                type: USER_TYPE
              }
            },
            code: code.chat.message.send.success.toUser,
          }))
        })
      break
    case RELATION.REMINDER_LEVEL.REJECT:
      // 设置拒收消息
      MESSAGE.addNewMessageState(userId, message.id, MESSAGE.STATE.SERVER_RECEIVING)
      ws && ws.send(JSON.stringify({
        data: {
          state: MESSAGE.STATE.SERVER_RECEIVING,
          id: message.id,
          key: {
            id: message.receiveId,
            type: USER_TYPE
          }
        },
        code: code.chat.message.send.fail.toUser
      }))
      break
    default:
      ws && ws.send(JSON.stringify({
        code: code.chat.message.send.error.noReminderLevel
      }))
  }
}



module.exports = chat