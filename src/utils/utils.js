import { Message } from 'element-ui'

export function storageSet (name, value) {
  sessionStorage.setItem(name, JSON.stringify(value))
}

export function storageGet (name) {
  if (!sessionStorage.getItem(name) || sessionStorage.getItem(name) === 'undefined') {
    return null
  } else {
    return JSON.parse(sessionStorage.getItem(name))
  }
}

/*
  调用：this.$utils.tagState(list, stateList)
    list: Array,原数据
    stateList: Object,使用分类tag的key、颜色
    颜色: ['danger', 'warning', 'info', 'success']
    例如:
      stateList = {
        state: {
          '未结清': 'danger',
          '已结清': 'success'
        },
        type: {
          '水费': 'warning',
          '房租费': 'info'
        }
      }
*/
export function tagState (list, stateList) { // 标签颜色
  list.forEach(v => {
    for (let state in stateList) {
      for (let value in stateList[state]) {
        if (v && v[state] === value) {
          v[state] = {
            value: v[state],
            [stateList[state][value]]: true
          }
        }
      }
    }
  })
  return list
}

export function dialogHeight () { // 右侧弹窗body高度
  let dialogHeight = document.querySelector('.el-drawer__body').offsetHeight
  let headerHeight = document.querySelector('.headerCard') ? document.querySelector('.headerCard').offsetHeight : 0
  let headerInfoHeight = document.querySelector('.headerInfo') ? document.querySelector('.headerInfo').offsetHeight : 0
  let bodyHeight = dialogHeight - headerHeight - headerInfoHeight - 10 + 'px'
  return bodyHeight
}

// this.$utils.timeOut(this.fetchGetBack)
export function timeOut (fn, time = 500) { // 延时器
  setTimeout(() => {
    fn()
  }, time)
}

export function isString (obj) {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export const isUndefined = (val) => {
  return val === void 0
}

export const isDefined = (val) => {
  return val !== undefined && val !== null
}

export const noPMS = () => {
  Message.error('无操作权限')
  return false
}

/**
  对象赋值
  source 非null、非'' 赋值给 target
  this.$utils.copyObj(target, source)
  @param {Object} target, 目标对象
  @param {Object} source, 来源对象
  @return {Object}
*/
export const copyObj = (target, source) => {
  for (let key in source) {
    if (source[key] !== '' && source[key] !== null) {
      target[key] = source[key]
    }
  }
  return target
}

/**
   类型判断
  判断核心使用Object.prototype.toString，这种方式可以准确的判断数据类型。
  this.$utils.isType(target, type)
 * @param {any} target
 * @param {string} type
 * @return {boolean}
*/
export const isType = (target, type) => {
  let targetType = Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
  return targetType === type.toLowerCase()
}

/**
   时间格式化
  this.$utils.dateFormat(date, fmt)
 * @param {date} date
 * @param {string} fmt
 * @return {string}
*/
export const dateFormat = (date, fmt = 'YYYY-m-d HH:MM:SS') => {
  let ret
  date = isType(date, 'Date') ? date : new Date(date)
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

/**
 * 获取两个数组不同元素(差集)
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
export const getArrDifference = (arr1, arr2) => {
  return arr1.concat(arr2).filter((v, i, arr) => {
    return arr.indexOf(v) === arr.lastIndexOf(v)
  })
}

/**
 * 获取两个数组相同元素（交集）
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
// export const getArrEqual = (arr1, arr2) => {
//   let obj = {}
//   let arr = []
//   arr1.forEach(x => {
//     obj[x] = true
//   })
//   arr2.forEach(x => {
//     !!obj[x] && arr.push(x)
//   })
//   return arr
// }
export const getArrEqual = (arr1, arr2) => {
  let arr = [...new Set(arr1)].filter(x => new Set(arr2).has(x))
  return arr
}

/**
 * 获取两个数组并集后去重
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
export const getArrUnion = (arr1, arr2) => {
  let arr = [...new Set(arr1, arr2)]
  return arr
}

/**
 * 生成一个从 start 到 end 的连续数组
 * @param start
 * @param end
 */
export const generateArray = (start, end) => {
  const difference = start - 0
  let arr = Array.from(new Array(end - difference + 1).keys()).slice(start - difference)
  return arr.map(x => x + difference)
}

/**
 * 随机数
 * @param {*} n 
 * @param {*} m 
 */
export const random = (n, m) => Math.floor(Math.random() * (m - n)) + n

/**
 * 获取随机数组
 * @param length
 * @param start
 * @param end
 */
export const randomArray = (length, start = 0, end = 100) => {
  let arr = Array.from(Array(length).keys())
  arr = arr.map(x => random(start, end))
  return arr
}

/**
 * 查询Url参数值
 * @param {string} name 
 */
export const getQueryStringByName = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  let context = ''
  if (r != null) {
    context = r[2]
  }
  reg = null
  r = null
  return context
}

/**
 * 获取cookie值
 * @param {string} name 
 */
export const getCookie = (name) => {
  let arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
 * 对象转Map
 * @param {Object} obj 
 */
export const objChangeMap = obj => {
  let map = new Map()
  for (let key in obj) {
    map.set(key, obj[key])
  }
  return map
}

/**
 * Map转为对象
 * @param {Map} map 
 */
export const mapChangeObj = map => {
  let obj = {}
  for (let [k, v] of map) {
    obj[k] = v
  }
  return obj
}

/**
 * Map转为option
 * @param {Map} map 
 */
export const mapChangeOption = map => {
  let option = []
  for (let [k, v] of map) {
    let item = {
      value: k,
      label: v
    }
    option.push(item)
  }
  return option
}

/**
 * option转为Map
 * @param {Array} option 
 */
export const OptionChangeMap = option => {
  let map = new Map()
  for (let item of option) {
    map.set(item.value, item.label)
  }
  return map
}


/**
 * 检查是否为JSON
 * @param {*} str 
 */
export const isJSON = str => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
}

/**
 * 获取本月天数
 */
export const getMonthDays = () => {
  let now = new Date()
  let d = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  let days = d.getDate()
  return days
}

/**
 * 获取指定日期
 */
export const getDateStr = (n, fmt = 'YYYY-m-d') => {
  var date = new Date()
  date.setDate(date.getDate() + n) //获取n天后的日期
  return dateFormat(date, fmt)
}

/**
 * 获取本月第一天
 */
export const CurrentMonthFirst = (fmt = 'YYYY-m-d') => {
  let date = new Date()
  date.setDate(1)
  return dateFormat(date, fmt)
}

/**
 * 获取本月最后一天
 */
export const CurrentMonthLast = (fmt = 'YYYY-m-d') => {
  let date = new Date()
  let currentMonth = date.getMonth()
  let nextMonth = ++currentMonth
  let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  let oneDay = 1000 * 60 * 60 * 24
  return dateFormat(new Date(nextMonthFirstDay - oneDay), fmt)
}

/**
 * 数组对象按key指定顺序排序
 * @param {Array} data 数据
 * @param {Array} sortBy 排序规则
 * @param {String} sortField key
 */
export const customSort = ({ data, sortBy, sortField }) => {
  const sortByObject = sortBy.reduce(
    (obj, item, index) => ({
      ...obj,
      [item]: index
    }),
    {}
  );
  return data.sort(
    (a, b) => sortByObject[a[sortField]] - sortByObject[b[sortField]]
  )
}


export const uuid = hasHyphen => {
  return (hasHyphen ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 防抖
 * @param {Number} delay 延迟时间
 * @param {*} callback 
 */
export const debounce = (delay, callback) => {
  let timer = null
  return function () {
    clearTimeout(timer)
    const [that, args] = [this, arguments]
    timer = setTimeout(() => {
      callback.apply(that, args)
    }, delay)
  }
}

/**
 * 节流
 * @param {Number} delay 延迟时间
 * @param {*} callback 
 */
export const throttle = (delay, callback) => {
  let timer = null
  let timeStamp = new Date()
  return function () {
    const [that, args] = [this, arguments]
    if (new Date() - timeStamp > delay) {
      timeStamp = new Date()
      timer = setTimeout(function () {
        callback.apply(that, args)
      }, delay)
    }
  }
}

/**
 * 复制文档到剪贴板
 * @param {String} data 
 */
export const copyToClipboard = data => {
  if (window.clipboardData) {
    window.clipboardData.setData('text', data)
  } else {
    (function (s) {
      document.oncopy = function (e) {
        e.clipboardData.setData('text', s)
        e.preventDefault()
        document.oncopy = null
      }
    })(data)
    document.execCommand('Copy')
  }
}

/**
 * 删除数组中符合fn条件的元素
 * @param {*} array 
 * @param {*} fn 
 */
export const removeArrayItem = (array, fn) => {
  const length = array.length
  for (let i = length; i >= 0; i--) {
    if (fn(array[i])) {
      array.splice(i, 1)
    }
  }
}