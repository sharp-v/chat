/**
 * 该函数只检查基本的http status,然后得到基本的状态信息
 * 因为对每种操作的处理方式不同所以不在这里写处理方案
 * 如果最后确定在这里写的话再说吧
 * 现在只是保证数据能够获取到
 */

import { Notify } from 'vant';

function checkHttpStatus(res) {
    const checkResult = {
        next: false,
        type: 'warning',
        message: '未开始检查status',
    };
    const status = res.status;
    switch (true) {
        case status == 200:
            checkResult.next = true;
            checkResult.type = 'success';
            checkResult.message = '正确的http状态码';
            break;
        case status == 400:
            checkResult.next = false;
            checkResult.type = 'danger';
            checkResult.message = '错误的请求';
            break;
        // 需要进一步知道请求失败的原因
        case status == 401:
            checkResult.next = true;
            checkResult.type = 'warning';
            checkResult.message = '401';
            break;
        case status == 403:
            checkResult.next = false;
            checkResult.type = 'warning';
            checkResult.message = '没有权限';
            break;
        case status == 404:
            checkResult.next = false;
            checkResult.type = 'fail';
            checkResult.message = '404';
            break;
        case status >= 400 && status < 500:
            checkResult.next = true;
            checkResult.type = 'fail';
            checkResult.message = '请求错误';
            break;
        case status >= 500 && status <= 505:
            checkResult.next = false;
            checkResult.type = 'error';
            checkResult.message = '服务器错误';
            break;
        default:
            checkResult.next = false;
            checkResult.type = 'fail';
            checkResult.message = '其他问题';
    }
    if (!checkResult.next) {
        Notify(checkResult);
    }
    return checkResult;
}

function checkApiCode(code) {
    code;
}

export { checkHttpStatus, checkApiCode };
