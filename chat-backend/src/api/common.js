const Redis = require("ioredis");
const redis = new Redis();
const AES = require("crypto-js/aes");
// const CryptoJS = require('crypto-js')

const { code } = require("./api-code");
const { MESSAGE, USER } = require("./sql");
const { STATE } = MESSAGE;
const LOCAL_HOST = "::ffff:127.0.0.1";
const {
  TOKEN_VALIDITY_PERIOD,
  USER_DATA_CACHE_TIME,
  RANDOM_RANGE,
  TOKEN_PREFIX,
} = require("../config");

/**
 *  weboscket请求类型
 * FIRST_CONNCET:首次连接
 * HEARTBEAT_MESSAGE:ws心跳
 * SEND_MESSAGE:用户发送消息
 * REVOKE_MESSAGE:用户撤销消息
 * CLOSE_CONNCET:用户关闭连接
 *  */
const WS_TYPE = {
  FIRST_CONNECT: "OPEN",
  HEARTBEAT_MESSAGE: "HEARTBEAT",
  SEND_MESSAGE: "SEND",
  RECEVICE_MESSAGE: "RECEVICE",
  REVOKE_MESSAGE: "REVOKE",
  CLOSE_CONNECT: "CLOSE",
};

/**
 *  验证token,req
 * @param token req
 * @returns promise
 * verifyResult=>{
 *   success:boolean(true,false),验证是否通过
 *   reasons:string,//未通过的原因
 *   user:{
 *      id:Number,//用户的id
 *      token:string,//连接者的token
 *      key:string,//连接者token的key
 *      connectTime:Number,//本次连接的时间
 *      currentIp:string,//用户当前ip
 *      agent:string,//连接者的设备
 *   }
 * }
 *
 *  */
const TokenTimerMap = new Map();
async function verToken(token, req) {
  const verifyResult = {
    success: false,
    code: code.system.confirm.token.normal,
  };

  const user = {
    id: null,
    token: { value: token, key: null },
    connect: {
      time: Date.now(),
      ip: req.ip,
      api: req.originalUrl,
      agent: req.headers["user-agent"],
      body: req.body,
    },
  };

  if (!token) {
    verifyResult.code = code.system.confirm.token.noPermission;
  } else {
    await redis.get(TOKEN_PREFIX + token).then((key) => {
      if (key) {
        user.token.key = key;
        key = JSON.parse(key);
        if (user.connect.time - key.genTime > TOKEN_VALIDITY_PERIOD) {
          verifyResult.code = code.system.confirm.token.expired;
        }
        if (user.connect.ip != key.ip && user.connect.ip != LOCAL_HOST) {
          verifyResult.code = code.system.confirm.token.changeIp;
        }
        if (key.agent != user.connect.agent) {
          verifyResult.code =
            verifyResult.code.value > code.system.confirm.token.safe.value
              ? code.system.confirm.token.changeIpAndAgent
              : code.system.confirm.token.changeAgent;
        }
        if (verifyResult.code.value > code.system.confirm.token.safe.value) {
          console.log(
            "____________________________________________________________________"
          );
          console.log("verify resutl is not safe", verifyResult);
          redis.del(TOKEN_PREFIX + token);
          console.log(key);
          console.log(user);
          console.log(
            "____________________________________________________________________"
          );
        } else {
          verifyResult.success = true;
          user.id = key.id;
          user.connect.ip = true;
          user.connect.agent = true;
        }
      } else {
        verifyResult.code = code.system.confirm.token.error;
      }
    });
  }
  verifyResult.user = user;
  return verifyResult;
}

/**
 * 根据用户和req生成token
 */
async function genToken(user, req) {
  const originObj = {
    random: ~~(Math.random() * RANDOM_RANGE),
    id: user.id,
    genTime: Date.now(),
  };
  const key = JSON.stringify({
    random: ~~(Math.random() * RANDOM_RANGE),
    id: user.id,
    account: user.account,
    genTime: Date.now(),
    agent: req.headers["user-agent"],
    ip: req.ip,
  });
  let token = AES.encrypt(JSON.stringify(originObj), key).toString();
  await redis.set(TOKEN_PREFIX + token, key).then((res) => {
    if (res == "OK") {
      redis.get(TOKEN_PREFIX + token).then((res) => {
        if (res) {
          console.log("gen token", token);
          const timer = setTimeout(() => {
            const temp = token;
            redis.del(TOKEN_PREFIX + temp);
            console.log("clear then token", temp, key);
          }, TOKEN_VALIDITY_PERIOD);
          TokenTimerMap.set(TOKEN_PREFIX + token, timer);
        } else {
          token = null;
        }
      });
    } else {
      token = null;
    }
  });
  return token;
}

/**
 * 更新用户消息状态
 */
async function updateMessages(user) {
  console.log("update", user.id);
  await redis.get("msuid" + user.id).then((states) => {
    if (states) {
      states = JSON.parse(states);
      // 过滤超时的消息
      states.map((state) => {
        STATE;
        if (Date.now() - Date.parse(state.createdAt) > USER_DATA_CACHE_TIME) {
          // 将超过保存时间的消息更新为用户已接受
          state.state != STATE.REVOKE ? (state.state = STATE.TAKE_OVER) : null;
          MESSAGE.setMessageState(state.id, state.state);
        }
      });
      states = states.filter((state) => {
        Date.now() - Date.parse(state.createdAt) < USER_DATA_CACHE_TIME;
      });
      redis.set("msuid" + user.id, JSON.stringify(states));
    } else {
      states = MESSAGE.queryMessageByUserId(
        user.id,
        STATE.SERVER_RECEIVING
      ).then((states) => {
        states = states ? states : [];
        redis.set("msuid" + user.id, JSON.stringify(states));
      });
    }
  });
}

/**
 *  更新redis中的user
 * */
function setUserWsAlive(user) {
  USER.queryUserPrivacy(user.id).then((userPrivacy) => {
    if (userPrivacy) {
      user.privacy = userPrivacy;
      redis.set("uid" + user.id, JSON.stringify(user)).then((res) => {
        console.log("---- user id:" + user.id + " ws alive ----" + res);
      });
    }
  });
}

async function setUserWsDead(user) {
  await updateMessages(user).then(() => {
    const id = user.id;
    redis.get("uid" + id).then((user) => {
      user = JSON.parse(user);
      redis.del("uid" + id);
      redis.del("msuid" + id);
      console.log("----  user id:" + id + " ws dead ----");
      return true;
    });
  });
}

/**
 * 清除redis中的user,token
 */
async function clearUser(id) {
  await updateMessages({ id }).then(() => {
    redis.get("uid" + id).then((user) => {
      user = JSON.parse(user);
      redis.del(TOKEN_PREFIX + user.token).then(() => {
        clearTimeout(TokenTimerMap.get(TOKEN_PREFIX + user.token));
        TokenTimerMap.delete(TOKEN_PREFIX + user.token);
        redis.del("uid" + id);
        redis.del("msuid" + id);
        console.log("---- clear user id:" + id + " success ----");
        return true;
      });
    });
  });
}

function setMessageTimeOut(messageId) {
  setTimeout(() => {
    const id = messageId;
    // redis.get("mid" + id).then((res) => {
    //   console.log(JSON.parse(res));
    // });
    redis.del("mid" + id);
  }, USER_DATA_CACHE_TIME);
}

/**
 * 保存消息状态
 */
function saveState(state, message) {
  state.main = message;
  redis.get("uid" + state.userId).then((user) => {
    if (user != null) {
      redis.get("msuid" + state.userId).then((messageStates) => {
        messageStates = messageStates ? JSON.parse(messageStates) : [];
        messageStates.push(state);
        redis.set("msuid" + state.userId, JSON.stringify(messageStates));
      });
    }
  });
}

function setState(state) {
  redis.get("uid" + state.userId).then((user) => {
    if (user) {
      redis.get("msuid" + state.userId).then((messageStates) => {
        messageStates = messageStates ? JSON.parse(messageStates) : [];
        for (let item of messageStates) {
          const { id } = item;
          if (id === state.id) {
            item == state;
            break;
          }
        }
        redis.set("msuid" + state.userId, JSON.stringify(messageStates));
      });
    }
  });
}

async function addSystemNotifyMessage(receiveId, data, notifyCode) {
  let flag = false;
  const notifyMessage = {
    sendId: MESSAGE.SYS_NOTIY_SENDID,
    receiveId: receiveId,
    sendType: MESSAGE.SEND_TYPE.SYSTEM_NOTIFY_MESSAGE,
    content: JSON.stringify({
      data: data,
      code: notifyCode,
    }),
  };
  await MESSAGE.addNewMessage(notifyMessage).then((message) => {
    setMessageTimeOut(message.id);
    MESSAGE.addNewMessageState(message.receiveId, message.id).then((state) => {
      saveState(state, message);
      flag = true;
    });
  });
  return flag;
}

module.exports = {
  USER_DATA_CACHE_TIME,
  TOKEN_VALIDITY_PERIOD,
  WS_TYPE,
  verToken,
  genToken,
  setUserWsDead,
  setUserWsAlive,
  clearUser,
  updateMessages,
  setMessageTimeOut,
  saveState,
  setState,
  addSystemNotifyMessage,
};
