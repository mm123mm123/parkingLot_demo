import request from '@/plugins/axios'
import { api } from '@/config/api'

const module = {
  state: {
    plateFromList: [],
  },
  getters: {
    getPlateFromList: state => () => state.plateFromList,
  },
  mutations: {
    // 销毁信息(退出登录后调用)
    destroyParkingPlateFrom (state) {
      state.plateFromList = []
    },
    setPlateFrom (state, list) {
      state.plateFromList = list
    },
  },
  actions: {
    fetchGetAllPlateFrom ({ commit }, { tag = 'plateform', page_no = 1, page_size = 9999 } = {}) {
      return request.post(api.parking.plateform.get_list, { tag, page_no, page_size }).then(res => {
        let list = []
        if (res.code === 1000 && res?.list?.length) {
          list = res.list
        }
        commit('setPlateFrom', list)
      })
    },
  }
}

export default module
