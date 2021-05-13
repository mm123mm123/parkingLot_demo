import request from '@/plugins/axios'
import { api } from '@/config/api'
import { storageSet, storageGet, copyObj } from '@/utils/utils'
import { Message } from 'element-ui'
import { cloneDeep } from 'lodash'

const module = {
  state: {
    tableLoading: false,
    roleList: [], // 角色列表
    templateList: [], // 角色模板列表
    venderTypes: [], // 厂商类型
    venderList: [], // 厂商列表
    function_group_tree: [], // 功能组树
    funcsList: [], // 功能列表
    roleTree: storageGet('role') || [],
  },
  getters: {
    getRoleTableLoading: state => () => state.tableLoading,
    getRoleList: state => () => state.roleList,
    getRoleTemplateList: state => () => state.templateList,
    getRoleVenderTypes: state => () => state.venderTypes,
    getRoleVenderList: state => () => state.venderList,
    // 获取功能组树
    getFunGroupTree: state => () => state.function_group_tree,
    getFuncsList: state => () => state.funcsList,
  },
  mutations: {
    // 销毁角色信息(退出登录后调用)
    destroyAccountRole (state) {
      state.roleList = []
      state.templateList = []
      state.function_group_tree = []
      state.venderTypes = []
      state.venderList = []
      state.funcsList = []
    },
    // 设置loading
    commitSetRoleTableLoading (state, value) {
      state.tableLoading = value
    },
    // 设置角色列表
    commitSetRoleList (state, list) {
      state.roleList = list
    },
    // 设置角色模板列表
    commitSetRoleTemplateList (state, list) {
      state.templateList = list
    },
    // 设置厂商类型
    commitSetRoleVenderTypes (state, types) {
      state.venderTypes = types
    },
    // 设置厂商列表
    commitSetRoleVenderList (state, list) {
      state.venderList = list
    },
    // 设置功能组树
    commitSetRoleFunGroupTree (state, tree) {
      state.function_group_tree = tree
    },
    // 设置功能列表
    commitSetRoleFuncsList (state, list) {
      state.funcsList = list
    }
  },
  actions: {
    // 获取角色列表
    fetchRoleList ({ commit }, data) {
      commit('commitSetRoleTableLoading', true)
      let params = {}
      copyObj(params, data)
      return request.post(api.role.get_list, params).then(res => {
        let list = []
        if (res.code === 1000) {
          list = res.list
        }
        commit('commitSetRoleList', list)
        commit('commitSetRoleTableLoading', false)
        return list
      })
    },
    // 添加角色
    addRole ({ dispatch }, params) {
      return request.post(api.role.add, params).then(res => {
        if (res.code === 1000) {
          Message.success(`添加成功`)
          dispatch('fetchRoleList')
        } else {
          Message.info(`添加失败`)
        }
        return res
      })
    },
    // 修改角色
    modifyRole ({ dispatch }, data) {
      return request.post(api.role.modify, data).then(res => {
        if (res.code === 1000) {
          Message.success(`修改成功`)
          dispatch('fetchRoleList')
        } else {
          Message.info(`修改失败`)
        }
        return res
      })
    },
    // 删除角色
    removeRole ({ dispatch }, role_id) {
      return request.post(api.role.remove, { role_id }).then(res => {
        if (res.code === 1000) {
          Message.success(`删除成功`)
          dispatch('fetchRoleList')
        } else {
          Message.info(`删除失败`)
        }
        return res
      })
    },
    // 获取角色模板列表
    fetchRoleTemplateList ({ commit }) {
      return request.post(api.role.get_template_list).then(res => {
        let list = []
        if (res.code === 1000) {
          list = res.list
        }
        commit('commitSetRoleTemplateList', list)
        return list
      })
    },
    // 获取厂商类型
    fetchRoleVenderTypes ({ commit }) {
      return request.post(api.role.get_vender_types).then(res => {
        let list = []
        if (res.code === 1000) {
          list = res.list
        }
        commit('commitSetRoleVenderTypes', list)
        return list
      })
    },
    // 获取角色厂商
    fetchRoleVender ({ commit }, { role_id, type_id }) {
      return request.post(api.role.get_venders, { role_id, type_id }).then(res => {
        let list = []
        if (res.code === 1000) {
          list = res.list
        }
        commit('commitSetRoleVenderList', list)
        return list
      })
    },
    // 设置角色厂商
    setRoleVender ({ commit }, { role_id, venders }) {
      return request.post(api.role.set_venders, { role_id, venders })
    },
    // 获取角色功能组树
    fetchRoleFunGroupTree ({ commit }) {
      return request.post(api.role.get_function_group_tree, {}).then(res => {
        if (res.code === 1000) {
          commit('commitSetRoleFunGroupTree', res.tree)
          return res.tree
        }
      })
    },
    // 获取子权限
    fetchRoleFuncs ({ state, commit, dispatch }, { group_id, role_id }) {
      return request.post(api.role.get_funcs, { group_id, role_id }).then(res => {
        let list = []
        if (res.code === 1000) {
          list = res.funcs
        }
        commit('commitSetRoleFuncsList', list)
        return list
      })
    },
    // 设置权限
    setRoleFuncs ({ commit }, { role_id, funcs }) {
      return request.post(api.role.set_funcs, { role_id, funcs })
    },

    setRoleTree ({ state, dispatch }, { list, id }) {
      state.roleTree = list
      state.funcsList = []
      let funcs = []
      list.forEach(item => {
        if (item.children.length) {
          let roleList = []
          item.children.forEach(x => {
            // console.log(x)
            let params = {
              role_id: id,
              group_id: x.id
            }
            // 获取子权限列表
            dispatch('getRoleItem', params).then(res => {
              let fun = JSON.parse(JSON.stringify(res))
              x.children = fun
              fun.forEach(y => {
                funcs.push(y.id)
              })
              state.funcsList = funcs
              storageSet('roleList', state.funcsList)
            })
          })
        }
      })
      state.roleTree = list
      storageSet('role', state.roleTree)
    }
  }
}

export default module
