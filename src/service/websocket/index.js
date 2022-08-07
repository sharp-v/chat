import defaultConfig from './ws-config'
import store from '../../store'
import { GROUP_TYPE, MESSAGE, USER_TYPE, SYSTEM_TYPE, TOKEN_NAME, WS_TYPE } from '../../common/config';
import { Notify } from 'vant';
WS_TYPE
import { code } from '../../common/code'

async function distributeMessage(messages) {
  let arr = []
  await Promise.all(
    messages.map(message => {
      arr.push(message.messageId)
      let key = null
      let main = message.main
      message = parseMessageTime(message)
      if ((store.state.message.indexMap.get(message.messageId) == undefined)
        || (message.state == MESSAGE.STATE.REVOKE))
        switch (main.sendType) {
          case MESSAGE.SEND_TYPE.STRANGER_MESSAGE:
          case MESSAGE.SEND_TYPE.FRIEND_MESSAGE:
            key = { id: main.sendId, type: USER_TYPE }
            message.senderKey = JSON.stringify(key)
            if (message.main.sendId == message.userId) {
              key = { id: message.main.receiveId, type: USER_TYPE }
              message = judgeRevoke(message, MESSAGE.MY_REVOKE_REPLACE)
              commitMessage('myMessage', JSON.stringify(key), message)
            } else {
              message = judgeRevoke(message, MESSAGE.RELATION_REVOKE_REPLACE)
              commitMessage('newMessage', JSON.stringify(key), message)
            }
            break
          case MESSAGE.SEND_TYPE.GROUP_MESSAGE:
          case MESSAGE.SEND_TYPE.GROUP_ALL_MESSAGE:
            key = { id: main.receiveId, type: GROUP_TYPE }
            message.senderKey = JSON.stringify({ id: main.sendId, type: USER_TYPE })
            if (message.main.sendId == message.userId) {
              message = judgeRevoke(message, MESSAGE.MY_REVOKE_REPLACE)
              commitMessage('myMessage', JSON.stringify(key), message)
            } else {
              message = judgeRevoke(message, MESSAGE.RELATION_REVOKE_REPLACE)
              commitMessage('newMessage', JSON.stringify(key), message)
            }
            break
          case MESSAGE.SEND_TYPE.SYSTEM_MESSAGE:
            message.senderKey = { id: main.sendId, type: SYSTEM_TYPE }
            store.commit('newSystemMessage', message)
            break
          case MESSAGE.SEND_TYPE.SYSTEM_NOTIFY_MESSAGE:
            message.senderKey = { id: main.sendId, type: SYSTEM_TYPE }
            store.commit('newNotifyMessage', message)
            break
          default:
            alert('什么鬼玩意')
        }
    }))
  return arr
}

function parseMessageTime(message) {
  message.createdAt = Date.parse(message.createdAt)
  message.updatedAt = Date.parse(message.updatedAt)
  return message
}

function judgeRevoke(message, REVOKE_REPLACE_WORLD) {
  if (message.state == MESSAGE.STATE.REVOKE) {
    message.main.content = REVOKE_REPLACE_WORLD
  }
  return message
}

function commitMessage(commitType, key, message) {
  store.commit('updateActiveList', key)
  let storeMessage = store.getters.getMessage(key)
  storeMessage.length > 0 ? null : store.commit('initMessage', key)
  store.commit(commitType, { key, message })
}

function updateLocalEditMessage(payload) {
  payload.key = JSON.stringify(payload.key)
  store.commit('localEditMessageState', payload)
  store.commit('updateActiveList', payload.key)
}

const wsConnection = {
  // 可配置项
  $ws: null,
  api: null,
  // 建立连接标志
  connectFlag: null,
  // 时延 心跳间隔
  timeout: null,
  // 时延对象
  timeoutObj: null,
  reconnectTimes: 0,
  maxReconnectTimes: 2,

  // 以下是不可配置项
  // 心跳包，
  heartBeatPackage: null,
  token: null,
  BASEURL: null,
  initConfig: function (config) {
    const _this = this
    const unconfigurableSet = new Set(['BASEURL', 'maxReconnectTimes', 'heartBeatPackage',])
    for (const [key, value] of Object.entries(defaultConfig)) {
      const descriptor = Object.getOwnPropertyDescriptor(_this, key);
      if (descriptor == undefined || descriptor.writable == true) {
        Object.defineProperty(_this, key, {
          value: config && config[key] ? config[key] : value,
          writable: !unconfigurableSet.has(key)
        })
      }
    }
  },
  //初始化webSocket长连接
  initWebSocket: function (config) {
    wsConnection.timeoutObj && clearTimeout(wsConnection.timeoutObj);
    this.$ws && this.resetHeartbeat()
    this.initConfig(config);
    this.token = localStorage.getItem(TOKEN_NAME)
    const url = this.BASEURL + this.api
    this.$ws = new WebSocket(url, 'json');
    this.$ws.onopen = this.wsOpen;
    this.$ws.onclose = this.wsClose;
    this.$ws.onmessage = this.wsMsg;
    this.$ws.onerror = this.wsError;
  },
  // wsOpen,wsClose,wsMsg,wsError这些函数的this是wsConnection.$ws
  wsOpen: function () {
    const data = {
      type: 'OPEN',
      token: wsConnection.token
    }
    this.send && this.send(JSON.stringify(data))
    wsConnection.startWsHeartbeat();
  },
  // 关闭整个websocket连接
  wsClose: function () {
    if (this.close != null) {
      this.close()
      wsConnection.$ws = null
    }
  },
  wsMsg: function (msg) {
    const data = JSON.parse(msg.data);
    if (data.code) {
      const wscode = data.code.value
      switch (true) {
        case wscode == code.chat.open.sendMessage.value || wscode == code.chat.message.heartBeat.value:
          // 提交到relation.*.message上
          distributeMessage(data.data)
            .then(arr => {
              arr.length > 0 && wsConnection.wsSend(WS_TYPE.RECEVICE_MESSAGE, arr)
            })
          break
        case wscode >= 12210 && wscode < 12220:
          updateLocalEditMessage(data.data)
          break
        case wscode >= 12000 && wscode < 12399:
          break
        // 应当终止心跳的code
        default:
          Notify(data.code)
          wsConnection.closeHeartBeat()
          break
      }
    }
  },
  wsError: function () {
    Notify(code.system.catchErr.wsConnectError)
    wsConnection.reconnect()
  },
  wsSend: function (type, data) {
    if (this.connectFlag && this.$ws && this.$ws.send && this.$ws.readyState == this.$ws.OPEN) {
      this.$ws.send(JSON.stringify({
        type: type,
        token: this.token,
        data: data
      }))
    }
  },
  reconnect: function () {
    if (this.connectFlag && (this.reconnectTimes - this.maxReconnectTimes < 0)) {
      this.reconnectTimes++
      this.initWebSocket()
    } else {
      this.closeHeartBeat()
      Notify({ type: 'danger', message: '重连失败' })
      this.wsClose()
    }
  },
  startWsHeartbeat: function () {
    const _this = this
    _this.timeoutObj && clearTimeout(_this.timeoutObj);
    _this.timeoutObj = setInterval(function () {
      //判断websocket当前状态
      if (_this.connectFlag) {
        if (_this.$ws && _this.$ws.readyState != _this.$ws.OPEN) {
          _this.reconnect()
        }
        _this.$ws && _this.$ws.send(JSON.stringify({
          type: 'HEARTBEAT',
          token: _this.token
        }))
      } else {
        _this.closeHeartBeat()
      }
    }, _this.timeout);
  },
  //重置websocket心跳
  resetHeartbeat: function () {
    if (this.$ws.readyState == this.$ws.OPEN) {
      this.$ws.close()
      this.$ws = null
    }
  },
  closeHeartBeat: function () {
    wsConnection.timeoutObj && clearTimeout(wsConnection.timeoutObj);
    this.connectFlag = false
    this.wsClose()
  },
};


export default wsConnection