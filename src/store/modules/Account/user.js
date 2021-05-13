import request from '@/plugins/axios'
import { api } from '@/config/api'

const module = {
  state: {
    userPermissionList: [],
  },
  getters: {
    noPermission: (state) => (api) => !state.userPermissionList.includes(api),
    hasPermission: state => api => state.userPermissionList.includes(api),

  },
  mutations: {
    // 销毁用户权限(退出登录后调用)
    destroyAccountPermission (state) {
      state.userPermissionList = []
    },
    // 设置用户权限树
    commitSetUserPermission (state, data) {
      state.userPermissionList = data.map(item => item.api)
    },
  },
  actions: {
    // 获取用户权限树
    fetchUserPermissionTree ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request.post(api.user.getUserPermissionTree, {}).then(res => {
          if (res.code === 1000) {
            commit('commitSetUserPermission', res.funcs)
            resolve(res.funcs)
          }
        })
      })
    },
  }
}

export default module
