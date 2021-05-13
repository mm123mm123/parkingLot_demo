import request from '@/plugins/axios'
import { api } from '@/config/api'

const module = {
  state: {

  },
  getters: {

  },
  mutations: {

  },
  actions: {
    // 催缴
    fetchGetUrgeList ({ commit }, params) {
      return request.post(api.parking.reminder.get_list, params).then(res => {
        let total = 0
        let list = []
        if (res.code === 1000 && res?.list?.length) {
          list = res.list
          total = +res.total
        }
        return { list, total }
      })
    },
    // 欠费
    fetchGetArrearsList ({ commit }, params) {
      return request.post(api.parking.reminder.get_consume_list, params).then(res => {
        let total = 0
        let list = []
        if (res.code === 1000 && res?.list?.length) {
          list = res.list
          total = +res.total
        }
        return { list, total }
      })
    },
  }
}

export default module
