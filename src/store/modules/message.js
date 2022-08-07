import { WS_TYPE } from "../../common/config"
import wsConnection from '../../service/websocket/index'
// import store from '../index'
const TIME_INTERVAL = 60 * 1000
const message = {
  state: () => ({
    /**
     *  活跃消息列表，最新的会放在最前面
     * 存储的是relation.map.key
     * [relation.map.key,relation.map.key,...]
     *  */
    activeList: [],
    /**********************
     * 消息列表map
     *  map:key => {
     *       消息列表
     *       messages:[],
     *       消息的未读数
     *       unReadCount,
     *       加载的历史消息数量
     *       histroyCount,
     *       准备发送的消息 本机
     *       localEditMessage
     *       ...
     *  } 
     *******************/
    map: new Map(),
    /**
     * 存储消息的index值,relation.map.key => index
     * 该index是messages.length - messages.historyCount后的index
     */
    indexMap: new Map(),
    // 系统公告消息
    systemMessages: [],
    systemUnReadCount: 0,
    // 系统通知消息
    notifyMessage: [],
    notifyUnReadCount: 0,
    // 未读消息总数(不包含通知和系统消息)
    unReadTotal: 0,
  }),


  // indexMap:(messageId)=> index
  // activeList => [{'key',ureadCount}]
  // unReadTotal => ...+...+...
  getters: {
    getLatestMessage: state => (key) => {
      return state.map.get(key).messages.slice(-1)[0]
    },
    getUnReadCount: state => (key) => {
      if (!key) return key
      const value = state.map.get(key)
      return value ? value.unReadCount : 0
    },
    getSystemMessage: state => {
      return state.systemMessages
    },
    getMessage: state => (key) => {
      if (!key) return key
      const value = state.map.get(key)
      return value ? value.messages : []
    },
    getMessageTime: state => (key, index) => {
      if (!key) return key
      const value = state.map.get(key)
      if (value) {
        if (index > 0) {
          if (
            value.messages[index].createdAt -
            value.messages[index - 1].createdAt
            > TIME_INTERVAL) {
            const timeString =
              new Date(value.messages[index].createdAt).toLocaleString()
            return timeString
          }
        } else {
          const timeString =
            new Date(value.messages[index].createdAt).toLocaleString()
          return timeString
        }
      }
    }
  },
  mutations: {
    initMessage(state, key) {
      if (!state.map.get(key)) {
        const value = {
          messages: [],
          historyCount: 0,
          unReadCount: 0,
          localEditMessage: null
        }
        state.map.set(key, value)
      }
    },
    newMessage(state, payload) {
      const key = payload.key
      const message = payload.message
      let value = state.map.get(key)
      state.indexMap.set(message.messageId, value.messages.length - value.historyCount)
      value.messages.push(message)
      state.unReadTotal++
      value.unReadCount++
      state.map.set(key, value)
    },
    revokeMessage(state, payload) {
      const key = payload.key
      const message = payload.message
      const index = state.indexMap.get(message.messageId) + value.historyCount
      let value = state.map.get(key)
      value.messages[index] = message
      state.unReadTotal++
      value.unReadCount++
    },
    myMessage(state, payload) {
      const key = payload.key
      const message = payload.message
      const value = state.map.get(key)
      state.indexMap.set(message.messageId, value.messages.length - value.historyCount)
      value.messages.push(message)
      state.map.set(key, value)
    },
    historyMessage(state, payload) {
      state, payload
      const key = payload.key
      const message = payload.message
      const value = state.map.get(key)
      value.messages.unshift(message)
      value.historyCount++
      state.map.set(key, value)
    },
    updateActiveList(state, key) {
      state.activeList.unshift(key)
      const tempSet = new Set()
      for (let i = 0; i < state.activeList.length; ++i) {
        if (tempSet.has(state.activeList[i])) {
          state.activeList.splice(i, 1)
          break
        } else {
          tempSet.add(state.activeList[i])
        }
      }
    },
    newSystemMessage(state, message) {
      state.systemMessages.push(message)
      state.systemUnReadCount++
    },
    newNotifyMessage(state, message) {
      state.notifyMessage.push(message)
      state.notifyUnReadCount++
    },
    localEditMessage(state, payload) {
      console.log('curmessage', payload)
      const key = payload.key
      let value = state.map.get(key)
      value.localEditMessage = payload.message
      state.map.set(key, value)
    },
    localEditMessageState(state, payload) {
      const key = payload.key
      const value = state.map.get(key)
      value.localEditMessage.state = payload.state
      value.localEditMessage.messageId = payload.id
      state.indexMap.set(payload.id, value.messages.length - value.historyCount)
      value.messages.push(value.localEditMessage)
      value.localEditMessage = null
      state.indexMap.set(key, value)
    },
    messageRead(state, key) {
      const value = state.map.get(key)
      state.unReadTotal -= value.unReadCount
      value.unReadCount = 0
      state.map.set(key, value)
    }
  },
  actions: {
    initMessage({ commit }, key) {
      commit('initMessage', key)
    },
    commitMessage({ commit }, payload) {
      wsConnection.wsSend(WS_TYPE.SEND_MESSAGE, payload.message.main)
      commit('localEditMessage', { key: payload.key, message: payload.message })
    }
  }
}

export default message