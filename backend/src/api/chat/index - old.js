const Redis = require('ioredis');
const redis = new Redis();
const express = require('express');
/**
 * @param  object data:{
 * data.token
 * data.type :{OPEN,HEARTBEAT}
 * }
 * @returns array
 * {
 * success:boolean,
 * message:string,
 * data:messages[],
 * code,
 * }
 */
const chat = express.Router();

const { MESSAGE, USER, RELATION } = require('../sql');
const {
    USER_DATA_CACHE_TIME,
    WS_TYPE,
    verToken,
    setUserWsAlive,
    setUserWsDead,
    clearUser,
    saveState,
    updateMessages,
    setMessageTimeOut,
} = require('../common');
const { code } = require('../api-code-table');
// 做一个定时器，超过指定时间,清除redis中的user
const timerMap = new Map();

chat.ws('/chat', (ws, req) => {
    try {
        ws.send(
            JSON.stringify({
                date: new Date().toLocaleString(),
                text: 'Hi,this is the chat backend service for you.',
                success: true,
            }),
        );
        ws.on('error', (event) => {
            console.log('error in connect');
            console.log(event);
        });
        ws.on('message', (data) => {
            data = JSON.parse(data);
            console.log('_+_+__+_+_+_+_______________+_+_+_++_+_+_+_+_+');
            console.log(data.type);
            console.log('_+_+__+_+_+_+_______________+_+_+_++_+_+_+_+_+');
            verToken(data.token, req).then((verifyResult) => {
                if (verifyResult.success) {
                    const user = verifyResult.user;
                    user.data = data;
                    console.log(user);
                    switch (data.type) {
                        case WS_TYPE.FIRST_CONNECT:
                            fisrtConnect(user, ws);
                            break;
                        case WS_TYPE.HEARTBEAT_MESSAGE:
                            sendNewMessage(user, ws);
                            clearUserTimeOut(user);
                            break;
                        case WS_TYPE.SEND_MESSAGE:
                            console.log(data);
                            data.message.sendId = user.id;
                            saveMessage(data.message, ws);
                            break;
                        case WS_TYPE.CLOSE_CONNECT:
                            clearUserData(user, ws);
                            break;
                        case WS_TYPE.REVOKE_MESSAGE:
                            revokeMessage(data.message, ws);
                            break;
                        default:
                            ws.send(
                                JSON.stringify({
                                    code: code.chat.error.type.value,
                                }),
                            );
                            return;
                    }
                } else {
                    ws.send(
                        JSON.stringify({
                            code: verifyResult.code,
                        }),
                    );
                }
            });
        });
    } catch (err) {
        console.log(err);
        ws.send(
            JSON.stringify({
                code: code.chat.error.catchErr.value,
            }),
        );
    }
});
/**
 * 1. redis存储user alive，
 * 2. 找到未接受的消息
 * */
function fisrtConnect(user, ws) {
    setUserWsAlive(user);
    firstSendMessage(user, ws);
}

/**
 *  发送unread message
 * */
function firstSendMessage(user, ws) {
    getNewMessages(user).then((messages) => {
        MESSAGE.queryMessageByUserId(
            user.id,
            MESSAGE.STATE.SERVER_RECEIVING,
        ).then((res) => {
            messages = messages.concat(res);
            ws.send(
                JSON.stringify({
                    code: code.chat.open.sendMessage.value,
                    data: JSON.stringify(messages),
                }),
            );
            /* if (ws.readyState == ws.OPEN) {
          arrayMessage = arrayMessage.map(item => {
            const Message = item.Message
            redis.set('mid' + Message.id, JSON.stringify(Message))
              .then(() => {
                setMessageTimeOut(Message.id)
              })
            delete item.Message
            // 消息已被用户接受
            item.state = MESSAGE.STATE.TAKE_OVER
            return item
          })
          redis.set('msuid' + user.id, JSON.stringify(arrayMessage))
        } */
        });
    });
}

function sendNewMessage(user, ws) {
    getNewMessages(user, ws).then((messages) => {
        console.log(messages);
        ws.send(
            JSON.stringify({
                data: JSON.stringify(messages),
                code: code.chat.message.heartBeat.value,
            }),
        );
    });
}

async function getNewMessages(user, ws) {
    // 获取用户的所有信息状态
    await redis.get('msuid' + user.id).then((states) => {
        let messages = [];
        if (states != null) {
            states = JSON.parse(states);
            states.map((item) => {
                // 0 服务器接收，准备发送的消息; 3,发送用户打算撤回的消息
                if (item.state == MESSAGE.STATE.SERVER_RECEIVING) {
                    redis.get('mid' + item.messageId).then((msg) => {
                        if (msg) {
                            messages.push(JSON.parse(item));
                        } else {
                            MESSAGE.queryById(item.messageId).then((msg) => {
                                messages.push(msg);
                            });
                        }
                    });
                }
                if (item.state == MESSAGE.STATE.REVOKE) {
                    redis.get('mid' + item.messageId).then((res) => {
                        res = JSON.parse(res);
                        res.content = '';
                        res.url = '';
                        messages.push(res);
                    });
                }
            });
            console.log('-=-=-+_+_+_+_+_+_+_+_+_+_+_+_+_+_+');
            console.log(messages);
            ws.send(
                JSON.stringify({
                    data: JSON.stringify(messages),
                    code: code.chat.message.heartBeat.value,
                }),
            );
            return messages;
        }
        return [];
    });
}

/**
 *  重置清除redis中user的定时器 */
function clearUserTimeOut(user) {
    // updateMessages(user)
    // 1.clearTimeout(timerMap.get(user.id))
    if (timerMap.get(user.id)) {
        clearTimeout(timerMap.get(user.id));
    }
    // 2.timerMap.set(user.id,setTimerout())
    timerMap.set(
        user.id,
        setTimeout(() => {
            const id = user.id;
            setUserWsDead({ id: id });
        }, USER_DATA_CACHE_TIME),
    );
}

function saveMessage(message, ws) {
    MESSAGE.addNewMessage(message).then((message) => {
        // 0,1:用户消息,2:群组消息,3:系统消息
        switch (message.sendType) {
            case MESSAGE.SEND_TYPE.STRANGER_MESSAGE:
            case MESSAGE.SEND_TYPE.FRIEND_MESSAGE:
                setUserMessage(message, ws);
                break;
            case MESSAGE.SEND_TYPE.GROUP_MESSAGE:
                setGroupMessage(message, ws);
                break;
            case MESSAGE.SEND_TYPE.SYSTEM_MESSAGE:
                setSystemMessage(message, ws);
                break;
            default:
                ws.send(
                    JSON.stringify({
                        code: code.chat.error.messageType.value,
                    }),
                );
        }
    });
}

function clearUserData(user, ws) {
    clearUser(user.id).then((flag) => {
        if (flag) {
            ws.send(
                JSON.stringify({
                    code: code.chat.close.success.value,
                }),
            );
        } else {
            ws.send(
                JSON.stringify({
                    code: code.chat.error.closeErr.value,
                }),
            );
        }
    });
}

function revokeMessage(message, ws) {
    redis.get('mid' + message.id).then((message) => {
        message = message ? JSON.parse(message) : false;
        // message存在
        // 1. 判断当前撤回时间和发送时间间隔，是否在keepDateTime内
        if (
            message &&
            Date.now() - Date.parse(message.createdAt) < USER_DATA_CACHE_TIME
        ) {
            // 找到该消息的所有接收者
            MESSAGE.setMessageStateByMessageId(message.id, 3).then((states) => {
                if (states) {
                    states.map((item) => {
                        setState(item);
                    });
                }
            });
            ws.send(
                JSON.stringify({
                    data: { state: MESSAGE.STATE.REVOKE, id: message.id },
                    code: code.chat.message.revoke.success.value,
                }),
            );
        } else {
            ws.send(
                JSON.stringify({
                    data: { state: MESSAGE.STATE.TAKE_OVER, id: message.id },
                    code: code.chat.message.revoke.fail.value,
                }),
            );
        }
    });
}

/**
 *
 *  设置用户消息 */
function setUserMessage(message, ws) {
    // 找到消息的所有接收者与发送者的关系
    RELATION.queryUserRelation(
        message.receiveId,
        message.sendId,
        message.sendType,
    ).then((relation) => {
        saveMessageAndState(message.receiveId, relation, message, ws);
    });
}
/**
 * 设置群组消息
 */
function setGroupMessage(message, ws) {
    RELATION.queryInGroupRelation(message.sendId, message.receiveId).then(
        (relation) => {
            if (relation) {
                RELATION.queryGroupRelation(
                    message.sendId,
                    message.receiveId,
                ).then((relations) => {
                    relations = relations ? relations : [];
                    relations.map((item) => {
                        item.userId != message.sendId
                            ? saveMessageAndState(item.userId, item, message)
                            : null;
                    });
                    ws.send(
                        JSON.stringify({
                            data: {
                                state: MESSAGE.STATE.SERVER_RECEIVING,
                                id: message.id,
                            },
                            code: code.chat.message.send.success.toGroup.value,
                        }),
                    );
                });
            } else {
                ws.send(
                    JSON.stringify({
                        code: code.chat.error.noPermission.value,
                    }),
                );
            }
        },
    );
}
/**
 * 设置系统消息
 */
function setSystemMessage(message, ws) {
    USER.queryUserById(message.sendId).then((user) => {
        if (user.type == 0) {
            redis.set('mid' + message.id, JSON.stringify(message)).then(() => {
                // 定时清除
                setMessageTimeOut(message.id);
                USER.queryAllUser().then((users) => {
                    console.log(message);
                    users.map((user) => {
                        MESSAGE.addNewMessageState(user.id, message.id).then(
                            (state) => {
                                saveState(state);
                            },
                        );
                    });
                    ws.send(
                        JSON.stringify({
                            data: {
                                state: MESSAGE.STATE.SERVER_RECEIVING,
                                id: message.id,
                            },
                            code: code.chat.message.send.success.toSystem.value,
                        }),
                    );
                });
            });
        } else {
            ws.send(
                JSON.stringify({
                    code: code.chat.error.noPermission.value,
                }),
            );
        }
    });
}
/**
 * 保存消息
 */
function saveMessageAndState(userId, relation, message, ws) {
    // 0:及时提醒,1:接收不提醒,2:拒收
    switch (relation.reminderLevel) {
        case RELATION.REMINDER_LEVEL.RECEIVE_AND_NOTIFY:
        case RELATION.REMINDER_LEVEL.RECEIVE_AND_NOT_NOTIFY:
            redis.set('mid' + message.id, JSON.stringify(message)).then(() => {
                // 定时清除redis中的message
                setMessageTimeOut(message.id);
                MESSAGE.addNewMessageState(userId, message.id).then((state) => {
                    saveState(state);
                    ws &&
                        ws.send(
                            JSON.stringify({
                                data: {
                                    state: MESSAGE.STATE.SERVER_RECEIVING,
                                    id: message.id,
                                },
                                code: code.chat.message.send.success.toUser
                                    .value,
                            }),
                        );
                });
            });
            break;
        case RELATION.REMINDER_LEVEL.REJECT:
            // 设置拒收消息
            MESSAGE.addNewMessageState(
                userId,
                message.id,
                MESSAGE.STATE.SERVER_RECEIVING,
            );
            ws &&
                ws.send(
                    JSON.stringify({
                        data: {
                            state: MESSAGE.STATE.SERVER_RECEIVING,
                            id: message.id,
                        },
                        code: code.chat.message.send.fail.toUser.value,
                    }),
                );
            break;
        default:
            ws &&
                ws.send(
                    JSON.stringify({
                        code: code.chat.message.send.error.noReminderLevel
                            .value,
                    }),
                );
    }
}

module.exports = chat;
