/**
 *
 * 该模块负责解释并说明code的用意
 * 说明:
 *  0. code.value范围-999-0和10000-100000
 *  1. 一个请求的value值最多有100个,一般从最后两位00-99
 *  2. 一个请求的value值最少有10个值,最后一位0-9
 *  3. 且一般最后一位用0-4表示没有异常和错误的状态,5-9表示出现异常错误的状态码
 *  4. 若当前5个码不够,则该请求的状态码数量+10,然后后面的10个状态码遵从(说明3)
 *  5. 10900-10999的value用于表示系统或网络大致的错误
 *  6. 所有的错误和异常码都配合http的状态码使用
 *  7. 大部分的请求的状态码都是有剩余的,这些剩余的状态码,不能被其他的请求覆盖使用
 *  8. 10800-10899的value用于表示对用户的认证,token,ip,agent
 *  9. 13000-14999的value都预留
 * 10. 一个http请求api下面可以分为success,fail,warning,error这四种,这样便于操作
 */

const code = {
    default: {
        min: -99,
        max: 0,
        error: {
            value: -99,
            message: '默认错误,请求失败',
            type: 'danger',
        },
        warning: {
            value: -2,
            message: '默认警告,请求失败',
            type: 'warning',
        },
        fail: {
            value: -1,
            message: '请求失败',
            directions: '请求失败,用于default',
            type: 'warning',
        },
        success: {
            value: 0,
            message: '请求成功',
            directions: '请求成功',
            type: 'success',
        },
    },
    system: {
        min: 10000,
        max: 10999,
        directions: '表示系统的基本响应代码',
        login: {
            min: 10010,
            max: 10019,
            success: {
                value: 10010,
                message: '登录成功',
                type: 'success',
            },
            fail: {
                value: 10011,
                message: '账户或密码错误',
                type: 'warning',
            },
            failAsLcData: {
                value: 10012,
                message: '请输入用户名或密码',
                type: 'danger',
            },
            error: {
                value: 10019,
                message: '登录出错',
                type: 'danger',
            },
        },
        register: {
            min: 10020,
            max: 10029,
            success: {
                value: 10020,
                message: '注册成功',
                type: 'success',
            },
            fail: {
                value: 10021,
                message: '注册失败',
                type: 'warning',
            },
            failAsAcIsRe: {
                value: 10022,
                message: '注册失败,该账号已被注册',
                type: 'warning',
            },
            failAsAcIsWr: {
                value: 10023,
                message: '注册失败,账号名不满足注册要求',
                type: 'warning',
            },
            error: {
                value: 10029,
                message: '注册出错',
                type: 'danger',
            },
        },
        notify: {
            min: 10700,
            max: 10799,
            newFriend: {
                value: 10700,
                message: '新好友申请通知',
                type: 'success',
            },
            newGroupMember: {
                value: 10701,
                message: '新群成员添加通知',
                type: 'success',
            },
            newFriendNotify: {
                value: 10702,
                message: '新好友消息',
                type: 'success',
            },
            newGroupMeberNotify: {
                value: 10703,
                message: '新群成员通知',
                type: 'success',
            },
        },
        confirm: {
            min: 10800,
            max: 10899,
            token: {
                min: 10800,
                max: 10809,
                normal: {
                    value: 10800,
                    message: 'token正常',
                    type: 'success',
                },
                changeAgent: {
                    value: 10801,
                    message: '检测到其他设备登录',
                    type: 'warning',
                },
                originIpChangeAgent: {
                    value: 10802,
                    message: '检测到其他设备登录',
                    type: 'warning',
                },
                safe: {
                    value: 10803,
                    message: 'token安全值',
                    type: 'warning',
                },
                changeIp: {
                    value: 10804,
                    message: '检测到ip异常',
                    type: 'danger',
                },
                changeIpAndAgent: {
                    value: 10805,
                    message: '检测到ip和登录设备异常',
                    type: 'danger',
                },
                expired: {
                    value: 10806,
                    message: 'token过期',
                    type: 'warning',
                },
                noPermission: {
                    value: 10807,
                    message: 'noPermission',
                    type: 'danger',
                },
                danger: {
                    value: 10808,
                    message: '危险的token',
                    type: 'danger',
                },
                error: {
                    value: 10809,
                    message: '请先登录',
                    type: 'danger',
                },
            },
        },
        // 10900-10999表示系统连接过程中的错误
        catchErr: {
            min: 10900,
            max: 10999,
            wsConnectError: {
                value: 10995,
                message: '网络连接错误',
                type: 'warning',
            },
            databaseError: {
                value: 10996,
                message: '数据库错误',
                type: 'danger',
            },
            deviceException: {
                value: 10997,
                message: '设备异常',
                type: 'danger',
            },
            netException: {
                value: 10998,
                message: 'ip异常',
                type: 'danger',
            },
            error: {
                value: 10999,
                message: '服务器开小差了',
                type: 'danger',
            },
        },
    },
    relation: {
        min: 11000,
        max: 11999,
        base: {
            noData: {
                value: 11000,
                message: '缺少关键参数',
                type: 'warning',
            },
            errorData: {
                value: 11001,
                message: '参数错误',
                type: 'danger',
            },
        },
        add: {
            min: 11010,
            max: 11029,
            success: {
                min: 11010,
                max: 11014,
                friend: {
                    value: 11010,
                    message: '发送成功',
                    directions: '仅表示发送的请求成功,对方还未同意',
                    type: 'success',
                },
                group: {
                    value: 11011,
                    message: '发送成功',
                    type: 'success',
                },
                addFriend: {
                    value: 11013,
                    message: '你有一位新的好友',
                    directions: '仅表示发送的请求成功,对方还未同意',
                    type: 'success',
                },
                addGroup: {
                    value: 11014,
                    message: '你已加入群组',
                    type: 'success',
                },
            },
            fail: {
                min: 11015,
                max: 11019,
                already: {
                    value: 11015,
                    message: '你们已经是好友了',
                    type: 'success',
                },
                alreadyInGroup: {
                    value: 11016,
                    message: '你已在群组中',
                    type: 'success',
                },
                undone: {
                    value: 11017,
                    message: '表示该联系已被对方拒绝',
                    type: 'warning',
                },
                undoneGroup: {
                    value: 11018,
                    message: '群组请求被拒绝',
                    type: 'warning',
                },
            },
            warning: {
                min: 11020,
                max: 11024,
            },
            error: {
                min: 11025,
                max: 11029,
                param: {
                    value: 11028,
                    message: '新建联系出错,缺少重要参数',
                    type: 'danger',
                },
                serverErr: {
                    value: 11029,
                    message: '新增好友或群组时错误,内部参数错误',
                    type: 'danger',
                },
            },
        },
        confirmAdd: {
            min: '11030',
            max: '11049',
            success: {
                agreeFriend: {
                    value: 11030,
                    message: '同意添加好友成功',
                    type: 'success',
                },
                agreeGroup: {
                    value: 11031,
                    message: '加群成功',
                    type: 'success',
                },
            },
            fail: {
                friend: {
                    value: 11035,
                    message: '同意添加好友失败',
                    type: 'warning',
                },
                group: {
                    value: 11036,
                    message: '拒绝加入群组',
                    type: 'warning',
                },
            },
            error: {
                friend: {
                    value: 11045,
                    message: '同意好友请求出错',
                    type: 'danger',
                },
                group: {
                    value: 11046,
                    message: '加入群组出错',
                    type: 'danger',
                },
                param: {
                    value: 11047,
                    message: '参数错误',
                    type: 'danger',
                },
                noPermission: {
                    value: 11048,
                    message: 'Sorry,permission denied',
                    type: 'danger',
                },
                serverErr: {
                    value: 11049,
                    message: '服务器错误',
                    type: 'danger',
                },
            },
        },
        update: {
            min: 11050,
            max: 11059,
            success: {
                type: 'success',
                message: '修改成功',
                value: 11050,
            },
            fail: {
                value: 11051,
                message: '修改失败',
                type: 'warning',
            },
            error: {
                value: 11059,
                message: '修改错误',
                type: 'danger',
            },
        },
        del: {},
        query: {
            min: 11100,
            max: 11199,
            all: {
                success: {
                    value: 11100,
                    message: '用户所有的关系结果',
                    type: 'success',
                },
                error: {
                    value: 11109,
                    message: '所有查询出错',
                    type: 'danger',
                },
            },
            user: {
                success: {
                    value: 11110,
                    message: '查询成功',
                    type: 'success',
                },
                fail: {
                    value: 11111,
                    message: '查询失败',
                    type: 'warning',
                },
                error: {
                    value: 11119,
                    message: '用户查询错误',
                    type: 'danger',
                },
            },
        },
    },
    chat: {
        min: 12000,
        max: 12999,
        // 现在只使用12000-12499的状态码，12500-12999的状态码留给以后使用
        maxUseNow: 12499,
        open: {
            min: 12000,
            max: 12099,
            sendMessage: {
                value: 12000,
                message: '首次连接,接收未读取消息',
                type: 'success',
            },
            openMessage: {
                value: 12001,
                message: 'chat-backend service for you',
                type: 'success',
            },
        },
        close: {
            min: 12100,
            max: 12199,
            success: {
                value: 12100,
                message: '退出成功',
                type: 'success',
            },
        },
        message: {
            min: 12200,
            max: 12399,
            heartBeat: {
                value: 12200,
                message: '心跳消息',
                type: 'success',
            },
            send: {
                min: 12210,
                max: 12249,
                success: {
                    min: 12210,
                    max: 12219,
                    toStranger: {
                        value: 12210,
                        message: '陌生消息发送成功',
                        type: 'success',
                    },
                    toUser: {
                        value: 12211,
                        message: '用户消息发送成功，陌生或好友消息',
                        type: 'success',
                    },
                    toGroup: {
                        value: 12212,
                        message: '群组消息发送成功',
                        type: 'success',
                    },
                    toSystem: {
                        value: 12213,
                        message: '系统消息发送成功',
                        type: 'success',
                    },
                    toGroupAll: {
                        value: 12214,
                        message: '群组全体消息发送成功',
                        type: 'success',
                    },
                    toSystemNotify: {
                        value: 12215,
                        message: '系统通知消息成功',
                        type: 'success',
                    },
                },
                fail: {
                    min: 12220,
                    max: 12229,
                    toStranger: {
                        value: 12220,
                        message: '陌生消息发送失败',
                        type: 'warning',
                    },
                    toUser: {
                        value: 12221,
                        message: '用户消息发送失败，陌生或好友消息',
                        type: 'warning',
                    },
                    toGroup: {
                        value: 12222,
                        message: '群组消息发送失败',
                        type: 'warning',
                    },
                    toSystem: {
                        value: 12223,
                        message: '系统消息发送失败',
                        type: 'warning',
                    },
                    toGroupAll: {
                        value: 12224,
                        message: '群组全体消息发送失败',
                        type: 'warning',
                    },
                    toSystemNotify: {
                        value: 12225,
                        message: '系统通知消息失败',
                        type: 'warning',
                    },
                },
                error: {
                    min: 12230,
                    max: 12239,
                    noReminderLevel: {
                        value: 12230,
                        message: '没有设置提醒级别',
                        type: 'danger',
                    },
                    noPermission: {
                        value: 12231,
                        message: '没有权限发送该消息',
                        type: 'danger',
                    },
                },
            },
            revoke: {
                min: 12250,
                max: 12259,
                success: {
                    value: 12250,
                    message: '消息撤销成功',
                    type: 'success',
                },
                fail: {
                    value: 12251,
                    message: '消息撤销失败，原因超时了',
                    type: 'warning',
                },
                noPermission: {
                    value: 12252,
                    message: '没有权限撤回该消息',
                    type: 'danger',
                },
            },
        },
        error: {
            min: 12400,
            max: 12499,
            notype: {
                value: 12400,
                message: '错误的请求，没有请求类型',
                type: 'danger',
            },
            nodata: {
                value: 12401,
                message: '错误的请求，该请求需要数据',
                type: 'danger',
            },
            type: {
                value: 12402,
                message: '错误的类型',
                type: 'danger',
            },
            messageType: {
                value: 12403,
                message: '错误的消息类型',
                type: 'danger',
            },
            noPermission: {
                value: 12404,
                message: 'Sorry,permission denied',
                type: 'danger',
            },
            closeErr: {
                value: 12405,
                message: '用户退出连接错误',
                type: 'danger',
            },
            catchErr: {
                value: 12499,
                message: 'chat中捕获到的系统异常',
                type: 'danger',
            },
        },
    },
    reserved: {
        min: 13000,
        max: 15999,
    },
    account: {
        min: 16000,
        max: 16100,
        query: {
            min: 16010,
            max: 16019,
            success: {
                value: 16000,
                message: '查询成功',
                type: 'success',
            },
            fail: {
                value: 16001,
                message: '查询失败',
                type: 'warning',
            },
            error: {
                value: 16002,
                message: '查询错误',
                type: 'danger',
            },
        },
        update: {
            min: 16020,
            max: 16029,
            success: {
                value: 16020,
                message: '修改成功',
                type: 'success',
            },
            fail: {
                value: 16021,
                message: '修改失败',
                type: 'warning',
            },
            error: {
                value: 16022,
                message: '修改出错',
                type: 'danger',
            },
        },
    },
};

const token_code = code.system.confirm.token;
const login_code = code.system.login;
const register_code = code.system.register;

const decode = {
    '-1': {
        type: 'warning',
        message: '请求失败',
    },
    0: {
        type: 'success',
        message: '请求成功',
    },
    // /api/login
    10010: {
        message: '登录成功',
        type: 'success',
    },
    10011: {
        message: '账户或密码错误',
        type: 'warning',
    },
    10012: {
        type: 'error',
        message: '请输入用户名或密码',
    },
    10019: {
        type: 'error',
        message: '登录时内部错误',
    },
    // /api/register
    10020: {
        type: 'success',
        message: '注册成功',
    },
    10021: {
        type: 'warning',
        message: '注册失败',
    },
    10022: {
        type: 'warning',
        message: '注册失败,该账户已被注册',
    },
    10023: {
        type: 'warning',
        message: '注册失败,账号名不满足注册要求',
    },
    10029: {
        type: 'error',
        message: '注册出错',
    },
    10700: {
        type: 'success',
        message: '新好友申请通知',
    },
    10701: {
        type: 'success',
        message: '新成员申请通知',
    },

    10800: {
        type: 'success',
        message: 'token正常',
    },
    10801: {
        type: 'success',
        message: '检测到其他设备登录',
    },
    10802: {
        type: 'success',
        message: '检测到其他设备登录',
    },
    10803: {
        type: 'success',
        message: 'token安全值',
    },
    10804: {
        type: 'warning',
        message: '检测到ip异常',
    },
    10805: {
        type: 'error',
        message: '检测到ip和登录设备异常',
    },
    10806: {
        type: 'warning',
        message: '用户认证过期',
    },
    10807: {
        type: 'error',
        message: 'Sorry,permission denied',
    },
    10808: {
        type: 'error',
        message: '危险的token',
    },
    10809: {
        type: 'error',
        message: '认证出错',
    },
    10996: {
        type: 'error',
        message: '数据库错误',
    },
    10997: {
        type: 'error',
        message: '设备异常',
    },
    10998: {
        type: 'error',
        message: 'ip异常',
    },
    10999: {
        type: 'error',
        message: '服务器开小差了',
    },
    // /api/relation
    11000: {
        type: 'error',
        message: '缺少关键参数',
    },
    // add
    11010: {
        type: 'success',
        message: '发送成功',
    },
    11011: {
        type: 'success',
        message: '已发送群组请求',
    },
    11013: {
        type: 'success',
        message: '你有一位新的好友',
    },
    11014: {
        type: 'success',
        message: '你已加入群组',
    },
    11015: {
        type: 'fail',
        message: '你们已经是好友了',
    },
    11016: {
        type: 'fail',
        message: '你已在群组中',
    },
    11017: {
        type: 'fail',
        message: '好友请求被拒绝',
    },
    11018: {
        type: 'fail',
        message: '群组请求被拒绝',
    },
    11020: {
        type: '',
        message: '',
    },
    11021: {
        type: '',
        message: '',
    },
    11022: {
        type: '',
        message: '',
    },
    11028: {
        type: 'error',
        message: '缺少参数',
    },
    11029: {
        type: 'error',
        message: '新增好友或群组时错误',
    },
    // api/relation/confirm-add
    11030: {
        type: 'success',
        message: '同意添加好友成功',
    },
    11031: {
        type: 'success',
        message: '加群组成功',
    },
    11035: {
        type: 'fail',
        message: '同意添加好友失败',
    },
    11036: {
        type: 'fail',
        message: '拒绝加入群组',
    },
    11039: {
        type: 'error',
        message: '同意好友请求出错',
    },
    11045: {
        type: 'error',
        message: '同意好友请求出错',
    },
    11046: {
        type: 'error',
        message: '加入群组出错',
    },
    11047: {
        type: 'error',
        message: '请求错误',
    },
    11048: {
        type: 'error',
        message: 'Sorry,permission denied',
    },
    11049: {
        type: 'error',
        message: '服务器错误',
    },
    11100: {
        type: 'success',
        message: '用户所有的关系结果',
    },
    11109: {
        type: 'error',
        message: '所有查询出错',
    },
    11110: {
        type: 'success',
        message: '用户查询成功',
    },
    11111: {
        type: 'fail',
        message: '用户查询失败',
    },
    11119: {
        type: 'error',
        message: '用户查询错误',
    },
    12000: {
        type: 'success',
        message: '首次连接时,获取消息成功',
    },
    12100: {
        type: 'success',
        message: '退出登录成功',
    },
    12200: {
        type: 'success',
        message: 'HeartBeat',
    },
    12210: {
        type: 'success',
        message: '陌生消息发送成功',
    },
    12211: {
        type: 'success',
        message: '用户消息发送成功，陌生或好友消息',
    },
    12212: {
        type: 'success',
        message: '群组消息发送成功',
    },
    12213: {
        type: 'success',
        message: '系统消息发送成功',
    },
    12214: {
        type: 'success',
        message: '群组全体消息发送成功',
    },
    12215: {
        type: 'success',
        message: '系统通知消息成功',
    },
    12220: {
        type: 'fail',
        message: '陌生消息发送失败',
    },
    12221: {
        type: 'fail',
        message: '用户消息发送失败，陌生或好友消息',
    },
    12222: {
        type: 'fail',
        message: '群组消息发送失败',
    },
    12223: {
        type: 'fail',
        message: '系统消息发送失败',
    },
    12224: {
        type: 'fail',
        message: '群组全体消息发送失败',
    },
    12225: {
        type: 'fail',
        message: '系统通知消息失败',
    },
    12230: {
        type: 'error',
        message: '没有reminderlevel',
    },
    12231: {
        type: 'error',
        message: 'Sorry,permission denied',
    },
    12250: {
        type: 'success',
        message: '消息撤销成功',
    },
    12251: {
        type: 'fail',
        message: '超过两分钟的消息不能撤回',
    },
    12252: {
        type: 'warning',
        message: '没有权限撤回该消息',
    },
    12400: {
        type: 'error',
        message: '错误的请求',
    },
    12401: {
        type: 'error',
        message: '错误的请求，该请求需要数据',
    },
    12402: {
        type: 'error',
        message: '错误的类型',
    },
    12403: {
        type: 'error',
        message: '错误的消息类型',
    },
    12404: {
        type: 'error',
        message: '没有权限',
    },
    12405: {
        type: 'error',
        message: '用户退出连接错误',
    },
    12499: {
        type: 'error',
        message: '系统异常',
    },
};

export { code, decode, token_code, login_code, register_code };
