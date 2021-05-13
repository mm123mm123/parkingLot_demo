export class FilterFun {
  funs = new Map()
  constructor() {
    let filters = ['NumFormat', 'Percent', 'NumOrFalse', 'StringStr', 'NumRound']
    filters.forEach(fun => {
      this.funs.set(fun, this[fun])
    })
  }

  // 百分百
  Percent (value, n = 2) {
    value = Number(value * 100).toFixed(n)
    return value + '%'
  }

  NumOrFalse (value) {
    if (!value) {
      if (value === 0) {
        return 0
      } else {
        return '-'
      }
    } else {
      return value
    }
  }

  // 四舍五入
  NumRound (value) {
    if (!value) {
      if (value === 0) {
        return 0
      } else {
        return '-'
      }
    } else {
      return Math.round(value)
    }
  }

  StringStr (value, num) {
    if (value === null) return '-'
    if (value === undefined) return '-'
    if (value.length > num) {
      return value.substr(0, num) + '...'
    } else {
      return value
    }
  }
}
