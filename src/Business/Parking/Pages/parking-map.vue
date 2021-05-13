<template>
  <div class="page">
    <baidu-map class="map" center="杭州" :zoom="zoom" :scroll-wheel-zoom="true" @ready="createMap">
      <!-- 定位 -->
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>

      <bml-marker-clusterer :averageCenter="true">
        <div v-for="(item, i) in parkingList" :key="`park_${i}`">
          <!-- marker -->
          <bm-marker
            :position="{lng: item.longitude, lat: item.latitude}"
            :title="item.name"
            @click="handleMarker(item)"
          >
            <bm-label
              :content="item.name"
              :offset="{width: 0, height: 30}"
              :labelStyle="{color: '#000', fontSize : '12px', border: 'none', background: 'rgba(255, 255, 255, .5)'}"
            />

            <!-- info -->
            <bm-info-window
              :title="item.name"
              :show="item.parking_id === showId"
              @close="showId = null"
            >
              <div class="info">
                <div class="item">
                  <div class="label">地址</div>：
                  <div class="value">{{item.address}}</div>
                </div>
                <div class="item">
                  <div class="label">编号</div>：
                  <div class="value">{{item.sn}}</div>
                </div>
                <div class="item">
                  <div class="label">类型</div>：
                  <div class="value">{{item.type_text}}</div>
                </div>
                <div class="item">
                  <div class="label">运营商</div>：
                  <div class="value">{{item.operator_text}}</div>
                </div>
                <div class="item">
                  <div class="label">平台</div>：
                  <div class="value">{{item.plateform_text}}</div>
                </div>
                <div class="item">
                  <div class="label">在线状态</div>：
                  <div class="value">
                    <GTag :data="item.isOnline_tag" size="small" />
                  </div>
                </div>
              </div>

              <div class="table">
                <div class="item">
                  <div class="value">{{item.total_number}}</div>
                  <div class="label">车位总数</div>
                </div>
                <div class="item">
                  <div class="value">{{item.free_num}}</div>
                  <div class="label">余位数量</div>
                </div>
                <div class="item">
                  <div class="value">{{item.car_num}}</div>
                  <div class="label">场内车数量</div>
                </div>
                <div class="item">
                  <div class="value">{{item.staff_num}}</div>
                  <div class="label">场库内人员数量</div>
                </div>
              </div>
            </bm-info-window>
          </bm-marker>
        </div>
      </bml-marker-clusterer>
    </baidu-map>
  </div>
</template>

<script>
import { BmlMarkerClusterer } from 'vue-baidu-map'

export default {
  components: {
    BmlMarkerClusterer
  },
  data () {
    return {
      zoom: 12,
      parkingList: [],
      showId: null
    }
  },
  computed: {
    plateformMap () {
      let map = this.$utils.OptionChangeMap(this.$store.getters.plateformOption())
      return map
    }
  },
  methods: {
    handleMarker (info) {
      const { parking_id } = info
      console.log(parking_id)
      this.showId = parking_id
    },
    draw ({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(116.404, 39.915))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    },
    async createMap ({ BMap, map }) {

    },
    fetchList () {
      let domain_id = [
        this.$store.getters.getBaseDomainPath(),
        // ...Object.values(this.domain_ids).filter(x => x.length)
      ]
      let params = {
        page_no: 1,
        page_size: 999,
        domain_id,
        isvalid: 1
      }
      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      this.$store.dispatch('fetchGetParkList', params).then(({ list, total }) => {
        let tableData = list.map(x => {
          const type_text = this.$store.state.parkingData.PARKING_TYPE_MAP.get(x.type)
          const operator_text = this.$store.getters.getDomainDataById(x.operator, 'name', 'services')
          const plateform_text = this.plateformMap.get(x.plateform) || '独立上报'
          const isvalid_tag = {
            value: x.isvalid ? '有效' : '禁用',
            danger: !x.isvalid,
            success: x.isvalid
          }
          const isOnline_tag = {
            value: x.is_online ? '在线' : '离线',
            danger: !x.is_online,
            success: x.is_online
          }

          let item = {
            ...x,
            type_text,
            operator_text,
            plateform_text,
            isvalid_tag,
            isOnline_tag
          }
          return item
        })
        this.parkingList = tableData.filter(x => x.latitude && x.longitude)

        console.log(this.parkingList);

      })
    },
  },
  beforeCreate () {
    this.$store.dispatch('fetchGetBaseDomain').then(res => {
      this.fetchList()
    })
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
@import '~@assets/style/index.less';
.page {
  height: 100%;
  .map {
    width: 100%;
    height: 100%;
    @border-color: #ddd;
    /deep/ .BMap_bubble_title {
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }
    /deep/ .BMap_bubble_content {
      margin: 12px 0;
      padding: 12px 0;
      border-top: 1px solid @border-color;
      .info .item {
        width: 350px;
        padding: 2px 0;
        .label,
        .value {
          display: inline-block;
        }
        .label {
          width: 80px;
          text-align: right;
          color: @text-color;
        }
      }
      .table {
        padding-top: 12px;
        display: flex;
        justify-items: center;
        justify-content: space-evenly;
        .item {
          padding-left: 10px;
          text-align: center;
          &:not(:first-child) {
            border-left: 1px solid @border-color;
          }
          .label {
            color: @text-color;
            font-size: 12px;
          }
          .value {
            color: @blue;
            padding-bottom: 4px;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
