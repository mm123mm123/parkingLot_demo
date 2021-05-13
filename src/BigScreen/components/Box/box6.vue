<template>
  <div class="g-box6" :ref="ref">
    <svg class="svg-container" :width="width" :height="height">
      <polyline
        class="line-1"
        :stroke="mergedColor[0]"
        :points="`
          0, 0
          ${width}, 0
          ${width}, ${height}
          0, ${height}
          0, 0
        `"
      />

      <polyline  :stroke="mergedColor[0]" stroke-width="3" :points="`0, 10 0, 0 28, 0`" />
      <polyline  :stroke="mergedColor[0]" stroke-width="3" :points="`0, 28 0, 20`" />

      <polyline  :stroke="mergedColor[0]" stroke-width="3" :points="`${width - 28}, 0 ${width - 20}, 0`" />
      <polyline  :stroke="mergedColor[0]" stroke-width="3" :points="`${width - 10}, 0 ${width}, 0 ${width}, 28`" />
      
      <polyline  :stroke="mergedColor[0]" stroke-width="3" :points="`${width}, ${height - 28} ${width}, ${height - 20}`" />
      <polyline  :stroke="mergedColor[0]" stroke-width="3" :points="`${width}, ${height - 10} ${width}, ${height} ${width - 28}, ${height}`" />

      
      <polyline  :stroke="mergedColor[0]" stroke-width="3" :points="`28, ${height} 20, ${height}`" />
      <polyline  :stroke="mergedColor[0]" stroke-width="3" :points="`10, ${height} 0, ${height} 0, ${height - 28}`" />

    </svg>

    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../mixin/autoResize'

export default {
  name: 'gBox6',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
  },
  data () {
    const { uuid } = this.$utils
    const id = uuid()
    return {
      ref: 'border-box-6',
      defaultColor: ['#3DDDFF', '#4fd2dd'],
      mergedColor: []
    }
  },
  computed: {
  },
  watch: {
    color () {
      const { mergeColor } = this
      mergeColor()
    }
  },
  methods: {
    mergeColor () {
      const { color, defaultColor } = this
      this.mergedColor = color.length ? color : defaultColor
    }
  },
  mounted () {
    const { mergeColor } = this
    mergeColor()
  }
}
</script>

<style lang="less">
.g-box6 {
  position: relative;
  width: 100%;
  height: 100%;

  .svg-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    & > polyline {
      fill: none;
    }
  }

  .line-1 {
    stroke-width: 0;
    fill: rgba(18, 56, 83, 0.5) !important;
  }

  .box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
