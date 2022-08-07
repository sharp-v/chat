/**
 * 公共常量
  */

//单位毫秒,保存没有发送websocket心跳的用户登录状态2分钟
const USER_DATA_CACHE_TIME = 10 * 1000
// token有效期 单位ms
const TOKEN_VALIDITY_PERIOD = 1000 * 60 * 60 * 24

// server
const IP = "119.23.54.17"
const PORT = '8080'

// local
// const IP = '127.0.0.1'
// const PORT = '9000'

// local network
// const IP = '192.168.1.101'
// const PORT = '9000'

const HOST = IP + ':' + PORT
const HTTP_HOST = 'http://' + HOST

const WS_TYPE = {
  FIRST_CONNECT: 'OPEN',
  HEARTBEAT_MESSAGE: 'HEARTBEAT',
  SEND_MESSAGE: 'SEND',
  RECEVICE_MESSAGE: 'RECEVICE',
  REVOKE_MESSAGE: 'REVOKE',
  CLOSE_CONNECT: 'CLOSE',
}

const RELATION = {
  TYPE: {
    STRANGER: 0,
    FRIEND: 1,
    GROUP: 2
  },
  REMINDER_LEVEL: {
    RECEIVE_AND_NOTIFY: 0,
    RECEIVE_AND_NOT_NOTIFY: 1,
    REJECT: 2
  }
}

const USER_PRIVACY = {
  ACCOUNT: {
    SHOW: 0,
    HIDE: 1,
    DEFAULT: 0,
  },
  PHONE: {
    SHOW: 0,
    HIDE: 1,
    DEFAULT: 0,
  },
  RELATION: {
    ADD_FRIEND: 0,
    NOT_ADD_FRIEND: 1,
    DEFAULT: 0
  },
  DYNAMIC: {
    EVERYONE_CAN_ACCESS: 0,
    JUST_FRIEND_CAN_ACCESS: 1,
    JUST_MYSELF: 2,
    DEFAULT: 0
  }
}

const MESSAGE = {
  STATE: {
    SERVER_RECEIVING: 0,
    SERVER_REFUSED: -1,
    TAKE_OVER: 2,
    REVOKE: 3
  },

  SYS_NOTIY_SENDID: 0,
  SYS_SENDID: -1,

  SEND_TYPE: {
    STRANGER_MESSAGE: 0,
    FRIEND_MESSAGE: 1,
    GROUP_MESSAGE: 2,
    GROUP_ALL_MESSAGE: 3,
    SYSTEM_MESSAGE: 4,
    SYSTEM_NOTIFY_MESSAGE: 5
  },

  TYPE: {
    NORMAL_MESSAGE: 0
  },
  SYS_REVOKE_REPLACE: '系统撤回了一条消息',
  OWN_REVOKE_REPLACE: '群主撤回了一条消息',
  RELATION_REVOKE_REPLACE: '对方撤回了一条消息',
  MY_REVOKE_REPLACE: '你撤回了一条消息'
}

const NET_ERROR_MESSAGE = "网络错误"

const TOKEN_NAME = 'token'
const USER_TYPE = 'USER_TYPE'
const GROUP_TYPE = 'GROUP_TYPE'
const SYSTEM_TYPE = 'SYSTEM_TYPE'

const MAX_SCROLL_VALUE = 999999999

export {
  HTTP_HOST,
  MAX_SCROLL_VALUE,
  SYSTEM_TYPE,
  USER_TYPE,
  GROUP_TYPE,
  TOKEN_NAME,
  NET_ERROR_MESSAGE,
  USER_DATA_CACHE_TIME,
  TOKEN_VALIDITY_PERIOD,
  WS_TYPE,
  HOST,
  RELATION,
  USER_PRIVACY,
  MESSAGE,
}