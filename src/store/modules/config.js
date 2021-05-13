import axios from 'axios'
import request from '@/plugins/axios'
import {api} from '@/config/api'
import config from '@/config'
import {storageSet, storageGet} from '@/utils/utils'
import {Message} from 'element-ui'
import Router from '@/router'
import {customSort} from '@/utils/utils.js'

const {tokenTimeout} = config
const userInfo = {
    state: {
        configData: storageGet('configData') || {},
        loginConfigData: storageGet('loginConfigData') || {},        //storageGet是从sessionStorage里面获取对应数据
        sliderList: [],
        firstShow: '',
        showSliderList: [],
    },
    getters: {
        getConfigData: state => key => {
            const configData = (state.configData || storageGet('configData'))
            if (key) {
                return configData[key]
            }
            return configData
        },
        getFirstShow: state => state.firstShow,
        getShowSliderList: state => state.showSliderList,
        getBaseUrl: state => key => {
            const {BASE_URL, BASE_PORT, BASE_ASSETS_URL, BASE_ASSETS_PORT} = state.configData
            const domin = `${BASE_URL}:${BASE_PORT}`
            const baseUrl = `${domin}/api`
            const data = {domin, baseUrl}
            return data[key]
        }
    },
    mutations: {
        commitSetConfig(state, config) {
            state.configData = config
            storageSet('configData', config)

            const {bannerShow} = config

            const {sliderList, firstShow} = bannerShow
            state.sliderList = sliderList
            state.firstShow = firstShow
        },
        commitSetLoginData(state, config) {

            state.loginConfigData = config
            storageSet('loginConfigData', config)
            const {sliderList} = state

            let showSliderList = sliderList.map(x => {
                const {name: dataName, color, recommend} = x
                let item = config.find(x => x.dataName === dataName)
                color !== undefined && (item.color = color)
                recommend !== undefined && (item.recommend = recommend)
                return item
            })

            state.showSliderList = showSliderList
        },
    },
    actions: {
        getConfigData({commit}) {
            const env = process.env.NODE_ENV
            const configPath = env === 'production' ? './config.json' : '/config.json'
            return axios.get(configPath).then(res => {
                let data = {}
                if (res.status === 200) {
                    data = res.data
                }
                commit('commitSetConfig', data)
                return data
            })
        },
        getLoginConfigData({commit}) {
            const env = process.env.NODE_ENV
            const configPath = env === 'production' ? './loginConfig.json' : '/loginConfig.json'
            return axios.get(configPath).then(res => {
                let data = {}
                if (res.status === 200) {
                    data = res.data
                }
                commit('commitSetLoginData', data)
                return data
            })
        },
    }
}

export default userInfo
