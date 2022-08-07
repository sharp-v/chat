// import store from ".."

const current = {
  state: () => ({
    // 用户本身的信息 这里还是key
    user: null,
    // 用户访问的对象(其他用户,群组)
    access: null,
    // 用户的安全配置
    security: null,
    // 用户的隐私设置
    privacy: null,
  }),
  getters: {

  },
  mutations: {
    setAccess(state, access) {
      state.access = access
    },
    user(state, user) {
      state.user = user
    }
  },
  actions: {
  }
}

export default current