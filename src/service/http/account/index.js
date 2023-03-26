import { Notify } from 'vant';
import { code } from '../../../common/code';
import { post } from '../http-config';

function url(childRoute) {
    return '/account' + childRoute;
}

function query() {
    return post({
        url: url('/query'),
    }).then((res) => {
        if (res.code.value == code.account.query.success.value) {
            return res.data;
        } else {
            Notify(res.code);
        }
    });
}

function update(user) {
    return post(
        {
            url: url('/update'),
        },
        user,
    ).then((res) => {
        Notify(res.code);
        if (res.code.value == code.account.update.success.value) {
            return true;
        } else {
            return false;
        }
    });
}

export { query, update };
