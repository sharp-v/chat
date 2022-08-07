import { GROUP_TYPE, USER_TYPE, HTTP_HOST } from "../../common/config";
import { queryByGroupId, queryByUserId } from "../../service/http/query/index";
import { query } from "../../service/http/account/index";

HTTP_HOST;
/**
 * 默认头像图片
 */
const DEFAULT_AVATAR = require("assets/default/avatar.jpg");
/**
 * 默认背景图片
 * */
const DEFAULT_BACK_IMAGE = require("assets/default/background.jpg");

import store from "../index";
const profile = {
  state: () => ({
    map: new Map(),
  }),
  getters: {
    getProfile: (state) => (key) => {
      if (!key) return null;
      return state.map.get(key);
    },
    getAvatar: (state) => (key) => {
      const profile = state.map.get(key);
      return profile && profile.avatar ? profile.avatar : DEFAULT_AVATAR;
    },
    getBackImage: (state) => (key) => {
      const profile = state.map.get(key);
      return profile && profile.backImage
        ? profile.backImage
        : DEFAULT_BACK_IMAGE;
    },
  },
  mutations: {
    profile(state, payload) {
      state.map.set(payload.key, payload.profile);
    },
  },
  actions: {
    // 初始化relation的profile
    initProfile({ commit }, key) {
      
      if (!key || store.state.profile.map.get(key)) return;
      const { type, id } = JSON.parse(key);
      if (type == GROUP_TYPE) {
        queryByGroupId(id).then((res) => {
          res.data && commit("profile", { key, profile: res.data });
        });
      } else {
        queryByUserId(id).then((res) => {
          res.data && commit("profile", { key, profile: res.data });
        });
      }
    },
    initUserProfile({ commit }, force) {
      if (!store.state.current.profile || force) {
        query().then((profile) => {
          if (profile) {
            const key = JSON.stringify({ id: profile.id, type: USER_TYPE });
            commit("profile", { key, profile });
            store.commit("user", key);
          }
        });
      }
    },
  },
};

export default profile;
