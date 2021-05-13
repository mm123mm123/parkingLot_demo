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
        :path="polygonPath"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="2"
        :editing="true"
        @lineupdate="updatePolygonPath"
      />
    </baidu-map>
    <div class="footer" style="text-align: right; margin-top: 10px; margin-right: 10px">
      <div style="float: left;">
        <el-button icon="el-icon-circle-plus" @click="clear">清除边界</el-button>
        <el-button icon="el-icon-delete-solid" @click="add">添加边界</el-button>
      </div>
      <div style="float: right;">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'CurrentPosition',
      validator (value) {
        return ['CurrentPosition', 'CityCenter', 'point'].includes(value)
      }
    },
    centerPoint: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: Array,
      default: () => []
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
      // 获取城市中心点
      const getLocalCityCenter = async () => {
        let LocalCity = new BMap.LocalCity()
        return new Promise(resolve => {
          LocalCity.get((LocalCityResult) => {
            const { center } = LocalCityResult
            resolve(center)
          })
        })
      }

      // 获取当前位置经纬度
      const getCurrentPoint = () => {
        let Geolocation = new BMap.Geolocation()
        Geolocation.enableSDKLocation()
        return new Promise(resolve => {
          Geolocation.getCurrentPosition((GeolocationResult) => {
            const { point } = GeolocationResult
            resolve(point)
          })
        })
      }

      if (this.centerType === 'point') {
        let { lng, lat } = this.centerPoint
        console.log(lng, lat);

        if (lng === undefined || lat === undefined) {
          this.centerType = 'CityCenter'
        } else {
          this.center.lng = lng
          this.center.lat = lat
        }
      }
      if (this.centerType === 'CityCenter') {
        let LocalCityPoint = await getLocalCityCenter()
        console.log(LocalCityPoint)
        this.center.lng = LocalCityPoint.lng
        this.center.lat = LocalCityPoint.lat
      }
      if (this.centerType === 'CurrentPosition') {
        let CurrentPoint = await getCurrentPoint()
        console.log(CurrentPoint)
        this.center.lng = CurrentPoint.lng
        this.center.lat = CurrentPoint.lat
      }

      if (this.path.length) {
        this.polygonPath = this.path
      } else {
        this.initPoints(this.center)
      }
    },
    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
      this.$emit('onChange', e.target.getPath())
    },
    initPoints (point) {
      let { lng, lat } = point
      let diff = 0.00025
      let points = [
        { lng: lng - diff, lat: lat - diff },
        { lng: lng - diff, lat: lat + diff },
        { lng: lng + diff, lat: lat + diff },
        { lng: lng + diff, lat: lat - diff },
      ]
      this.polygonPath = points
    },
    clear () {
      this.polygonPath = []
    },
    add () {
      if (this.polygonPath.length) {
        this.$message.error('请清除原有边界')
        return
      }
      this.initPoints(this.center)
    },
    onCancel () {
      this.$emit('onCancel')
    },
    handleSubmit () {
      if (!this.polygonPath.length) {
        this.$message.error('请选择边界')
      } else {
        this.$emit('onSubmit', this.polygonPath)
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
    height: ~'calc(100% - 50px)';
  }
}
</style>
