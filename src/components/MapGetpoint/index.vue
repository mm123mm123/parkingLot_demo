<template>
  <div class="MapGetpoint">
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      :mapClick="false"
      @ready="createMap"
    >
      <!-- 标记 -->
      <bm-marker :position="{lng: model.lng, lat: model.lat}" />

      <!-- 定位 -->
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>

      <!-- 搜索地点 -->
      <bm-local-search :keyword="model.address" :auto-viewport="true" style="display: none"></bm-local-search>
    </baidu-map>
    <el-row :gutter="24" style="padding-top: 8px;">
      <el-col :span="10">
        <span>搜索地点</span>
        <el-input
          style="width: 140px; margin-left: 15px"
          v-model="model.address"
          size="mini"
          clearable
        />
      </el-col>
      <el-col :span="7">经度：{{model.lng}}</el-col>
      <el-col :span="7">纬度：{{model.lat}}</el-col>
    </el-row>
    <div class="footer" style="text-align: right; margin-top: 10px; margin-right: 10px">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
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
      default: () => ({ lng: 0, lat: 0 })
    }
  },
  data () {
    return {
      centerType: this.type,
      center: { lng: '', lat: '' },
      zoom: 12,
      model: {
        lng: '',
        lat: '',
        address: ''
      },
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


      let point

      if (this.centerType === 'point') {
        let { lng, lat } = this.centerPoint
        if (lng === undefined || lat === undefined) {
          this.centerType = 'CurrentPosition'
        } else {
          point = this.centerPoint
        }
      }
      if (this.centerType === 'CityCenter') {
        let LocalCityPoint = await getLocalCityCenter()
        point = LocalCityPoint
      }
      if (this.centerType === 'CurrentPosition') {
        let CurrentPoint = await getCurrentPoint()
        point = CurrentPoint
      }

      let { lng, lat } = point
      this.center.lng = lng
      this.center.lat = lat
      this.model.lng = lng
      this.model.lat = lat

      const that = this
      map.addEventListener('click', function (e) {
        that.model.lng = e.point.lng
        that.model.lat = e.point.lat
        that.$emit('onChange', e.point)
      })
    },

    onCancel () {
      this.$emit('onCancel')
    },
    handleSubmit () {
      let { lng, lat } = this.model
      if (!lng && !lat) {
        this.$message.error('请选择点位后点击“确定”按钮')
        return
      }
      this.$emit('onSubmit', { lng, lat })
    },
  }
}
</script>

<style scoped lang="less" >
.MapGetpoint {
  height: 500px;
}
.bm-view {
  width: 100%;
  height: ~'calc(100% - 80px)';
}
</style>
