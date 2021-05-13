<template>
  <div class="page">
    <baidu-map
        class="map"
        center="西湖管委会"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        :mapClick="false"
        @ready="createMap"
    >
      <bml-marker-clusterer :averageCenter="true">
        <div v-for="(item, i) in parkingList" :key="`park_${i}`">
          <bm-marker
              v-if="parkingVisible"
              :title="item.name"
              :position="{lng: item.longitude, lat: item.latitude}"
              @click="handleMarker(item)"
              :icon="{url: require(`@v_Parking_img/parking-${getIconColor(item.free_num)}.png`),  size: {width: 28, height: 28}}"
          />
          <bm-polygon
              v-if="boundaryVisible"
              :path="item.boundary"
              stroke-color="blue"
              :stroke-opacity="0.5"
              :stroke-weight="2"
              :fill-opacity="0.3"
              :editing="false"
          />
          <MapOverlayPeople
              v-if="peopleVisible"
              :position="{lng: item.longitude, lat: item.latitude}"
          >
            <Box3 class="MapOverlayPeople">
              <Icons type="icon-yonghu"/>
              <div class="value">{{ item.staff_num }}人</div>
            </Box3>
          </MapOverlayPeople>
        </div>
      </bml-marker-clusterer>
      <bml-heatmap
          :data="heatData"
          :max="100"
          :radius="20"
      ></bml-heatmap>
    </baidu-map>

    <div class="bg-top"></div>
    <div class="bg-left"></div>
    <div class="bg-right"></div>

    <div class="module1">
      <Module>
        <Title1 slot="title">停车场运营指数</Title1>
        <Line1 slot="line"/>
        <Box1 slot="body">
          <div style="height: 300px;">
            <ChartLine
                ref="chartLine"
                :xAxisData="$utils.generateArray(1, new Date().getDate())"
                tooltipUnit="日"
            />
          </div>
        </Box1>
      </Module>
    </div>
    <div class="module2">
      <Module>
        <Title1 slot="title">账单一览</Title1>
        <Line1 slot="line"/>
        <Box1 slot="body">
          <div style="height: 590px;">
            <div class="items">
              <Box2 class="item">
                <div class="title">今日收益</div>
                <div class="value">
                  {{ income }}
                  <span class="unit">万</span>
                </div>
              </Box2>
              <Box2 class="item">
                <div class="title">离场未缴费</div>
                <div class="value">
                  {{ unpaid }}
                  <span class="unit">万</span>
                </div>
              </Box2>
            </div>
            <div class="pies">
              <div class="echart chart2">
                <Pie3D ref="chartPie"/>
              </div>
              <div class="echart chart3">
                <PieBar3D ref="chartPieBar"/>
              </div>
              <div>应收金额</div>
              <div>未收费催缴一览</div>
            </div>
            <div class="progress">
              <div class="progress-top">
                <div class="item">
                  <el-progress
                      type="circle"
                      color="#FA8C09"
                      :percentage="25"
                      :width="136"
                      :stroke-width="10"
                      :show-text="false"
                  ></el-progress>
                  <div class="text">
                    <div class="value">25%</div>
                    <div class="title">短信催缴率</div>
                  </div>
                </div>
                <div class="item">
                  <el-progress
                      type="circle"
                      color="#669BFF"
                      :percentage="25"
                      :width="136"
                      :stroke-width="10"
                      :show-text="false"
                  ></el-progress>
                  <div class="text">
                    <div class="value">25%</div>
                    <div class="title">线下催缴率</div>
                  </div>
                </div>
                <div class="item">
                  <el-progress
                      type="circle"
                      color="#0BB4AB"
                      :percentage="25"
                      :width="136"
                      :stroke-width="10"
                      :show-text="false"
                  ></el-progress>
                  <div class="text">
                    <div class="value">25%</div>
                    <div class="title">城市大脑催缴率</div>
                  </div>
                </div>
              </div>
              <div class="progress-bottom">
                <div class="item">
                  <el-progress
                      type="circle"
                      color="#006CFF"
                      :percentage="50"
                      :width="166"
                      :stroke-width="12"
                      :show-text="false"
                  ></el-progress>
                  <div class="text">
                    <div class="value">50%</div>
                    <div class="title">短信到达率</div>
                  </div>
                </div>
                <div class="item">
                  <el-progress
                      type="circle"
                      color="#6BE4B2"
                      :percentage="50"
                      :width="166"
                      :stroke-width="12"
                      :show-text="false"
                  ></el-progress>
                  <div class="text">
                    <div class="value">50%</div>
                    <div class="title">欠费比例</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box1>
      </Module>
    </div>
    <div class="module3">
      <Module>
        <Title1 slot="title">停车场管理</Title1>
        <Line2 slot="line"/>
        <Box1 slot="body">
          <div style="height: 160px;">
            <div class="items">
              <div v-for="(item, i) in module3Data" :key="'module3_item_' + i" class="item">
                <div class="title">{{ item.name }}</div>
                <div class="content">
                  <Box3 :title="item.name + '停车场总数'">
                    <Icons type="icon-tingchezhishu"/>
                    <div class="value">
                      <Number separator :duration="1000" :value="item.parking_num"/>
                    </div>
                  </Box3>
                  <Box3 :title="item.name + '车位总数'">
                    <Icons type="icon-tingchechang"/>
                    <div class="value">
                      <Number separator :duration="1000" :value="item.total_number"/>
                    </div>
                  </Box3>
                </div>
              </div>
            </div>
          </div>
        </Box1>
      </Module>
    </div>
    <div class="module4">
      <Module>
        <Title1 slot="title">车辆管理</Title1>
        <Line2 slot="line"/>
        <Box1 slot="body">
          <div style="height: 200px;">
            <ChartLine
                ref="chartLine2"
                xAxisType="time"
                :xAxisData="chartLine2XAxisData"
                :color="['#1968FF', '#8AEF9D', '#FD4C96']"
            />
          </div>
        </Box1>
      </Module>
    </div>
    <div class="module5">
      <Module>
        <Title1 slot="title">停车场实时TOP</Title1>
        <Line2 slot="line"/>
        <Box1 slot="body">
          <div style="height: 475px;">
            <div class="title">
              <Box4 style="height: 54px; width: 254px;">
                <div class="search">
                  <input type="text" placeholder="搜索停车场"/>
                  <div class="btn">
                    <Icons type="el-icon-search"/>
                  </div>
                </div>
              </Box4>

              <div class="items">
                <div
                    class="icon"
                    v-for="(item, i) in searchTypeList"
                    :key="'icon' + i"
                    :class="{active: searchType === item.icon}"
                    @click="handleSearch(item)"
                >
                  <Icons :title="item.name" :type="item.icon"/>
                </div>
              </div>
            </div>
            <div class="content">
              <div
                  class="item"
                  v-for="(item, i) in parkingTop"
                  :key="'parking' + i"
                  :style="{'--color': getColor(i)}"
              >
                <div class="index">{{ i < 9 ? '0' + (i + 1) : i }}</div>
                <div class="chart">
                  <div class="name">{{ item.name }}</div>
                  <el-progress
                      :percentage="item.value"
                      :stroke-width="10"
                      :show-text="false"
                      :color="getColor(i)"
                  ></el-progress>
                </div>
                <div class="per">{{ item.value }}%</div>
              </div>
            </div>
          </div>
        </Box1>
      </Module>
    </div>

    <Box2 class="top-left">
      <div class="title">总余位</div>
      <div class="value">
        <Number separator :value="$store.getters.getParkFreeAndCarNum('free')"/>
      </div>
    </Box2>
    <Box2 class="top-right">
      <div class="title">在场车辆</div>
      <div class="value">
        <Number separator :value="$store.getters.getParkFreeAndCarNum('car_num')"/>
      </div>
    </Box2>
    <Box2 class="top-left" style="top: 200px;">
      <div class="title">总车位</div>
      <div class="value">
        <Number separator :value="topLeftNum"/>
      </div>
    </Box2>
    <Box2 class="top-right" style="top: 200px;">
      <div class="title">当日过车</div>
      <div class="value">
        <Number separator :value="topRightNum"/>
      </div>
    </Box2>

    <div class="bottom-box">
      <Box5>
        <div class="content">
          <div
              class="item"
              :class="item.type"
              v-for="(item, i) in $store.getters.getParkingIndexList()"
              :key="'bottom_index' + i"
              @click="$store.commit('openIndexInfo', item.key)"
          >
            <div class="value">{{ item.value + item.unit }}</div>
            <Icons :type="item.icon" :size="24"/>
            <img :src="require('@v_Parking_img/plate-' + item.type + '.png')" alt/>
            <div class="title">{{ item.name }}</div>
          </div>
        </div>
      </Box5>
    </div>

    <div class="btns">
      <div
          class="btn"
          :class="{ active: parkingVisible }"
          @click="parkingVisible = !parkingVisible"
      >
        <Icons type="icon-tingchechang" :size="22"/>
      </div>
      <div
          class="btn"
          :class="{ active: boundaryVisible }"
          @click="boundaryVisible = !boundaryVisible"
      >
        <Icons type="icon-bianjietiaojian" :size="22"/>
      </div>
      <div class="btn" :class="{ active: peopleVisible }" @click="peopleVisible = !peopleVisible">
        <Icons type="icon-yonghu" :size="22"/>
      </div>
    </div>

    <div
        v-if="$store.state.parkingData.parkingInfoVisible"
        class="info-popup"
        @click="$store.commit('closeParkingInfo')"
    >
      <div class="content1" @click.stop>
        <Title2>{{ $store.getters.getCurrentParkingInfo('name') }}</Title2>
        <Line3 :width="130"/>
        <Box6></Box6>
      </div>
    </div>

    <div
        v-if="$store.state.parkingData.indexInfoVisible"
        class="info-popup"
        @click="$store.commit('closeIndexInfo')"
    >
      <div class="content1" @click.stop>
        <Title2>{{ $store.getters.getCurrentIndexData('name') }}</Title2>
        <Line3 :width="130"/>
        <Box6></Box6>
      </div>
    </div>
  </div>
</template>

<script>
import Number from '@v_compo/Number/index.vue'
import Module from '@v_Parking_compo/Module/index.vue'
import Title1 from '@v_compo/Title/title1.vue'
import Title2 from '@v_compo/Title/title2.vue'
import Line1 from '@v_compo/Line/line1.vue'
import Line2 from '@v_compo/Line/line2.vue'
import Line3 from '@v_compo/Line/line3.vue'
import Box1 from '@v_compo/Box/box1.vue'
import Box2 from '@v_compo/Box/box2.vue'
import Box3 from '@v_compo/Box/box3.vue'
import Box4 from '@v_compo/Box/box4.vue'
import Box5 from '@v_compo/Box/box5.vue'
import Box6 from '@v_compo/Box/box6.vue'

import ChartLine from '@v_Parking_compo/Charts/Line'
import Pie3D from '@v_Parking_compo/Charts/Pie3D'
import PieBar3D from '@v_Parking_compo/Charts/PieBar3D'

import MapOverlayPeople from '@v_Parking_compo/MapOverlayPeople'


import {BmlMarkerClusterer} from 'vue-baidu-map'
import {BmlHeatmap} from 'vue-baidu-map'

export default {
  components: {
    Number,
    BmlMarkerClusterer,
    BmlHeatmap,
    MapOverlayPeople,
    Module,
    Title1,
    Title2,
    Line1,
    Line2,
    Line3,
    Box1,
    Box2,
    Box3,
    Box4,
    Box5,
    Box6,
    ChartLine,
    Pie3D,
    PieBar3D
  },
  data() {
    return {
      zoom: 16,
      heatData: [
        // { lat: 30.25445, lng: 120.137334, count: 100 },
        // { lat: 30.25145, lng: 120.139334, count: 10 },
        // { lat: 30.25745, lng: 120.136334, count: 50 },
        // { lat: 30.25145, lng: 120.131334, count: 80 },
      ],
      parkingList: [],
      showId: null,
      income: 3.8,
      unpaid: 1.8,
      module3Data: [
        {name: '地面', type: 1, parking_num: 0, total_number: 0},
        {name: '地下', type: 2, parking_num: 0, total_number: 0},
        {name: '混合', type: 3, parking_num: 0, total_number: 0},
      ],
      searchType: 'icon-kongxian',
      searchTypeList: [
        {name: '通行效率', icon: 'icon-tonghangxiaoshuai', key: 'txxl'},
        {name: '催缴', icon: 'icon-cuijiao', key: 'cj'},
        {name: '空闲', icon: 'icon-kongxian', key: 'kx'},
        {name: '泊位', icon: 'icon-bowei', key: 'bw'},
        {name: '停车指数', icon: 'icon-tingchezhishu', key: 'tczs'},
      ],
      ParkIngListData: [],
      parkingTop: [],
      parkingVisible: true,
      boundaryVisible: false,
      peopleVisible: false,

      topLeftNum: 0,
      topRightNum: 0,

      timer: null,
    }
  },
  computed: {
    plateformMap() {
      let map = this.$utils.OptionChangeMap(this.$store.getters.plateformOption())
      return map
    },
    chartLine2XAxisData() {
      let data = this.$utils.generateArray(1 - new Date().getDate(), 0)
          .map(x => this.$utils.getDateStr(x, 'm.d'))
      return data
    }
  },
  methods: {
    async createMap({BMap, map}) {
      let mapStyle = {style: 'midnight'}
      map.setMapStyle(mapStyle)
    },
    handleSearch(data) {
      const {icon, key} = data
      this.searchType = icon
      this.parkingTop = this._.cloneDeep(this.ParkIngListData)
          .sort((a, b) => b[key] - a[key])
          .slice(0, 6)
          .map(x => ({name: x.name, value: x[key]}))
    },
    getColor(i) {
      let color
      switch (i + 1) {
        case 1:
          color = '#EB4545'
          break
        case 2:
          color = '#FA752D'
          break
        case 3:
          color = '#E99031'
          break
        default:
          color = '#1BC0FD'
          break
      }
      return color
    },

    getIconColor(num) {
      if (num === 0) {
        return 'danger'
      } else if (num < 10) {
        return 'warning'
      } else {
        return 'normal'
      }
    },

    handleMarker(info) {
      const {parking_id} = info
      this.showId = parking_id
      this.$store.commit('openParkingInfo', info)
    },

    fetchParkList(data) {
      let domain_id = [
        this.$store.getters.getBaseDomainPath()
        // ...Object.values(this.domain_ids).filter(x => x.length)
      ]
      let params = {
        page_no: 1,
        page_size: 999,
        domain_id,
        isvalid: 1,
        ...data
      }
      return this.$store.dispatch('fetchGetParkList', params)
    },
    // 获取过车统计数据
    fetchGetPassStatisticsDay(startTime, endTime) {
      let {dateFormat} = this.$utils
      return this.$store.dispatch('fetchGetPassStatisticsDay', {startTime, endTime}).then(list => {

        const getData = (list, key) => {
          let obj = {}
          list.forEach(x => {
            obj[dateFormat(x.ts, 'm.d')] = x[key]
          })

          return this.chartLine2XAxisData.map(x => obj[x] !== undefined ? obj[x] : '-')
        }
        let chartData = [
          {
            name: '本地车辆',
            data: getData(list, 'local_car_data')
          },
          {
            name: '外省车辆',
            data: getData(list, 'other_car_data')
          },
          {
            name: '本省外地车辆',
            data: getData(list, 'province_car_data')
          }
        ]
        this.$refs.chartLine2.setData(chartData)
      })
    },
  },

  beforeCreate() {

  },
  created() {
  },
  mounted() {
    const {getDateStr, CurrentMonthFirst, CurrentMonthLast, debounce, throttle} = this.$utils

    let data1 = this.$utils.randomArray(new Date().getDate(), 400000, 600000)
    let data2 = data1.map(x => this.$utils.random(0.5 * x, x))
    let data3 = data1.map((x, i) => x - data2[i])

    let chartData1 = [
      {
        name: '应收',
        data: data1
      },
      {
        name: '已收',
        data: data2
      },
      {
        name: '未收',
        data: data3
      }
    ]
    this.$refs.chartLine.setData(chartData1)

    let chartData2 = this.$utils.generateArray(-7, -1)
        .map(x => this.$utils.getDateStr(x, 'm.d'))
        .map(x => ({name: x, value: this.$utils.random(200000, 500000)}))
    setTimeout(() => {
      this.$refs.chartPie.setData([
        {
          name: 'ETC',
          value: 30,
        },
        {
          name: '场内支付',
          value: 30,
        },
        {
          name: '未缴费',
          value: 40,
        }
      ])
      this.$refs.chartPieBar.setData([
        {
          name: 'ETC',
          value: 30,
        },
        {
          name: '场内支付',
          value: 60,
        },
        {
          name: '未缴费',
          value: 40,
        },
        {
          name: '未缴费1',
          value: 20,
        }
      ])
    })

    this.$store.dispatch('fetchGetIndexList') // 获取指数数据

    // 需要定时获取的数据
    const handleTiming = async () => {
      // 当日过车数据
      const {enter_data} = await this.$store.dispatch('fetchGetPassStatistics', {
        startTime: getDateStr(0),
        endTime: getDateStr(1)
      })
      this.topRightNum = enter_data

      this.fetchGetPassStatisticsDay(CurrentMonthFirst(), CurrentMonthLast())

      this.$store.dispatch('fetchGetParkFreeAndCarNum')

    }

    // 获取停车场类型
    const handleParkTypeNum = async () => {
      let promises = this.module3Data.map(x => this.fetchParkList({type: x.type}))
      Promise.all(promises).then(res => {
        res.forEach((x, i) => {
          let {list, total: parking_num} = x
          let total_number = list.reduce((total, item) => total + item.total_number, 0)
          this.module3Data[i].parking_num = parking_num
          this.module3Data[i].total_number = total_number
        })
      })
    }

    this.$store.dispatch('fetchGetAllParking', ['government']).then(list => {
      let parkingList = list.map(x => {
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

      this.topLeftNum = parkingList.reduce((total, x) => total + x.total_number, 0)
      this.parkingList = parkingList.filter(x => x.latitude && x.longitude)


      const _parkingList = [
        {name: '丁家山停车场'},
        {name: '万松书院停车场'},
        {name: '万松岭停车场'},
        {name: '三台山停车场'},
        {name: '上天竺停车场'},
        {name: '上天竺地下车库'},
        {name: '上天竺道路'},
        {name: '九溪1号立体车库'},
        {name: '九溪A停车场'},
        {name: '九溪停车场'},
        {name: '九里松停车场'},
        {name: '云栖竹径停车场'},
        {name: '八盘岭停车场'},
        {name: '六公园停车场'},
        {name: '六和塔文化公园停车场'},
        {name: '动物园停车场'},
        {name: '南宋官窑博物馆停车场'},
        {name: '四眼井'},
        {name: '圣塘景区停车场'},
        {name: '城西公园一号停车场'},
        {name: '城隍阁停车场'},
        {name: '外鸡笼山停车场'},
        {name: '天外天停车场'},
        {name: '太子湾北门停车场'},
        {name: '太子湾西门停车场'},
        {name: '宝石前山停车场'},
        {name: '小天竺停车场'},
        {name: '少儿公园停车场'},
        {name: '平湖秋月停车场'},
        {name: '抱青会馆停车场'},
        {name: '招贤寺停车场'},
        {name: '景行'},
        {name: '曲院风荷三号门停车场'},
        {name: '杭州植物园'},
        {name: '杭州植物园竹区'},
        {name: '杭饭码头停车场'},
        {name: '柳浪闻莺停车场'},
        {name: '柳莺停车场'},
        {name: '梅家坞停车场'},
        {name: '梅灵停车场'},
        {name: '植物园北门停车场'},
        {name: '植物园玉泉停车场'},
        {name: '江洋畈停车场'},
        {name: '灵溪停车场'},
        {name: '灵隐32号大院停车场'},
        {name: '玉皇山A'},
        {name: '玉皇山停车场'},
        {name: '白塔公园A区停车场'},
        {name: '白塔公园道路停车场'},
        {name: '罗马广场停车场'},
        {name: '花圃东门停车场'},
        {name: '花港西门(道路)'},
        {name: '花港西门停车场'},
        {name: '苏堤停车场'},
        {name: '茅乡水情停车场'},
        {name: '茶博双峰馆停车场'},
        {name: '茶博双峰馆（道路）'},
        {name: '茶博龙井馆停车场'},
        {name: '西泠桥停车场'},
        {name: '西湖博物馆停车场'},
        {name: '赤山埠停车场'},
        {name: '赵公堤林下停车场'},
        {name: '郭庄停车场'},
        {name: '金溪山庄停车场'},
        {name: '钱塘门停车场'},
        {name: '钱王祠停车场'},
        {name: '钱王祠地下车库'},
        {name: '飞来峰停车场'},
        {name: '高丽寺停车场'},
        {name: '黄龙洞停车场'},
        {name: '龙井1号立体车库'},
        {name: '龙井八景停车场'},
        {name: '龙井村停车场'},
      ]
      let ParkIngListData = _parkingList.map(x => {
        let item = {
          name: x.name,
          txxl: this.$utils.random(1, 100),
          cj: this.$utils.random(1, 100),
          kx: this.$utils.random(1, 100),
          bw: this.$utils.random(1, 100),
          tczs: this.$utils.random(1, 100),
        }
        return item
      })
      this.ParkIngListData = ParkIngListData
      this.handleSearch({name: '空闲', icon: 'icon-kongxian', key: 'kx'})

      handleParkTypeNum()
      handleTiming()
      this.timer = setInterval(handleTiming, 10 * 1000)


      // 热力图
      let heatData = parkingList.map(x => {
        const {latitude: lat, longitude: lng, car_num: count} = x
        return {lat, lng, count}
      }).filter(x => x.lat && x.lng)
      // this.heatData = heatData

    })
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  }
}
</script>
<style scoped lang="less">
@import '~@assets/style/index.less';

.page {
  position: relative;
  height: 100%;

  .map {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;

    .MapOverlayPeople /deep/ .box-content {
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #44f3fe;
    }
  }

  .bg-top,
  .bg-left,
  .bg-right {
    position: absolute;
    top: 0;
    z-index: 10;
  }

  .bg-top {
    width: 100%;
    height: 100px;
    left: 0;
    background: linear-gradient(to bottom,
    rgba(0, 0, 0, 0.6) 30%,
    rgba(0, 0, 0, 0.1));
  }

  .bg-left {
    width: 496px;
    height: 100%;
    left: 0;
    background: linear-gradient(to right,
    rgba(0, 0, 0, 0.8) 30%,
    rgba(0, 0, 0, 0.6) 80%,
    rgba(0, 0, 0, 0.1) 100%);
  }

  .bg-right {
    width: 496px;
    height: 100%;
    right: 0;
    background: linear-gradient(to left,
    rgba(0, 0, 0, 0.8) 30%,
    rgba(0, 0, 0, 0.6) 80%,
    rgba(0, 0, 0, 0.1) 100%);
  }

  .module1,
  .module2,
  .module3,
  .module4,
  .module5,
  .top-left,
  .top-right,
  .bottom-box,
  .btns {
    position: absolute;
    z-index: 100;
  }

  .module1,
  .module2 {
    left: 16px;
  }

  .module3,
  .module4,
  .module5 {
    right: 16px;
  }

  .module1,
  .module3 {
    top: 60px;
  }

  .module4 {
    top: 280px;
  }

  .module5 {
    top: 540px;
  }

  .module2 {
    top: 420px;

    .items {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: 12px;

      .item {
        width: 162px;
        margin: 0 auto;

        /deep/ .box-content {
          color: #fff;
          font-size: 14px;
          height: 38px;
          line-height: 38px;

          display: flex;
          justify-content: space-between;
          padding: 0 12px;

          .value {
            font-size: 22px;
            color: #3dddff;
          }

          .unit {
            font-size: 14px;
          }
        }
      }
    }

    .pies {
      height: 200px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: 160px 1fr;
      text-align: center;
      grid-gap: 12px;

      .chart2,
      .chart3 {
        background: url('~@v_Parking_img/chart-bottom.png') no-repeat center bottom;
        position: relative;
      }

      .chart2 {
        .echarts {
          width: 78%;
          height: 78%;
          margin-top: -3%;
          .center-align;
        }
      }

      .chart4 {
        grid-column-start: 1;
        grid-column-end: 3;
      }
    }

    .progress {
      &-top,
      &-bottom {
        display: flex;
        justify-content: space-evenly;
        padding: 8px 0;

        /deep/ svg path:first-child {
          stroke: rgba(255, 255, 255, 0.2);
        }

        .item {
          position: relative;

          .text {
            .center-align;
            margin-top: -12px;
            width: 100%;
            font-size: 14px;
            text-align: center;

            .value {
              font-size: 28px;
              color: #f6920f;
            }
          }
        }
      }
    }
  }

  .module3 {
    .items {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .item {
        width: 49%;
        padding: 0 8px;
        padding-top: 8px;

        .title {
          position: relative;
          padding-left: 19px;

          &::before {
            display: block;
            content: '';
            width: 9px;
            height: 12px;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background: #44f3fe;
          }
        }

        .content {
          margin-top: 4px;
          display: flex;
          justify-content: space-between;

          /deep/ .box-content {
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #44f3fe;
          }
        }
      }
    }
  }

  .module5 {
    .title {
      height: 64px;
      padding: 10px 18px 0;
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      /deep/ .search {
        height: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding: 0 8px;

        input {
          margin-right: 12px;
          width: 160px;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
        }

        .btn {
          width: 56px;
          height: 28px;
          background: linear-gradient(-30deg, #1bc0fd 0%, #1eeaf1 100%);
          border-radius: 4px;
          text-align: center;
          line-height: 28px;
          cursor: pointer;

          &:hover {
            background: #1eeaf1;
          }

          &:active {
            background: #1bc0fd;
          }
        }
      }

      .items {
        flex: 1;
        height: 54px;
        margin-left: 18px;
        border-bottom: 1px dashed #3dddff;
        display: flex;
        justify-content: space-evenly;

        .icon {
          color: #aaa;
          position: relative;
          line-height: 48px;

          i {
            cursor: pointer;
            font-size: 24px;
          }

          &.active {
            i {
              color: #1bc0fd;
            }

            &::after {
              display: block;
              width: 0;
              height: 0;
              content: '';
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              border: 8px solid transparent;
              border-bottom-color: #1bc0fd;
            }
          }
        }
      }
    }

    .content {
      .item {
        height: 64px;
        border-bottom: 1px solid #fff;
        display: flex;
        align-items: center;
        padding-left: 16px;
        padding-right: 40px;
        color: var(--color);

        .index {
          font-size: 24px;
          width: 32px;
        }

        .chart {
          flex: 1;
          margin-left: 24px;

          .name {
            margin-bottom: 4px;
            color: #fff;
            font-size: 16px;
          }

          /deep/ .el-progress-bar__outer {
            background: #3d5f85;
          }
        }

        .per {
          width: 100px;
          color: #4fecff;
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }

  .top-left,
  .top-right {
    top: 100px;
    width: 363px;
    height: 84px;

    /deep/ .box-content {
      display: flex;
      justify-content: space-around;
      align-items: center;

      .title {
        font-size: 28px;
        color: #ffffff;
      }

      .value {
        font-size: 60px;
        font-family: DS-Digital;
        font-weight: bold;
        color: #f6920f;
      }
    }
  }

  .top-left {
    left: 554px;
  }

  .top-right {
    right: 554px;
  }

  .bottom-box {
    left: 50%;
    transform: translateX(-50%);
    width: 831px;
    height: 117px;
    bottom: 40px;

    .content {
      display: flex;
      justify-content: space-around;
      height: 100%;

      .item {
        width: 90px;
        height: 100%;
        color: #44f3fe;
        text-align: center;
        position: relative;

        &.normal {
          i {
            color: #44f3fe;
          }
        }

        &.warning {
          i {
            color: #fdbe7b;
          }
        }

        &.danger {
          i {
            color: #eb4545;
          }
        }

        &:hover {
          .value {
            opacity: 1;
            transform: rotateY(0);
          }

          i {
            opacity: 0;
          }
        }

        i,
        .value,
        img,
        .title {
          position: absolute;
          cursor: pointer;
        }

        .value {
          width: 100%;
          font-size: 18px;
          top: 15px;
          color: #fff;
          opacity: 0;
          transform: rotateY(180deg);
          transition: 0.3s ease;
        }

        i {
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          transition: 0.3s ease;
        }

        img {
          width: 90px;
          height: 71px;
          left: 50%;
          top: 10px;
          transform: translateX(-50%);
        }

        .title {
          width: 100%;
          bottom: 8px;
        }
      }
    }
  }

  .btns {
    left: 520px;
    bottom: 175px;
    width: 40px;
    height: 130px;

    .btn {
      height: 40px;
      width: 40px;
      background: rgba(55, 57, 65, 0.1);
      box-shadow: 0px 0px 10px 0px rgba(68, 243, 254, 0.33) inset;
      border: 1px solid rgba(68, 243, 254, 0.6);
      border-radius: 4px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;

      &:not(:first-child) {
        margin-top: 5px;
      }

      &:hover {
        box-shadow: 0px 0px 10px 0px rgba(68, 243, 254, 0.66) inset;
      }

      &.active i {
        color: #3dddff;
      }
    }
  }

  .info-popup {
    position: absolute;
    z-index: 1000;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);

    .content1 {
      width: 500px;
      height: 300px;
      .center-align;
    }
  }
}
</style>
