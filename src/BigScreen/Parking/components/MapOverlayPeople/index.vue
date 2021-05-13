<template>
  <bm-overlay ref="customOverlay" :class="{sample: true}" pane="labelPane" @draw="draw">
    <slot></slot>
  </bm-overlay>
</template>

<script>
export default {
  props: ['position'],
  watch: {
    position: {
      handler () {
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
    handleClick () {
      global.alert('Well done.')
    },
    draw ({ el, BMap, map }) {
      const { lng, lat } = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 50 + 'px'
      el.style.top = pixel.y - 60 + 'px'
    }
  }
}
</script>

<style>
.sample {
  position: absolute;
}
</style>