import { GROUP_TYPE, RELATION, USER_TYPE } from '../../common/config';
import { queryAll } from '../../service/http/query/index';
import { update } from '../../service/http/relation';

import store from '../index';
/**
 * 这里只记录与当前用户关系的数据
 * 如与好友的关系,与群组的关系,
 */
const relation = {
    state: () => ({
        map: new Map(),
    }),
    getters: {
        getRelation: (state) => (key) => {
            return state.map.get(key);
        },
    },
    mutations: {
        initRelation(state, payload) {
            state.map = payload;
        },
        setRelation(state, payload) {
            let key = payload.key;
            state.map.set(key, payload.relation);
        },
    },
    actions: {
        initRelation({ commit }, force) {
            if (store.state.relation.map.size == 0 || force)
                queryAll().then((res) => {
                    const relation = new Map();
                    res.data &&
                        res.data.map((item) => {
                            const key = JSON.stringify({
                                id: item.contactId,
                                type:
                                    item.type <= RELATION.TYPE.FRIEND
                                        ? USER_TYPE
                                        : GROUP_TYPE,
                            });
                            store.dispatch('initProfile', key);
                            relation.set(key, item);
                        });
                    commit('initRelation', relation);
                });
        },
        setRelation({ commit }, payload) {
            const relation = payload.relation;
            update(relation).then((flag) => {
                if (flag) {
                    commit('setRelation', payload);
                }
            });
        },
    },
};

export default relation;
