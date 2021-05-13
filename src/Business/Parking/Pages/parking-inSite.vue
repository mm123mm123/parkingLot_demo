<template>
  <div class="page">
    <PageListTemplate
      :key="_uid"
      ref="page"
      :className="'row'"
      infoTitle="过车详情"
      :infoHeader="infoHeader"
      @handleInfoBtn="open"
    >
      <!-- 卡片 -->
      <div slot="card" class="card">
        <div class="box" v-for="(item, i) in statisticsData" :key="'card_box' + i">
          <div class="title">{{item.name}}</div>
          <div class="value">
            <span class="num">
              <Number :value="item.value" />
            </span>
            <span class="unit">{{item.unit}}</span>
          </div>
        </div>
      </div>

      <!-- 搜索条件 -->
      <div slot="search-items">
        <div class="search-item">
          <label>车牌</label>
          <el-input
            style="width: 190px"
            placeholder="车牌号"
            size="mini"
            prefix-icon="el-icon-search"
            clearable
            @change="fetchListSearch"
            v-model="keys.car_no"
          ></el-input>
        </div>
        <div class="search-item">
          <label>车牌颜色</label>
          <el-select
            size="mini"
            prefix-icon="el-icon-search"
            v-model="keys.car_type"
            clearable
            @change="fetchListSearch"
            placeholder="选择颜色"
          >
            <el-option
              v-for="item in $utils.mapChangeOption($store.state.parkingData.PLATE_COLOR_MAP)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="search-item">
          <label>停车场</label>
          <el-select
            size="mini"
            prefix-icon="el-icon-search"
            v-model="keys.parking_code"
            clearable
            @change="fetchListSearch"
            placeholder="选择停车场"
          >
            <el-option
              v-for="({label, value}, i) in $store.getters.getParkingOptions()"
              :key="'parking_option_' + i"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <label>开始日期:</label>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            size="mini"
            clearable
            value-format="yyyy-MM-dd"
            @change="fetchListSearch"
            v-model="keys.startTime"
          ></el-date-picker>
        </div>
        <div class="search-item">
          <label>结束日期:</label>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            size="mini"
            clearable
            value-format="yyyy-MM-dd"
            @change="fetchListSearch"
            v-model="keys.endTime"
          ></el-date-picker>
        </div>
      </div>

      <!-- 表格 -->
      <GTable
        slot="table"
        ref="table"
        v-loading="tableLoading"
        @row-click="handleRow"
        @current-change="handlePageClick"
        @prev-click="handlePageClick"
        @next-click="handlePageClick"
        :page="page"
        :tableLabel="tableLabel"
        :tableData="tableData"
      ></GTable>

      <!-- 详情 -->
      <template #infoBody="{data, infoVisible}">
        <div v-if="infoVisible">
          <BodyCard type="item" :data="{ ...infoData_parking, data }" />
          <BodyCard type="img" :data="{ title: '入场照片', data: data.enter_pic_url }" />
        </div>
      </template>
    </PageListTemplate>
  </div>
</template>

<script>

export default {
  data () {
    return {
      keys: {
        parking_code: null,
        car_no: null,
        car_type: null,
        startTime: null,
        endTime: null,
      },
      domain_ids: {
        government: [],
      },
      tableLoading: true,
      page: {
        page_no: 1,
        total: 0,
        page_size: 10
      },
      tableLabel: [
        {
          prop: 'car_no',
          label: '车牌号'
        },
        {
          prop: 'car_type_text',
          label: '车牌类型'
        },
        {
          prop: 'parking_code_text',
          label: '停车场'
        },
        {
          prop: 'enter_ts',
          label: '入场时间'
        },
      ],
      tableData: [],
      statisticsData: [
        { name: '场内车辆数量', key: 'sum', value: 0, unit: '辆' },
        { name: '当日入场数量', key: 'today', value: 0, unit: '辆' },
        { name: '过夜车数量', key: 'yesterday', value: 0, unit: '辆' },
        { name: '僵尸车数量', key: 'other', value: 0, unit: '辆' },
      ],
      infoHeader: {
        title: '车牌号',
        button: {
        },
        data: {}
      },
      infoData_parking: {
        title: '停车信息',
        span: 6,
        label: [
          {
            prop: 'parking_code_text',
            label: '停车场'
          },
          {
            prop: 'enter_ts',
            label: '入场时间'
          },
        ],
        data: {}
      },
      id: null,
    }
  },
  methods: {
    async handleRow (data) {
      console.log(data)
      this.id = data.parking_id
      this.$refs.page.setInfoHeaderTitle(data.car_no)

      const { enter_pic, exit_pic } = data
      if (enter_pic) {
        const enter_pic_url = await this.$store.dispatch('fetchGetMinioUrl', enter_pic)
        data.enter_pic_url = enter_pic_url
      }
      if (exit_pic) {
        const exit_pic_url = await this.$store.dispatch('fetchGetMinioUrl', exit_pic)
        data.exit_pic_url = exit_pic_url
      }

      this.$refs.page.setCurrentData(data)

      this.$refs.page.openInfo()
    },
    handlePageClick (num) { // 点击页码时
      this.page.page_no = num
      this.fetchList()
    },
    fetchListSearch () {
      this.page.page_no = 1
      this.fetchList()
      this.fetchStatistics()
    },
    fetchList () {
      this.tableLoading = true
      let domain_id = [
        this.$store.getters.getBaseDomainPath(),
        ...Object.values(this.domain_ids).filter(x => x.length)
      ]
      let params = {
        page_no: this.page.page_no,
        page_size: this.page.page_size,
        domain_id,
      }
      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      this.$store.dispatch('fetchGetCarInSite', params).then(({ list, total }) => {
        let tableData = list.map(x => {
          const car_type_text = this.$store.state.parkingData.PLATE_COLOR_MAP.get(x.car_type)
          const parking_code_text = this.$store.getters.getParkingMap().get(x.parking_id)
          const duration_text = Math.round(x.duration * 10 / 6) / 100
          let item = {
            ...x,
            car_type_text,
            parking_code_text,
            duration_text,
          }
          return item
        })
        this.tableData = tableData
        this.page.total = total
        this.tableLoading = false
      })
    },
    fetchStatistics () {
      const { dateFormat, getDateStr } = this.$utils
      let domain_id = [
        this.$store.getters.getBaseDomainPath(),
        ...Object.values(this.domain_ids).filter(x => x.length)
      ]
      let params = {
        domain_id,
      }
      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      params.startTime = undefined 
      params.endTime = undefined 
      this.$store.dispatch('fetchGetCarInSiteStatistics', params).then(res => {
        let {
          other = 0,
          sum = 0,
          today = 0,
          yesterday = 0,
        } = res
        const data = {
          other,
          sum,
          today,
          yesterday,
        }
        

        let statisticsData = this.statisticsData.map(x => {
          const { name, key, unit } = x
          let item = {
            name, unit, key,
            value: +data[key]
          }
          return item
        })
        this.statisticsData = statisticsData
        console.log(statisticsData);
      })
    },
    open (type) {

    }
  },
  beforeCreate () {
    this.$store.dispatch('fetchGetAllParking').then(res => {
      this.fetchStatistics()
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
  .card {
    padding: 12px 0;
    .box {
      width: 22%;
      text-align: center;
      &:not(:first-child) {
        border-left: 1px dashed @light-gray2;
      }
    }
    .title {
      font-size: 16px;
    }
    .value {
      .num {
        color: @blue;
        font-size: 24px;
      }
      .unit {
        padding-left: 4px;
        font-size: 14px;
      }
    }
  }
}
</style>
