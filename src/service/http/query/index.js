import { GROUP_TYPE, USER_TYPE } from '../../../common/config';
import store from '../../../store';
import { get, post } from '../http-config';
// import { code } from 'common/code'

function url(childRoute) {
    return '/query' + childRoute;
}

function queryByAccount(account) {
    return get(
        {
            url: url('/account'),
        },
        account,
    );
}

function queryByGroupId(groupId) {
    return get(
        {
            url: url('/groupId'),
        },
        groupId,
    );
}

function queryAll() {
    return post(
        {
            url: url('/all'),
        },
        {},
    ).then((res) => {
        return res;
    });
}

function queryByUserId(id) {
    return post(
        {
            url: url('/id'),
        },
        { id },
    );
}

function queryByKeyWord(keyWord) {
    return post(
        {
            url: url('/key-word'),
        },
        { keyWord },
    ).then((res) => {
        res.data.groups.map((item) => {
            const key = JSON.stringify({ id: item.id, type: GROUP_TYPE });
            store.commit('profile', { key, profile: item });
        });
        res.data.users.map((item) => {
            const key = JSON.stringify({ id: item.id, type: USER_TYPE });
            store.commit('profile', { key, profile: item });
        });
        return res.data;
    });
}

export {
    queryAll,
    queryByAccount,
    queryByGroupId,
    queryByUserId,
    queryByKeyWord,
};
