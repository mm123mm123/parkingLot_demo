
const module = {
  state: {

  },
  getters: {

  },
  mutations: {
    // 销毁信息(退出登录后调用)
    destroyParkingServices (state) {
    },
  },
  actions: {
    addServiceGroup ({ dispatch }, params) {
      return dispatch('addAccountDomainTree', params).then(res => {
        if (res.code === 1000) {
          dispatch('fetchParkingDomainsByTag', 'services')
        }
        return res
      })
    },
    modifyServiceGroup ({ dispatch }, params) {
      return dispatch('modifyAccountDomainTree', params).then(res => {
        if (res.code === 1000) {
          dispatch('fetchParkingDomainsByTag', 'services')
        }
        return res
      })
    },
    removeServiceGroup ({ dispatch }, id) {
      return dispatch('removeAccountDomainTree', id).then(res => {
        if (res.code === 1000) {
          dispatch('fetchParkingDomainsByTag', 'services')
        }
        return res
      })
    },
  }
}

export default module
