<template>
  <div class="polygon">
    <baidu-map
      class="map"
      :center="center"
      :zoom="19"
      :scroll-wheel-zoom="true"
      :mapClick="false"
      @ready="createMap"
    >
      <bm-marker :position="centerPoint" />
      <bm-polygon
        v-if="polygonPath.length"
        :path="polygonPath"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="2"
        :editing="false"
      />
    </baidu-map>
  </div>
</template>

<script>
export default {
  props: {
    centerPoint: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: Array,
      default: () => []
    },
    disableScrollWheelZoom: { // 滚轮缩放
      type: Boolean,
      default: true
    },
    disableDragging: { // 拖拽
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      centerType: this.type,
      center: { lng: 0, lat: 0 },
      polygonPath: []
    }
  },
  methods: {
    async createMap ({ BMap, map }) {
      this.disableScrollWheelZoom && map.disableScrollWheelZoom()
      this.disableDragging && map.disableDragging()

      let { lng, lat } = this.centerPoint
      this.center.lng = lng
      this.center.lat = lat
      if (this.path.length) {
        this.polygonPath = this.path
      }
    },
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
.polygon {
  height: 500px;
  .map {
    width: 100%;
    height: 100%;
  }
}
</style>
