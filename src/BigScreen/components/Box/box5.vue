<template>
  <div class="g-box5" :ref="ref">
    <div class="side-decor"></div>
    <svg class="svg-container" :width="width" :height="height">
      <polyline
        class="line-1"
        :stroke="mergedColor[0]"
        :points="`
          16, 0
          ${width - 18}, 0
          ${width}, 8
          ${width}, ${height}
          0, ${height}
          0, 85
          8, 75
          8, 25
          0, 20
          0, 10
          16, 0
        `"
      />
      <polyline
        class="line-2"
        :stroke="mergedColor[0]"
        :points="`
          ${width - 50}, 0
          ${width - 18}, 0
          ${width}, 8
          ${width}, 30
        `"
      />
    </svg>

    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../mixin/autoResize'

export default {
  name: 'gBox5',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
  },
  data () {
    return {
      ref: 'border-box-5',
      defaultColor: ['rgba(68, 243, 254, 1)'],
      mergedColor: []
    }
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
.g-box5 {
  position: relative;
  width: 100%;
  height: 100%;
  .side-decor {
    width: 6px;
    height: 55px;
    position: absolute;
    left: 0;
    top: 23px;
    background: url('~@v_img/Box/side-decor.png') 100% 100%;
  }

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
    stroke-width: 1;
    fill: rgba(18, 56, 83, 0.5) !important;
  }

  .line-2 {
    stroke-width: 2;
  }

  .box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
