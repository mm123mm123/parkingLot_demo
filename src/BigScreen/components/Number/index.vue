<template>
  <countTo
    :startVal="oldValue"
    :endVal="value"
    :duration="duration"
    :decimals="decimals"
    :decimal="decimal"
    :separator="separator"
    :prefix="prefix"
    :suffix="suffix"
    :useEasing="useEasing"
    :easingFn="easingFn"
  ></countTo>
</template>

<script>
import countTo from 'vue-count-to'
export default {
  components: { countTo },
  props: {
    // 开始值
    startVal: {
      type: Number,
      default: 0
    },
    // 值
    value: {
      type: Number,
      default: 0
    },
    // 动画持续时间
    duration: {
      type: Number,
      default: 500
    },
    // 小数位数
    decimals: {
      type: Number,
      default: 0
    },
    // 小数分隔符
    decimal: {
      type: String,
      default: '.'
    },
    // 分隔符
    separator: {
      type: String,
      default: ','
    },
    // 前缀
    prefix: {
      type: String,
      default: ''
    },
    // 后缀
    suffix: {
      type: String,
      default: ''
    },
    // 使用easing方程
    useEasing: {
      type: Boolean,
      default: true
    },
    // easing方程
    easingFn: {
      type: Function
    }
  },
  data () {
    return {
      oldValue: this.startVal
    }
  },
  watch: {
    value (val, oldVal) {
      this.oldValue = oldVal
    }
  }
}
</script>
