import request from '@/plugins/axios'
import { api } from '@/config/api'
import { storageSet, storageGet } from '@/utils/utils'
import Router from '@/router'

const module = {
  state: {
    selfRoles: [],
    selfInfo: {}
  },
  getters: {
    // 获取当前用户角色
    fetchSelfRoles: state => () => state.selfRoles,
    /**
     * 获取用户信息
     * 调用：this.$store.getters.getSelfInfo
     */
    getSelfInfo: state => (state.selfInfo || {}),
  },
  mutations: {
    // 销毁信息(退出登录后调用)
    destroySelf (state) {
      state.selfRoles = []
      state.selfInfo =  {}
    },
    // 设置用户角色
    commitSetSelfRole (state, data) {
      state.selfRoles = data
    },
    // 获取用户信息
    commitSetSelfInfo (state, data) {
      state.selfInfo = data
      storageSet('_user', data)
    },
  },
  actions: {
    // 登出
    loginOut ({ commit }) {
      return request.post(api.self.logout).then(res => {
        if (res.code === 1000) {
          commit('commitSetToken', '')
          commit('commitSetSelfInfo', {})
          commit('commitSetTokenTimeout', Date.now())

          // 销毁账号信息
          commit('destroySelf') // 用户信息
          commit('destroyTemplate') // 模板
          commit('destroyAccountDomain') // 用户域
          commit('destroyAccountPermission') // 权限
          commit('destroyAccountRole') // 角色
          commit('destroyBaseVender') // 厂商

          commit('destroyParkingDomains') // 停车-域
          commit('destroyParkingPlateFrom') // 停车-平台
          commit('destroyParkingServices') // 停车-运营商

          Router.push('/login')
        }
        return res
      })
    },
    // 获取用户角色
    fetchSelfRoles ({ commit, dispatch }, data) {
      return request.post(api.self.get_roles, {}).then(res => {
        let data = []
        if (res.code === 1000) {
          data = res.roles
          commit('commitSetSelfRole', data)
        }
        return data
      })
    },
    // 获取用户信息
    fetchSelfInfo ({ commit }, data) {
      return request.post(api.self.get_info, {}).then(res => {
        let data = {}
        if (res.code === 1000) {
          data = res.info
          commit('commitSetSelfInfo', data)
        }
        return data
      })
    },
  }
}

export default module
