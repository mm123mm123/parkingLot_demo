import request from '@/plugins/axios'
import { api } from '@/config/api'
import { cloneDeep } from 'lodash'

const module = {
  state: {
    domainTree: {},
    base_domains: {},
    baseRole: ['government', 'services', 'plateform']

  },
  getters: {
    /**
     * 获取基础角色
     */
    getParkingBaseRole: state => () => state.baseRole,
    /**
     * 获取用户域树
     * this.$store.getters.getParkingDomainTree
     */
    getParkingDomainTree: state => tag => { 
      return (tag ? state.domainTree[tag] : state.domainTree) || []
    },
    /**
     * 按标签获取用户域树
     * this.$store.getters.getParkingDomainTreeOptions(tag)
     */
    getParkingDomainTreeOptions: state => tag => {
      let list = state.domainTree[tag]
      const filterList = (list) => {
        return list.map(item => {
          if (!item) {
            return {
              label: '暂无',
              disabled: true
            }
          }
          let children = item.children && item.children.length ? filterList(item.children) : null
          let disabled = false
          return {
            label: item.name,
            value: item.id,
            children,
            disabled
          }
        })
      }
      if (list) {
        return filterList(cloneDeep(list))
      } else {
        return []
      }
    },
    /**
     * 按等级获取域树options
     * this.$store.getters.getParkingDomainTreeByLevel(tag, level)
     */
    getParkingDomainTreeByLevel: state => (tag, level) => {
      let list = state.domainTree[tag]
      const getLevel = path => {
        path = path.replace(/^\./, '').replace(/\.$/, '')
        if (!path) return 0
        return path.split('.').length
      }
      const filterList = (list) => {
        return list.map(item => {
          if (!item) return
          let children = item.children && item.children.length ? filterList(item.children) : null
          let disabled = false
          if (getLevel(item.path) < level) {
            disabled = true
          }
          return {
            path: item.path,
            label: item.name,
            value: item.id,
            children,
            disabled
          }
        })
      }
      if (list) {
        return filterList(cloneDeep(list))
      } else {
        return []
      }
    },
    /**
     * 获取账号基本域
     * this.$store.getters.getBaseDomains(tag)
     */
    getBaseDomains: state => tag => {
      if (tag) {
        return state.base_domains[tag]
      }
      return state.base_domains
    },
    getDomainDataById: (state, getters) => (id, key, tag) => { // 根据tag域节点id 获取节点某个key的值
      let getValue = list => {
        for (const item of list) {
          if (item.id === id) return item[key]
          if (item?.children?.length) getValue(item.children)
        }
      }

      let list
      if (getters.getParkingBaseRole().includes(tag)) {
        list = getters.getParkingDomainTree(tag)
      } else {
        list = Object.values(getters.getParkingDomainTree()).flat()
      }
      return getValue(list) || id
    },
  },
  mutations: {
    // 销毁信息(退出登录后调用)
    destroyParkingDomains (state) {
      state.domainTree = {}
      state.base_domains = {}
    },
    commitSetParkingDomains (state, { tag, list }) {
      let domainTree = cloneDeep(list)
      state.domainTree[tag] = domainTree
      let base_domains = domainTree.map(x => {
        const { name, id, path } = x
        return { name, id, path }
      })
      state.base_domains[tag] = base_domains
    }
  },
  actions: {

    // 按域标签获取用户域树
    fetchParkingDomainsByTag ({ commit }, tag) {
      return request.post(api.parking.domain.get_tree, { tag }).then(res => {
        let list = []
        if (res.code === 1000) {
          list = res.tree
        }
        commit('commitSetParkingDomains', { tag, list })
        return list
      })
    },
  }
}

export default module
