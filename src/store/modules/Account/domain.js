import request from '@/plugins/axios'
import { api } from '@/config/api'
import { cloneDeep } from 'lodash'

// 查找树
const treeFind = (tree, func) => {
  for (const data of tree) {
    if (func(data)) return data
    if (data.children) {
      const res = treeFind(data.children, func)
      if (res) return res
    }
  }
  return null
}

const module = {
  state: {
    accountDomainTreeState: false,
    accountDomainTree: [],
  },
  getters: {
    /**
     * 获取用户域
     * 调用：this.$store.getters.getAccountDomainTree
     */
    getAccountDomainTree: state => () => (cloneDeep(state.accountDomainTree) || []),
    /**
     * 通过id获取用户域节点
     */
    getAccountDomainTreeById: state => id => treeFind(cloneDeep(state.accountDomainTree), item => item.id === id),

  },
  mutations: {
    // 销毁账号信息(退出登录后调用)
    destroyAccountDomain (state) {
      state.accountDomainTreeState = false
      state.accountDomainTree = []
    },
    /**
     * 设置用户域
     * @param {*} tree
     */
    commitSetAccountDomainTree (state, tree) {
      state.accountDomainTreeState = true
      state.accountDomainTree = tree
    },
  },
  actions: {
    /**
     * 按条件获取用户域树
     */
    fetchDomainTree ({ commit }, params) {
      return request.post(api.domain.tree, params).then(res => {
        let tree = []
        if (res.code === 1000) {
          tree = res.tree
        }
        return tree
      })
    },
    /**
     * 获取用户所有域树
     * @param {*} force 强制调用接口重新获取
     */
    fetchAccountDomainTree ({ state, dispatch, commit }, force) {
      const { accountDomainTreeState, accountDomainTree } = state
      if (accountDomainTreeState && !force) {
        return Promise.resolve(accountDomainTree)
      }
      return dispatch('fetchDomainTree').then(tree => {
        commit('commitSetAccountDomainTree', tree)
        return tree
      })
    },
    addAccountDomainTree ({ dispatch }, params) {
      return request.post(api.domain.add, params).then(res => {
        if (res.code === 1000) {
          dispatch('fetchAccountDomainTree', true)
        }
        return res
      })
    },
    modifyAccountDomainTree ({ dispatch }, params) {
      return request.post(api.domain.modify, params).then(res => {
        if (res.code === 1000) {
          dispatch('fetchAccountDomainTree', true)
        }
        return res
      })
    },
    removeAccountDomainTree ({ dispatch }, id) {
      return request.post(api.domain.remove, { id }).then(res => {
        if (res.code === 1000) {
          dispatch('fetchAccountDomainTree', true)
        }
        return res
      })
    },
    fetchAccountDomainTag ({ dispatch }, id) {
      return request.post(api.domain.get_tags, { id }).then(res => {
        let tags = []
        if (res.code === 1000) {
          tags = res.tags
        }
        return tags
      })
    },
    setAccountDomainTag ({ dispatch }, params) {
      return request.post(api.domain.set_tags, params)
    },

  }
}

export default module
