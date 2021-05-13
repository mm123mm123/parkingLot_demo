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
    fetchGetPassList ({ commit }, params) {
      return request.post(api.parking.pass.get_list, params).then(res => {
        let list = [], total = 0
        if (res.code === 1000 && res?.list?.length) {
          list = res.list
          total = +res.total
        }
        return { list, total }
      })
    },
    fetchGetPassStatistics ({ getters }, { startTime, endTime }) {
      let params = {
        domain_id: [getters.getBaseDomainPath()],
        startTime,
        endTime,
      }
      return request.post(api.parking.pass.statistics, params).then(res => {
        let data = {}
        if (res.code === 1000) {
          data = res
        }
        return data
      })
    },
    fetchGetPassStatisticsDay ({ getters }, { startTime, endTime }) {
      let params = {
        domain_id: [getters.getBaseDomainPath()],
        startTime,
        endTime,
      }
      return request.post(api.parking.pass.statistics_day, params).then(res => {
        let list = []
        if (res.code === 1000 && res?.list?.length) {
          list = res.list
        }
        return list
      })
    },
    fetchGetCarInSite ({ commit }, params) { // 获取场内车辆
      return request.post(api.parking.pass.get_parking_car, params).then(res => {
        let list = [], total = 0
        if (res.code === 1000 && res?.list?.length) {
          list = res.list
          total = +res.total
        }
        return { list, total }
      })
    },
    fetchGetCarInSiteStatistics ({ commit }, params) { // 场内车辆统计
      return request.post(api.parking.pass.parking_data, params).then(res => {
        let data = {}
        if (res.code === 1000) {
          data = res
        }
        return data
      })
    },
    // 获取图片
    fetchGetMinioUrl ({ commit }, url) {
      return request.post(api.parking.pass.get_minio_url, { url }).then(res => {
        let url
        if (res.code === 1000) {
          url = res.url
        }
        return url
      })
    },
  }
}

export default module
