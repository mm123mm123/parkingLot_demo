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
          <label>出入类型</label>
          <el-select
            size="mini"
            prefix-icon="el-icon-search"
            v-model="keys.inOrOut"
            clearable
            @change="fetchListSearch"
            placeholder="选择类型"
          >
            <el-option label="入场" :value="1"></el-option>
            <el-option label="出场" :value="2"></el-option>
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
          <BodyCard type="img" :data="{ title: '出场照片', data: data.exit_pic_url }" />
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
        inOrOut: null,
        startTime: this.$utils.getDateStr(0),
        endTime: this.$utils.getDateStr(1),
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
          prop: 'duration_text',
          label: '停车时长(分钟)'
        },
        {
          prop: 'parking_code_text',
          label: '停车场'
        },
        {
          prop: 'enter_ts',
          label: '入场时间'
        },
        {
          prop: 'exit_ts',
          label: '出场时间'
        },
      ],
      tableData: [],
      statisticsData: [
        { name: '进场车数量', value: 0, unit: '辆' },
        { name: '出场车数量', value: 0, unit: '辆' },
        { name: '本地车数量', value: 0, unit: '辆' },
        { name: '本省外地车数量', value: 0, unit: '辆' },
        { name: '外地车数量', value: 0, unit: '辆' },
        { name: '停车场使用时长', value: 0, unit: 'h' },
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
          {
            prop: 'exit_ts',
            label: '出场时间'
          },
          {
            prop: 'duration_text',
            label: '停车时长(分钟)'
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
        domain_id
      }
      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      this.$store.dispatch('fetchGetPassList', params).then(({ list, total }) => {
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
      let startTime = this.keys.startTime ? dateFormat(new Date(this.keys.startTime), 'YYYY-m-d') : dateFormat(new Date('1970-01-01'), 'YYYY-m-d')
      let endTime = this.keys.endTime ? dateFormat(new Date(this.keys.endTime), 'YYYY-m-d') : dateFormat(new Date(getDateStr(1)), 'YYYY-m-d')
      
      this.$store.dispatch('fetchGetPassStatistics', { startTime, endTime }).then(res => {
        let {
          enter_data = 0,
          exit_car_data = 0,
          local_car_data = 0,
          other_car_data = 0,
          province_car_data = 0,
          use_time_data = 0,
        } = res
        use_time_data = Math.round(use_time_data / 3600)
        const data = {
          enter_data,
          exit_car_data,
          local_car_data,
          other_car_data,
          province_car_data,
          use_time_data,
        }
        let statisticsLabel = [
          { name: '进场车数量', key: 'enter_data', unit: '辆' },
          { name: '出场车数量', key: 'exit_car_data', unit: '辆' },
          { name: '本地车数量', key: 'local_car_data', unit: '辆' },
          { name: '本省外地车数量', key: 'province_car_data', unit: '辆' },
          { name: '外地车数量', key: 'other_car_data', unit: '辆' },
          { name: '停车场使用时长', key: 'use_time_data', unit: 'h' },
        ]

        let statisticsData = statisticsLabel.map(x => {
          const { name, key, unit } = x
          let item = {
            name, unit,
            value: +data[key]
          }
          return item
        })
        console.log(statisticsData);

        this.statisticsData = statisticsData
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
