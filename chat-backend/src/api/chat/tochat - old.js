const Redis = require('ioredis')
const redis = new Redis()
const express = require('express')
/**
 * @param  object data:{
 * data.token 
 * data.type :{SEND,CLOSE,REVOKE}
 * data.message data.type==SEND or data.type == REVOKE时有效
 * 若type==SEND 则message中必须带着message.id
 * }
 * @returns object
 * {
 *  success,// boolean
 *  message,// string
 *  data:{}//object
 *  code,// code
 * }
 */
const tochat = express.Router()


// const USER_DATA_CACHE_TIME = 1000
const { MESSAGE, RELATION, USER } = require('../sql')
const { USER_DATA_CACHE_TIME, WS_TYPE,
  verToken, saveState, clearUser, updateMessages, setMessageTimeOut, setState } = require('../common')
const { code } = require('../api-code-table')

tochat.ws('/tochat',
  (ws, req) => {
    try {
      ws.on('message', (data) => {
        data = JSON.parse(data)
        verToken(data.token, req).then(verifyResult => {
          if (verifyResult.success) {
            const user = verifyResult.user
            switch (data.type) {
              case WS_TYPE.SEND_MESSAGE:
                data.message.sendId = user.id
                saveMessage(data.message, ws)
                break
              case WS_TYPE.CLOSE_CONNECT:
                clearUserData(user, ws)
                break
              case WS_TYPE.REVOKE_MESSAGE:
                revokeMessage(data.message, ws)
                break
              default:
                ws.send(JSON.stringify({
                  code: code.chat.error.type.value
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
        code: code.chat.error.catchErr.value
      }))
    }
  })

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
            code: code.chat.error.messageType.value
          }))
      }
    })
}

function clearUserData(user, ws) {
  clearUser(user.id)
    .then(flag => {
      if (flag) {
        ws.send(JSON.stringify({
          code: code.chat.close.success.value
        }))
      } else {
        ws.send(JSON.stringify({
          code: code.chat.error.closeErr
        }))
      }
    })
}

function revokeMessage(message, ws) {
  redis.get('mid' + message.id)
    .then(message => {
      message = message ? JSON.parse(message) : false
      // message存在
      // 1. 判断当前撤回时间和发送时间间隔，是否在keepDateTime内
      if (message && Date.now() - Date.parse(message.createdAt) < USER_DATA_CACHE_TIME) {
        // 找到该消息的所有接收者
        MESSAGE.setMessageStateByMessageId(message.id, 3)
          .then(states => {
            if (states) {
              states.map(item => {
                setState(item)
              })
            }
          })
        ws.send(JSON.stringify({
          data: { state: MESSAGE.STATE.REVOKE, id: message.id },
          code: code.chat.message.revoke.success.value
        }))
      } else {
        ws.send(JSON.stringify({
          data: { state: MESSAGE.STATE.TAKE_OVER, id: message.id },
          code: code.chat.message.revoke.fail.value
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
        RELATION.queryGroupRelation(message.sendId, message.receiveId)
          .then(relations => {
            relations = relations ? relations : []
            relations.map(item => {
              item.userId != message.sendId ? saveMessageAndState(item.userId, item, message) : null
            })
            ws.send(JSON.stringify({
              data: { state: MESSAGE.STATE.SERVER_RECEIVING, id: message.id },
              code: code.chat.message.send.success.toGroup.value
            }))
          })
      } else {
        ws.send(JSON.stringify({
          code: code.chat.error.noPermission.value
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
        redis.set('mid' + message.id, JSON.stringify(message))
          .then(() => {
            // 定时清除
            setMessageTimeOut(message.id)
            USER.queryAllUser()
              .then(users => {
                console.log(message)
                users.map(user => {
                  MESSAGE.addNewMessageState(user.id, message.id)
                    .then(state => {
                      saveState(state)
                    })
                })
                ws.send(JSON.stringify({
                  data: { state: MESSAGE.STATE.SERVER_RECEIVING, id: message.id },
                  code: code.chat.message.send.success.toSystem.value,
                }))
              })
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
      redis.set('mid' + message.id, JSON.stringify(message))
        .then(() => {
          // 定时清除redis中的message
          setMessageTimeOut(message.id)
          MESSAGE.addNewMessageState(userId, message.id)
            .then(state => {
              saveState(state)
              ws && ws.send(JSON.stringify({
                data: { state: MESSAGE.STATE.SERVER_RECEIVING, id: message.id },
                code: code.chat.message.send.success.toUser.value,
              }))
            })
        })
      break
    case RELATION.REMINDER_LEVEL.REJECT:
      // 设置拒收消息
      MESSAGE.addNewMessageState(userId, message.id, MESSAGE.STATE.SERVER_RECEIVING)
      ws && ws.send(JSON.stringify({
        data: { state: MESSAGE.STATE.SERVER_RECEIVING, id: message.id },
        code: code.chat.message.send.fail.toUser.value
      }))
      break
    default:
      ws && ws.send(JSON.stringify({
        code: code.chat.message.send.error.noReminderLevel.value
      }))
  }
}




module.exports = {
  tochat
}