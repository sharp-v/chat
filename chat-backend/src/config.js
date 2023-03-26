// 保存没有发送websocket心跳的用户2分钟 单位ms,以及消息的默认redis存储时间
// const USER_DATA_CACHE_TIME = 2 * 60 * 1000 * (30 * 24)
const USER_DATA_CACHE_TIME = 2 * 60 * 1000;
// token有效期7天 单位ms
const TOKEN_VALIDITY_PERIOD = 1000 * 60 * 60 * 24 * 7;
const TOKEN_PREFIX = 'token';

const RANDOM_RANGE = 100000;

const PORT = 9000;

const ALLOW_CORS = true;

const USER_TYPE = 'USER_TYPE';
const GROUP_TYPE = 'GROUP_TYPE';
const SYSTEM_TYPE = 'SYSTEM_TYPE';

module.exports = {
    USER_TYPE,
    GROUP_TYPE,
    SYSTEM_TYPE,
    USER_DATA_CACHE_TIME,
    TOKEN_VALIDITY_PERIOD,
    RANDOM_RANGE,
    PORT,
    ALLOW_CORS,
    TOKEN_PREFIX,
};
