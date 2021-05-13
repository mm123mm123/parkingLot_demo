import axios from 'axios'
import store from '../store/index'
import config from '@/config'
import {storageSet, storageGet} from '@/utils/utils'
import Router from '@/router'
import {Message} from 'element-ui'

const {requestBody} = config
const codeMessage = {
    1000: '成功',
    1001: '插入重复数据',
    1002: '外键冲突',
    1100: '尚未登录',
    1101: '没有权限',
    1102: '登录失败，用户名或密码错误',
    1103: '用户被锁定',
    1110: '内部错误',
    1111: '数据库访问错误',
    1112: '服务访问错误',
    1113: 'API参数错误',
    1114: '资源未找到',
    1115: '接口已废弃'
}

const getConfigData = () => {
    let configData = storageGet('configData')
    if (configData) {
        return configData
    }
    const env = process.env.NODE_ENV
    const configPath = env === 'production' ? './config.json' : '/config.json'
    return axios.get(configPath).then(res => {
        let data = {}
        if (res.status === 200) {
            data = res.data
        }
        return data
    })
}

const request = axios.create()
request.defaults.timeout = 30000

const setBaseURL = async () => {
    let configData = await getConfigData()
    store.commit('commitSetConfig', configData)

    const {BASE_URL, BASE_PORT, BASE_ASSETS_URL, BASE_ASSETS_PORT} = configData

    const domin = `${BASE_URL}:${BASE_PORT}/`
    const baseUrl = `${domin}api/`
    const fileUrl = `${BASE_ASSETS_URL}:${BASE_ASSETS_PORT}/images/`
    const uploadUrl = `${domin}upload`

    request.defaults.baseURL = baseUrl
}
setBaseURL()

let timer
let flag = true

request.interceptors.request.use(
    config => {
        // store.commit('setLoading', true)
        const token = store.getters.getToken

        config.data = {
            ...requestBody,
            ...config.data,
            access_token: token
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    config => {
        // store.commit('setLoading', false)
        const code = config.data.code
        const msg = codeMessage[code] || config.data.msg
        if (code === 1100 || code === 1103) {
            store.commit('commitSetToken', '')
            store.commit('commitSetSelfInfo', {})
            store.commit('commitSetTokenTimeout', Date.now())

            if (flag) {
                // if (![ 'login', 'account.self.logout'].includes(config.data.api)) {
                if (!['login'].includes(config.data.api)) {
                    Router.push('/login')
                    Message.error(`登录超时`)
                }
                flag = false
            }
            timer = setTimeout(() => {
                flag = true
            }, 1000)
        }
        config.data.msg = msg
        store.commit('commitSetTokenTimeout')
        return config.data
    },
    error => {
        // return Promise.reject(error)
        return Promise.resolve(error)
    }
)

export default request
