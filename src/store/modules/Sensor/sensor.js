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
    fetchSensorList ({ commit }, params) {
      return request.post(api.sensor.get_list, params).then(res => {
        let list = [], total = 0
        if (res.code === 1000 && res?.list?.length) {
          list = res.list
          total = +res.total
        }
        return { list, total }
      })
    },
    fetchSensorDomains ({ commit }, id) {
      return request.post(api.sensor.get_domains, { id }).then(res => {
        let domains = []
        if (res.code = 1000) {
          domains = res.domains
        }
        return domains
      })
    },
    setSensorDomains ({ dispatch }, { id, newDomains }) {
      return dispatch('fetchSensorDomains', id).then(res => {
        let oldDomains = res.map(x => x.id)
        let domains = [
          ...oldDomains.filter(x => !newDomains.map(y => y.id).includes(x)).map(id => ({ id, enabled: true })),
          ...newDomains
        ]
        return request.post(api.sensor.set_domains, { id, domains })
      })
    }
  }
}

export default module
