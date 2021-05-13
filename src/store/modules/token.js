import request from '@/plugins/axios'
import { api } from '@/config/api'
import config from '@/config'
import { storageSet, storageGet } from '@/utils/utils'
import { Message } from 'element-ui'

const { tokenTimeout } = config

const module = {
  state: {
    token: storageGet('_token') || '',
    tokenTimeoutTs: storageGet('_tokenTimeout') || +new Date(),
  },
  getters: {
    /**
     * 获取token
     * 调用：this.$store.getters.getToken
     */
    getToken: state => (state.token || storageGet('_token')),
    /**
     * 获取tokenTimeoutTs
     * 调用：this.$store.getters.getTokenTimeoutTs
     */
    getTokenTimeoutTs: state => (state.tokenTimeoutTs || storageGet('_tokenTimeoutTs')),
    /**
     * 检查token是否失效
     * this.$store.getters.checkToken()
     */
    checkToken: (state, getters) => {
      return (getters.getToken && getters.getTokenTimeoutTs > Date.now())
    },
  },
  mutations: {
    /**
     * 设置token
     * @param {*} token
     */
    commitSetToken (state, token) {
      state.token = token
      storageSet('_token', token)
    },
    /**
     * 重置token失效时间
     */
    commitSetTokenTimeout (state, date) {
      const tokenTimeoutTs = date ? +new Date() : +new Date() + tokenTimeout
      state.tokenTimeoutTs = tokenTimeoutTs
      storageSet('_tokenTimeout', tokenTimeoutTs)
    },
  },
  actions: {
    // 登录
    login ({ commit, dispatch }, { user, pass }) {
      return request.post(api.login, {
        user, pass
      }).then(res => {
        if (res.code === 1000) {
          const token = res.access_token
          commit('commitSetToken', token)
          commit('commitSetTokenTimeout')
        } else {
          Message.error(`${res.msg}`)
        }
        return res
      })
    },

  }
}

export default module
