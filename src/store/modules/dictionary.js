import request from '@/plugins/axios'
import { api } from '@/config/api'
import { storageSet } from '@/utils/utils'
const dictionary = {
  state: {
    dictionaryTypeList: [],
    dictionaryList: [],
    dictionaryType: {},
    dictionary: {},
    dictionary_code: {}
  },
  getters: {
    // 通过字典id获取字典名
    // 调用：this.$store.getters.getDicById(id);
    getDicById: (state) => (id) => {
      return (state.dictionary && state.dictionary[id]) || id
    },
    // 通过字典类型获取字典内容
    // 调用：this.$store.getters.getDicInfoByCode(type_code)
    getDicInfoByCode: (state) => (code) => {
      return state.dictionaryType[code]
    },
    // 通过字典dic_code获取字典id
    // 调用：this.$store.getters.getDicIdByCode(dic_code)
    getDicIdByCode: (state) => (dic_code) => {
      return (state.dictionary_code && state.dictionary_code[dic_code]) || dic_code
    },
    // 通过字典id获取字典dic_code
    // 调用：this.$store.getters.getDicCodeById(id)
    getDicCodeById: (state) => (id) => {
      return Object.keys(state.dictionary_code).find(x => state.dictionary_code[x] === id)
    },
    // 通过字典code获取字典名
    // 调用：this.$store.getters.getDicByCode(code)
    getDicByCode: (state, getters) => (code) => {
      return getters.getDicById(getters.getDicIdByCode(code)) || code
    }
  },
  mutations: {
    // 根据字典树取出字典、类型
    commitDictionaryTree (state, list) {
      state.dictionaryTypeList = list
      let dictionaryType = {}
      let dictionarys = {}
      let dictionary_codes = {}
      if (list.length) {
        list.forEach(type => {
          dictionaryType[type.type_code] = []
          if (type.dicinfo.length) {
            type.dicinfo.forEach(dictionary => {
              state.dictionaryList.push({ ...dictionary })
              dictionarys[dictionary.id] = dictionary.dic_info
              dictionary_codes[dictionary.dic_code] = dictionary.id
              dictionaryType[type.type_code][dictionary.order_num] = ({
                value: dictionary.id,
                label: dictionary.dic_info,
                code: dictionary.dic_code
              })
            })
          }
        })
      }
      state.dictionary = dictionarys
      state.dictionary_code = dictionary_codes
      state.dictionaryType = dictionaryType
    }
  },
  actions: {
    // 获取字典树
    getDictionaryTree ({ commit }, data) {
      return request.post(api.dictype.get_tree_list, {
        page_no: 1,
        page_size: 999
      }).then(res => {
        if (res.code === 1000) {
          storageSet('dictionary', res.list)
          commit('commitDictionaryTree', res.list)
          return res
        }
      })
    }
  }
}

export default dictionary
