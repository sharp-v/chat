import { HOST, NET_ERROR_MESSAGE } from '../../common/config';
import { checkHttpStatus } from '../../common/tool';
const PROTOCOL = 'http://';
const API = '/api';
const BASEURL = PROTOCOL + HOST + API;

import { Notify } from 'vant';
import { token_code } from '../../common/code';

function post(config, data) {
    return fetch(BASEURL + config.url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
        }),
    })
        .then((res) => {
            return checkHttpStatus(res).next ? res.json() : null;
        })
        .then((res) => {
            if (
                res.code.value > token_code.safe.value &&
                res.code.value <= token_code.max
            ) {
                Notify(res.code);
                return false;
            } else {
                return res;
            }
        })
        .catch(() => {
            Notify({ type: 'danger', message: NET_ERROR_MESSAGE });
        });
}

function get(config, data) {
    return fetch(BASEURL + config.url + '/' + data, {
        method: 'get',
        headers: new Headers({
            token: localStorage.getItem('token'),
        }),
    })
        .then((res) => {
            return checkHttpStatus(res).next ? res.json() : null;
        })
        .then((res) => {
            if (
                res.code.value > token_code.safe.value &&
                res.code.value <= token_code.max
            ) {
                Notify(res.code);
                return false;
            } else {
                return res;
            }
        })
        .catch(() => {
            Notify({ type: 'danger', message: NET_ERROR_MESSAGE });
        });
}

function postFile(config, fileData) {
    return fetch(BASEURL + config.url, {
        method: 'post',
        body: fileData,
        headers: new Headers({
            token: localStorage.getItem('token'),
        }),
    })
        .then((res) => {
            return checkHttpStatus(res).next ? res.json() : null;
        })
        .then((res) => {
            if (
                res.code.value > token_code.safe.value &&
                res.code.value <= token_code.max
            ) {
                Notify(res.code);
                return false;
            } else {
                return res;
            }
        })
        .catch(() => {
            Notify({ type: 'danger', message: NET_ERROR_MESSAGE });
        });
}

export { BASEURL, post, get, postFile };
