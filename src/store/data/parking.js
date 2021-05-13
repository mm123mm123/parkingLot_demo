import request from '@/plugins/axios'
import { api } from '@/config/api'
import { storageSet, storageGet, mapChangeOption, random } from '@/utils/utils'
import { cloneDeep } from 'lodash'

const data = {
  state: {
    PARKING_TYPE_MAP: new Map([
      [1, '地面停车场'],
      [2, '地下停车场'],
      [3, '混合停车场'],
    ]),
    PLATE_COLOR_MAP: new Map([ // 车牌颜色map
      [1, '蓝色'],
      [2, '黄色'],
      [3, '白色'],
      [4, '黑色'],
      [5, '绿色'],
    ]),
    PAY_CHANNEL_MAP: new Map([ // 付费方式map
      [1, '现金'],
      [2, '市民卡钱包'],
      [3, '支付宝'],
      [4, '微信'],
      [5, '银联'],
      [6, '市名卡账户'],
      [7, '建行龙支付'],
      [8, '招行'],
      [9, '杭州农业银行'],
      [10, 'ETC'],
    ]),
    PAY_TYPE_MAP: new Map([ // 付费场景map
      [101, '先离场后付费'],
      [102, '场内提前付费'],
      [103, '出入口付费'],
      [104, '欠费补缴'],
    ]),
    URGE_STATUS_MAP: new Map([ // 催缴map
      [0, '未催缴'],
      [1, '已催缴'],
      [2, '催缴中'],
    ]),
    REMINDER_CHANNEL_MAP: new Map([ // 催缴渠道
      [1, '短信'],
      [2, '线下'],
      [3, '电话'],
    ]),
    base_domain: null,
    base_domain_path: null,
    PARKING_MAP: new Map(),
    parkingList: [],

    parkingInfoVisible: false, // 大屏停车场详情弹窗
    currentParkingInfo: null, // 当前选中停车场详情
    indexInfoVisible: false, // 大屏指数详情弹窗
    indexList: [ // 指数列表
      { key: 'tczs', name: '停车指数', icon: 'icon-tingchezhishu', thresholds: [0.3, 0.8], value: 0, unit: '' },
      { key: 'bwzs', name: '泊位指数', icon: 'icon-bowei', thresholds: [0.3, 0.8], value: 0, unit: '' },
      { key: 'kxl', name: '实时空闲率', icon: 'icon-kongxian', thresholds: [30, 80], value: 0, unit: '%' },
      { key: 'cjl', name: '催缴率', icon: 'icon-cuijiao', thresholds: [30, 80], value: 0, unit: '%' },
      { key: 'txxl', name: '通行效率', icon: 'icon-tonghangxiaoshuai', thresholds: [30, 80], value: 0, unit: '%' },
    ],
    currentIndexData: null, // 当前选择index数据
  },
  getters: {
    plateformOption: (state, getters) => () => {
      let plateform = getters.getPlateFromList().map(x => {
        const item = {
          label: x.name,
          value: x.id
        }
        return item
      })
      return plateform
    },
    Domain_GFormOptions: (state, getters) => () => {
      let area = getters.getParkingDomainTreeByLevel('government', 4)
      let operator = getters.getParkingDomainTreeOptions('services')
      let plateform = getters.plateformOption()

      const options = {
        area,
        operator,
        plateform,
      }
      return options
    },
    getBaseDomain: state => () => state.base_domain,
    getBaseDomainPath: state => () => state.base_domain_path,
    getParkingMap: state => () => state.PARKING_MAP,
    getParkingOptions: state => () => mapChangeOption(state.PARKING_MAP),
    getParkingList: state => () => state.parkingList,

    getParkingIndexList: state => () => { // 获取停车场指数数据
      const handleIndexList = list => {
        return list.map(x => {
          const { value, thresholds } = x
          const [threshold1, threshold2] = thresholds
          let type
          if (value < threshold1) {
            type = 'danger'
          } else if (value >= threshold1 && value <= threshold2) {
            type = 'warning'
          } else {
            type = 'normal'
          }
          return { ...x, type }
        })
      }
      let indexList = state.indexList
      let data = handleIndexList(indexList)
      return data
    },
    getCurrentIndexData: state => key => key ? state.currentIndexData[key] : state.currentIndexData,
    getCurrentParkingInfo: state => key => key ? state.currentParkingInfo[key] : state.currentParkingInfo,

  },
  mutations: {
    commitSetBaseDomain: (state, { base_domain, base_domain_path }) => {
      state.base_domain = base_domain
      state.base_domain_path = base_domain_path
    },
    commitSetParkingMap: (state, map) => {
      state.PARKING_MAP = map
    },
    commitSetParkingList: (state, list) => {
      state.parkingList = list
    },

    // 大屏
    openParkingInfo: (state, info) => { // 打开停车场详情
      state.currentParkingInfo = info
      state.parkingInfoVisible = true
    },
    closeParkingInfo: state => { // 关闭停车场详情
      state.parkingInfoVisible = false
      state.currentParkingInfo = null
    },
    openIndexInfo: (state, key) => { // 打开指数详情
      state.currentIndexData = state.indexList.find(x => x.key === key)
      state.indexInfoVisible = true
    },
    closeIndexInfo: state => { // 关闭指数详情
      state.indexInfoVisible = false
      state.currentIndexData = null
    },

    commitSetindexList: (state, indexList) => {
      state.indexList = indexList
    },


  },
  actions: {
    // 获取用户角色、域
    fetchDomainAndRole: ({ commit, dispatch }) => {
      let promises = [
        dispatch('fetchSelfRoles'),
        dispatch('fetchParkingDomainsByTag', 'government'),
        dispatch('fetchParkingDomainsByTag', 'services'),
        dispatch('fetchParkingDomainsByTag', 'plateform'),
        dispatch('fetchGetAllPlateFrom'),
      ]
      return Promise.all(promises)
    },
    // 获取用户基础域
    fetchGetBaseDomain: ({ commit, dispatch, getters }, _role) => {
      return dispatch('fetchDomainAndRole').then(res => {
        let role = _role || getters.fetchSelfRoles().map(x => x.id).filter(x => getters.getParkingBaseRole().includes(x))

        let base_domain_info = role.map(x => getters.getBaseDomains(x)).flat()
        let base_domain = base_domain_info.map(x => x.id)
        let base_domain_path = base_domain_info.map(x => x.path)
        commit('commitSetBaseDomain', { base_domain, base_domain_path })

        return Promise.resolve({ base_domain, base_domain_path })
      })
    },
    // 获取所有停车场
    fetchGetAllParking: ({ commit, dispatch, getters }, _role) => {
      return dispatch('fetchGetBaseDomain', _role).then(async res => {
        let params = {
          page_no: 1,
          page_size: 9999,
          domain_id: [getters.getBaseDomainPath()],
          isvalid: 1,
        }
        const { list } = await dispatch('fetchGetParkList', params)
        const parkingMap = new Map()
        list.forEach(x => {
          parkingMap.set(x.sn, x.name)
        })
        commit('commitSetParkingMap', parkingMap)
        commit('commitSetParkingList', list)
        return list
      })
    },

    // 大屏-指数列表数据
    fetchGetIndexList: ({ state, commit }) => {
      let data = {
        tczs: random(1, 10) / 10,
        bwzs: random(1, 20) / 10,
        kxl: random(1, 100),
        cjl: random(1, 100),
        txxl: random(1, 100),
      }
      return new Promise(resolve => {
        const { indexList } = state
        let list = cloneDeep(indexList)
        list.forEach(x => {
          x.value = data[x.key]
        })
        setTimeout(() => {
          commit('commitSetindexList', list)
          resolve(list)
        }, 100)
      })

    }
  }
}

export default data
