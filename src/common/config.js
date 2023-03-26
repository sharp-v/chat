/**
 * 公共常量
 * 我现在觉得这写的不好,我又想改了... 再说吧
 */

//单位毫秒,保存没有发送websocket心跳的用户登录状态2分钟
const USER_DATA_CACHE_TIME = 10 * 1000;
// token有效期 单位ms
const TOKEN_VALIDITY_PERIOD = 1000 * 60 * 60 * 24;

// server 这是阿里云服务器的地址
// const IP = "119.23.54.17"
// const PORT = '8080'

// local 本地服务器地址2
const IP = '127.0.0.1';
const PORT = '9000';

// local network 本地服务器地址2
// const IP = '192.168.1.101'
// const PORT = '9000'

const HOST = IP + ':' + PORT;
const HTTP_HOST = 'http://' + HOST;

// websocket消息类型
const WS_TYPE = {
    // 连接开始
    FIRST_CONNECT: 'OPEN',
    // 心跳包消息
    HEARTBEAT_MESSAGE: 'HEARTBEAT',
    // 发送消息
    SEND_MESSAGE: 'SEND',
    // 接受消息
    RECEVICE_MESSAGE: 'RECEVICE',
    // 撤回消息
    REVOKE_MESSAGE: 'REVOKE',
    // 关闭连接
    CLOSE_CONNECT: 'CLOSE',
};
// 关系
const RELATION = {
    // 关系类型
    TYPE: {
        // 陌生人
        STRANGER: 0,
        // 好友
        FRIEND: 1,
        // 群组
        GROUP: 2,
    },
    // 消息接收级别
    REMINDER_LEVEL: {
        // 接收提醒
        RECEIVE_AND_NOTIFY: 0,
        // 接收不提醒
        RECEIVE_AND_NOT_NOTIFY: 1,
        // 拒收
        REJECT: 2,
    },
};
// 用户隐私权限
const USER_PRIVACY = {
    // 账号是否可以被搜索到
    ACCOUNT: {
        SHOW: 0,
        HIDE: 1,
        DEFAULT: 0,
    },
    // 是否可以通过手机被搜索到
    PHONE: {
        SHOW: 0,
        HIDE: 1,
        DEFAULT: 0,
    },
    // 是否允许被添加
    RELATION: {
        ADD_FRIEND: 0,
        NOT_ADD_FRIEND: 1,
        DEFAULT: 0,
    },
    // 动态权限
    DYNAMIC: {
        EVERYONE_CAN_ACCESS: 0,
        JUST_FRIEND_CAN_ACCESS: 1,
        JUST_MYSELF: 2,
        DEFAULT: 0,
    },
};

// 消息
const MESSAGE = {
    // 消息的状态
    STATE: {
        // 发送中(服务器接收到, 准备发送)
        SERVER_RECEIVING: 0,
        // 发送取消(服务接收到, 对方拒绝接收)
        SERVER_REFUSED: -1,
        // 发送成功
        TAKE_OVER: 2,
        // 撤回
        REVOKE: 3,
    },
    // 系统消息id
    SYS_NOTIY_SENDID: 0,
    // 系统发送id
    SYS_SENDID: -1,
    // 消息类型
    SEND_TYPE: {
        // 陌生人消息
        STRANGER_MESSAGE: 0,
        // 好友消息
        FRIEND_MESSAGE: 1,
        // 群组消息
        GROUP_MESSAGE: 2,
        // 群组全部成员消息
        GROUP_ALL_MESSAGE: 3,
        // 系统消息
        SYSTEM_MESSAGE: 4,
        // 系统提醒消息
        SYSTEM_NOTIFY_MESSAGE: 5,
    },
    // 消息类型?
    TYPE: {
        NORMAL_MESSAGE: 0,
    },
    // 消息撤回提醒
    SYS_REVOKE_REPLACE: '系统撤回了一条消息',
    OWN_REVOKE_REPLACE: '群主撤回了一条消息',
    RELATION_REVOKE_REPLACE: '对方撤回了一条消息',
    MY_REVOKE_REPLACE: '你撤回了一条消息',
};
// 网络错误提醒
const NET_ERROR_MESSAGE = '网络错误';
// token名
const TOKEN_NAME = 'token';
// 用户消息类型
const USER_TYPE = 'USER_TYPE';
// 群组消息类型
const GROUP_TYPE = 'GROUP_TYPE';
// 系统消息类型
const SYSTEM_TYPE = 'SYSTEM_TYPE';

const MAX_SCROLL_VALUE = 999999999;

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
};
