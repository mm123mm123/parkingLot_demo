
import screenfull from 'screenfull'

// 检查是否是全屏
export const checkFull = () => screenfull.isFullscreen

// 浏览器是否支持全screenfull
export const checkIsEnabled = () => screenfull.isEnabled

// 全屏
export const full = (ele) => {
  // 如果当前是否是全屏状态
  const isFull = checkFull()
  if (isFull) {
    const fullele = fullEle() // 当前全屏元素
    if (ele === fullele) return
    const HTML = document.querySelector('HTML')
    if (!ele && fullele === HTML) return
  }
  
  let timer
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (!checkIsEnabled()) return false
    if (ele) {
      screenfull.request(ele)
    } else {
      screenfull.toggle()
    }
  }, 300)
}

// 退出全屏
export const exit = () => {
  if (checkFull()) screenfull.exit()
}

// 检查全屏的dom节点，如果没有为null
export const fullEle = () => screenfull.element
