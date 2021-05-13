
const module = {
  state: {
    types: [], // 厂商类型
  },
  getters: {
    getVenderTypes: state => () => state.types,
  },
  mutations: {
    // 销毁信息(退出登录后调用)
    destroyBaseVender (state) {
      state.types = []
    },
    commitSetVenderTypes (state, types) {
      state.types = types
    }
  },
  actions: {
    // 获取厂商类型
    fetchVenderTypes ({ commit }) {
      return request.post(api.vender.get_vender_types).then(res => {
        let list = []
        if (res.code === 1000) {
          list = res.list
        }
        commit('commitSetVenderTypes', list)
        return list
      })
    },
  }
}

export default module
