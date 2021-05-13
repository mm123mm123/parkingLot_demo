import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { api } from './config/api'
import axios from './plugins/axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import * as _ from 'lodash'

import * as utils from './utils/utils'

import * as echarts from 'echarts'
import 'echarts-gl'

import QRCode from 'qrcodejs2' // 二维码

import registerGlobalComponents from './components/index.js'

import BaiduMap from 'vue-baidu-map'

Vue.prototype.$QRCode = QRCode

registerGlobalComponents(Vue) // 全局注册组件

// 过滤器
import { FilterFun } from './filters/index'

const filterFun = new FilterFun()
filterFun.funs.forEach((v, k) => {
  Vue.filter(k, v)
})

Vue.use(ElementUI)
Vue.use(ViewUI)

Vue.config.productionTip = false

Vue.prototype.$https = axios
Vue.prototype.$api = api
Vue.prototype.$utils = utils
Vue.prototype._ = _

Vue.prototype.$echarts = echarts

Vue.use(BaiduMap, {
  // ak: 'Pg4MpuHusnTbjoz1L0vbE4HQGb1UO7k9'
  ak: 'Oj7TeNUGf0RiEPI1sll1MkonXLOPxNSp'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
