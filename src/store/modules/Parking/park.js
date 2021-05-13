import request from '@/plugins/axios'
import { api } from '@/config/api'

const module = {
  state: {
    parkFreeAndCarNum: {
      free: 0,
      car_num: 0
    },
  },
  getters: {
    getParkFreeAndCarNum: state => key => key ? state.parkFreeAndCarNum[key] : state.parkFreeAndCarNum,
  },
  mutations: {
    setParkFreeAndCarNum (state, data) {
      state.parkFreeAndCarNum = data
    }
  },
  actions: {
    fetchGetParkAll ({ commit }, tag) {
      return request.post(api.parking.park.get_all, { tag }).then(res => {
      })
    },
    fetchGetParkList ({ commit }, params) {
      return request.post(api.parking.park.get_list, params).then(res => {
        let list = [], total = 0
        if (res.code === 1000 && res?.list?.length) {
          list = res.list
          total = +res.total
        }
        return { list, total }
      })
    },
    fetchGetParkStatistics ({ commit }, params) {
      return request.post(api.parking.park.statistics, params).then(res => {
        if (res.code === 1000) {
          return res
        }
      })
    },
    // 余位&在场车辆
    fetchGetParkFreeAndCarNum ({ commit, getters }) {
      const params = {
        domain_id: [
          getters.getBaseDomainPath()
        ]
      }
      return request.post(api.parking.park.get_free, params).then(res => {
        let free = 0
        let car_num = 0
        if (res.code === 1000) {
          free = +res.free
          car_num = +res.car_num
        }
        commit('setParkFreeAndCarNum', { free, car_num })
        return { free, car_num }
      })
    },
  }
}

export default module
