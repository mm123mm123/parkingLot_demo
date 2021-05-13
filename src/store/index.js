import Vue from 'vue'
import Vuex from 'vuex'

import config from './modules/config' // 项目配置信息

import bigScreen from './modules/bigScreen' // 大屏配置

import token from './modules/token' // token

import {vender} from './modules/Bizbase/index' // 基础模块
import {self, domain, user, role, template} from './modules/Account/index' // 账号模块
import {sensor} from './modules/Sensor/index' // 传感器模块

import {
    parkingDomain,
    parkingServices,
    parkingPlateform,
    parkingPark,
    parkingPass,
    parkingReminder
} from './modules/Parking/index' // 停车场模块

import parkingData from './data/parking' // 停车场


Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        // 基础配置
        config,
        bigScreen,
        token,

        // 基础模块
        vender,

        // 用户模块
        self, domain, user, role, template,

        // 传感器模块
        sensor,

        // 停车场模块
        parkingDomain, parkingServices, parkingPlateform, parkingPark, parkingPass, parkingReminder,

        // 拓展数据
        parkingData,
    }
})
